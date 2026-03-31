import Image from "next/image";
import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { CtaButton } from "@/components/cta-button";
import { homeContent } from "@/content/home";
import { getUserFromRequest } from "@/lib/auth";

export default async function HomePage() {
  const user = await getUserFromRequest();
  const isStudent = user?.role === "student";

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-20">
        <Image
          src="/homeheropic.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-65"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/95 via-white/85 to-[#F0FF96]/40" />

      <main className="relative">
        <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pt-16 pb-20 text-center sm:pt-24">
          <div
            className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-gradient-to-b from-[#9196FF]/25 to-transparent blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center gap-4">
            <Image
              src="/toefl-ambassador-logo.png"
              alt="TOEFL Ambassador logo"
              width={260}
              height={120}
              priority
            />

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
              {homeContent.hero.eyebrow}
            </p>

            <h1 className="mt-3 text-balance text-4xl font-semibold text-slate-900 sm:text-5xl">
              {homeContent.hero.title}
            </h1>
            <p className="mt-4 max-w-3xl text-balance text-lg text-slate-700">
              {homeContent.hero.subtitle}
            </p>
          </div>

          <div className="mt-8 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-[#9196FF] to-transparent" />
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 sm:pb-14">
          <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
            <span
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#9196FF] via-[#343579] to-[#FF8F60]"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-[#343579]">Centri</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{homeContent.centersTeaser.title}</h2>
            <p className="mt-3 text-slate-600">{homeContent.centersTeaser.description}</p>
            <CtaButton className="mt-6" href={homeContent.centersTeaser.cta.href}>
              {homeContent.centersTeaser.cta.label}
            </CtaButton>
          </article>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF8F60]">
            {homeContent.studentsSection.label}
          </p>
          <h2 className="mt-4 max-w-4xl text-3xl font-semibold text-slate-900 sm:text-4xl">
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
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#343579] transition group-hover:text-[#1f2050]"
                  href={link.href}
                >
                  Vai alla sezione
                  <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="rounded-3xl border border-[#9196FF]/30 bg-gradient-to-br from-white via-[#EEF0FF] to-[#FFF3EC] p-8 shadow-[0_20px_60px_-30px_rgba(52,53,121,0.45)] sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <span className="inline-flex rounded-full border border-[#9196FF]/40 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#343579]">
                  {homeContent.materialSection.label}
                </span>
                <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
                  {homeContent.materialSection.title}
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-slate-700">{homeContent.materialSection.description}</p>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm sm:p-6">
                {isStudent ? (
                  <CheckoutButton
                    endpoint="/api/checkout/student-voucher"
                    label={homeContent.materialSection.cta.label}
                    className="w-full rounded-full bg-[#343579] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#2a2b63] disabled:opacity-60"
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
      </main>
    </div>
  );
}
