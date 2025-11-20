import Link from "next/link";
import { CtaButton } from "@/components/cta-button";

const studentLinks = [
  { title: "L’esame TOEFL", description: "Formato, durata e competenze valutate dal TOEFL iBT®.", href: "/student/esame-toefl" },
  { title: "Riconoscimenti", description: "Scopri dove è accettato il punteggio TOEFL in Italia e nel mondo.", href: "/student/riconoscimenti" },
  { title: "Prenota la consulenza gratuita", description: "Parla con un TOEFL Ambassador e pianifica il tuo percorso.", href: "/student/prenota-consulenza" },
  { title: "Prenota il tuo esame", description: "Scegli un centro TOEFL Ambassador e conferma la data dell’esame.", href: "/student/prenota-esame" },
  { title: "Acquista il TOEFL iBT", description: "Completa l’acquisto attraverso il canale ufficiale ETS.", href: "/student/acquista-toefl-ibt" },
];

export default function StudentPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Studenti</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Servizi TOEFL Ambassador per gli studenti</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Preparazione, registrazione e utilizzo del punteggio TOEFL iBT® con supporto ufficiale ETS. Trova il centro più vicino o prenota una consulenza gratuita.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CtaButton href="/student/prenota-consulenza">Prenota la consulenza</CtaButton>
          <CtaButton href="/student/esame-toefl" variant="secondary">
            Scopri l’esame
          </CtaButton>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {studentLinks.map((link) => (
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
