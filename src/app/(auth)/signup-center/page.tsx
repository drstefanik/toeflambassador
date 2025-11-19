export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getActiveCenters } from "@/lib/repositories/centers";
import { SignupCenterForm } from "./signup-center-form";

export default async function SignupCenterPage() {
  let centers = [] as Awaited<ReturnType<typeof getActiveCenters>>;
  try {
    centers = await getActiveCenters();
  } catch (error) {
    console.warn("Impossibile caricare i centri attivi", error);
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Attiva il tuo centro</h1>
      <p className="mt-2 text-slate-600">
        Inserisci l&rsquo;OTP ricevuto dal team ETS per collegare il tuo account al centro.
      </p>
      <div className="mt-8 rounded-3xl bg-white p-8 shadow">
        <SignupCenterForm
          centers={centers.map((center) => ({ id: center.id, name: center.name, slug: center.slug }))}
        />
      </div>
    </div>
  );
}
