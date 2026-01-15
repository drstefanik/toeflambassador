import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";
import { env } from "./config";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  cc?: string;
  replyTo?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    console.warn("Email not sent. Missing RESEND_API_KEY or RESEND_FROM_EMAIL");
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const from = env.RESEND_FROM_EMAIL;
  const to = options.to;
  const cc = options.cc;
  const replyTo = options.replyTo;
  const html = options.html;
  const text = options.text ?? options.html?.replace(/<[^>]+>/g, "");

  const toList = (to ?? "").trim() ? [(to ?? "").trim()] : [];

  const ccTrimmed = (cc ?? "").trim();
  const ccList = ccTrimmed ? [ccTrimmed] : undefined;
  const replyToTrimmed = (replyTo ?? "").trim();

  const payload: CreateEmailOptions = {
    from,
    to: toList,
    ...(ccList ? { cc: ccList } : {}),
    subject: options.subject,
    ...(replyToTrimmed ? { replyTo: replyToTrimmed } : {}),
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
  };

  const response = await resend.emails.send(payload);

  if (response.error) {
    console.error("Failed to send email", response.error);
    throw new Error("Unable to send email");
  }

  return response.data;
}
