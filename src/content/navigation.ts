// src/content/navigation.ts

export const navigationContent = {
  tagline: "Programma ufficiale ETS per il TOEFL iBT® in Italia",
  navItems: [
    { label: "Home", href: "/" },
    { label: "About us", href: "/about" },
    {
      label: "Partner",
      href: "/partner",
      children: [
        { label: "Chi può aderire", href: "/partner/chi-puo-aderire" },
        { label: "Vantaggi", href: "/partner/vantaggi" },
        { label: "Come funziona", href: "/partner/come-funziona" },
        { label: "Fissa un appuntamento", href: "/partner/appuntamento" },
        { label: "Elenco sedi", href: "/partner/sedi" },
      ],
    },
    {
      label: "Studenti",
      href: "/student",
      children: [
        { label: "L’esame TOEFL", href: "/student/esame-toefl" },
        { label: "Riconoscimenti", href: "/student/riconoscimenti" },
        { label: "Elenco sedi", href: "/partner/sedi" },
        { label: "Prenota la consulenza gratuita", href: "/student/prenota-consulenza" },
        { label: "Prenota il tuo esame", href: "/student/prenota-esame" },
        { label: "Acquista il tuo esame TOEFL iBT", href: "/student/acquista-toefl-ibt" },
      ],
    },
  ],
  primaryCta: {
    label: "Prenota una consulenza",
    href: "/student/prenota-consulenza",
  },
};
