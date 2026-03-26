import { CalendlyButton } from "@/components/calendly-button";
import { CtaButton } from "@/components/cta-button";

export default function AppuntamentoPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">
          Sedi
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">
          Fissa un appuntamento
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Prenota un incontro con il team TOEFL Ambassador per valutare la
          collaborazione, conoscere i requisiti e ricevere una proposta
          personalizzata.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CtaButton href="mailto:partners@toeflambassador.org">
            Scrivici ora
          </CtaButton>
          <CtaButton href="/partner/come-funziona" variant="secondary">
            Scopri il processo
          </CtaButton>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            <span>Step 1</span>
            <span className="h-3 w-[1px] bg-sky-300" />
            <span>Prenota la call conoscitiva</span>
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-slate-900">
            Prenota tramite calendario
          </h2>
          <p className="mt-2 text-slate-700">
            Apri il popup Calendly per scegliere lo slot disponibile più comodo
            per il tuo team.
          </p>

          <div className="mt-6">
            <CalendlyButton label="Prenota una consulenza" />
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Preferisci scriverci prima?
            </h3>
            <p className="mt-2 text-slate-700">
              Contattaci a <span className="font-semibold">partners@toeflambassador.org</span> con il tuo ruolo e i servizi che vorresti offrire.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
