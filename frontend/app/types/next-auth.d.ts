import NextAuth from 'next-auth';

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: 'month' | 'year';
  features?: string;
  isActive: boolean;
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
      hasActiveSubscription?: boolean;
      planId?: string;
      plan?: Plan;
      isApprovedWaitlist?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    isAdmin?: boolean;
    hasActiveSubscription?: boolean;
    planId?: string;
    plan?: Plan;
    isApprovedWaitlist?: boolean;
  }
}