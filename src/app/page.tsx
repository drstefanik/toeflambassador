import Image from "next/image";
import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { CtaButton } from "@/components/cta-button";
import { homeContent } from "@/content/home";
import { getUserFromRequest } from "@/lib/auth";
import { resolveStudentCtaTarget } from "@/lib/student-action-routing";

export default async function HomePage() {
  const user = await getUserFromRequest();
  const isStudent = user?.role === "student";
  const bookingCtaHref = resolveStudentCtaTarget(user, "book-exam");
  const purchaseCtaHref = resolveStudentCtaTarget(user, "buy-exam");

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
        <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pt-16 pb-16 text-center sm:pt-24 sm:pb-20">
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

        <section className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
          <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-7 shadow-[0_20px_55px_-35px_rgba(52,53,121,0.45)] backdrop-blur-sm sm:p-9">
            <h2 className="max-w-4xl text-3xl font-semibold text-slate-900 sm:text-4xl">
              TOEFL Ambassador per gli studenti
            </h2>
            <p className="mt-4 max-w-4xl text-lg text-slate-700">
              Preparazione all&apos;esame, supporto alla registrazione, orientamento ufficiale ETS e utilizzo del
              punteggio TOEFL iBT® in un percorso chiaro: dalla scelta del centro ai materiali per arrivare pronti
              all&apos;esame.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaButton href={bookingCtaHref}>
                {homeContent.studentsSection.primaryCta.label}
              </CtaButton>
              <CtaButton href={homeContent.studentsSection.secondaryCta.href} variant="secondary">
                {homeContent.studentsSection.secondaryCta.label}
              </CtaButton>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5">
              {homeContent.studentsSection.links.map((link) => (
                <article
                  key={link.href}
                  className="group flex h-full min-h-52 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#9196FF]/60 hover:shadow-md"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">{link.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base">{link.description}</p>
                  </div>
                  <Link
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#343579] transition group-hover:text-[#1f2050]"
                    href={link.href === "/student/prenota-esame" ? bookingCtaHref : link.href === "/student/acquista-toefl-ibt" ? purchaseCtaHref : link.href}
                  >
                    Vai alla sezione
                    <span aria-hidden>→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:pt-10 sm:pb-20">
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
                <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                  Dopo aver scelto data e sede, completa la preparazione con risorse ufficiali pensate per ottenere il
                  massimo dal tuo percorso TOEFL.
                </p>
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

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:pb-24">
          <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/92 px-6 py-6 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md sm:px-8 sm:py-7">
            <span
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#9196FF] via-[#343579] to-[#FF8F60]"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#343579]">Per scuole e centri</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
                  {homeContent.centersTeaser.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 sm:text-base">{homeContent.centersTeaser.description}</p>
              </div>
              <CtaButton className="w-full justify-center sm:w-auto" href={homeContent.centersTeaser.cta.href}>
                {homeContent.centersTeaser.cta.label}
              </CtaButton>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
