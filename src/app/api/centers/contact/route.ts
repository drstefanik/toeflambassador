import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { getCenterBySlug } from "@/lib/repositories/centers";
import { env } from "@/lib/config";

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    { ok: false, error: { code, message } },
    { status }
  );
}

export async function POST(request: NextRequest) {
  let payload: {
    centerSlug?: string;
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
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

    if (!centerSlug || !name || !email || !subject || !message) {
      return errorResponse(400, "missing_fields", "Dati mancanti");
    }

    const center = await getCenterBySlug(centerSlug);
    const targetEmail = center?.fields.ContactFormEmail || center?.fields.Email;
    if (!center || !targetEmail) {
      return errorResponse(404, "center_not_found", "Centro non trovato");
    }

    await sendEmail({
      to: targetEmail,
      cc: env.ADMIN_CONTACT_EMAIL || undefined,
      subject: `[TOEFL Ambassador] ${subject}`,
      html: `<p>Hai ricevuto un nuovo messaggio dal portale TOEFL Ambassador.</p><p><strong>Nome:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Messaggio:</strong><br/>${message}</p>`,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("centers contact", error);
    return errorResponse(500, "server_error", "Impossibile inviare il messaggio");
  }
}
