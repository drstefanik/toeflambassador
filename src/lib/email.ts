import { Resend } from "resend";
import { env } from "./config";

type EmailTarget = string | string[];

export interface SendEmailOptions {
  to: EmailTarget;
  subject: string;
  html?: string;
  text?: string;
  cc?: EmailTarget;
  replyTo?: string;
}

const formatTarget = (target?: EmailTarget) => {
  if (!target) return undefined;
  return Array.isArray(target) ? target : [target];
};

export async function sendEmail(options: SendEmailOptions) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    console.warn("Email not sent. Missing RESEND_API_KEY or RESEND_FROM_EMAIL");
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const payload = {
    from: env.RESEND_FROM_EMAIL,
    to: formatTarget(options.to),
    cc: formatTarget(options.cc),
    subject: options.subject,
    reply_to: options.replyTo,
    html: options.html,
    text: options.text ?? options.html?.replace(/<[^>]+>/g, ""),
  };

  const response = await resend.emails.send(payload);

  if (response.error) {
    console.error("Failed to send email", response.error);
    throw new Error("Unable to send email");
  }

  return response.data;
}
