import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { getCenterBySlug } from "@/lib/repositories/centers";
import { env } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const { centerSlug, name, email, subject, message } = await request.json();
    if (!centerSlug || !name || !email || !subject || !message) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const center = await getCenterBySlug(centerSlug);
    if (!center || !center.fields.ContactFormEmail) {
      return NextResponse.json({ error: "Centro non trovato" }, { status: 404 });
    }

    await sendEmail({
      to: center.fields.ContactFormEmail,
      cc: env.ADMIN_CONTACT_EMAIL || undefined,
      subject: `[TOEFL Ambassador] ${subject}`,
      html: `<p>Hai ricevuto un nuovo messaggio dal portale TOEFL Ambassador.</p><p><strong>Nome:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Messaggio:</strong><br/>${message}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("centers contact", error);
    return NextResponse.json({ error: "Impossibile inviare il messaggio" }, { status: 500 });
  }
}
