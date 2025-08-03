import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '../db';
import type { NextAuthConfig } from 'next-auth';
import { User } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Email from 'next-auth/providers/email';
import { sendVerificationRequest } from './verification';
import { users, accounts } from '../db/schema';
import { eq } from 'drizzle-orm';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

export const config = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: 'jwt', // Use JWT for Edge Runtime compatibility in middleware
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  experimental: {
    enableWebAuthn: false,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    Email({
      id: 'email',
      from: process.env.SMTP_FROM || 'noreply@example.com',
      server: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      sendVerificationRequest,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }), // GitHub OAuth provider
  ],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
    jwt({ token, user, account }) {
      console.log(`[JWT] Callback triggered with:`, {
        hasUser: !!user,
        hasToken: !!token,
        provider: account?.provider,
      });

      if (user) {
        token.id = user.id;
        token.email = user.email;
        console.log(`[JWT] Setting token data:`, {
          id: user.id,
          email: user.email,
        });
      }

      return token;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
    redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful login
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      console.log(`[Auth] SignIn callback triggered:`, {
        email: user.email,
        provider: account?.provider,
        hasUser: !!user,
        hasAccount: !!account,
      });

      return true;
    },
  },
  pages: {
    signIn: '/login',
    verifyRequest: '/check-email',
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(config);
