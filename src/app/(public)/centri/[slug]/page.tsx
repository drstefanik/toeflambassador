import Image from "next/image";
import { notFound } from "next/navigation";
import { CenterContactForm } from "@/components/center-contact-form";
import { getAllCentersForStaticPaths, getCenterBySlug } from "@/lib/repositories/centers";

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
  const { slug } = params;
  let center = null;
  try {
    center = await getCenterBySlug(slug);
  } catch (error) {
    console.error(`Impossibile caricare il centro ${slug}`, error);
  }

  if (!center) {
    notFound();
  }

  const { fields } = center;
  const callSectionEnabled = fields.CallSectionEnabled && fields.CallSectionPhoneNumber;
  const writeSectionEnabled = fields.WriteSectionEnabled && fields.ContactFormEmail;
  const mapEnabled = fields.MapEnabled && fields.Latitude && fields.Longitude;

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-20 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
              TOEFL Ambassador
            </p>
            <h1 className="mt-4 text-4xl font-bold">{center.name}</h1>
            {fields.City && <p className="text-slate-200">{fields.City}</p>}
          </div>
          <Image src="/logo.svg" alt="TOEFL Ambassador" width={160} height={160} className="opacity-80" />
        </div>
      </section>

      {callSectionEnabled && (
        <section className="mx-auto max-w-5xl px-4 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 rounded-3xl bg-slate-100 p-8">
              {fields.HeroImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fields.HeroImageUrl}
                  alt={center.name}
                  className="h-72 w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
                  Immagine centro
                </div>
              )}
              <button className="w-full rounded-full bg-sky-600 py-3 font-semibold text-white">
                CALL US
              </button>
            </div>
            <div className="rounded-3xl border border-slate-200 p-8">
              <p className="text-sm font-semibold text-sky-600">{fields.CallSectionTitle}</p>
              <h2 className="mt-2 text-4xl font-bold text-slate-900">
                {fields.CallSectionPhoneNumber}
              </h2>
              {fields.Address && <p className="mt-4 text-slate-600">{fields.Address}</p>}
              {fields.CallSectionSubtitle && (
                <p className="mt-2 text-slate-500">{fields.CallSectionSubtitle}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {mapEnabled && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-semibold text-slate-900">Come raggiungerci</h2>
            <iframe
              title="Mappa del centro"
              className="mt-6 h-[400px] w-full rounded-3xl border"
              src={`https://www.google.com/maps?q=${fields.Latitude},${fields.Longitude}&output=embed`}
              loading="lazy"
            />
          </div>
        </section>
      )}

      {writeSectionEnabled && (
        <section className="mx-auto max-w-5xl px-4 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-sky-600">{fields.WriteSectionTitle}</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                {fields.WriteSectionSubtitle}
              </h2>
              <p className="mt-4 text-slate-600">
                Scrivici per ricevere maggiori informazioni su preparazione, esami e servizi.
              </p>
            </div>
            <CenterContactForm centerSlug={slug} />
          </div>
        </section>
      )}
    </div>
  );
}
