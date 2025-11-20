export const dynamic = "force-dynamic";
export const revalidate = 0;

import { CheckoutButton } from "@/components/checkout-button";
import { CtaButton } from "@/components/cta-button";
import { studentsContent as studentiContent } from "@/content/studenti";
import { env } from "@/lib/config";
import { getUserFromRequest } from "@/lib/auth";

export default async function StudentiPage() {
  const user = await getUserFromRequest();
  const isStudent = user?.role === "student";

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">
          Per gli studenti
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">
          {studentiContent.hero.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          {studentiContent.hero.subtitle}
        </p>
      </section>

      {/* CALENDLY CONSULENZA */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-2xl font-semibold text-slate-900">
          {studentiContent.calendly.title}
        </h2>
        <p className="mt-2 text-slate-600">
          Fissa un appuntamento con un TOEFL Ambassador per pianificare il tuo
          percorso.
        </p>
        {env.NEXT_PUBLIC_CALENDLY_STUDENT_URL ? (
          <iframe
            src={env.NEXT_PUBLIC_CALENDLY_STUDENT_URL}
            className="mt-6 h-[600px] w-full rounded-3xl border"
            title="Calendly Studenti"
            loading="lazy"
          />
        ) : (
          <p className="mt-6 text-sm text-slate-500">
            Imposta la variabile NEXT_PUBLIC_CALENDLY_STUDENT_URL per mostrare
            il calendario.
          </p>
        )}
      </section>

      {/* VOUCHER STRIPE */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 text-white">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-semibold">
            {studentiContent.voucher.title}
          </h2>
          <p className="mt-2 text-slate-200">
            Completa l&rsquo;acquisto con Stripe e ricevi il voucher
            direttamente via email.
          </p>
          <div className="mt-6">
            {isStudent ? (
              <div className="max-w-md">
                <CheckoutButton
                  endpoint="/api/checkout/student-voucher"
                  label={studentiContent.voucher.loggedInLabel}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row">
                {studentiContent.voucher.loggedOutCtas.map((cta) => (
                  <CtaButton key={cta.href} href={cta.href} variant="secondary">
                    {cta.label}
                  </CtaButton>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
