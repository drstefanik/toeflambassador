import { LoginStudentForm } from "./student-login-form";

export default function LoginStudentPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Accedi Studente</h1>
      <p className="mt-2 text-slate-600">Entra nella tua dashboard e completa gli acquisti.</p>
      <div className="mt-8 rounded-3xl bg-white p-8 shadow">
        <LoginStudentForm />
      </div>
    </div>
  );
}
