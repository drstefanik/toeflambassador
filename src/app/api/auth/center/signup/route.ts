import { NextRequest, NextResponse } from "next/server";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getCenterBySlug } from "@/lib/repositories/centers";
import {
  findCenterUserByEmail,
  linkCenterUserToCenter,
  markOTPUsed,
  updateCenterUserPassword,
} from "@/lib/repositories/centerUsers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, otp, centerSlug } = body;

    if (!email || !password || !otp || !centerSlug) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const center = await getCenterBySlug(centerSlug);
    if (!center) {
      return NextResponse.json({ error: "Centro non trovato" }, { status: 400 });
    }

    const centerUser = await findCenterUserByEmail(email);
    if (
      !centerUser ||
      !centerUser.fields.OTP ||
      centerUser.fields.OTP !== otp ||
      centerUser.fields.OTPUsed
    ) {
      return NextResponse.json({ error: "OTP non valido" }, { status: 401 });
    }

    const passwordHash = await hashPassword(password);
    await updateCenterUserPassword(centerUser.id, passwordHash);
    await linkCenterUserToCenter(centerUser.id, center.id);
    await markOTPUsed(centerUser.id);

    const token = signToken({
      role: "center",
      centerUserId: centerUser.id,
      centerId: center.id,
      email,
    });
    const response = NextResponse.json({ email });
    setAuthCookie(response, token, "center");

    await sendEmail({
      to: email,
      subject: "Benvenuto nel network TOEFL Ambassador",
      html: `<p>Ciao ${center.name},</p><p>Il tuo account centro è stato attivato. Accedi alla dashboard per gestire pagine e ordini.</p>`,
    });

    return response;
  } catch (error) {
    console.error("center signup", error);
    return NextResponse.json({ error: "Errore durante la registrazione" }, { status: 500 });
  }
}
