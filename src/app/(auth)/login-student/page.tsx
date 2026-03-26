import { LoginStudentForm } from "./student-login-form";
import Link from "next/link";

export default function LoginStudentPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Accedi Studente</h1>
      <p className="mt-2 text-slate-600">Entra nella tua dashboard e completa gli acquisti.</p>
      <div className="mt-8 rounded-3xl bg-white p-8 shadow">
        <LoginStudentForm />
        <p className="mt-6 text-center text-sm text-slate-600">
          Non sei ancora registrato?{" "}
          <Link
            href="/signup-student"
            className="font-semibold text-sky-700 transition-colors hover:text-sky-800 hover:underline"
          >
            Registrati ora
          </Link>
        </p>
      </div>
    </div>
  );
}
