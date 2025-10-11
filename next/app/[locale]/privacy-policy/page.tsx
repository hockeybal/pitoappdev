import { Metadata } from 'next';
import { 
  IconShield, 
  IconLock, 
  IconDatabase, 
  IconUsers, 
  IconFileText, 
  IconClock,
  IconShieldCheck,
  IconWorld,
  IconCookie,
  IconGavel,
  IconMail
} from '@tabler/icons-react';
import { 
  LegalLayout, 
  LegalParagraph, 
  LegalList, 
  LegalHighlight,
  LegalContact 
} from '@/components/legal-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy - Pito App',
  description: 'Onze privacy policy legt uit hoe we uw gegevens verzamelen, gebruiken en beschermen.',
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: 'section-1',
      title: 'Wie is verantwoordelijk voor uw gegevens?',
      icon: <IconUsers className="w-6 h-6 text-blue-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            Pito App is de verwerkingsverantwoordelijke voor de verwerking van uw persoonsgegevens. 
            Voor vragen over deze privacy policy kunt u contact met ons opnemen via de contactgegevens 
            onderaan deze pagina.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-2',
      title: 'Welke gegevens verzamelen we?',
      icon: <IconDatabase className="w-6 h-6 text-purple-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            We verzamelen verschillende soorten gegevens om onze diensten te kunnen leveren:
          </LegalParagraph>
          <LegalList items={[
            <><strong className="text-neutral-900">Accountgegevens:</strong> Naam, e-mailadres, wachtwoord (versleuteld opgeslagen)</>,
            <><strong className="text-neutral-900">Bedrijfsgegevens:</strong> Bedrijfsnaam, KvK-nummer, BTW-nummer (indien van toepassing)</>,
            <><strong className="text-neutral-900">Betalingsgegevens:</strong> Factuuradres, betalingsmethode (verwerkt via Mollie)</>,
            <><strong className="text-neutral-900">Gebruiksgegevens:</strong> Informatie over hoe u onze diensten gebruikt, inclusief IP-adres, browsertype, pagina's die u bezoekt</>,
            <><strong className="text-neutral-900">Communicatiegegevens:</strong> Berichten die u ons stuurt via e-mail of contactformulieren</>,
          ]} />
        </>
      ),
    },
    {
      id: 'section-3',
      title: 'Hoe gebruiken we uw gegevens?',
      icon: <IconFileText className="w-6 h-6 text-green-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            We gebruiken uw persoonsgegevens voor de volgende doeleinden:
          </LegalParagraph>
          <LegalList items={[
            'Het leveren en beheren van onze diensten',
            'Het verwerken van betalingen en facturatie',
            'Klantenservice en ondersteuning',
            'Het verzenden van belangrijke updates over uw account',
            'Het verbeteren van onze diensten en gebruikerservaring',
            'Het voldoen aan wettelijke verplichtingen',
            'Het analyseren van websitegebruik om onze diensten te optimaliseren',
          ]} />
        </>
      ),
    },
    {
      id: 'section-4',
      title: 'Juridische grondslag voor gegevensverwerking',
      icon: <IconGavel className="w-6 h-6 text-yellow-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            We verwerken uw persoonsgegevens op basis van:
          </LegalParagraph>
          <LegalList items={[
            <><strong className="text-neutral-900">Uitvoering van een overeenkomst:</strong> Om onze diensten aan u te leveren</>,
            <><strong className="text-neutral-900">Wettelijke verplichting:</strong> Voor belasting- en boekhoudkundige doeleinden</>,
            <><strong className="text-neutral-900">Gerechtvaardigd belang:</strong> Voor het verbeteren van onze diensten en beveiliging</>,
            <><strong className="text-neutral-900">Toestemming:</strong> Voor marketing communicatie (indien u hiervoor heeft gekozen)</>,
          ]} />
        </>
      ),
    },
    {
      id: 'section-5',
      title: 'Met wie delen we uw gegevens?',
      icon: <IconWorld className="w-6 h-6 text-cyan-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            We delen uw gegevens alleen met vertrouwde derde partijen die ons helpen onze diensten te leveren:
          </LegalParagraph>
          <div className="space-y-4 my-6">
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
              <h4 className="text-neutral-900 font-semibold mb-2">🔐 Mollie</h4>
              <p className="text-neutral-600 text-sm">
                Voor het veilig verwerken van betalingen. Mollie is PCI-DSS gecertificeerd en verwerkt 
                betalingsgegevens volgens strenge beveiligingsstandaarden.
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
              <h4 className="text-neutral-900 font-semibold mb-2">🗄️ PostgreSQL database</h4>
              <p className="text-neutral-600 text-sm">
                Voor het veilig opslaan van uw accountgegevens en applicatiedata. Onze database is 
                beveiligd met encryptie en toegangscontroles.
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
              <h4 className="text-neutral-900 font-semibold mb-2">👥 Pipedrive</h4>
              <p className="text-neutral-600 text-sm">
                Voor CRM en klantenrelatiebeheer. We delen alleen noodzakelijke contactgegevens om 
                u beter van dienst te kunnen zijn.
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
              <h4 className="text-neutral-900 font-semibold mb-2">📊 Google Analytics</h4>
              <p className="text-neutral-600 text-sm">
                Voor websiteanalyse. We gebruiken Google Analytics om te begrijpen hoe bezoekers onze 
                website gebruiken. IP-adressen worden geanonimiseerd.
              </p>
            </div>
          </div>
          <LegalParagraph>
            Al deze partijen zijn contractueel verplicht om uw gegevens veilig te houden en alleen te gebruiken 
            voor de doeleinden waarvoor ze zijn verstrekt. We verkopen uw gegevens nooit aan derden.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-6',
      title: 'Internationale gegevensoverdracht',
      icon: <IconWorld className="w-6 h-6 text-indigo-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            Uw gegevens worden voornamelijk opgeslagen binnen de Europese Economische Ruimte (EER). 
            Indien we gebruik maken van diensten die gegevens buiten de EER verwerken (zoals Google Analytics), 
            zorgen we ervoor dat er passende waarborgen zijn getroffen conform de AVG, zoals standaard 
            contractuele clausules.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-7',
      title: 'Hoe lang bewaren we uw gegevens?',
      icon: <IconClock className="w-6 h-6 text-orange-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            We bewaren uw persoonsgegevens niet langer dan noodzakelijk:
          </LegalParagraph>
          <LegalList items={[
            <><strong className="text-neutral-900">Accountgegevens:</strong> Zolang uw account actief is</>,
            <><strong className="text-neutral-900">Facturatiegegevens:</strong> 7 jaar (wettelijke verplichting)</>,
            <><strong className="text-neutral-900">Analysegegevens:</strong> 26 maanden (Google Analytics standaard)</>,
            <><strong className="text-neutral-900">Marketing gegevens:</strong> Tot u zich uitschrijft of 2 jaar na laatste interactie</>,
          ]} />
          <LegalParagraph>
            Na verwijdering van uw account worden uw persoonsgegevens binnen 30 dagen verwijderd, met 
            uitzondering van gegevens die we wettelijk verplicht zijn te bewaren.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-8',
      title: 'Gegevensbeveiliging',
      icon: <IconLock className="w-6 h-6 text-red-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            We nemen de beveiliging van uw gegevens zeer serieus en hebben passende technische en 
            organisatorische maatregelen getroffen:
          </LegalParagraph>
          <LegalList items={[
            'SSL/TLS versleuteling voor alle datatransmissie',
            'Versleutelde opslag van wachtwoorden (bcrypt hashing)',
            'Regelmatige beveiligingsupdates en patches',
            'Toegangscontrole en authenticatie',
            'Regelmatige back-ups met encryptie',
            'Beveiligde hosting omgeving',
          ]} />
        </>
      ),
    },
    {
      id: 'section-9',
      title: 'Cookies en tracking',
      icon: <IconCookie className="w-6 h-6 text-pink-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            We gebruiken cookies en vergelijkbare technologieën om:
          </LegalParagraph>
          <LegalList items={[
            <><strong className="text-neutral-900">Noodzakelijke cookies:</strong> Voor het laten functioneren van de website (inloggen, sessies)</>,
            <><strong className="text-neutral-900">Analytische cookies:</strong> Google Analytics voor websitestatistieken (geanonimiseerd)</>,
            <><strong className="text-neutral-900">Functionele cookies:</strong> Voor het onthouden van uw voorkeuren</>,
          ]} />
          <LegalParagraph>
            U kunt cookies beheren via uw browserinstellingen. Let op dat het uitschakelen van bepaalde 
            cookies de functionaliteit van onze website kan beïnvloeden.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-10',
      title: 'Uw rechten onder de AVG',
      icon: <IconShieldCheck className="w-6 h-6 text-teal-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            U heeft de volgende rechten met betrekking tot uw persoonsgegevens:
          </LegalParagraph>
          <LegalList items={[
            <><strong className="text-neutral-900">Recht op inzage:</strong> U kunt opvragen welke gegevens we van u hebben</>,
            <><strong className="text-neutral-900">Recht op rectificatie:</strong> U kunt uw gegevens laten corrigeren als deze onjuist zijn</>,
            <><strong className="text-neutral-900">Recht op verwijdering:</strong> U kunt verzoeken om verwijdering van uw gegevens (recht op vergetelheid)</>,
            <><strong className="text-neutral-900">Recht op beperking:</strong> U kunt verzoeken om beperking van de verwerking</>,
            <><strong className="text-neutral-900">Recht op dataportabiliteit:</strong> U kunt uw gegevens in een gestructureerd formaat ontvangen</>,
            <><strong className="text-neutral-900">Recht van bezwaar:</strong> U kunt bezwaar maken tegen bepaalde verwerkingen</>,
            <><strong className="text-neutral-900">Recht om toestemming in te trekken:</strong> Als we uw gegevens verwerken op basis van toestemming</>,
          ]} />
          <LegalHighlight>
            Om deze rechten uit te oefenen, kunt u contact met ons opnemen via de onderstaande contactgegevens. 
            We reageren binnen 30 dagen op uw verzoek.
          </LegalHighlight>
        </>
      ),
    },
    {
      id: 'section-11',
      title: 'Kinderen',
      icon: <IconUsers className="w-6 h-6 text-violet-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            Onze diensten zijn niet gericht op personen jonger dan 16 jaar. We verzamelen niet bewust 
            persoonsgegevens van kinderen onder de 16 jaar. Als u vermoedt dat we onbedoeld gegevens 
            hebben verzameld van een kind onder de 16 jaar, neem dan contact met ons op.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-12',
      title: 'Wijzigingen in deze privacy policy',
      icon: <IconFileText className="w-6 h-6 text-amber-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            We kunnen deze privacy policy van tijd tot tijd bijwerken. Belangrijke wijzigingen zullen we u 
            meedelen via e-mail of via een melding op onze website. We raden u aan deze pagina regelmatig 
            te raadplegen om op de hoogte te blijven van eventuele wijzigingen.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-13',
      title: 'Klachten',
      icon: <IconShield className="w-6 h-6 text-rose-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            Als u een klacht heeft over hoe we met uw persoonsgegevens omgaan, neem dan eerst contact met 
            ons op. U heeft ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens, 
            de toezichthouder op het gebied van privacy in Nederland.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-14',
      title: 'Contact',
      icon: <IconMail className="w-6 h-6 text-sky-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            Voor vragen over deze privacy policy of over hoe we uw persoonsgegevens verwerken, kunt u 
            contact met ons opnemen:
          </LegalParagraph>
          <LegalContact 
            company="Pito App"
            email="privacy@pito.app"
            additionalInfo="Voor algemene vragen: info@pito.app"
          />
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      title="Privacy Policy"
      description="Bij Pito App hechten we veel waarde aan uw privacy en de bescherming van uw persoonsgegevens."
      lastUpdated="10 oktober 2025"
      heroIcon={<IconShield className="w-8 h-8 text-blue-400" stroke={1.5} />}
      sections={sections}
    />
  );
}
