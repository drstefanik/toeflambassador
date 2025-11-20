const audience = [
  "Scuole di lingua e centri di formazione privati",
  "Università e dipartimenti che offrono corsi di inglese accademico",
  "Centri linguistici di atenei e istituti superiori",
  "Agenzie educative e consulenti per study abroad",
  "Aziende che investono su certificazioni linguistiche per i team",
];

export default function ChiPuoAderirePage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">
          Sedi
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">
          Chi può diventare sede TOEFL Ambassador
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Il programma è aperto a organizzazioni che desiderano promuovere o offrire il TOEFL iBT® in modo ufficiale. La rete di sedi copre diversi contesti formativi e professionali.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {audience.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
            >
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#9196FF]/10 text-[#343579]">
                ✓
              </span>
              <p className="text-slate-800">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
