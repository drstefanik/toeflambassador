const steps = [
  {
    title: "Richiesta di informazioni",
    description: "Invia la tua candidatura e condividi i servizi linguistici già attivi nel tuo ente.",
  },
  {
    title: "Valutazione con il team ETS",
    description: "Analizziamo insieme bisogni, requisiti e opportunità di collaborazione sul territorio.",
  },
  {
    title: "Attivazione",
    description: "Definiamo le azioni prioritarie: materiali brandizzati, canali di contatto e visibilità sul sito TOEFL Ambassador.",
  },
  {
    title: "Training",
    description: "Sessioni di formazione su TOEFL iBT®, procedure di registrazione, supporto agli studenti e strategie di comunicazione.",
  },
  {
    title: "Operatività continuativa",
    description: "Monitoraggio dei risultati, aggiornamenti costanti e supporto dedicato per eventi e campagne locali.",
  },
];

export default function ComeFunzionaPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Sedi</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Come funziona il programma</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Un percorso guidato per diventare sede TOEFL Ambassador: dal primo contatto all’operatività con il supporto del team ETS.
        </p>

        <div className="mt-10 space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9196FF]/15 text-base font-semibold text-[#343579]">
                {index + 1}
              </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{step.title}</h2>
                <p className="mt-1 text-slate-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
