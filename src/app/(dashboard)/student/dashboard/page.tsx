import { CheckoutButton } from "@/components/checkout-button";
import { env } from "@/lib/config";
import { getUserFromRequest } from "@/lib/auth";
import { fetchStudentById } from "@/lib/repositories/students";
import { redirect } from "next/navigation";

export default async function StudentDashboardPage() {
  const user = getUserFromRequest();
  if (!user || user.role !== "student") {
    redirect("/login-student");
  }

  const student = await fetchStudentById(user.studentId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">
        Student Dashboard
      </p>
      <h1 className="mt-4 text-4xl font-bold text-slate-900">
        Benvenuto, {student.fullName ?? student.email}
      </h1>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Prenota una consulenza</h2>
          <p className="mt-2 text-slate-600">
            Pianifica una call con un TOEFL Ambassador per chiarire dubbi e definire il percorso.
          </p>
          {env.NEXT_PUBLIC_CALENDLY_STUDENT_URL ? (
            <iframe
              src={env.NEXT_PUBLIC_CALENDLY_STUDENT_URL}
              className="mt-4 h-80 w-full rounded-2xl border"
              title="Calendly Studente"
              loading="lazy"
            />
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              Imposta NEXT_PUBLIC_CALENDLY_STUDENT_URL per mostrare il calendario.
            </p>
          )}
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Acquista il tuo voucher</h2>
          <p className="mt-2 text-slate-600">
            Completa il checkout su Stripe e ricevi il codice per prenotare l&rsquo;esame TOEFL iBT®.
          </p>
          <div className="mt-6">
            <CheckoutButton endpoint="/api/checkout/student-voucher" label="Acquista voucher" />
          </div>
        </section>
      </div>
    </div>
  );
}
