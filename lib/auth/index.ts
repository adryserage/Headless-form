import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../db";
import type { NextAuthConfig } from "next-auth";
import { User } from "next-auth";
import GitHub from "next-auth/providers/github";
import { sendVerificationRequest } from "./verification";

declare module "next-auth" {
  interface Session extends User {
    user: {
      id: string;
    } & Session;
  }
}

export const config = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    {
      id: "email",
      type: "email",
      name: "Email",
      from: process.env.SMTP_FROM || "noreply@example.com",
      maxAge: 24 * 60 * 60, // 24 hours
      options: {},
      sendVerificationRequest,
    },
    GitHub, // optional GitHub provider
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
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/check-email",
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(config);
