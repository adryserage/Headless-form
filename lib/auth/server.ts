import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

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
  session: {
    strategy: 'jwt', // Use JWT for Edge Runtime compatibility in middleware
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('[Auth] Missing email or password');
          return null;
        }

        try {
          // Find user by email
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .limit(1);

          if (user.length === 0) {
            console.log('[Auth] User not found');
            return null;
          }

          const dbUser = user[0];

          // Check password
          if (!dbUser.password) {
            console.log('[Auth] User has no password set');
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            dbUser.password
          );

          if (!isValidPassword) {
            console.log('[Auth] Invalid password');
            return null;
          }

          console.log('[Auth] User authenticated successfully');
          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
          };
        } catch (error) {
          console.error('[Auth] Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful login
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    verifyRequest: '/check-email',
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(config);
