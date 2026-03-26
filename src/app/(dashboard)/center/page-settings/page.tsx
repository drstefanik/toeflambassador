import { getUserFromRequest } from "@/lib/auth";
import { getCenterById } from "@/lib/repositories/centers";
import { redirect } from "next/navigation";
import { PageSettingsForm } from "./settings-form";

export default async function CenterPageSettings() {
  const user = await getUserFromRequest();
  if (!user || user.role !== "center") {
    redirect("/login-center");
  }

  if (!user.centerId) {
    console.error("[center/page-settings] Missing centerId in auth payload", {
      centerUserId: user.centerUserId,
      email: user.email,
    });
    redirect("/login-center");
  }

  const center = await getCenterById(user.centerId);
  if (!center) {
    console.error("[center/page-settings] Center not found or Airtable unavailable", {
      centerId: user.centerId,
      centerUserId: user.centerUserId,
      email: user.email,
    });
    redirect("/login-center");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Personalizza la pagina pubblica</h1>
      <p className="mt-2 text-slate-600">
        Aggiorna sezioni, immagini e contatti mostrati nella pagina dedicata del tuo centro.
      </p>
      <div className="mt-8 rounded-3xl bg-white p-8 shadow">
        <PageSettingsForm centerId={center.id} fields={center.fields} />
      </div>
    </div>
  );
}
