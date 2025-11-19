import { NextRequest, NextResponse } from "next/server";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getCenterBySlug } from "@/lib/repositories/centers";
import { createStudent, findStudentByEmail } from "@/lib/repositories/students";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, country, preferredCenterSlug } = body;

    if (!email || !password || !fullName || !country) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const existing = await findStudentByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Studente già registrato" }, { status: 400 });
    }

    let preferredCenterId: string | undefined;
    if (preferredCenterSlug) {
      const center = await getCenterBySlug(preferredCenterSlug);
      if (!center) {
        return NextResponse.json({ error: "Centro preferito non valido" }, { status: 400 });
      }
      preferredCenterId = center.id;
    }

    const passwordHash = await hashPassword(password);
    const student = await createStudent({
      email,
      fullName,
      passwordHash,
      country,
      preferredCenterId,
    });

    const token = signToken({ role: "student", studentId: student.id, email: student.email });
    const response = NextResponse.json({ email: student.email, fullName: student.fullName });
    setAuthCookie(response, token, "student");

    await sendEmail({
      to: student.email,
      subject: "Benvenuto nel programma TOEFL Ambassador",
      html: `<p>Ciao ${student.fullName ?? ""},</p><p>Grazie per esserti registrato al portale TOEFL Ambassador. Da oggi potrai prenotare consulenze e acquistare il voucher TOEFL iBT® dedicato.</p><p>Il team TOEFL Ambassador</p>`,
    });

    return response;
  } catch (error) {
    console.error("student signup", error);
    return NextResponse.json({ error: "Errore durante la registrazione" }, { status: 500 });
  }
}
