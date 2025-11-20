import Link from "next/link";
import { CtaButton } from "@/components/cta-button";

const partnerLinks = [
  { title: "Chi può aderire", description: "Scopri quali tipologie di enti possono diventare TOEFL Ambassador.", href: "/partner/chi-puo-aderire" },
  { title: "Vantaggi", description: "Utilizzo del marchio, materiali marketing ufficiali e visibilità nazionale.", href: "/partner/vantaggi" },
  { title: "Come funziona", description: "Dal primo contatto all'attivazione: le fasi per entrare nel programma.", href: "/partner/come-funziona" },
  { title: "Fissa un appuntamento", description: "Parla con il team TOEFL Ambassador e ricevi una valutazione personalizzata.", href: "/partner/appuntamento" },
  { title: "Elenco sedi", description: "Consulta i centri già attivi e ispirati alle loro best practice.", href: "/partner/sedi" },
];

export default function PartnerPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Sedi</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Programma TOEFL Ambassador per le sedi</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Diventa punto di riferimento ufficiale ETS per il TOEFL iBT® nel tuo territorio. Offri ai tuoi studenti una certificazione riconosciuta a livello globale con strumenti, formazione e supporto dedicato.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CtaButton href="/partner/chi-puo-aderire">Scopri chi può aderire</CtaButton>
          <CtaButton href="/partner/appuntamento" variant="secondary">
            Fissa un appuntamento
          </CtaButton>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {partnerLinks.map((link) => (
            <article
              key={link.href}
              className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{link.title}</h2>
                <p className="mt-2 text-slate-700">{link.description}</p>
              </div>
              <Link
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition group-hover:text-sky-800"
                href={link.href}
              >
                Vai alla sezione
                <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
