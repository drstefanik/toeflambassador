import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie, signToken, verifyPassword } from "@/lib/auth";
import { findCenterUserByEmail } from "@/lib/repositories/centerUsers";
import { getCenterBySlug } from "@/lib/repositories/centers";

const looksLikeAirtableRecordId = (value: string) => /^rec[a-zA-Z0-9]{14}$/.test(value);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.info("[auth/center/login] request received", {
      hasEmail: Boolean(email),
      email,
      hasPassword: Boolean(password),
    });

    if (!email || !password) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const centerUser = await findCenterUserByEmail(email);
    const centerRefRaw = centerUser?.fields.Center;
    const centerRef = Array.isArray(centerRefRaw) ? centerRefRaw[0] : centerRefRaw;
    console.info("[auth/center/login] center lookup", {
      email,
      centerUserFound: Boolean(centerUser),
      centerUserId: centerUser?.id ?? null,
      centerRefType: Array.isArray(centerRefRaw) ? "array" : typeof centerRefRaw,
      centerRef: centerRef ?? null,
    });

    if (!centerUser || !centerUser.fields.PasswordHash || !centerRef) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 });
    }

    const valid = await verifyPassword(password, centerUser.fields.PasswordHash);
    console.info("[auth/center/login] password check", {
      email,
      centerUserId: centerUser.id,
      passwordMatch: valid,
    });
    if (!valid) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 });
    }

    const centerId = looksLikeAirtableRecordId(centerRef)
      ? centerRef
      : (await getCenterBySlug(centerRef))?.id;
    console.info("[auth/center/login] center resolution", {
      email,
      centerUserId: centerUser.id,
      centerRef,
      centerId: centerId ?? null,
      resolvedBy: looksLikeAirtableRecordId(centerRef) ? "record-id" : "slug",
    });

    if (!centerId) {
      console.warn("[auth/center/login] unable to resolve centerId", {
        email,
        centerUserId: centerUser.id,
        centerRef,
      });
      return NextResponse.json({ error: "Centro non valido" }, { status: 401 });
    }

    const token = signToken({
      role: "center",
      centerUserId: centerUser.id,
      centerId,
      email: centerUser.email,
    });
    const response = NextResponse.json({ email: centerUser.email });
    setAuthCookie(response, token, "center");
    console.info("[auth/center/login] success", {
      email: centerUser.email,
      centerUserId: centerUser.id,
      centerId,
      redirectTo: "/center/dashboard",
      cookieWritten: true,
    });
    return response;
  } catch (error) {
    console.error("center login", error);
    return NextResponse.json({ error: "Errore durante l'accesso" }, { status: 500 });
  }
}
