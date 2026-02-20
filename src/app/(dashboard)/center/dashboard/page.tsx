import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { LogoutButton } from "@/components/logout-button";
import { getUserFromRequest } from "@/lib/auth";
import { findOrdersByCenter } from "@/lib/airtable";
import { getCenterById } from "@/lib/repositories/centers";
import { redirect } from "next/navigation";

interface DashboardOrder {
  CreatedAt?: string;
  Amount?: number;
  Currency?: string;
  Status?: string;
}

const formatDate = (value: string | null | undefined) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsed);
};

const formatAmount = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return "-";
  return String(amount);
};

export default async function CenterDashboardPage() {
  const user = await getUserFromRequest();
  if (!user || user.role !== "center") {
    redirect("/login-center");
  }

  const center = await getCenterById(user.centerId);
  if (!center) {
    redirect("/login-center");
  }

  let orders: DashboardOrder[] = [];
  try {
    const fetchedOrders = await findOrdersByCenter(user.centerId, user.centerUserId);
    orders = fetchedOrders.map((record: { fields?: DashboardOrder }) => record.fields ?? {});
  } catch (err) {
    console.error("[dashboard] orders fetch failed", err);
    orders = [];
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
            Center Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">{center.name}</h1>
          {center.city && <p className="text-slate-600">{center.city}</p>}
        </div>

        <LogoutButton className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60" />
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            TOEFL Ambassador Activation Pack
          </h2>
          <p className="mt-2 text-slate-600">
            Acquista il kit di attivazione per ricevere materiali promozionali, formazione e accesso prioritario agli studenti.
          </p>

          <div className="mt-6">
            <CheckoutButton
              endpoint="/api/stripe/checkout"
              label="Acquista il pack"
              payload={{
                type: "ACTIVATION_PACK",
                centerUserEmail: user.email,
              }}
              className="w-full rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Gestisci la tua pagina pubblica
          </h2>
          <p className="mt-2 text-slate-600">
            Aggiorna immagini, call-to-action e informazioni di contatto mostrate su{" "}
            <span className="rounded bg-slate-50 px-2 py-0.5 font-mono text-sm text-slate-700">
              toeflambassador.com/centri/{center.slug}
            </span>
            .
          </p>

          <Link
            href="/center/page-settings"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold !text-white hover:!text-white transition hover:bg-slate-800"
          >
            Gestisci la pagina
          </Link>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">I tuoi ordini</h2>

        {orders.length === 0 ? (
          <p className="mt-4 text-slate-600">Nessun ordine</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-4 font-medium">Data</th>
                  <th className="py-2 pr-4 font-medium">Importo</th>
                  <th className="py-2 pr-4 font-medium">Valuta</th>
                  <th className="py-2 pr-4 font-medium">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((order, index) => (
                  <tr key={`${order.CreatedAt ?? "order"}-${index}`}>
                    <td className="py-2 pr-4">{formatDate(order.CreatedAt)}</td>
                    <td className="py-2 pr-4">{formatAmount(order.Amount)}</td>
                    <td className="py-2 pr-4">{order.Currency ?? "-"}</td>
                    <td className="py-2 pr-4">{order.Status ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
