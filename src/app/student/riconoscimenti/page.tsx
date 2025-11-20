const recognitions = [
  "Oltre 12.000 università e istituzioni in più di 160 Paesi accettano il TOEFL iBT®.",
  "Programmi di laurea magistrale e MBA richiedono spesso un punteggio minimo TOEFL.",
  "Procedure di visa e immigrazione in USA, Canada, UK e Australia includono il TOEFL tra i test approvati.",
  "Aziende internazionali e programmi di internship utilizzano il TOEFL come riferimento di competenza linguistica.",
];

export default function RiconoscimentiPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Studenti</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Riconoscimenti TOEFL</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Il TOEFL iBT® è riconosciuto in tutto il mondo per ammissioni universitarie, programmi di lavoro e procedure di visto. Consulta le linee guida degli enti che ti interessano e pianifica il punteggio richiesto.
        </p>

        <div className="mt-10 space-y-3">
          {recognitions.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
            >
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8F60]/10 text-[#C34D1E]">
                •
              </span>
              <p className="text-slate-800">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
