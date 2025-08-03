import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../db";
import type { NextAuthConfig } from "next-auth";
import { User } from "next-auth";
import GitHub from "next-auth/providers/github";
import Email from "next-auth/providers/email";
import { sendVerificationRequest } from "./verification";
import { users, accounts } from "../db/schema";
import { eq } from "drizzle-orm";

declare module "next-auth" {
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
    strategy: "database",
  },
  trustHost: true,
  experimental: {
    enableWebAuthn: false,
  },
  providers: [
    Email({
      id: "email",
      from: process.env.SMTP_FROM || "noreply@example.com",
      server: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
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
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
    redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful login
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      if (!user.email || !account) return false;
      
      // For OAuth providers, check if user exists and link accounts
      if (account.provider !== "email") {
        try {
          console.log(`[Auth] OAuth sign-in attempt for ${user.email} via ${account.provider}`);
          
          // Check if user already exists with this email
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email))
            .limit(1);
          
          if (existingUser.length > 0) {
            console.log(`[Auth] Found existing user, allowing account linking for ${user.email}`);
            // User exists, allow linking by setting the user ID
            user.id = existingUser[0].id;
          }
          
          return true;
        } catch (error) {
          console.error(`[Auth] Error during account linking:`, error);
          return false;
        }
      }
      
      return true;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/check-email",
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(config);
