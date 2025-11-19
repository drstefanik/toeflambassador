import { env } from "./config";

type EmailTarget = string | string[];

export interface SendEmailOptions {
  to: EmailTarget;
  subject: string;
  html?: string;
  text?: string;
  cc?: EmailTarget;
}

const formatTarget = (target?: EmailTarget) => {
  if (!target) return undefined;
  return Array.isArray(target) ? target : [target];
};

export async function sendEmail(options: SendEmailOptions) {
  if (!env.EMAIL_API_KEY || !env.EMAIL_FROM) {
    console.warn("Email not sent. Missing EMAIL_API_KEY or EMAIL_FROM");
    return;
  }

  const payload = {
    from: env.EMAIL_FROM,
    to: formatTarget(options.to),
    cc: formatTarget(options.cc),
    subject: options.subject,
    html: options.html,
    text: options.text ?? options.html?.replace(/<[^>]+>/g, ""),
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.EMAIL_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to send email", errorText);
    throw new Error("Unable to send email");
  }

  return response.json();
}
