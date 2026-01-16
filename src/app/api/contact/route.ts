import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createContactLead, getCenterRecordBySlug } from "@/lib/airtable";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/config";

const redis = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
    })
  : null;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(request: NextRequest): string {
  const h = request.headers;

  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();

  const realIp = h.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cf = h.get("cf-connecting-ip");
  if (cf) return cf.trim();

  return "unknown";
}

export async function POST(request: NextRequest) {
  let payload: {
    centerSlug?: string;
    name?: string;
    mobile?: string;
    email?: string;
    subject?: string;
    message?: string;
    company?: string;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const centerSlug = String(payload.centerSlug || "").trim();
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const subject = String(payload.subject || "").trim();
  const message = String(payload.message || "").trim();
  const mobile = String(payload.mobile || "").trim();
  const company = String(payload.company || "").trim();

  if (company) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!centerSlug || !name || !email || !subject || !message) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email" },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);

  if (ratelimit) {
    const { success } = await ratelimit.limit(`contactform:${ip}`);
    if (!success) {
      return NextResponse.json(
        { ok: false, error: "Too many requests" },
        { status: 429 }
      );
    }
  }

  const centerRecord = await getCenterRecordBySlug(centerSlug);
  const centerFields = centerRecord?.fields;
  const centerEmail = centerFields?.Email;
  const centerName = centerFields?.Name || "";

  if (!centerRecord || !centerEmail) {
    return NextResponse.json(
      { ok: false, error: "Center not found" },
      { status: 404 }
    );
  }

  const userAgent = request.headers.get("user-agent") || "";

  let resendMessageId: string | undefined;
  let status: "sent" | "failed" = "sent";

  try {
    const textContent = [
      "Hai ricevuto un nuovo messaggio dal form TOEFL Ambassador.",
      "",
      `Centro: ${centerName}`,
      "",
      `Nome: ${name}`,
      `Email: ${email}`,
      `Mobile: ${mobile || "—"}`,
      "",
      `Oggetto: ${subject}`,
      "",
      "Messaggio:",
      message,
    ].join("\n");

    const emailResponse = await sendEmail({
      to: centerEmail,
      cc: env.CONTROL_CC_EMAIL || undefined,
      subject: `[TOEFL Ambassador] ${subject} — ${name}`,
      replyTo: email,
      text: textContent,
      html: `
        <p>Hai ricevuto un nuovo messaggio dal form TOEFL Ambassador.</p>
        <p><strong>Centro:</strong> ${centerName}</p>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile || "—"}</p>
        <p><strong>Oggetto:</strong> ${subject}</p>
        <p><strong>Messaggio:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    if (emailResponse?.id) {
      resendMessageId = emailResponse.id;
    } else {
      status = "failed";
    }
  } catch (error) {
    console.error("contact email send failed", error);
    status = "failed";
  }

  if (status === "failed") {
    return NextResponse.json(
      { ok: false, error: "Unable to send" },
      { status: 500 }
    );
  }

  let leadWarning: string | undefined;
  try {
    await createContactLead({
      CenterSlug: centerSlug,
      CenterName: centerName,
      Name: name,
      Email: email,
      Mobile: mobile,
      Subject: subject,
      Message: message,
      Ip: ip,
      UserAgent: userAgent,
      Status: status,
      ResendMessageId: resendMessageId,
    });
  } catch (error) {
    console.error("Airtable lead save failed", error);
    leadWarning = "lead_not_saved";
  }

  return NextResponse.json(
    leadWarning ? { ok: true, warning: leadWarning } : { ok: true },
    { status: 200 }
  );
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed" },
    { status: 405 }
  );
}
