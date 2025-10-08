import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
          
          const response = await fetch(`${strapiUrl}/api/auth/local`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              identifier: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();
          
          if (response.ok && data.user) {
            return {
              id: String(data.user.id),
              email: data.user.email,
              name: data.user.username || data.user.email,
              jwt: data.jwt,
              kvk_number: data.user.kvk_number,
              company_name: data.user.company_name,
              street_address: data.user.street_address,
              postal_code: data.user.postal_code,
              city: data.user.city,
              country: data.user.country,
              sector: data.user.sector,
              sub_sector: data.user.sub_sector,
              trial_start_date: data.user.trial_start_date,
              trial_end_date: data.user.trial_end_date,
              is_trial_active: data.user.is_trial_active,
              subscription_status: data.user.subscription_status,
            };
          }

          return null;
        } catch (error) {
          console.error('🚨 Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwt = (user as any).jwt;
        token.userId = user.id;
        token.kvk_number = (user as any).kvk_number;
        token.company_name = (user as any).company_name;
        token.street_address = (user as any).street_address;
        token.postal_code = (user as any).postal_code;
        token.city = (user as any).city;
        token.country = (user as any).country;
        token.sector = (user as any).sector;
        token.sub_sector = (user as any).sub_sector;
        token.trial_start_date = (user as any).trial_start_date;
        token.trial_end_date = (user as any).trial_end_date;
        token.is_trial_active = (user as any).is_trial_active;
        token.subscription_status = (user as any).subscription_status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.userId;
        (session.user as any).jwt = token.jwt;
        (session.user as any).kvk_number = token.kvk_number;
        (session.user as any).company_name = token.company_name;
        (session.user as any).street_address = token.street_address;
        (session.user as any).postal_code = token.postal_code;
        (session.user as any).city = token.city;
        (session.user as any).country = token.country;
        (session.user as any).sector = token.sector;
        (session.user as any).sub_sector = token.sub_sector;
        (session.user as any).trial_start_date = token.trial_start_date;
        (session.user as any).trial_end_date = token.trial_end_date;
        (session.user as any).is_trial_active = token.is_trial_active;
        (session.user as any).subscription_status = token.subscription_status;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});