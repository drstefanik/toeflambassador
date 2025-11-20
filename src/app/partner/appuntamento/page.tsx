"use client";

import { useState } from "react";
import { CtaButton } from "@/components/cta-button";
import { env } from "@/lib/config";

export default function AppuntamentoPage() {
  const [isCalendlyLoading, setIsCalendlyLoading] = useState(true);

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
          {/* Step header */}
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            <span>Step 1</span>
            <span className="h-3 w-[1px] bg-sky-300" />
            <span>Prenota la call conoscitiva</span>
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-slate-900">
            Prenota tramite calendario
          </h2>
          <p className="mt-2 text-slate-700">
            Seleziona uno slot orario disponibile o inviaci una richiesta
            dettagliata.
          </p>

          {env.NEXT_PUBLIC_CALENDLY_CENTER_URL ? (
            <div className="mt-5 w-full">
              {/* Loader sopra il Calendly */}
              {isCalendlyLoading && (
                <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
                  <span>Caricamento calendario in corso…</span>
                </div>
              )}

              <iframe
                src={env.NEXT_PUBLIC_CALENDLY_CENTER_URL}
                className="w-full rounded-2xl border border-slate-200"
                style={{
                  // altezza diversa per mobile / desktop, senza wrap interno
                  height: "950px", // fallback
                  minHeight: "850px",
                  border: "none",
                }}
                title="Calendly Sedi"
                loading="lazy"
                onLoad={() => setIsCalendlyLoading(false)}
              ></iframe>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <form
                className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                action="mailto:partners@toeflambassador.org"
                method="post"
                encType="text/plain"
              >
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Nome e cognome
                  </label>
                  <input
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    name="name"
                    placeholder="Il tuo nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    name="email"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Ente
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    name="organization"
                    placeholder="Scuola, università, azienda..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Messaggio
                  </label>
                  <textarea
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    rows={4}
                    name="message"
                    placeholder="Raccontaci cosa vorresti attivare"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Invia richiesta
                </button>
              </form>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Preferisci parlare con noi?
                </h3>
                <p className="mt-2 text-slate-700">
                  Scrivi a{" "}
                  <span className="font-semibold">
                    partners@toeflambassador.org
                  </span>{" "}
                  indicando il tuo ruolo e i servizi che vorresti offrire. Ti
                  contatteremo con una proposta dedicata.
                </p>
                <p className="mt-3 text-slate-700">
                  Puoi anche consultare la sezione{" "}
                  <span className="font-semibold">Come funziona</span> per
                  vedere le fasi di attivazione.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
