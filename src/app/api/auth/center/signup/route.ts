import { NextRequest, NextResponse } from "next/server";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getCenterById } from "@/lib/repositories/centers";
import {
  createCenterUserRecord,
  findCenterUserByEmail,
  linkCenterUserToCenter,
  updateCenterUserPassword,
} from "@/lib/repositories/centerUsers";
import { findActiveCenterOtpByCode, markCenterOtpUsed } from "@/lib/repositories/centerOtps";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, otp, centerSlug } = body;

    if (!email || !password || !otp || !centerSlug) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const centerOtp = await findActiveCenterOtpByCode(otp);
    if (!centerOtp) {
      return NextResponse.json({ error: "OTP non valido" }, { status: 400 });
    }

    const now = new Date();
    const expiresAtValue = centerOtp.fields.ExpiresAt;
    const expiresAt = expiresAtValue ? new Date(expiresAtValue) : null;
    if (!expiresAt || Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < now.getTime()) {
      return NextResponse.json({ error: "OTP scaduto" }, { status: 400 });
    }

    const centerIds = centerOtp.fields.Center ?? [];
    if (!centerIds.length) {
      return NextResponse.json(
        { error: "OTP non valido per questo centro" },
        { status: 400 }
      );
    }

    const center = await getCenterById(centerIds[0]);
    if (!center.slug || center.slug !== centerSlug) {
      return NextResponse.json(
        { error: "OTP non valido per questo centro" },
        { status: 400 }
      );
    }

    let centerUser = await findCenterUserByEmail(email);
    const passwordHash = await hashPassword(password);
    if (!centerUser) {
      centerUser = await createCenterUserRecord({
        email,
        centerId: center.id,
        passwordHash,
      });
    } else {
      await updateCenterUserPassword(centerUser.id, passwordHash);
      await linkCenterUserToCenter(centerUser.id, center.id);
    }
    await markCenterOtpUsed(centerOtp.id, now);

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
