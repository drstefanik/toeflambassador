import Link from "next/link";
import { getUserFromRequest } from "@/lib/auth";
import { resolveStudentCtaTarget } from "@/lib/student-action-routing";

const sections = [
  {
    title: "Struttura dell’esame",
    description:
      "Il TOEFL iBT® valuta Reading, Listening, Speaking e Writing in ambiente digitale sicuro. L’esame dura circa due ore e mezza con task calibrati sul contesto accademico.",
  },
  {
    title: "Skills valutate",
    description:
      "Comprensione di testi e lezioni, capacità di interazione orale e scritta, integrazione di informazioni provenienti da diverse fonti.",
  },
  {
    title: "Formato e punteggio",
    description:
      "Domande a scelta multipla, risposte aperte e esercizi integrati con punteggio da 0 a 120. Ricevi report dettagliato per ogni sezione.",
  },
];

export default async function EsameToeflPage() {
  const user = await getUserFromRequest();
  const ctaHref = resolveStudentCtaTarget(user, "buy-exam");

  return (
    <div className="relative overflow-hidden bg-slate-950">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/studentetoefl.jpg')" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/65 to-slate-950/85"
      />
      <section className="relative mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">Studenti</p>
        <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">L’esame TOEFL</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-100">
          Un test computer based che misura l’inglese accademico. È riconosciuto da università, enti e aziende in tutto il mondo.
        </p>
        <div className="mt-8">
          <Link
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:w-auto"
          >
            Acquista il tuo esame TOEFL
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-white/30 bg-white/10 p-6 shadow-sm backdrop-blur-sm"
            >
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <p className="mt-2 text-slate-100">{section.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
