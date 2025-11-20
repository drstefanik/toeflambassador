import type { Metadata } from "next";

const sections = [
  {
    title: "Ambito di applicazione",
    content: [
      "Questi termini regolano l'utilizzo del sito toeflambassador.org e dei servizi informativi offerti a centri, scuole e studenti interessati al TOEFL iBT®.",
      "Navigando o inviando una richiesta dichiari di aver letto e accettato queste condizioni.",
    ],
  },
  {
    title: "Uso consentito del sito",
    content: [
      "Puoi utilizzare i moduli e le informazioni esclusivamente per finalità legate al TOEFL iBT® e ai servizi TOEFL Ambassador.",
      "È vietato inserire dati falsi, diffondere contenuti illeciti o tentare di compromettere la sicurezza della piattaforma.",
    ],
  },
  {
    title: "Informazioni e responsabilità",
    content: [
      "Le informazioni fornite sul sito sono aggiornate in collaborazione con ETS, ma potrebbero subire variazioni. Ti invitiamo a contattarci per conferme su procedure e requisiti.",
      "TOEFL Ambassador non è responsabile per danni indiretti derivanti dall'uso del sito o da interruzioni del servizio, salvo i casi previsti dalla legge.",
    ],
  },
  {
    title: "Prenotazioni e servizi",
    content: [
      "Le procedure di registrazione all'esame TOEFL iBT® seguono i termini ufficiali ETS. Eventuali servizi offerti dalle sedi TOEFL Ambassador sono soggetti ad accordi specifici comunicati al momento della richiesta.",
    ],
  },
  {
    title: "Proprietà intellettuale",
    content: [
      "Tutti i contenuti, loghi e materiali del sito sono protetti da diritti di proprietà intellettuale. Non è consentita la riproduzione senza autorizzazione.",
      "TOEFL iBT® è un marchio registrato di ETS. L'uso avviene nel rispetto delle linee guida ufficiali.",
    ],
  },
  {
    title: "Tutela dei dati personali",
    content: [
      "Il trattamento dei dati raccolti tramite il sito è disciplinato dall'Informativa privacy disponibile alla pagina /privacy.",
    ],
  },
  {
    title: "Modifiche ai termini",
    content: [
      "Possiamo aggiornare questi termini per riflettere cambiamenti normativi o operativi. La versione attuale è sempre pubblicata su questa pagina.",
    ],
  },
  {
    title: "Contatti",
    content: [
      "Per domande sui servizi TOEFL Ambassador o sui presenti termini puoi scriverci a info@toeflambassador.org.",
    ],
  },
];

export const metadata: Metadata = {
  title: "Termini e condizioni | TOEFL Ambassador",
  description: "Condizioni di utilizzo del sito e dei servizi informativi di TOEFL Ambassador.",
};

export default function TermsPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/20">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Legale</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Termini e condizioni</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          L’accesso e l’utilizzo del sito TOEFL Ambassador sono soggetti alle condizioni riportate di seguito. Ti invitiamo a
          leggerle con attenzione prima di inviare una richiesta o utilizzare i servizi offerti.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
              <ul className="mt-3 space-y-2 text-slate-700">
                {section.content.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[#343579]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
