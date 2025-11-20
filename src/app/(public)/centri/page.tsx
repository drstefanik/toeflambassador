export const dynamic = "force-dynamic";
export const revalidate = 0;

import { CtaButton } from "@/components/cta-button";
import { centersContent as centriContent } from "@/content/centri";
import { env } from "@/lib/config";

export default function CentriPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
          Per i centri
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">
          {centriContent.hero.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          {centriContent.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <CtaButton href={centriContent.hero.primaryCta.href}>
            {centriContent.hero.primaryCta.label}
          </CtaButton>
          <CtaButton
            variant="secondary"
            href={centriContent.hero.secondaryCta.href}
          >
            {centriContent.hero.secondaryCta.label}
          </CtaButton>
        </div>
      </section>

      {/* CALENDLY – FISSA APPUNTAMENTO */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-2xl font-semibold text-slate-900">
          Fissa un appuntamento per maggiori informazioni
        </h2>
        <p className="mt-2 text-slate-600">
          Prenota un incontro con il nostro team commerciale per attivare il
          programma.
        </p>
        {env.NEXT_PUBLIC_CALENDLY_CENTER_URL ? (
          <iframe
            src={env.NEXT_PUBLIC_CALENDLY_CENTER_URL}
            className="mt-6 h-[600px] w-full rounded-3xl border"
            title="Calendly Centro"
            loading="lazy"
          />
        ) : (
          <p className="mt-6 text-sm text-slate-500">
            Aggiungi l&rsquo;URL Calendly centro nella variabile
            NEXT_PUBLIC_CALENDLY_CENTER_URL.
          </p>
        )}
      </section>
    </div>
  );
}
