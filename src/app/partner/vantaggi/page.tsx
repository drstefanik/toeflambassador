const benefits = [
  {
    title: "Uso del marchio TOEFL Ambassador",
    description:
      "Accedi a linee guida brand, loghi ufficiali e materiali promozionali approvati da ETS per comunicare in modo chiaro e riconoscibile.",
  },
  {
    title: "Materiali marketing pronti all'uso",
    description:
      "Brochure, template social e guide informative per raccontare l'esame e i servizi offerti ai tuoi studenti.",
  },
  {
    title: "Visibilità nella rete ufficiale",
    description:
      "Il tuo centro viene inserito nell'elenco nazionale dei TOEFL Ambassador, con rimando diretto alle tue pagine informative.",
  },
  {
    title: "Supporto operativo dedicato",
    description:
      "Onboarding, formazione sul TOEFL iBT® e supporto continuativo per procedure d'esame, registrazioni e comunicazione.",
  },
];

export default function VantaggiPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Partner</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Vantaggi e branding TOEFL Ambassador</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Un programma creato con ETS per dare ai partner strumenti di comunicazione, formazione e supporto. Ogni centro può valorizzare il proprio ruolo locale mantenendo coerenza con il brand TOEFL®.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900">{benefit.title}</h2>
              <p className="mt-2 text-slate-700">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
