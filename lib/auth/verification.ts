import { smtpEmailSender } from "@/lib/utils/smtp";
import MagicLinkEmail from "@/components/email/magic-link-email";

export async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  expires: Date;
  provider: any;
  token: string;
  theme: any;
  request: Request;
}) {
  const { identifier, url } = params;
  const { host } = new URL(url);

  try {
    await smtpEmailSender.emails.send({
      from: process.env.SMTP_FROM || "info@router.so",
      to: [identifier],
      subject: `Log in to ${host}`,
      text: text({ url, host }),
      react: MagicLinkEmail({ url, host }),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send the verification email.");
  }
}

/**
 * Generates text for email
 *
 * @param url - The URL to be included in the generated text.
 * @param host - The host to be included in the generated text.
 * @returns A string containing the generated text.
 */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
