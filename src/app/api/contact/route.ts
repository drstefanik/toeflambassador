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
    return NextResponse.json({ ok: true });
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
  const timestamp = new Date().toISOString();

  let resendMessageId: string | undefined;
  let status: "sent" | "failed" = "sent";

  try {
    const emailResponse = await sendEmail({
      to: centerEmail,
      cc: env.CONTROL_CC_EMAIL || undefined,
      subject: `[TOEFL Ambassador] ${subject} — ${name}`,
      replyTo: email,
      html: `
        <p>Hai ricevuto un nuovo messaggio dal form TOEFL Ambassador.</p>
        <p><strong>Centro:</strong> ${centerName}</p>
        <p><strong>Slug:</strong> ${centerSlug}</p>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile || "—"}</p>
        <p><strong>Oggetto:</strong> ${subject}</p>
        <p><strong>Messaggio:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
        <p><strong>IP:</strong> ${ip}</p>
        <p><strong>User Agent:</strong> ${userAgent}</p>
        <p><strong>Timestamp:</strong> ${timestamp}</p>
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

  let leadSaved = true;

  try {
    await createContactLead({
      CenterSlug: centerSlug,
      CenterName: centerName,
      Email: email,
      Mobile: mobile,
      Subject: subject,
      Message: message,
      Ip: ip,
      UserAgent: userAgent,
      Status: status,
      ResendMessageId: resendMessageId,
      CreatedAt: timestamp,
    });
  } catch (error) {
    leadSaved = false;
    console.error("Airtable lead save failed", error);
  }

  return NextResponse.json({ ok: true, leadSaved });
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed" },
    { status: 405 }
  );
}
