import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { CtaButton } from "@/components/cta-button";
import { homeContent } from "@/content/home";
import { getUserFromRequest } from "@/lib/auth";

export default async function HomePage() {
  const user = await getUserFromRequest();
  const isStudent = user?.role === "student";

  return (
    <div className="bg-gradient-to-b from-white to-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
          {homeContent.hero.eyebrow}
        </p>
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">{homeContent.hero.title}</h1>
        <p className="max-w-3xl text-lg text-slate-600">{homeContent.hero.subtitle}</p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-8 sm:grid-cols-2 sm:pb-12">
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
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">
          {homeContent.studentsSection.label}
        </p>
        <h2 className="mt-4 max-w-4xl text-3xl font-bold text-slate-900 sm:text-4xl">
          {homeContent.studentsSection.title}
        </h2>
        <p className="mt-4 max-w-4xl text-lg text-slate-700">{homeContent.studentsSection.description}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CtaButton href={homeContent.studentsSection.primaryCta.href}>
            {homeContent.studentsSection.primaryCta.label}
          </CtaButton>
          <CtaButton href={homeContent.studentsSection.secondaryCta.href} variant="secondary">
            {homeContent.studentsSection.secondaryCta.label}
          </CtaButton>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {homeContent.studentsSection.links.map((link) => (
            <article
              key={link.href}
              className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{link.title}</h3>
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

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-8 shadow-[0_20px_60px_-30px_rgba(2,132,199,0.45)] sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="inline-flex rounded-full border border-sky-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                {homeContent.materialSection.label}
              </span>
              <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                {homeContent.materialSection.title}
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-slate-700">{homeContent.materialSection.description}</p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm sm:p-6">
              {isStudent ? (
                <CheckoutButton
                  endpoint="/api/checkout/student-voucher"
                  label={homeContent.materialSection.cta.label}
                  className="w-full rounded-full bg-sky-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
                />
              ) : (
                <div className="space-y-3">
                  <CtaButton className="w-full justify-center" href="/signup-student">
                    Crea account studente
                  </CtaButton>
                  <CtaButton className="w-full justify-center" href="/login-student" variant="secondary">
                    Hai già un account? Accedi
                  </CtaButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
