import { CtaButton } from "@/components/cta-button";

export default function AcquistaToeflIbtPage() {
  const steps = [
    "Crea o accedi al tuo account ETS per la registrazione ufficiale.",
    "Scegli data e centro TOEFL Ambassador preferito e completa il pagamento sul portale ETS.",
    "Ricevi conferma e istruzioni via email direttamente da ETS.",
  ];

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Studenti</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Acquista il tuo esame TOEFL iBT</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          L’acquisto e la registrazione ufficiale avvengono sul portale ETS. I TOEFL Ambassador ti assistono nella scelta della sede e nella preparazione della documentazione.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CtaButton href="https://www.ets.org/toefl/test-takers/ibt/register">Vai al portale ETS</CtaButton>
          <CtaButton href="/student/prenota-consulenza" variant="secondary">
            Chiedi supporto
          </CtaButton>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
            >
              <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#9196FF]/15 text-sm font-semibold text-[#343579]">
                {index + 1}
              </span>
              <p className="text-slate-800">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
