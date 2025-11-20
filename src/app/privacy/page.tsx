import type { Metadata } from "next";

const sections = [
  {
    title: "Titolare del trattamento",
    content: [
      "Il sito TOEFL Ambassador è gestito da una rete di sedi autorizzate che operano in coordinamento con ETS. Per ogni richiesta relativa alla privacy puoi contattarci all'indirizzo info@toeflambassador.org.",
    ],
  },
  {
    title: "Tipologie di dati trattati",
    content: [
      "Raccogliamo i dati che ci fornisci tramite i moduli di contatto e di candidatura (nome, cognome, email, ruolo, istituzione e messaggio). I sistemi possono inoltre registrare dati tecnici come indirizzo IP, dispositivo e log di navigazione necessari al funzionamento del sito.",
    ],
  },
  {
    title: "Finalità del trattamento",
    content: [
      "Rispondere a richieste di informazioni su TOEFL Ambassador e sui servizi per centri e studenti.",
      "Gestire le candidature delle sedi e l'invio di comunicazioni di follow-up.",
      "Adempiere ad obblighi legali e di sicurezza della piattaforma.",
    ],
  },
  {
    title: "Base giuridica",
    content: [
      "Il trattamento dei dati avviene sulla base del consenso espresso tramite i moduli di contatto e sulla necessità di eseguire misure precontrattuali su richiesta dell'interessato.",
    ],
  },
  {
    title: "Conservazione dei dati",
    content: [
      "I dati inviati tramite i form vengono conservati per il tempo necessario a gestire la richiesta e comunque non oltre 24 mesi, salvo obblighi legali diversi.",
    ],
  },
  {
    title: "Condivisione con terzi",
    content: [
      "I dati possono essere condivisi con ETS e con i partner operativi di TOEFL Ambassador solo quando necessario per erogare i servizi richiesti o per adempiere a obblighi normativi.",
      "Non cediamo i dati a terze parti per fini di marketing autonomo.",
    ],
  },
  {
    title: "Diritti dell'interessato",
    content: [
      "Puoi richiedere l'accesso, la rettifica, la cancellazione, la limitazione del trattamento, l'opposizione o la portabilità dei dati. Per esercitare i diritti, scrivi a info@toeflambassador.org.",
      "Se ritieni che il trattamento violi la normativa, puoi proporre reclamo al Garante per la protezione dei dati personali.",
    ],
  },
  {
    title: "Sicurezza",
    content: [
      "Adottiamo misure tecniche e organizzative per proteggere i dati da accessi non autorizzati, perdita o divulgazione. L'accesso ai dati è limitato al personale e ai partner autorizzati che ne hanno necessità.",
    ],
  },
];

export const metadata: Metadata = {
  title: "Informativa privacy | TOEFL Ambassador",
  description:
    "Informazioni su come TOEFL Ambassador raccoglie, utilizza e protegge i dati personali degli utenti e delle sedi.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/20">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Legale</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Informativa privacy</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Questa informativa descrive come TOEFL Ambassador raccoglie e gestisce i dati personali forniti tramite il sito e i
          moduli di contatto. Aggiorniamo periodicamente questa pagina per riflettere eventuali modifiche normative o operative.
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

        <div className="mt-12 rounded-3xl border border-[#9196FF]/30 bg-[#9196FF]/10 p-6 text-slate-800">
          <h2 className="text-lg font-semibold text-[#343579]">Contatti per la privacy</h2>
          <p className="mt-2">Per qualsiasi chiarimento o richiesta sui tuoi dati personali, puoi scriverci a:</p>
          <p className="mt-2 font-semibold">info@toeflambassador.org</p>
        </div>
      </section>
    </div>
  );
}
