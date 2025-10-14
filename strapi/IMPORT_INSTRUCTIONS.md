# Database Import Instructies

## Bestand om te gebruiken
`database_export_20251014_124559.backup` (532 KB)

## Stappen voor import op live server

### 1. Upload het backup bestand naar de live server
```bash
scp database_export_20251014_124559.backup user@jouw-server.nl:/tmp/
```

### 2. Maak eerst een backup van de huidige live database (BELANGRIJK!)
```bash
pg_dump -h localhost -p 5432 -U <live_username> -d <live_database> -F c -f backup_before_import_$(date +%Y%m%d_%H%M%S).backup
```

### 3. Importeer de database met pg_restore

**Optie A: Overschrijf de bestaande database (LET OP: verwijdert eerst alle data!)**
```bash
pg_restore -h localhost -p 5432 -U <live_username> -d <live_database> -c -v database_export_20251014_124559.backup
```

**Optie B: Importeer in een nieuwe/lege database**
```bash
# Maak eerst een nieuwe database
createdb -h localhost -p 5432 -U <live_username> <nieuwe_database_naam>

# Importeer in de nieuwe database
pg_restore -h localhost -p 5432 -U <live_username> -d <nieuwe_database_naam> -v database_export_20251014_124559.backup
```

### Parameters uitleg:
- `-h` : hostname (bijvoorbeeld localhost of IP-adres)
- `-p` : poort (standaard 5432)
- `-U` : username van de PostgreSQL gebruiker
- `-d` : naam van de database
- `-c` : clean (verwijdert eerst bestaande objecten)
- `-v` : verbose (toont voortgang)
- `-F c` : custom format (voor pg_dump)

### 4. Update de .env variabelen op de live server
Zorg dat de database credentials in je live `.env` bestand correct zijn:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=<jouw_live_database_naam>
DATABASE_USERNAME=<jouw_live_username>
DATABASE_PASSWORD=<jouw_live_password>
DATABASE_SSL=false
```

### 5. Test de applicatie
Start Strapi op de live server en controleer of alles werkt:
```bash
cd /pad/naar/strapi
npm run build
npm run start
```

## Veelvoorkomende problemen

### Permissie fouten
Als je permissie fouten krijgt, voeg dan `--no-owner --no-privileges` toe:
```bash
pg_restore -h localhost -p 5432 -U <username> -d <database> --no-owner --no-privileges -v database_export_20251014_124559.backup
```

### Database bestaat niet
Maak eerst de database aan:
```bash
createdb -h localhost -p 5432 -U <username> <database_naam>
```

### Wachtwoord prompt vermijden
Gebruik een `.pgpass` bestand of stel `PGPASSWORD` environment variabele in:
```bash
export PGPASSWORD='jouw_wachtwoord'
pg_restore -h localhost -p 5432 -U <username> -d <database> -v database_export_20251014_124559.backup
```

## Export details
- **Database naam (development)**: pitoappdash_db
- **Export datum**: 14 oktober 2025, 12:45:59
- **Export formaat**: PostgreSQL custom format (compressed)
- **Bestandsgrootte**: 532 KB
- **Includes**: Alle tabellen, data, indexes, constraints en foreign keys

## Belangrijke notities
⚠️ **ALTIJD** eerst een backup maken van de live database voordat je importeert!
⚠️ De import bevat `DROP` statements - bestaande tabellen worden overschreven
⚠️ Test de import eerst op een staging omgeving als die beschikbaar is
⚠️ Zorg dat er geen actieve connecties zijn naar de database tijdens import
