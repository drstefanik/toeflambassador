import { CentersDirectoryClient } from "@/components/centers-directory-client";
import { getActiveCenters } from "@/lib/repositories/centers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PartnerSediPage() {
  let centers = [] as Awaited<ReturnType<typeof getActiveCenters>>;
  try {
    centers = await getActiveCenters();
  } catch (error) {
    console.warn("Impossibile caricare la lista centri", error);
  }

  const points = centers.map((center) => ({
    id: center.id,
    name: center.name,
    city: center.city,
    slug: center.slug,
    address: center.fields.Address,
    latitude: center.fields.Latitude,
    longitude: center.fields.Longitude,
  }));

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Partner</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Elenco centri TOEFL Ambassador</h1>
        <p className="mt-4 text-lg text-slate-700">
          Consulta i partner già attivi, scopri le città coperte e visita la pagina dedicata di ogni centro.
        </p>
        <div className="mt-10">
          <CentersDirectoryClient centers={points} />
        </div>
      </section>
    </div>
  );
}
