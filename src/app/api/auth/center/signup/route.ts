import { NextRequest, NextResponse } from "next/server";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getCenterById } from "@/lib/repositories/centers";
import {
  createCenterUserRecord,
  findCenterUserByEmail,
  updateCenterUserRecord,
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

    const otpCenterId = centerIds[0];
    const center = await getCenterById(otpCenterId);
    if (!center.slug || center.slug !== centerSlug) {
      return NextResponse.json(
        { error: "OTP non valido per questo centro" },
        { status: 400 }
      );
    }

    const centerValue = center.slug ?? centerSlug;
    console.log("typeof Center", typeof centerValue, centerValue);
    if (typeof centerValue !== "string") {
      return NextResponse.json({ error: "Centro non valido" }, { status: 400 });
    }

    let centerUser = await findCenterUserByEmail(email);
    const passwordHash = await hashPassword(password);
    if (!centerUser) {
      const fields = {
        Email: email,
        PasswordHash: passwordHash,
        Center: centerValue,
      };
      console.log("CenterUsers fields:", Object.keys(fields));
      centerUser = await createCenterUserRecord(fields);
    } else {
      const fields = {
        PasswordHash: passwordHash,
        Center: centerValue,
      };
      console.log("CenterUsers fields:", Object.keys(fields));
      centerUser = await updateCenterUserRecord(centerUser.id, fields);
    }

    const updateFields: { Status: string; UsedAt?: string } = { Status: "used" };
    if ("UsedAt" in centerOtp.fields) {
      updateFields.UsedAt = now.toISOString();
    }
    console.log("Center_OTPs update fields:", Object.keys(updateFields));
    await markCenterOtpUsed(centerOtp.id, updateFields);

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
