'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
// Using Tabler icons instead since they're already installed
import { 
  IconUser, 
  IconCreditCard, 
  IconSettings, 
  IconFileText,
  IconChartBar,
  IconBell,
  IconShieldCheck,
  IconLogout,
  IconChevronRight,
  IconPackage,
  IconX,
  IconBuilding,
  IconMapPin,
  IconBriefcase,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff
} from '@tabler/icons-react';

interface Plan {
  id: number;
  name: string;
  price: number;
  sub_text: string;
  featured?: boolean;
}

interface Customer {
  id: number;
  user_id: string;
  plan?: Plan;
  created_at: string;
  subscription_status?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
}

interface UserProfile {
  username: string;
  email: string;
  kvk_number: string;
  company_name: string;
  street_address: string;
  postal_code: string;
  city: string;
  country: string;
}

interface Vacature {
  id: number;
  title: string;
  company_name: string;
  location: string;
  employment_type: string;
  location_type: string;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  salary_period?: string;
  is_active: boolean;
  publishedAt?: string;
  expires_at?: string;
  description?: string;
  requirements?: string;
  nice_to_have?: string;
  what_we_offer?: string;
  benefits?: string;
  application_email?: string;
  application_url?: string;
}

type ActiveTab = 'overview' | 'profile' | 'subscription' | 'billing' | 'settings' | 'vacatures';

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isActive, setIsActive] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: '',
    email: '',
    kvk_number: '',
    company_name: '',
    street_address: '',
    postal_code: '',
    city: '',
    country: 'Netherlands',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      const pathname = window.location.pathname;
      const locale = pathname.split('/')[1];
      router.push(`/${locale}/login`);
    }
  }, [status, router]);

  const fetchUserData = useCallback(async () => {
    if (!session?.user?.id) {
      return;
    }

    try {
      const customerRes = await fetch(`/api/customer-info?userId=${session?.user?.id}`);
      
      const customerData = await customerRes.json();

      if (customerData.success && customerData.data) {
        const userInfo = customerData.data;
        
        // Update userProfile with fetched data
        setUserProfile({
          username: userInfo.username || session?.user?.name || '',
          email: userInfo.user_email || session?.user?.email || '',
          kvk_number: userInfo.kvk_number || '',
          company_name: userInfo.company_name || '',
          street_address: userInfo.street_address || '',
          postal_code: userInfo.postal_code || '',
          city: userInfo.city || '',
          country: userInfo.country || 'Netherlands',
        });
        
        // Create a customer-like object for backward compatibility
        const customerCompatible = {
          id: userInfo.id,
          user_id: userInfo.id.toString(),
          plan: userInfo.plan,
          created_at: userInfo.createdAt || new Date().toISOString(),
          subscription_status: userInfo.subscription_status,
          subscription_start_date: userInfo.subscription_start_date,
          subscription_end_date: userInfo.subscription_end_date
        };
        
        setCustomer(customerCompatible);
        
        if (userInfo.plan) {
          setPlan(userInfo.plan);
        } else {
        }

        // Check if user is active (trial or paid)
        const now = new Date();
        const trialEnd = (session?.user as any)?.trial_end_date ? new Date((session?.user as any).trial_end_date) : null;
        const isTrialActive = (session?.user as any)?.is_trial_active && trialEnd && trialEnd > now;
        const isSubscriptionActive = userInfo.subscription_status === 'active';
        setIsActive(isTrialActive || isSubscriptionActive);
      } else {
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    if (session?.user?.jwt) {
      fetchUserData();
    }
  }, [session, fetchUserData]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!isActive) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <IconShieldCheck className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Toegang Geblokkeerd</h2>
          <p className="text-neutral-600 mb-6">
            Je proefperiode is verlopen. Kies een abonnement om verder te gaan met het dashboard.
          </p>
          <Link
            href={`/${window.location.pathname.split('/')[1]}/upgrade`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-orange hover:bg-brand-orange/90 transition-colors"
          >
            Kies een Plan
            <IconChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { id: 'overview', name: 'Overzicht', icon: IconChartBar },
    { id: 'profile', name: 'Profiel', icon: IconUser },
    { id: 'vacatures', name: 'Vacatures', icon: IconBriefcase },
    { id: 'subscription', name: 'Abonnement', icon: IconCreditCard },
    { id: 'billing', name: 'Facturering', icon: IconFileText },
    { id: 'settings', name: 'Instellingen', icon: IconSettings },
  ];

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: `/${window.location.pathname.split('/')[1]}/login` 
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 text-neutral-500 hover:text-brand-blue transition-colors"
                title="Meldingen"
                aria-label="Meldingen bekijken"
              >
                <IconBell className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="font-medium text-neutral-900">{userProfile.username}</p>
                  <p className="text-neutral-500">{userProfile.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-neutral-500 hover:text-red-600 transition-colors"
                  title="Uitloggen"
                  aria-label="Uitloggen"
                >
                  <IconLogout className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id as ActiveTab)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-brand-blue/10 text-brand-blue'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <DashboardOverview 
                session={session} 
                plan={plan} 
                customer={customer}
                userProfile={userProfile}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileSection 
                session={session} 
                userProfile={userProfile}
                setUserProfile={setUserProfile}
              />
            )}
            {activeTab === 'vacatures' && (
              <VacaturesSection session={session} customer={customer} plan={plan} />
            )}
            {activeTab === 'subscription' && (
              <SubscriptionSection plan={plan} customer={customer} session={session} />
            )}
            {activeTab === 'billing' && (
              <BillingSection customer={customer} session={session} />
            )}
            {activeTab === 'settings' && (
              <SettingsSection session={session} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview Component
function DashboardOverview({ session, plan, customer, userProfile }: { 
  session: any; 
  plan: Plan | null; 
  customer: Customer | null;
  userProfile: UserProfile;
}) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-light-blue rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welkom terug, {userProfile.username}!</h2>
        <p className="opacity-90">Hier is wat er vandaag gebeurt met je account.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Huidig Plan</p>
              <p className="text-2xl font-bold text-neutral-900">
                {plan ? plan.name : 'Geen Plan'}
              </p>
            </div>
            <IconCreditCard className="h-8 w-8 text-brand-orange" />
          </div>
          {plan && (
            <div className="mt-4">
              <p className="text-sm text-neutral-600">{plan.sub_text}</p>
              <p className="text-lg font-semibold text-brand-orange mt-2">€{plan.price}/maand</p>
            </div>
          )}
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Account Status</p>
              <p className="text-2xl font-bold text-green-600">Actief</p>
            </div>
            <IconShieldCheck className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm text-neutral-600 mt-4">
            lid sinds {customer ? new Date(customer.created_at).toLocaleDateString() : 'Recent'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Snelle Acties</h3>
          <div className="space-y-3">
            {!plan && (
              <Link
                href="/pricing"
                className="flex items-center justify-between p-3 bg-brand-blue/10 rounded-lg hover:bg-brand-blue/15 transition-colors"
              >
                <span className="text-brand-orange font-medium">Kies een Plan</span>
                <IconChevronRight className="h-4 w-4 text-brand-orange" />
              </Link>
            )}
            <Link
              href="/products"
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <span className="text-neutral-700">Blader door Producten</span>
              <IconChevronRight className="h-4 w-4 text-neutral-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Section Component  
function ProfileSection({ 
  session, 
  userProfile, 
  setUserProfile 
}: { 
  session: any; 
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    username: userProfile.username,
    email: userProfile.email,
    kvk_number: userProfile.kvk_number || '',
    company_name: userProfile.company_name || '',
    street_address: userProfile.street_address || '',
    postal_code: userProfile.postal_code || '',
    city: userProfile.city || '',
    country: userProfile.country || 'Netherlands',
  });

  // Sync formData when userProfile changes
  useEffect(() => {
    setFormData({
      username: userProfile.username,
      email: userProfile.email,
      kvk_number: userProfile.kvk_number || '',
      company_name: userProfile.company_name || '',
      street_address: userProfile.street_address || '',
      postal_code: userProfile.postal_code || '',
      city: userProfile.city || '',
      country: userProfile.country || 'Netherlands',
    });
  }, [userProfile]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setMessage(null);

    // Basic validation
    if (!formData.username.trim() || !formData.email.trim()) {
      setMessage({ 
        type: 'error', 
        text: 'Gebruikersnaam en e-mail zijn verplicht' 
      });
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ 
        type: 'error', 
        text: 'Voer een geldig e-mailadres in' 
      });
      setIsLoading(false);
      return;
    }

    try {
      // Update user in Strapi
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.jwt}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          kvk_number: formData.kvk_number,
          company_name: formData.company_name,
          street_address: formData.street_address,
          postal_code: formData.postal_code,
          city: formData.city,
          country: formData.country,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profiel succesvol bijgewerkt!' });
        setIsEditing(false);
        
        // Update parent state
        setUserProfile({
          username: formData.username,
          email: formData.email,
          kvk_number: formData.kvk_number,
          company_name: formData.company_name,
          street_address: formData.street_address,
          postal_code: formData.postal_code,
          city: formData.city,
          country: formData.country,
        });
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error?.message || 'Kon profiel niet bijwerken'
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Er is een onverwachte fout opgetreden' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: userProfile.username,
      email: userProfile.email,
      kvk_number: userProfile.kvk_number || '',
      company_name: userProfile.company_name || '',
      street_address: userProfile.street_address || '',
      postal_code: userProfile.postal_code || '',
      city: userProfile.city || '',
      country: userProfile.country || 'Netherlands',
    });
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-neutral-900">Profiel Informatie</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-brand-orange border border-brand-orange rounded-lg hover:bg-brand-blue/10 transition-colors"
        >
          {isEditing ? 'Annuleren' : 'Profiel Bewerken'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 bg-brand-blue/15 rounded-full flex items-center justify-center">
            <IconUser className="h-10 w-10 text-brand-orange" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{formData.username}</h3>
            <p className="text-neutral-600">{formData.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-neutral-200 pb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                <IconUser className="h-5 w-5 mr-2" />
                Basis Informatie
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Gebruikersnaam
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-neutral-900"
                    placeholder="Voer je gebruikersnaam in"
                    title="Gebruikersnaam"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-neutral-900"
                    placeholder="Voer je e-mail in"
                    title="E-mail"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="border-b border-neutral-200 pb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                <IconBuilding className="h-5 w-5 mr-2" />
                Bedrijfs Informatie
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    KVK Nummer
                  </label>
                  <input
                    type="text"
                    value={formData.kvk_number || ''}
                    onChange={(e) => setFormData({...formData, kvk_number: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-neutral-900"
                    placeholder="Voer je KVK nummer in"
                    maxLength={20}
                  />
                  <p className="mt-1 text-sm text-neutral-500">Kamer van Koophandel registratienummer</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Bedrijfsnaam
                  </label>
                  <input
                    type="text"
                    value={formData.company_name || ''}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-neutral-900"
                    placeholder="Voer je bedrijfsnaam in"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                <IconMapPin className="h-5 w-5 mr-2" />
                Adres Informatie
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Straatadres
                  </label>
                  <input
                    type="text"
                    value={formData.street_address || ''}
                    onChange={(e) => setFormData({...formData, street_address: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-neutral-900"
                    placeholder="Voer je straatadres in"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Postcode
                    </label>
                    <input
                      type="text"
                      value={formData.postal_code || ''}
                      onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-neutral-900"
                      placeholder="1234 AB"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Stad
                    </label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-neutral-900"
                      placeholder="Voer je stad in"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Land
                    </label>
                    <select
                      value={formData.country || 'Netherlands'}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue text-neutral-900"
                      title="Selecteer je land"
                    >
                      <option value="Netherlands">Nederland</option>
                      <option value="Belgium">België</option>
                      <option value="Germany">Duitsland</option>
                      <option value="France">Frankrijk</option>
                      <option value="United Kingdom">Verenigd Koninkrijk</option>
                      <option value="Other">Anders</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="px-6 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                <IconUser className="h-5 w-5 mr-2" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Username</label>
                  <p className="text-neutral-900">{formData.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                  <p className="text-neutral-900">{formData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">User ID</label>
                  <p className="text-neutral-900 font-mono text-sm">{session.user?.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Account Status</label>
                  <p className="text-green-600 font-medium">Active</p>
                </div>
              </div>
            </div>

            {/* Business Information */}
            {(formData.kvk_number || formData.company_name) && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                  <IconBuilding className="h-5 w-5 mr-2" />
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.kvk_number && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">KVK Number</label>
                      <p className="text-neutral-900">{formData.kvk_number}</p>
                    </div>
                  )}
                  {formData.company_name && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Company Name</label>
                      <p className="text-neutral-900">{formData.company_name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Address Information */}
            {(formData.street_address || formData.postal_code || formData.city || formData.country) && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                  <IconMapPin className="h-5 w-5 mr-2" />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.street_address && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Street Address</label>
                      <p className="text-neutral-900">{formData.street_address}</p>
                    </div>
                  )}
                  {formData.postal_code && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Postal Code</label>
                      <p className="text-neutral-900">{formData.postal_code}</p>
                    </div>
                  )}
                  {formData.city && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                      <p className="text-neutral-900">{formData.city}</p>
                    </div>
                  )}
                  {formData.country && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Land</label>
                      <p className="text-neutral-900">{formData.country}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty state for missing business/address info */}
            {!formData.kvk_number && !formData.company_name && !formData.street_address && !formData.postal_code && !formData.city && (
              <div className="bg-neutral-50 rounded-lg p-6 text-center">
                <IconBuilding className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Vul Je Profiel Aan</h3>
                <p className="text-neutral-600 mb-4">Voeg je bedrijfsgegevens en adres toe om je profiel te voltooien.</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors"
                >
                  Bedrijfsgegevens Toevoegen
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Subscription Section Component
function SubscriptionSection({ plan, customer, session }: { plan: Plan | null; customer: Customer | null; session: any }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      cancelled: 'bg-neutral-100 text-neutral-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        statusColors[status as keyof typeof statusColors] || 'bg-neutral-100 text-neutral-800'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Abonnementsgegevens</h2>
          {customer?.subscription_status && getStatusBadge(customer.subscription_status)}
        </div>
        
        {plan ? (
          <div className="space-y-6">
            {/* Current Plan Card */}
            <div className={`p-6 rounded-lg border-2 ${plan.featured ? 'border-brand-blue bg-brand-blue/10' : 'border-neutral-200'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{plan.name}</h3>
                  <p className="text-neutral-600 mt-1">{plan.sub_text}</p>
                  <div className="flex items-baseline mt-4">
                    <span className="text-3xl font-bold text-brand-orange">€{plan.price}</span>
                    <span className="text-neutral-600 ml-2">/maand</span>
                  </div>
                </div>
                {plan.featured && (
                  <span className="px-3 py-1 bg-brand-orange text-white text-sm rounded-full">
                    Uitgelicht
                  </span>
                )}
              </div>

              {/* Subscription Dates */}
              {customer && (customer.subscription_start_date || customer.subscription_end_date) && (
                <div className="border-t border-neutral-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customer.subscription_start_date && (
                      <div>
                        <p className="text-sm text-neutral-600">Abonnement Gestart</p>
                        <p className="font-medium text-neutral-900">{formatDate(customer.subscription_start_date)}</p>
                      </div>
                    )}
                    {customer.subscription_end_date && (
                      <div>
                        <p className="text-sm text-neutral-600">Volgende Factureringsdatum</p>
                        <p className="font-medium text-neutral-900">{formatDate(customer.subscription_end_date)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Link
                href="/pricing"
                className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors"
              >
                Plan Upgraden
              </Link>
              <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                Abonnement Beheren
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <IconCreditCard className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Geen Actief Abonnement</h3>
            <p className="text-neutral-600 mb-6">Kies een plan om te beginnen met onze diensten.</p>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors"
            >
              Plannen Bekijken
            </Link>
          </div>
        )}
      </div>

      {/* Plan Features */}
      {plan && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Plan Kenmerken</h3>
          <div className="text-neutral-600">
            <p>Je huidige plan bevat alle functies die je nodig hebt om te beginnen.</p>
            <p className="mt-2">Meer functies nodig? <Link href="/pricing" className="text-brand-orange hover:text-brand-orange">Upgrade je plan</Link> voor extra voordelen.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Billing Section Component
function BillingSection({ customer, session }: { customer: Customer | null; session: any }) {
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [isCreatingPaymentMethod, setIsCreatingPaymentMethod] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
    fetchPaymentMethods();

    // Check if user returned from successful payment method setup
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'billing' && urlParams.get('payment_method') === 'success') {
      // Clear URL parameters
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);

      // Refresh payment methods
      fetchPaymentMethods();

      // Show success message
      alert('Betaalmethode succesvol toegevoegd!');
    }
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch('/api/payments');
      if (response.ok) {
        const data = await response.json();
        setPaymentHistory(data.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    } finally {
      setLoadingPayments(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payment-methods');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    setIsCreatingPaymentMethod(true);
    try {
      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Mollie checkout
        window.location.href = data.checkoutUrl;
      } else {
        console.error('Failed to create payment method setup');
        alert('Kon betaalmethode niet instellen. Probeer het opnieuw.');
      }
    } catch (error) {
      console.error('Error creating payment method:', error);
      alert('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsCreatingPaymentMethod(false);
    }
  };

  const handleDeletePaymentMethod = async (methodId: string) => {
    if (!confirm('Weet je zeker dat je deze betaalmethode wilt verwijderen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/payment-methods/${methodId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh payment methods
        fetchPaymentMethods();
      } else {
        alert('Kon betaalmethode niet verwijderen. Probeer het opnieuw.');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      alert('Er is een fout opgetreden. Probeer het opnieuw.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(parseFloat(amount));
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-neutral-100 text-neutral-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusColors[status as keyof typeof statusColors] || 'bg-neutral-100 text-neutral-800'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Billing & Payments</h2>
        
        <div className="space-y-6">
          {/* Payment Methods */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Betaalmethodes</h3>
              <button 
                onClick={() => setShowAddPaymentMethod(true)}
                className="px-4 py-2 bg-brand-orange text-white text-sm rounded-lg hover:bg-brand-orange/90 transition-colors"
              >
                Betaalmethode Toevoegen
              </button>
            </div>
            
            <div className="border border-neutral-200 rounded-lg p-4">
              {loadingPaymentMethods ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mx-auto mb-4"></div>
                  <p className="text-neutral-600">Betaalmethodes laden...</p>
                </div>
              ) : paymentMethods.length > 0 ? (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <IconCreditCard className="h-6 w-6 text-neutral-400" />
                        <div>
                          <p className="font-medium text-neutral-900">
                            {method.methodName || method.method} •••• {method.details?.cardNumber?.slice(-4) || '****'}
                          </p>
                          <p className="text-sm text-neutral-600">
                            Toegevoegd {new Date(method.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          method.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'
                        }`}>
                          {method.status === 'active' ? 'actief' : method.status}
                        </span>
                        <button
                          onClick={() => handleDeletePaymentMethod(method.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Remove payment method"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <IconCreditCard className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-600 mb-2">Geen opgeslagen betaalmethodes</p>
                  <p className="text-sm text-neutral-500 mb-4">
                    Betaalmethodes worden automatisch opgeslagen wanneer je een aankoop doet
                  </p>
                  <button
                    onClick={() => setShowAddPaymentMethod(true)}
                    className="text-brand-orange hover:text-brand-orange text-sm font-medium"
                  >
                    Betaalmethode Toevoegen via Mollie
                  </button>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-500 text-center">
                  💡 Betaalmethodes worden veilig opgeslagen door Mollie, niet op onze servers
                </p>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Betaalgeschiedenis</h3>
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-neutral-200 bg-neutral-50">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-neutral-700">
                  <span>Datum</span>
                  <span>Beschrijving</span>
                  <span>Bedrag</span>
                  <span>Status</span>
                  <span>Acties</span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {loadingPayments ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mx-auto"></div>
                    <p className="text-neutral-600 mt-2">Betaalgeschiedenis laden...</p>
                  </div>
                ) : paymentHistory.length > 0 ? (
                  paymentHistory.map((payment) => (
                    <div key={payment.id} className="p-4">
                      <div className="grid grid-cols-5 gap-4 text-sm">
                        <span className="text-neutral-900">{formatDate(payment.createdAt)}</span>
                        <span className="text-neutral-900">{payment.description}</span>
                        <span className="font-medium text-neutral-900">
                          {formatAmount(payment.amount, payment.currency)}
                        </span>
                        <span>{getStatusBadge(payment.status)}</span>
                        <div className="space-x-2">
                          <button className="text-brand-orange hover:text-brand-orange text-sm">
                            View
                          </button>
                          {payment.status === 'paid' && (
                            <button className="text-brand-orange hover:text-brand-orange text-sm">
                              Download
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <IconCreditCard className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600">Geen betaalgeschiedenis beschikbaar.</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Je betalingstransacties verschijnen hier.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Billing Info */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Factureringsinformatie</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-neutral-200 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 mb-3">Factuuradres</h4>
                <div className="text-center py-4">
                  <p className="text-neutral-500 text-sm mb-3">Geen factuuradres geregistreerd</p>
                  <button className="px-4 py-2 bg-brand-orange text-white text-sm rounded-lg hover:bg-brand-orange/90">
                    Factuuradres Toevoegen
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-500">
                    💡 Factuuradres wordt verzameld tijdens checkout via Mollie
                  </p>
                </div>
              </div>
              
              <div className="border border-neutral-200 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 mb-3">Belastinginformatie</h4>
                <div className="text-center py-4">
                  <p className="text-neutral-500 text-sm mb-3">Geen belastinginformatie geconfigureerd</p>
                  <button className="px-4 py-2 bg-brand-orange text-white text-sm rounded-lg hover:bg-brand-orange/90">
                    Belastinginstellingen Configureren
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-500">
                    💡 Belastingafhandeling wordt beheerd door Mollie gebaseerd op je bedrijfslocatie
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Payment */}
          {customer?.plan && (
            <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-brand-blue">Volgende Betaling</h4>
                  <p className="text-sm text-brand-blue mt-1">
                    Je volgende betaling van €{customer.plan.price} wordt afgeschreven op{' '}
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
                <button className="px-4 py-2 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue transition-colors">
                  Betaling Bijwerken
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddPaymentMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Betaalmethode Toevoegen</h3>
              <button
                onClick={() => setShowAddPaymentMethod(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <IconX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <IconCreditCard className="h-12 w-12 text-brand-orange mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">
                  Je wordt doorgestuurd naar Mollie om veilig een betaalmethode toe te voegen. Dit is een eenmalige €0,01 verificatiekosten die wordt terugbetaald.
                </p>
              </div>

              <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <IconShieldCheck className="h-5 w-5 text-brand-blue mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-brand-blue">Veilig & PCI Compliant</h4>
                    <p className="text-sm text-brand-blue mt-1">
                      Je betalingsgegevens worden veilig verwerkt door Mollie en nooit opgeslagen op onze servers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddPaymentMethod(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                  disabled={isCreatingPaymentMethod}
                >
                  Annuleren
                </button>
                <button
                  onClick={handleAddPaymentMethod}
                  disabled={isCreatingPaymentMethod}
                  className="flex-1 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingPaymentMethod ? 'Instellen...' : 'Doorgaan naar Mollie'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Settings Section Component
function SettingsSection({ session }: { session: any }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Nieuwe wachtwoorden komen niet overeen.');
      setLoading(false);
      return;
    }

    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      
      const response = await fetch(`${strapiUrl}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.jwt}`,
        },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Wachtwoord succesvol bijgewerkt.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error?.message || 'Er is een fout opgetreden.');
      }
    } catch (err) {
      console.error('🚨 Password change exception:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Account Instellingen</h2>
        
        <div className="space-y-6">
          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Meldingen</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-brand-orange" />
                <span className="ml-3 text-neutral-700">E-mailmeldingen</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-brand-orange" />
                <span className="ml-3 text-neutral-700">Marketing e-mails</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-brand-orange" />
                <span className="ml-3 text-neutral-700">Beveiligingswaarschuwingen</span>
              </label>
            </div>
          </div>

          {/* Password Change */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Wachtwoord veranderen</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700">
                  Huidig wachtwoord
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700">
                  Nieuw wachtwoord
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                  Bevestig nieuw wachtwoord
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                  required
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              {success && (
                <div className="text-green-600 text-sm">{success}</div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Bijwerken...' : 'Wachtwoord bijwerken'}
              </button>
            </form>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Privacy</h3>
            <div className="space-y-4">
              <button className="text-left">
                <span className="text-neutral-700">Download je gegevens</span>
                <p className="text-sm text-neutral-500">Krijg een kopie van je accountgegevens</p>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Gevarenzone</h3>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Account Verwijderen
            </button>
            <p className="text-sm text-neutral-500 mt-2">Deze actie kan niet ongedaan worden gemaakt.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Vacatures Section Component
function VacaturesSection({ session, customer, plan }: { 
  session: any; 
  customer: any; 
  plan: any;
}) {
  const [vacatures, setVacatures] = useState<Vacature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVacature, setEditingVacature] = useState<Vacature | null>(null);

  const fetchVacatures = useCallback(async () => {
    if (!session?.user?.jwt) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/vacatures?dashboard=true&populate=*`, {
        headers: {
          'Authorization': `Bearer ${session.user.jwt}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVacatures(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching vacatures:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.jwt]);

  useEffect(() => {
    fetchVacatures();
  }, [fetchVacatures]);

  const handleToggleActive = async (id: number, isActive: boolean) => {
    if (!session?.user?.jwt) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/vacatures/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.jwt}`,
        },
        body: JSON.stringify({
          data: { is_active: !isActive }
        }),
      });

      if (response.ok) {
        fetchVacatures();
      }
    } catch (error) {
      console.error('Error toggling vacature status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.user?.jwt || !confirm('Weet je zeker dat je deze vacature wilt verwijderen?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/vacatures/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.user.jwt}`,
        },
      });

      if (response.ok) {
        fetchVacatures();
      }
    } catch (error) {
      console.error('Error deleting vacature:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (showCreateForm || editingVacature) {
    return (
      <VacatureForm
        session={session}
        customer={customer}
        plan={plan}
        vacature={editingVacature}
        onClose={() => {
          setShowCreateForm(false);
          setEditingVacature(null);
        }}
        onSuccess={() => {
          setShowCreateForm(false);
          setEditingVacature(null);
          fetchVacatures();
        }}
      />
    );
  }

  const activeVacatures = vacatures.filter(v => v.is_active && v.publishedAt);
  const inactiveVacatures = vacatures.filter(v => !v.is_active || !v.publishedAt);

  // Calculate plan limits
  const planLimits = {
    'Basic': 1,
    'Pro': 5,
    'Enterprise': -1 // unlimited
  };
  
  const limit = planLimits[plan?.name as keyof typeof planLimits] || 1;
  const canCreateMore = limit === -1 || activeVacatures.length < limit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Vacature Beheer</h2>
            <p className="text-neutral-600 mt-1">
              Beheer je vacatures en bereik potentiële kandidaten
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            disabled={!canCreateMore}
            className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconPlus className="h-4 w-4" />
            <span>Nieuwe Vacature</span>
          </button>
        </div>

        {/* Plan Status */}
        <div className="mt-4 p-4 bg-brand-blue/10 rounded-lg">
          <p className="text-sm text-brand-blue">
            <strong>{plan?.name || 'Basic'} Plan:</strong> {' '}
            {limit === -1 ? 'Onbeperkt aantal' : `${activeVacatures.length}/${limit}`} actieve vacatures
            {!canCreateMore && (
              <span className="text-red-600 ml-2">
                (Limiet bereikt - upgrade je plan voor meer vacatures)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Active Vacatures */}
      {activeVacatures.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900">Actieve Vacatures ({activeVacatures.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {activeVacatures.map((vacature) => (
              <VacatureCard
                key={vacature.id}
                vacature={vacature}
                onEdit={() => setEditingVacature(vacature)}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Vacatures */}
      {inactiveVacatures.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900">Inactieve Vacatures ({inactiveVacatures.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {inactiveVacatures.map((vacature) => (
              <VacatureCard
                key={vacature.id}
                vacature={vacature}
                onEdit={() => setEditingVacature(vacature)}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {vacatures.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <IconBriefcase className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Nog geen vacatures</h3>
          <p className="text-neutral-600 mb-6">Begin met het plaatsen van je eerste vacature om kandidaten te bereiken.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            disabled={!canCreateMore}
            className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors disabled:opacity-50"
          >
            Eerste Vacature Plaatsen
          </button>
        </div>
      )}
    </div>
  );
}

// Vacature Card Component
function VacatureCard({ 
  vacature, 
  onEdit, 
  onToggleActive, 
  onDelete 
}: { 
  vacature: Vacature;
  onEdit: () => void;
  onToggleActive: (id: number, isActive: boolean) => void;
  onDelete: (id: number) => void;
}) {
  const isExpired = vacature.expires_at && new Date(vacature.expires_at) < new Date();
  const isActive = vacature.is_active && vacature.publishedAt && !isExpired;

  return (
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-neutral-900">{vacature.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              isActive 
                ? 'bg-green-100 text-green-800' 
                : isExpired 
                  ? 'bg-red-100 text-red-800'
                  : 'bg-neutral-100 text-neutral-800'
            }`}>
              {isActive ? 'Actief' : isExpired ? 'Verlopen' : 'Inactief'}
            </span>
          </div>
          
          <div className="mt-2 space-y-1">
            <p className="text-neutral-600">{vacature.company_name} • {vacature.location}</p>
            <div className="flex items-center space-x-4 text-sm text-neutral-500">
              <span>{vacature.employment_type}</span>
              <span>{vacature.location_type}</span>
              {vacature.experience_level && <span>{vacature.experience_level}</span>}
            </div>
            {(vacature.salary_min || vacature.salary_max) && (
              <p className="text-sm text-neutral-600">
                €{vacature.salary_min ? vacature.salary_min.toLocaleString() : '?'} - 
                €{vacature.salary_max ? vacature.salary_max.toLocaleString() : '?'} {vacature.salary_period}
              </p>
            )}
            {vacature.expires_at && (
              <p className="text-sm text-neutral-500">
                Verloopt: {new Date(vacature.expires_at).toLocaleDateString('nl-NL')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-neutral-400 hover:text-brand-orange transition-colors"
            title="Bewerken"
            aria-label="Vacature bewerken"
          >
            <IconEdit className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onToggleActive(vacature.id, vacature.is_active)}
            className="p-2 text-neutral-400 hover:text-brand-blue transition-colors"
            title={vacature.is_active ? 'Deactiveren' : 'Activeren'}
            aria-label={vacature.is_active ? 'Vacature deactiveren' : 'Vacature activeren'}
          >
            {vacature.is_active ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => onDelete(vacature.id)}
            className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
            title="Verwijderen"
            aria-label="Vacature verwijderen"
          >
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Vacature Form Component
function VacatureForm({ 
  session, 
  customer, 
  plan, 
  vacature, 
  onClose, 
  onSuccess 
}: { 
  session: any;
  customer: any;
  plan: any;
  vacature: Vacature | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: vacature?.title || '',
    description: vacature?.description || '',
    company_name: vacature?.company_name || session?.user?.company_name || '',
    location: vacature?.location || '',
    location_type: vacature?.location_type || 'On-site' as const,
    employment_type: vacature?.employment_type || 'Full-time' as const,
    experience_level: vacature?.experience_level || 'Mid Level' as const,
    salary_min: vacature?.salary_min || '',
    salary_max: vacature?.salary_max || '',
    salary_period: vacature?.salary_period || 'per month' as const,
    requirements: vacature?.requirements || '',
    benefits: vacature?.benefits || '',
    application_email: vacature?.application_email || session?.user?.email || '',
    application_url: vacature?.application_url || '',
    expires_at: vacature?.expires_at ? vacature.expires_at.split('T')[0] : '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!session?.user?.jwt) {
      setMessage({ type: 'error', text: 'Geen authenticatie gevonden' });
      setLoading(false);
      return;
    }

    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.application_email.trim()) {
      setMessage({ type: 'error', text: 'Vul alle verplichte velden in' });
      setLoading(false);
      return;
    }

    try {
      const url = vacature 
        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/vacatures/${vacature.id}`
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/vacatures`;
      
      const method = vacature ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.jwt}`,
        },
        body: JSON.stringify({
          data: {
            ...formData,
            salary_min: formData.salary_min ? parseInt(formData.salary_min.toString()) : null,
            salary_max: formData.salary_max ? parseInt(formData.salary_max.toString()) : null,
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: vacature ? 'Vacature succesvol bijgewerkt!' : 'Vacature succesvol aangemaakt!' 
        });
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error?.message || 'Er is een fout opgetreden'
        });
      }
    } catch (error) {
      console.error('Error saving vacature:', error);
      setMessage({ 
        type: 'error', 
        text: 'Er is een onverwachte fout opgetreden'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-neutral-900">
          {vacature ? 'Vacature Bewerken' : 'Nieuwe Vacature Plaatsen'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          title="Sluiten"
        >
          <IconX className="h-5 w-5" />
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Basis Informatie</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Functietitel *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                placeholder="Senior React Developer"
                required
                maxLength={100}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Bedrijfsnaam *
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                placeholder="Jouw Bedrijf BV"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Locatie *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                placeholder="Amsterdam, Nederland"
                required
              />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Functie Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Locatie Type
              </label>
              <select
                value={formData.location_type}
                onChange={(e) => setFormData({...formData, location_type: e.target.value as any})}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                title="Selecteer locatie type"
              >
                <option value="On-site">Op locatie</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybride</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Dienstverband
              </label>
              <select
                value={formData.employment_type}
                onChange={(e) => setFormData({...formData, employment_type: e.target.value as any})}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                title="Selecteer dienstverband"
              >
                <option value="Full-time">Fulltime</option>
                <option value="Part-time">Parttime</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Stage</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Ervaring Level
              </label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData({...formData, experience_level: e.target.value as any})}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                title="Selecteer ervaring level"
              >
                <option value="Entry Level">Starter</option>
                <option value="Junior">Junior</option>
                <option value="Mid Level">Medior</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
          </div>
        </div>

        {/* Salary Information */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Salaris Informatie</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Minimum Salaris (€)
              </label>
              <input
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData({...formData, salary_min: e.target.value})}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                placeholder="3000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Maximum Salaris (€)
              </label>
              <input
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Salaris Periode
              </label>
              <select
                value={formData.salary_period}
                onChange={(e) => setFormData({...formData, salary_period: e.target.value as any})}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                title="Selecteer salaris periode"
              >
                <option value="per hour">Per uur</option>
                <option value="per month">Per maand</option>
                <option value="per year">Per jaar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Functiebeschrijving *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={6}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
            placeholder="Beschrijf de functie, verantwoordelijkheden, en wat je zoekt in een kandidaat..."
            required
          />
        </div>

        {/* Requirements & Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Vereisten
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
              placeholder="- Minimaal 3 jaar ervaring met React&#10;- Kennis van TypeScript&#10;- Ervaring met API's"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Voordelen
            </label>
            <textarea
              value={formData.benefits}
              onChange={(e) => setFormData({...formData, benefits: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
              placeholder="- Flexibele werktijden&#10;- Remote werk mogelijk&#10;- Goede pensioenregeling"
            />
          </div>
        </div>

        {/* Application Information */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Sollicitatie Informatie</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Contact E-mail *
              </label>
              <input
                type="email"
                value={formData.application_email}
                onChange={(e) => setFormData({...formData, application_email: e.target.value})}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                placeholder="hr@jouwbedrijf.nl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Sollicitatie URL (optioneel)
              </label>
              <input
                type="url"
                value={formData.application_url}
                onChange={(e) => setFormData({...formData, application_url: e.target.value})}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                placeholder="https://jouwbedrijf.nl/carriere"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Vervaldatum (optioneel)
              </label>
              <input
                type="date"
                value={formData.expires_at}
                onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                min={new Date().toISOString().split('T')[0]}
                title="Selecteer vervaldatum"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            disabled={loading}
          >
            Annuleren
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Opslaan...' : (vacature ? 'Bijwerken' : 'Publiceren')}
          </button>
        </div>
      </form>
    </div>
  );
}