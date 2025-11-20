import { CentersDirectoryClient } from "@/components/centers-directory-client";
import { CtaButton } from "@/components/cta-button";
import { getActiveCenters } from "@/lib/repositories/centers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PrenotaEsamePage() {
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
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Studenti</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Prenota il tuo esame presso un centro TOEFL Ambassador</h1>
        <p className="mt-4 text-lg text-slate-700">
          Scegli il centro più vicino, controlla le disponibilità e completa la registrazione con il supporto ufficiale ETS.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <CtaButton href="/student/acquista-toefl-ibt">Acquista il tuo esame</CtaButton>
          <CtaButton href="mailto:support@toeflambassador.org" variant="secondary">
            Richiedi assistenza
          </CtaButton>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Centri disponibili</h2>
          <p className="mt-2 text-slate-700">
            Seleziona una sede per vedere i dettagli e procedere con la prenotazione ufficiale.
          </p>
          <div className="mt-6">
            <CentersDirectoryClient centers={points} />
          </div>
        </div>
      </section>
    </div>
  );
}
