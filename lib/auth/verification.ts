import { smtpEmailSender } from '@/lib/utils/smtp';
import MagicLinkEmail from '@/components/email/magic-link-email';

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
    console.log(`Attempting to send magic link email to: ${identifier}`);
    console.log(`SMTP Config - Host: ${process.env.SMTP_HOST}, Port: ${process.env.SMTP_PORT}, User: ${process.env.SMTP_USER}`);
    
    const result = await smtpEmailSender.emails.send({
      from: process.env.SMTP_FROM || 'noreply@allowebs.com',
      to: [identifier],
      subject: `Log in to ${host}`,
      text: text({ url, host }),
      react: MagicLinkEmail({ url, host }),
    });
    
    console.log('Email sent successfully:', result.id);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error(`Failed to send the verification email: ${error.message}`);
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
