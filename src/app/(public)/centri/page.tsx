import { CtaButton } from "@/components/cta-button";
import { centriContent } from "@/content/centri";
import { env } from "@/lib/config";

export default function CentriPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
          Per i centri
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">{centriContent.hero.title}</h1>
        <p className="mt-4 text-lg text-slate-600">{centriContent.hero.subtitle}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <CtaButton href={centriContent.ctas.signup.href}>{centriContent.ctas.signup.label}</CtaButton>
          <CtaButton variant="secondary" href="/signup-center">
            Accedi all&rsquo;area partner
          </CtaButton>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-3">
          {centriContent.sections.map((section) => (
            <article key={section.title} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-2 text-slate-600">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-2xl font-semibold text-slate-900">{centriContent.ctas.calendly.label}</h2>
        <p className="mt-2 text-slate-600">
          Prenota un incontro con il nostro team commerciale per attivare il programma.
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
            Aggiungi l&rsquo;URL Calendly centro nella variabile NEXT_PUBLIC_CALENDLY_CENTER_URL.
          </p>
        )}
      </section>
    </div>
  );
}
