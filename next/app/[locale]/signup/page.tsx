'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const sectors = [
  "horeca",
  "winkeliers(retail)",
  "Sport&Recreatie",
  "dienstverlenen (lokaal, b2c)",
  "zakelijk dienstverlener(B2B)",
  "eten bestellen / bezorgdiensten",
  "hulpverleners / maatschappelijk (stichtingen, vereningen)"
];

const subSectors = {
  "horeca": [
    "Catering Service",
    "DJ",
    "Evenementorganisatie",
    "Feest- en vergaderruimte verhuur"
  ],
  "winkeliers(retail)": [
    "Bedrijfsvideo & promotie",
    "Copywriter",
    "Fotograaf",
    "Glazenwasser",
    "Grafisch ontwerper",
    "Gevelreiniger",
    "Glaszetter",
    "Graffiti verwijderen"
  ],
  "Sport&Recreatie": [
    "Hondentrimsalon",
    "Hondenuitlaatservice",
    "Kinderopvang"
  ],
  "dienstverlenen (lokaal, b2c)": [
    "Aannemer",
    "Airco installateur",
    "Alarm installateur",
    "APK Keuringsstation",
    "Autogarage",
    "Autopoetsbedrijf",
    "Autoschadeherstel",
    "Bandenservice",
    "Carwash",
    "Chauffeur",
    "Container reiniging",
    "CV installateur",
    "Dakdekkers",
    "Elektricien",
    "Fietsenmaker",
    "Hovenier",
    "Huiswerkbegeleiding",
    "Installateur zonnepanelen",
    "Klussenbedrijf",
    "Keukenmontage",
    "KLusbedrijf",
    "Loodgieter"
  ],
  "zakelijk dienstverlener(B2B)": [
    "Accountant",
    "Arbeidsrechtadvocaat",
    "Architect",
    "Belastingadvies en aangifte",
    "Beveilingsdiensten",
    "Binnenhuisarchitect",
    "Computerservice",
    "Familierecht advocaat",
    "Hypotheekadviseur"
  ],
  "eten bestellen / bezorgdiensten": [
    "Catering Service"
  ],
  "hulpverleners / maatschappelijk (stichtingen, vereningen)": [
    "Dierencrematorium"
  ]
};

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    kvk_number: '',
    company_name: '',
    street_address: '',
    postal_code: '',
    city: '',
    country: 'Netherlands',
    sector: '',
    sub_sector: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'sector') {
      // Reset sub_sector when sector changes
      setFormData({ ...formData, [name]: value, sub_sector: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Register with basic fields only
      const basicData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const registerRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(basicData),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setError(registerData.error?.message || 'Registration failed');
        setLoading(false);
        return;
      }

      // Step 2: Update user with additional fields
      const userId = registerData.user.id;
      const jwt = registerData.jwt;

      const updateData = {
        kvk_number: formData.kvk_number,
        company_name: formData.company_name,
        street_address: formData.street_address,
        postal_code: formData.postal_code,
        city: formData.city,
        country: formData.country,
        sector: formData.sector,
        sub_sector: formData.sub_sector,
      };

      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!updateRes.ok) {
        console.error('Failed to update user profile');
        // Still redirect to login since account was created
      }

      router.push('/login?message=Account created successfully');
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              Schrijf je in voor Pito App
            </h2>
            <p className="text-blue-100">
              Maak je account aan en begin met het beheren van je bedrijf
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Gebruikersnaam
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                  placeholder="Kies een gebruikersnaam"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mailadres
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                  placeholder="jouw@email.nl"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                placeholder="Minimaal 6 karakters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bedrijfsgegevens</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="kvk_number" className="block text-sm font-semibold text-gray-700 mb-2">
                    KVK Nummer
                  </label>
                  <input
                    id="kvk_number"
                    name="kvk_number"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                    placeholder="12345678"
                    value={formData.kvk_number}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="company_name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Bedrijfsnaam
                  </label>
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                    placeholder="Jouw Bedrijf B.V."
                    value={formData.company_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="sector" className="block text-sm font-semibold text-gray-700 mb-2">
                  Sector van je bedrijf
                </label>
                <select
                  id="sector"
                  name="sector"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                  value={formData.sector}
                  onChange={handleChange}
                >
                  <option value="">Selecteer je sector</option>
                  {sectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>

              {formData.sector && subSectors[formData.sector as keyof typeof subSectors] && (
                <div className="mt-6">
                  <label htmlFor="sub_sector" className="block text-sm font-semibold text-gray-700 mb-2">
                    Specifieke dienst/categorie
                  </label>
                  <select
                    id="sub_sector"
                    name="sub_sector"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                    value={formData.sub_sector}
                    onChange={handleChange}
                  >
                    <option value="">Selecteer je specifieke categorie</option>
                    {subSectors[formData.sector as keyof typeof subSectors].map((subSector) => (
                      <option key={subSector} value={subSector}>
                        {subSector}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Adresgegevens</h3>

              <div className="space-y-6">
                <div>
                  <label htmlFor="street_address" className="block text-sm font-semibold text-gray-700 mb-2">
                    Straat en huisnummer
                  </label>
                  <input
                    id="street_address"
                    name="street_address"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                    placeholder="Hoofdstraat 123"
                    value={formData.street_address}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="postal_code" className="block text-sm font-semibold text-gray-700 mb-2">
                      Postcode
                    </label>
                    <input
                      id="postal_code"
                      name="postal_code"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                      placeholder="1234 AB"
                      value={formData.postal_code}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                      Plaats
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                      placeholder="Amsterdam"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                      Land
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                      placeholder="Nederland"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-800 text-sm">{error}</div>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Account aanmaken...
                  </div>
                ) : (
                  'Account aanmaken'
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Al een account? Log hier in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}