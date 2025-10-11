import { Metadata } from 'next';
import { 
  IconFileText,
  IconShieldCheck,
  IconUserCheck,
  IconCreditCard,
  IconUserX,
  IconAlertTriangle,
  IconRefresh,
  IconMail,
  IconCopyright,
  IconLock,
  IconCloudDownload,
  IconScale,
  IconWorld,
  IconSettings,
  IconGavel
} from '@tabler/icons-react';
import { 
  LegalLayout, 
  LegalParagraph, 
  LegalList, 
  LegalHighlight,
  LegalContact 
} from '@/components/legal-layout';

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden - Pito App',
  description: 'Onze algemene voorwaarden beschrijven de regels voor het gebruik van onze diensten.',
};

export default function TermsOfServicePage() {
  const sections = [
    {
      id: 'section-1',
      title: 'Definities',
      icon: <IconFileText className="w-6 h-6 text-blue-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            In deze Voorwaarden worden de volgende termen gebruikt:
          </LegalParagraph>
          <LegalList items={[
            <><strong className="text-neutral-900">"Pito App", "wij", "ons", "onze":</strong> Verwijst naar Pito App, de aanbieder van de diensten</>,
            <><strong className="text-neutral-900">"Gebruiker", "u", "uw":</strong> De natuurlijke persoon of rechtspersoon die gebruik maakt van onze diensten</>,
            <><strong className="text-neutral-900">"Diensten":</strong> Alle producten, software, en diensten die worden aangeboden door Pito App</>,
            <><strong className="text-neutral-900">"Account":</strong> Het persoonlijke gebruikersaccount dat u aanmaakt om gebruik te maken van onze diensten</>,
            <><strong className="text-neutral-900">"Content":</strong> Alle informatie, tekst, afbeeldingen, data, en andere materialen die via onze diensten toegankelijk zijn</>,
          ]} />
        </>
      ),
    },
    {
      id: 'section-2',
      title: 'Acceptatie van de voorwaarden',
      icon: <IconShieldCheck className="w-6 h-6 text-green-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            Door toegang te krijgen tot of gebruik te maken van onze diensten, bevestigt u dat u:
          </LegalParagraph>
          <LegalList items={[
            'Deze Voorwaarden heeft gelezen en begrepen',
            'Akkoord gaat met deze Voorwaarden',
            'Ten minste 18 jaar oud bent of de wettelijke leeftijd in uw rechtsgebied',
            'Bevoegd bent om namens uw organisatie een bindende overeenkomst aan te gaan (indien van toepassing)',
          ]} />
          <LegalHighlight>
            Als u niet akkoord gaat met deze Voorwaarden, mag u onze diensten niet gebruiken.
          </LegalHighlight>
        </>
      ),
    },
    {
      id: 'section-3',
      title: 'Beschrijving van de diensten',
      icon: <IconCloudDownload className="w-6 h-6 text-purple-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            Pito App biedt een platform voor digitale dienstverlening. Onze diensten omvatten maar zijn niet beperkt tot:
          </LegalParagraph>
          <LegalList items={[
            'Online applicatie toegang via webbrowser',
            'Gegevensopslag en -beheer',
            'Klantenondersteuning',
            'Regelmatige updates en verbeteringen',
          ]} />
          <LegalParagraph>
            We behouden ons het recht voor om de diensten op elk moment te wijzigen, uit te breiden of stop te zetten, met of zonder kennisgeving.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-4',
      title: 'Account registratie en beveiliging',
      icon: <IconUserCheck className="w-6 h-6 text-cyan-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            <strong className="text-neutral-900">Account aanmaken</strong><br />
            Om gebruik te maken van bepaalde functies van onze diensten, moet u een account aanmaken. Bij het aanmaken van een account dient u:
          </LegalParagraph>
          <LegalList items={[
            'Accurate, volledige en actuele informatie te verstrekken',
            'Deze informatie up-to-date te houden',
            'Slechts één account per persoon of organisatie aan te maken',
          ]} />
          <LegalParagraph>
            <strong className="text-neutral-900">Accountbeveiliging</strong><br />
            U bent verantwoordelijk voor:
          </LegalParagraph>
          <LegalList items={[
            'Het geheimhouden van uw wachtwoord en inloggegevens',
            'Alle activiteiten die plaatsvinden onder uw account',
            'Het onmiddellijk informeren van Pito App bij vermoeden van ongeautoriseerde toegang',
          ]} />
          <LegalParagraph>
            We zijn niet aansprakelijk voor verlies of schade als gevolg van uw nalatigheid om uw accountgegevens te beschermen.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-5',
      title: 'Toegestaan en verboden gebruik',
      icon: <IconAlertTriangle className="w-6 h-6 text-yellow-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            <strong className="text-neutral-900">Toegestaan gebruik</strong><br />
            U mag onze diensten gebruiken voor legitieme zakelijke en persoonlijke doeleinden in overeenstemming met deze Voorwaarden en toepasselijke wetgeving.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Verboden gebruik</strong><br />
            Het is verboden om onze diensten te gebruiken voor:
          </LegalParagraph>
          <LegalList items={[
            'Illegale activiteiten of activiteiten die in strijd zijn met de wet',
            'Het verspreiden van malware, virussen of andere schadelijke code',
            'Het kraken, reverse-engineeren of anderszins proberen toegang te krijgen tot de broncode',
            'Het verstoren of overbelasten van onze servers of netwerken',
            'Het oogsten of verzamelen van gegevens van andere gebruikers zonder toestemming',
            'Het schenden van intellectuele eigendomsrechten',
            'Het plaatsen van onwettige, beledigende, discriminerende of lasterlijke content',
            'Het nabootsen van Pito App of een andere persoon of entiteit',
            'Spam of ongewenste commerciële berichten',
          ]} />
        </>
      ),
    },
    {
      id: 'section-6',
      title: 'Abonnementen en betalingen',
      icon: <IconCreditCard className="w-6 h-6 text-emerald-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            <strong className="text-neutral-900">Abonnementsplannen</strong><br />
            Onze diensten worden aangeboden via verschillende abonnementsplannen. Details over de functies en prijzen van elk plan zijn beschikbaar op onze website.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Betalingen</strong><br />
            Betalingen worden verwerkt via Mollie, een PCI-DSS gecertificeerde betalingsprovider. Door een abonnement af te sluiten, stemt u ermee in dat:
          </LegalParagraph>
          <LegalList items={[
            'U toestemming geeft voor automatische incasso voor terugkerende betalingen',
            'Alle prijzen inclusief BTW zijn (tenzij anders vermeld)',
            'Betalingen vooraf worden voldaan voor de gekozen abonnementsperiode',
            'U verantwoordelijk bent voor alle toepasselijke belastingen',
          ]} />
          <LegalParagraph>
            <strong className="text-neutral-900">Prijswijzigingen</strong><br />
            We behouden ons het recht voor om onze prijzen te wijzigen. Prijswijzigingen worden minimaal 30 dagen van tevoren aangekondigd via e-mail. Als u niet akkoord gaat met een prijswijziging, kunt u uw abonnement opzeggen vóór de ingangsdatum van de nieuwe prijzen.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Achterstallige betalingen</strong><br />
            Bij niet-betaling of mislukte betalingen:
          </LegalParagraph>
          <LegalList items={[
            'Zullen we pogingen ondernemen om de betaling opnieuw te innen',
            'Kan uw toegang tot de diensten worden opgeschort',
            'Kunnen we buitengerechtelijke incassokosten in rekening brengen',
            'Kan uw account worden beëindigd na 30 dagen niet-betaling',
          ]} />
        </>
      ),
    },
    {
      id: 'section-7',
      title: 'Opzegging en beëindiging',
      icon: <IconUserX className="w-6 h-6 text-red-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            <strong className="text-neutral-900">Opzegging door gebruiker</strong><br />
            U kunt uw abonnement op elk moment opzeggen via uw accountinstellingen. Opzegging wordt effectief aan het einde van de lopende betaalperiode. Er worden geen terugbetalingen verstrekt voor reeds betaalde periodes, tenzij wettelijk verplicht.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Beëindiging door Pito App</strong><br />
            We kunnen uw account onmiddellijk opschorten of beëindigen als:
          </LegalParagraph>
          <LegalList items={[
            'U deze Voorwaarden schendt',
            'U illegale activiteiten onderneemt',
            'Uw gebruik schade toebrengt aan Pito App of andere gebruikers',
            'Betalingen achterwege blijven',
            'Dit wettelijk vereist is',
          ]} />
          <LegalParagraph>
            <strong className="text-neutral-900">Gevolgen van beëindiging</strong><br />
            Bij beëindiging van uw account:
          </LegalParagraph>
          <LegalList items={[
            'Verliest u toegang tot alle diensten',
            'Kunnen uw gegevens worden verwijderd (na een bewaarperiode van 30 dagen)',
            'Blijven bepalingen die hun aard behouden (zoals aansprakelijkheid en intellectuele eigendom) van kracht',
          ]} />
        </>
      ),
    },
    {
      id: 'section-8',
      title: 'Intellectuele eigendomsrechten',
      icon: <IconCopyright className="w-6 h-6 text-indigo-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            <strong className="text-neutral-900">Eigendom van Pito App</strong><br />
            Alle intellectuele eigendomsrechten met betrekking tot onze diensten, inclusief maar niet beperkt tot software, design, logo's, tekst, afbeeldingen en code, zijn eigendom van of gelicentieerd aan Pito App.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Uw content</strong><br />
            U behoudt alle rechten op de content die u uploadt of aanmaakt via onze diensten. Door content te uploaden, verleent u Pito App een wereldwijde, niet-exclusieve licentie om deze content te hosten, opslaan, en verwerken voor het leveren van onze diensten.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Gebruikslicentie</strong><br />
            We verlenen u een beperkte, niet-exclusieve, niet-overdraagbare licentie om onze diensten te gebruiken in overeenstemming met deze Voorwaarden.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-9',
      title: 'Gegevensbescherming en privacy',
      icon: <IconLock className="w-6 h-6 text-pink-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            De verwerking van uw persoonsgegevens is geregeld in onze Privacy Policy. Door gebruik te maken van onze diensten, stemt u in met het verzamelen en gebruiken van uw gegevens zoals beschreven in de Privacy Policy.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Data opslag</strong><br />
            Uw gegevens worden veilig opgeslagen in een PostgreSQL database met passende beveiligingsmaatregelen.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Derde partijen</strong><br />
            We maken gebruik van betrouwbare derde partijen voor specifieke diensten:
          </LegalParagraph>
          <LegalList items={[
            'Mollie voor betalingsverwerking',
            'Pipedrive voor CRM en klantrelatiebeheer',
            'Google Analytics voor websiteanalyse',
          ]} />
        </>
      ),
    },
    {
      id: 'section-10',
      title: 'Garanties en aansprakelijkheid',
      icon: <IconShieldCheck className="w-6 h-6 text-teal-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            <strong className="text-neutral-900">Beschikbaarheid</strong><br />
            We streven naar 99,9% uptime, maar kunnen geen absolute beschikbaarheid garanderen. We zijn niet aansprakelijk voor tijdelijke onderbrekingen door onderhoud, updates of overmacht.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Uitsluiting garanties</strong><br />
            Onze diensten worden geleverd "as is" en "as available". We geven geen garanties dat:
          </LegalParagraph>
          <LegalList items={[
            'De diensten ononderbroken of foutloos zijn',
            'Defecten zullen worden gecorrigeerd',
            'De diensten voldoen aan uw specifieke eisen',
            'Resultaten behaald via onze diensten accuraat of betrouwbaar zijn',
          ]} />
          <LegalParagraph>
            <strong className="text-neutral-900">Beperking van aansprakelijkheid</strong><br />
            Voor zover toegestaan door de wet is Pito App niet aansprakelijk voor:
          </LegalParagraph>
          <LegalList items={[
            'Indirecte, incidentele, of gevolgschade',
            'Verlies van winst, omzet, data of goodwill',
            'Onderbreking van bedrijfsvoering',
            'Schade door gebruik of onmogelijkheid tot gebruik van de diensten',
          ]} />
          <LegalHighlight>
            Onze totale aansprakelijkheid is in alle gevallen beperkt tot het bedrag dat u in de laatste 12 maanden aan ons heeft betaald, of €100, welke het hoogst is.
          </LegalHighlight>
          <LegalParagraph>
            <strong className="text-neutral-900">Vrijwaring</strong><br />
            U stemt ermee in Pito App te vrijwaren van alle claims, schade, verliezen en kosten (inclusief juridische kosten) voortvloeiend uit:
          </LegalParagraph>
          <LegalList items={[
            'Uw gebruik van de diensten',
            'Uw schending van deze Voorwaarden',
            'Uw schending van rechten van derden',
          ]} />
        </>
      ),
    },
    {
      id: 'section-11',
      title: 'Overmacht',
      icon: <IconAlertTriangle className="w-6 h-6 text-orange-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            Pito App is niet aansprakelijk voor niet-nakoming van verplichtingen als gevolg van omstandigheden buiten onze redelijke controle, inclusief maar niet beperkt tot: natuurrampen, oorlog, terrorisme, stakingen, technische storingen, internetuitval, of acties van overheidsinstanties.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-12',
      title: 'Wijzigingen van de voorwaarden',
      icon: <IconRefresh className="w-6 h-6 text-violet-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            We kunnen deze Voorwaarden op elk moment wijzigen. Materiële wijzigingen zullen we u minimaal 30 dagen van tevoren meedelen via:
          </LegalParagraph>
          <LegalList items={[
            'E-mail naar uw geregistreerde e-mailadres',
            'Een melding op onze website',
            'Een melding in uw account dashboard',
          ]} />
          <LegalParagraph>
            Door de diensten te blijven gebruiken na de ingangsdatum van gewijzigde Voorwaarden, gaat u akkoord met deze wijzigingen. Als u niet akkoord gaat, dient u het gebruik van onze diensten te staken en uw account op te zeggen.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-13',
      title: 'Toepasselijk recht en geschillenbeslechting',
      icon: <IconScale className="w-6 h-6 text-amber-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            <strong className="text-neutral-900">Toepasselijk recht</strong><br />
            Op deze Voorwaarden is Nederlands recht van toepassing, met uitsluiting van het Weens Koopverdrag.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Geschillen</strong><br />
            We streven ernaar geschillen in der minne op te lossen. Mocht dit niet lukken, dan zijn geschillen uitsluitend voorbehouden aan de bevoegde rechter in Nederland.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-14',
      title: 'Diversen',
      icon: <IconSettings className="w-6 h-6 text-slate-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            <strong className="text-neutral-900">Volledige overeenkomst</strong><br />
            Deze Voorwaarden, samen met onze Privacy Policy, vormen de volledige overeenkomst tussen u en Pito App.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Scheidbaarheid</strong><br />
            Als een bepaling van deze Voorwaarden ongeldig wordt verklaard, blijven de overige bepalingen volledig van kracht.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Geen afstand van rechten</strong><br />
            Het niet uitoefenen van een recht onder deze Voorwaarden betekent geen afstand van dat recht.
          </LegalParagraph>
          <LegalParagraph>
            <strong className="text-neutral-900">Overdracht</strong><br />
            U mag uw rechten onder deze Voorwaarden niet overdragen zonder onze voorafgaande schriftelijke toestemming. Wij mogen onze rechten en verplichtingen overdragen aan derden.
          </LegalParagraph>
        </>
      ),
    },
    {
      id: 'section-15',
      title: 'Contact',
      icon: <IconMail className="w-6 h-6 text-sky-400" stroke={1.5} />,
      content: (
        <>
          <LegalParagraph>
            Voor vragen over deze Algemene Voorwaarden kunt u contact met ons opnemen:
          </LegalParagraph>
          <LegalContact 
            company="Pito App"
            email="info@pito.app"
            additionalInfo="Voor juridische vragen: legal@pito.app"
          />
          <div className="mt-8 pt-6 border-t border-neutral-800">
            <p className="text-sm text-neutral-500">
              Door gebruik te maken van Pito App bevestigt u dat u deze Algemene Voorwaarden heeft gelezen, begrepen en ermee akkoord gaat.
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      title="Algemene Voorwaarden"
      description="Deze algemene voorwaarden regelen uw toegang tot en gebruik van onze diensten."
      lastUpdated="10 oktober 2025"
      heroIcon={<IconGavel className="w-8 h-8 text-blue-400" stroke={1.5} />}
      sections={sections}
    />
  );
}
