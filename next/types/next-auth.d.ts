import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      jwt: string;
      kvk_number?: string | null;
      company_name?: string | null;
      street_address?: string | null;
      postal_code?: string | null;
      city?: string | null;
      country?: string | null;
    };
  }

  interface User {
    id: string;
    jwt: string;
    kvk_number?: string;
    company_name?: string;
    street_address?: string;
    postal_code?: string;
    city?: string;
    country?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    jwt: string;
  }
}