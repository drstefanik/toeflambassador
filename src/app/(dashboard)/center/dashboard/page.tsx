import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { getUserFromRequest } from "@/lib/auth";
import { getCenterById } from "@/lib/repositories/centers";
import { redirect } from "next/navigation";

export default async function CenterDashboardPage() {
  const user = await getUserFromRequest();
  if (!user || user.role !== "center") {
    redirect("/login-center");
  }

  const center = await getCenterById(user.centerId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
        Center Dashboard
      </p>
      <h1 className="mt-4 text-4xl font-bold text-slate-900">{center.name}</h1>
      {center.city && <p className="text-slate-600">{center.city}</p>}

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">TOEFL Ambassador Activation Pack</h2>
          <p className="mt-2 text-slate-600">
            Acquista il kit di attivazione per ricevere materiali promozionali, formazione e accesso prioritario agli studenti.
          </p>
          <div className="mt-6">
            <CheckoutButton endpoint="/api/checkout/center-kit" label="Acquista il pack" />
          </div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Gestisci la tua pagina pubblica</h2>
          <p className="mt-2 text-slate-600">
            Aggiorna immagini, call-to-action e informazioni di contatto mostrate su toeflambassador.com/centri/{center.slug}.
          </p>
          <Link
            href="/center/page-settings"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 font-semibold text-white"
          >
            Modifica la pagina
          </Link>
        </section>
      </div>
    </div>
  );
}
