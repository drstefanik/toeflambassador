import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie, signToken, verifyPassword } from "@/lib/auth";
import { findStudentByEmail } from "@/lib/repositories/students";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const student = await findStudentByEmail(email);
    if (!student || !student.fields.PasswordHash) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 });
    }

    const valid = await verifyPassword(password, student.fields.PasswordHash);
    if (!valid) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 });
    }

    const token = signToken({ role: "student", studentId: student.id, email: student.email });
    const response = NextResponse.json({ email: student.email, fullName: student.fullName });
    setAuthCookie(response, token, "student");
    return response;
  } catch (error) {
    console.error("student login", error);
    return NextResponse.json({ error: "Errore durante l'accesso" }, { status: 500 });
  }
}
