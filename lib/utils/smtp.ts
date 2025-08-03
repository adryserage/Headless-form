import nodemailer from "nodemailer";
import { render } from "@react-email/render";

// Create SMTP transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

// Email sending function compatible with the existing interface
export const smtpEmailSender = {
  emails: {
    send: async ({
      from,
      to,
      subject,
      text,
      react,
    }: {
      from: string;
      to: string[];
      subject: string;
      text?: string;
      react?: React.ReactElement;
    }) => {
      const htmlContent = react ? await render(react) : undefined;
      
      const mailOptions = {
        from: from || process.env.SMTP_FROM!,
        to: to.join(", "),
        subject,
        text,
        html: htmlContent,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        return { id: info.messageId, data: info };
      } catch (error) {
        console.error("SMTP Email error:", error);
        throw error;
      }
    },
  },
};
