import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Onze algemene voorwaarden beschrijven de regels voor het gebruik van onze diensten.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Algemene Voorwaarden</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Welkom bij LaunchPad. Deze algemene voorwaarden regelen uw gebruik van onze website en diensten. Door onze diensten te gebruiken, gaat u akkoord met deze voorwaarden.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Gebruik van de Dienst</h2>
          <p className="text-gray-600 mb-4">
            U mag onze diensten gebruiken voor legitieme doeleinden. Het is verboden om de diensten te misbruiken, in strijd met de wet te handelen of de rechten van anderen te schenden.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Account Verantwoordelijkheid</h2>
          <p className="text-gray-600 mb-4">
            U bent verantwoordelijk voor het beveiligen van uw account en wachtwoord. Informeer ons onmiddellijk bij vermoeden van ongeautoriseerd gebruik.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Betalingen</h2>
          <p className="text-gray-600 mb-4">
            Voor betaalde diensten bent u verantwoordelijk voor tijdige betaling. Prijzen kunnen worden gewijzigd met voorafgaande kennisgeving.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Beëindiging</h2>
          <p className="text-gray-600 mb-4">
            We kunnen uw toegang tot de diensten op elk moment beëindigen indien u deze voorwaarden schendt.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Aansprakelijkheid</h2>
          <p className="text-gray-600 mb-4">
            LaunchPad is niet aansprakelijk voor indirecte schade of verlies voortvloeiend uit het gebruik van onze diensten.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Wijzigingen</h2>
          <p className="text-gray-600 mb-4">
            We behouden het recht voor om deze voorwaarden te wijzigen. Wijzigingen worden van kracht na publicatie op onze website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact</h2>
          <p className="text-gray-600 mb-4">
            Voor vragen over deze voorwaarden, neem contact met ons op via email@example.com.
          </p>

          <p className="text-gray-600 mt-8">
            Laatste update: 29 september 2025.
          </p>
        </div>
      </div>
    </div>
  );
}