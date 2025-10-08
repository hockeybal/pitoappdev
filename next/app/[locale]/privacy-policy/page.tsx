import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Onze privacy policy legt uit hoe we uw gegevens verzamelen, gebruiken en beschermen.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Bij LaunchPad hechten we veel waarde aan uw privacy. Deze privacy policy legt uit hoe we uw persoonsgegevens verzamelen, gebruiken, delen en beschermen.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Gegevens die we verzamelen</h2>
          <p className="text-gray-600 mb-4">
            We verzamelen informatie die u ons verstrekt, zoals uw naam, e-mailadres en betalingsgegevens wanneer u zich registreert of een aankoop doet.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Hoe we uw gegevens gebruiken</h2>
          <p className="text-gray-600 mb-4">
            Uw gegevens worden gebruikt om onze diensten te leveren, uw account te beheren, betalingen te verwerken en u te informeren over updates.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Gegevens delen</h2>
          <p className="text-gray-600 mb-4">
            We delen uw gegevens niet met derden, behalve zoals vereist door de wet of met uw toestemming.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Gegevensbeveiliging</h2>
          <p className="text-gray-600 mb-4">
            We nemen passende maatregelen om uw gegevens te beschermen tegen ongeautoriseerde toegang, verlies of misbruik.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Uw rechten</h2>
          <p className="text-gray-600 mb-4">
            U heeft het recht om uw gegevens in te zien, te corrigeren of te verwijderen. Neem contact met ons op voor verzoeken.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact</h2>
          <p className="text-gray-600 mb-4">
            Voor vragen over deze privacy policy, neem contact met ons op via email@example.com.
          </p>

          <p className="text-gray-600 mt-8">
            Deze privacy policy kan worden bijgewerkt. Controleer regelmatig voor wijzigingen.
          </p>
        </div>
      </div>
    </div>
  );
}