export default function AboutPage() {
  const values = [
    {
      title: "Programma ufficiale ETS",
      description:
        "TOEFL Ambassador collega ETS con scuole, università e centri di formazione italiani per offrire il TOEFL iBT® con supporto locale e standard internazionali.",
    },
    {
      title: "Missione",
      description:
        "Diffondiamo l'accesso a una certificazione riconosciuta globalmente, accompagnando sedi e studenti con materiali ufficiali, formazione e orientamento dedicato.",
    },
    {
      title: "Collaborazione trasparente",
      description:
        "Ogni iniziativa nasce in collaborazione con ETS e con una rete di ambassador che condividono le best practice per l'erogazione e la preparazione all'esame.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">
          About us
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">
          About TOEFL Ambassador
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          TOEFL Ambassador è il programma ufficiale ETS in Italia per portare il TOEFL iBT® più vicino a istituzioni, docenti e studenti. Collaboriamo direttamente con ETS per garantire informazioni aggiornate, procedure chiare e un ecosistema di supporto affidabile.
        </p>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          Lavoriamo con scuole di lingua, università, centri di formazione e consulenti educativi per diffondere buone pratiche di preparazione, gestire eventi informativi e facilitare l’accesso all’esame attraverso sedi certificate.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900">{value.title}</h2>
              <p className="mt-2 text-slate-700">{value.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
