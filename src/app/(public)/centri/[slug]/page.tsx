import { notFound } from "next/navigation";
import { getAllCentersForStaticPaths, getCenterBySlug } from "@/lib/repositories/centers";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const centers = await getAllCentersForStaticPaths();
    return centers
      .filter((center) => center.slug)
      .map((center) => ({ slug: center.slug as string }));
  } catch (error) {
    console.warn("Impossibile generare gli slug dei centri", error);
    return [];
  }
}

interface PageProps {
  params: { slug: string };
}

export default async function CenterPublicPage({ params }: PageProps) {
  let center = null;
  let hasError = false;
  try {
    center = await getCenterBySlug(params.slug);
  } catch (error) {
    console.error(`Impossibile caricare il centro ${params.slug}`, error);
    hasError = true;
  }

  if (hasError) {
    return (
      <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
        <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            Centro non disponibile, riprova
          </div>
        </section>
      </div>
    );
  }

  if (!center) {
    notFound();
  }

  const { fields } = center;
  const email = fields.AdminEmail ?? fields.ContactFormEmail;
  const phone = fields.CallSectionPhoneNumber;
  const mapUrl =
    fields.Latitude && fields.Longitude
      ? `https://www.google.com/maps?q=${fields.Latitude},${fields.Longitude}`
      : fields.Address
        ? `https://www.google.com/maps?q=${encodeURIComponent(fields.Address)}`
        : null;

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <a href="/partner/sedi" className="text-sm font-semibold text-sky-700">
          ← Torna all’elenco sedi
        </a>
        <h1 className="mt-6 text-4xl font-bold text-slate-900">{center.name}</h1>
        {(fields.City ?? fields["Città"]) && (
          <p className="mt-2 text-lg font-semibold text-slate-600">
            {fields.City ?? fields["Città"]}
          </p>
        )}

        <div className="mt-8 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {fields.Address && (
            <div>
              <p className="text-sm font-semibold text-slate-500">Indirizzo</p>
              <p className="text-slate-800">{fields.Address}</p>
            </div>
          )}

          {(email || phone) && (
            <div>
              <p className="text-sm font-semibold text-slate-500">Contatti</p>
              <ul className="mt-2 space-y-1 text-slate-800">
                {email && <li>Email: {email}</li>}
                {phone && <li>Telefono: {phone}</li>}
              </ul>
            </div>
          )}

          {mapUrl && (
            <div>
              <p className="text-sm font-semibold text-slate-500">Mappa</p>
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 underline"
              >
                Apri su Google Maps
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
