import Image from "next/image";
import { CtaButton } from "@/components/cta-button";
import { homeContent } from "@/content/home";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-[#F0FF96]/30">
      {/* HERO */}
      <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pt-16 pb-20 text-center sm:pt-24">
        {/* Glow periwinkle dietro al contenuto */}
        <div
          className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-gradient-to-b from-[#9196FF]/25 to-transparent blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-center gap-4">
          {/* Logo TOEFL Ambassador */}
          <Image
            src="/toefl-ambassador-logo.png"
            alt="TOEFL Ambassador logo"
            width={260}
            height={120}
            priority
          />

          {/* Eyebrow */}
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
            {homeContent.eyebrow}
          </p>

          {/* Titolo + sottotitolo */}
          <h1 className="mt-3 text-balance text-4xl font-semibold text-slate-900 sm:text-5xl">
            {homeContent.hero.title}
          </h1>
          <p className="mt-4 max-w-3xl text-balance text-lg text-slate-700">
            {homeContent.hero.subtitle}
          </p>
        </div>

        {/* CTA */}
        <div className="relative mt-6 flex flex-col gap-4 sm:flex-row">
          <CtaButton href={homeContent.hero.centerCta.href}>
            {homeContent.hero.centerCta.label}
          </CtaButton>
          <CtaButton href={homeContent.hero.studentCta.href} variant="secondary">
            {homeContent.hero.studentCta.label}
          </CtaButton>
        </div>

        {/* Linea brand sotto l’hero */}
        <div className="mt-8 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-[#9196FF] to-transparent" />
      </section>

      {/* TEASER CENTRI / STUDENTI */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-24 sm:grid-cols-2">
        {/* Card Centri */}
        <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <span
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#9196FF] via-[#343579] to-[#FF8F60]"
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-[#343579]">Centri</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {homeContent.centersTeaser.title}
          </h2>
          <p className="mt-3 text-slate-600">
            {homeContent.centersTeaser.description}
          </p>
          <CtaButton className="mt-6" href={homeContent.centersTeaser.cta.href}>
            {homeContent.centersTeaser.cta.label}
          </CtaButton>
        </article>

        {/* Card Studenti */}
        <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <span
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF8F60] via-[#9196FF] to-[#F0FF96]"
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-[#FF8F60]">Studenti</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {homeContent.studentsTeaser.title}
          </h2>
          <p className="mt-3 text-slate-600">
            {homeContent.studentsTeaser.description}
          </p>
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
