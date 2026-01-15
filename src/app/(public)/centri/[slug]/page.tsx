import { notFound } from "next/navigation";
import { getCenterBySlug } from "@/lib/airtable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CenterPage({
  params,
}: {
  params: { slug: string };
}) {
  let center: any = null;

  try {
    center = await getCenterBySlug(params.slug);
  } catch {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold">Errore temporaneo</h1>
        <p className="mt-2 opacity-80">
          Non è stato possibile caricare i dati del centro. Riprova più tardi.
        </p>
      </main>
    );
  }

  if (!center) return notFound();

  const mapsUrl =
    center.latitude && center.longitude
      ? `https://www.google.com/maps?q=${center.latitude},${center.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${center.address}, ${center.city}`
        )}`;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <a href="/partner/sedi" className="text-sm hover:underline">
        ← Torna all’elenco sedi
      </a>

      <div className="mt-6 rounded-2xl border bg-white/70 p-8 shadow-sm">
        <div className="text-sm opacity-70">{center.city}</div>
        <h1 className="text-3xl font-semibold mt-1">{center.name}</h1>

        <div className="mt-4">
          <div className="font-medium">Indirizzo</div>
          <div>{center.address}</div>
        </div>

        <div className="mt-4 grid gap-2">
          {center.email && (
            <div>
              <span className="font-medium">Email:</span>{" "}
              <a className="underline" href={`mailto:${center.email}`}>
                {center.email}
              </a>
            </div>
          )}
          {center.phone && (
            <div>
              <span className="font-medium">Telefono:</span>{" "}
              <a className="underline" href={`tel:${center.phone}`}>
                {center.phone}
              </a>
            </div>
          )}
        </div>

        <div className="mt-6">
          <a
            className="underline"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            Apri su Google Maps →
          </a>
        </div>
      </div>
    </main>
  );
}
