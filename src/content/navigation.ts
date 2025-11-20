// src/content/navigation.ts

export const navigationContent = {
    navItems: [
    { label: "Home", href: "/" },
    { label: "About us", href: "/about" },
    { label: "Elenco sedi", href: "/partner/sedi" },
    {
      label: "Sedi",
      href: "/partner",
      children: [
        { label: "Chi può aderire", href: "/partner/chi-puo-aderire" },
        { label: "Vantaggi", href: "/partner/vantaggi" },
        { label: "Come funziona", href: "/partner/come-funziona" },
        { label: "Fissa un appuntamento", href: "/partner/appuntamento" },
      ],
    },
    {
      label: "Studenti",
      href: "/student",
      children: [
        { label: "L’esame TOEFL", href: "/student/esame-toefl" },
        { label: "Riconoscimenti", href: "/student/riconoscimenti" },
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
