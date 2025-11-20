import { CtaButton } from "@/components/cta-button";
import { env } from "@/lib/config";

export default function PrenotaConsulenzaPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Studenti</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Prenota la tua consulenza gratuita</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Confrontati con un TOEFL Ambassador per scegliere la data dell’esame, capire il punteggio richiesto e ricevere indicazioni sui materiali ufficiali ETS.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CtaButton href="/student/prenota-esame">Prenota il tuo esame</CtaButton>
          <CtaButton href="mailto:support@toeflambassador.org" variant="secondary">
            Scrivi al supporto
          </CtaButton>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Scegli uno slot</h2>
          <p className="mt-2 text-slate-700">
            Prenota direttamente da calendario o inviaci le tue disponibilità.
          </p>
          {env.NEXT_PUBLIC_CALENDLY_STUDENT_URL ? (
            <iframe
              src={env.NEXT_PUBLIC_CALENDLY_STUDENT_URL}
              className="mt-6 h-[600px] w-full rounded-2xl border"
              title="Calendly Studenti"
              loading="lazy"
            />
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <form className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Nome e cognome</label>
                  <input
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    name="name"
                    placeholder="Il tuo nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Email</label>
                  <input
                    required
                    type="email"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    name="email"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Livello stimato</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    name="level"
                    placeholder="B2, C1..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Obiettivo</label>
                  <textarea
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    rows={4}
                    name="goal"
                    placeholder="Università, lavoro, visto..."
                  />
                </div>
                <button
                  type="button"
                  className="w-full rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white opacity-80"
                  aria-disabled
                >
                  Invia (abilita Calendly o contattaci via email)
                </button>
              </form>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-lg font-semibold text-slate-900">Supporto dedicato</h3>
                <p className="mt-2 text-slate-700">
                  Attiva la variabile <span className="font-semibold">NEXT_PUBLIC_CALENDLY_STUDENT_URL</span> per rendere disponibile la prenotazione online oppure scrivici a support@toeflambassador.org con le tue disponibilità.
                </p>
                <p className="mt-3 text-slate-700">
                  Ti aiuteremo a scegliere data e centro più adatto e a preparare tutta la documentazione necessaria.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
