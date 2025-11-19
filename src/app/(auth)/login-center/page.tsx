import { CenterLoginForm } from "./center-login-form";

export default function LoginCenterPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Accedi Centro</h1>
      <p className="mt-2 text-slate-600">
        Gestisci ordini, pagina pubblica e acquistare il TOEFL Ambassador Activation Pack.
      </p>
      <div className="mt-8 rounded-3xl bg-white p-8 shadow">
        <CenterLoginForm />
      </div>
    </div>
  );
}
