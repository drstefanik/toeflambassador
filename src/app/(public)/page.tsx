import { CtaButton } from "@/components/cta-button";
import { homeContent } from "@/content/home";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-white to-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
          Programma ufficiale ETS
        </p>
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          {homeContent.hero.title}
        </h1>
        <p className="max-w-3xl text-lg text-slate-600">{homeContent.hero.subtitle}</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <CtaButton href={homeContent.hero.centerCta.href}>
            {homeContent.hero.centerCta.label}
          </CtaButton>
          <CtaButton href={homeContent.hero.studentCta.href} variant="secondary">
            {homeContent.hero.studentCta.label}
          </CtaButton>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 sm:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-sky-600">Centri</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {homeContent.centersTeaser.title}
          </h2>
          <p className="mt-2 text-slate-600">{homeContent.centersTeaser.description}</p>
          <CtaButton className="mt-6" href={homeContent.centersTeaser.cta.href}>
            {homeContent.centersTeaser.cta.label}
          </CtaButton>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-violet-600">Studenti</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {homeContent.studentsTeaser.title}
          </h2>
          <p className="mt-2 text-slate-600">{homeContent.studentsTeaser.description}</p>
          <CtaButton
            className="mt-6"
            href={homeContent.studentsTeaser.cta.href}
            variant="secondary"
          >
            {homeContent.studentsTeaser.cta.label}
          </CtaButton>
        </article>
      </section>
    </div>
  );
}
