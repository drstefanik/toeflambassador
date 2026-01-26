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

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    { ok: false, error: { code, message } },
    { status }
  );
}

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
    return errorResponse(400, "invalid_json", "Invalid JSON");
  }

  try {
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
      return errorResponse(400, "missing_fields", "Missing required fields");
    }

    if (!emailRegex.test(email)) {
      return errorResponse(400, "invalid_email", "Invalid email");
    }

    const ip = getClientIp(request);

    if (ratelimit) {
      const { success } = await ratelimit.limit(`contactform:${ip}`);
      if (!success) {
        return errorResponse(429, "rate_limited", "Too many requests");
      }
    }

    const centerRecord = await getCenterRecordBySlug(centerSlug);
    const centerFields = centerRecord?.fields;
    const centerEmail = centerFields?.Email;
    const centerName = centerFields?.Name || "";

    if (!centerRecord || !centerEmail) {
      return errorResponse(404, "center_not_found", "Center not found");
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
      return errorResponse(500, "email_send_failed", "Unable to send");
    }

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
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("contact form error", error);
    return errorResponse(500, "server_error", "Server error");
  }
}

export async function GET() {
  return errorResponse(405, "method_not_allowed", "Method not allowed");
}
