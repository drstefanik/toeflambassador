import { notFound } from "next/navigation";
import Link from "next/link";
import { getCenterBySlug } from "@/lib/airtable";
import { CenterHero } from "@/components/center-hero";
import { CenterContactForm } from "@/components/center-contact-form";

export const dynamic = "force-dynamic";
export const revalidate = 60;

type PageProps = {
  params?: { slug?: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

function buildMapsEmbedUrl(args: {
  lat?: number;
  lng?: number;
  address?: string;
}) {
  if (args.lat != null && args.lng != null) {
    return `https://www.google.com/maps?q=${args.lat},${args.lng}&output=embed`;
  }
  const q = encodeURIComponent(args.address || "");
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

export default async function CenterPage(props: PageProps) {
  const params = await Promise.resolve(props.params);
  const slug = params?.slug;

  let center: any = null;

  try {
    if (!slug) {
      return notFound();
    }
    center = await getCenterBySlug(slug);
  } catch {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <Link href="/partner/sedi" className="text-sm hover:underline">
          ← Torna all’elenco sedi
        </Link>

        <div className="mt-6 rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Errore temporaneo</h1>
          <p className="mt-2 text-slate-600">
            Non è stato possibile caricare i dati del centro in questo momento.
            Riprova tra poco.
          </p>
        </div>
      </main>
    );
  }

  if (!center) return notFound();

  const phone =
    center.callSectionPhoneNumber || center.phone || undefined;
  const phoneLabel = center.callSectionPhoneLabel || "Telefono";
  const email = center.email || "";
  const address = center.address || "";
  const city = center.city || "";

  const mapsOpenUrl =
    center.latitude && center.longitude
      ? `https://www.google.com/maps?q=${center.latitude},${center.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${address}, ${city}`
        )}`;

  const mapEnabled = center.mapEnabled ?? true;
  const heroImageUrl = center.heroImageUrl ?? null;
  const callSectionEnabled = center.callSectionEnabled ?? true;
  const writeSectionEnabled = center.writeSectionEnabled ?? true;

  const mapsEmbedUrl = buildMapsEmbedUrl({
    lat: center.latitude,
    lng: center.longitude,
    address: `${address}, ${city}`,
  });

  const hasMapQuery = Boolean(
    (center.latitude != null && center.longitude != null) || address || city
  );


  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <CenterHero
        backHref="/partner/sedi"
        city={city}
        name={center.name}
        heroImageUrl={heroImageUrl}
      />

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="-mt-10 grid gap-6 lg:grid-cols-2">
          {callSectionEnabled ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-slate-900">
                  {center.callSectionTitle || "CALL US"}
                </h3>
                <div className="h-1 w-14 rounded-full bg-sky-600" />
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {center.callSectionSubtitle ||
                  "Contatta direttamente il centro per informazioni rapide."}
              </p>

                <div className="mt-6 space-y-3 text-sm">
                  <div>
                    <div className="text-slate-600">Indirizzo</div>
                    <div className="font-medium text-slate-900">
                      {address || "—"}
                    </div>
                  </div>

                {phone ? (
                  <div>
                    <div className="text-slate-600">{phoneLabel}</div>
                    <a
                      className="font-semibold text-slate-900 underline decoration-slate-300 hover:decoration-slate-500"
                      href={`tel:${phone}`}
                    >
                      {phone}
                    </a>
                  </div>
                ) : (
                  <div className="text-slate-600">Telefono non disponibile</div>
                )}

                {email ? (
                  <div>
                    <div className="text-slate-600">Email</div>
                    <a
                      className="font-semibold text-slate-900 underline decoration-slate-300 hover:decoration-slate-500"
                      href={`mailto:${email}`}
                    >
                      {email}
                    </a>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {phone ? (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-sky-600 px-6 text-sm font-semibold text-white hover:bg-sky-500"
                  >
                    Chiama ora
                  </a>
                ) : null}

                {hasMapQuery ? (
                  <a
                    href={mapsOpenUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Apri su Google Maps →
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          {writeSectionEnabled ? (
            <CenterContactForm
              centerSlug={center.slug}
              centerName={center.name}
            />
          ) : null}
        </section>

        {mapEnabled && hasMapQuery ? (
          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 px-6 py-5 text-slate-900 sm:px-8">
              <div>
                <h3 className="text-lg font-semibold">Dove siamo</h3>
                <p className="text-sm text-slate-600">{address || "—"}</p>
              </div>
              <div className="h-1 w-14 rounded-full bg-sky-600" />
            </div>

            <div className="aspect-[16/9] w-full bg-slate-100">
              <iframe
                title="Mappa"
                src={mapsEmbedUrl}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
