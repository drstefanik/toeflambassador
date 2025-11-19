import { CentersDirectoryClient } from "@/components/centers-directory-client";
import { getActiveCenters } from "@/lib/repositories/centers";

export const revalidate = 60;

export default async function SediPage() {
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
    <div className="bg-white">
      <section className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
          Sedi
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">
          Trova il TOEFL Ambassador più vicino
        </h1>
        <p className="mt-2 text-slate-600">
          Esplora la mappa interattiva e visita la pagina dedicata di ogni centro.
        </p>
        <div className="mt-10">
          <CentersDirectoryClient centers={points} />
        </div>
      </section>
    </div>
  );
}
