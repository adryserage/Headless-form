import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

// Force Node.js runtime for NextAuth.js to support nodemailer streams
export const runtime = 'nodejs';
