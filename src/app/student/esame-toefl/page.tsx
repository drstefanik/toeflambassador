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

export default function EsameToeflPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Studenti</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">L’esame TOEFL</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Un test computer based che misura l’inglese accademico. È riconosciuto da università, enti e aziende in tutto il mondo.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-2 text-slate-700">{section.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
