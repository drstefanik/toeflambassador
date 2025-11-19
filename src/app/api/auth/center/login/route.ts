import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie, signToken, verifyPassword } from "@/lib/auth";
import { findCenterUserByEmail } from "@/lib/repositories/centerUsers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const centerUser = await findCenterUserByEmail(email);
    if (!centerUser || !centerUser.fields.PasswordHash || !centerUser.fields.Center?.[0]) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 });
    }

    const valid = await verifyPassword(password, centerUser.fields.PasswordHash);
    if (!valid) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 });
    }

    const token = signToken({
      role: "center",
      centerUserId: centerUser.id,
      centerId: centerUser.fields.Center[0],
      email: centerUser.email,
    });
    const response = NextResponse.json({ email: centerUser.email });
    setAuthCookie(response, token, "center");
    return response;
  } catch (error) {
    console.error("center login", error);
    return NextResponse.json({ error: "Errore durante l'accesso" }, { status: 500 });
  }
}
