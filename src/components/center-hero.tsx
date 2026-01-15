import Link from "next/link";

type Props = {
  backHref?: string;
  city?: string;
  name?: string;
  heroImageUrl?: string | null;
};

export function CenterHero({
  backHref = "/partner/sedi",
  city,
  name,
  heroImageUrl,
}: Props) {
  const bg = heroImageUrl?.trim();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        {bg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bg}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-slate-100 via-white to-slate-200/60" />
        )}
        <div className="absolute inset-0 bg-white/70" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <Link
          href={backHref}
          className="inline-flex items-center text-sm text-slate-700 hover:text-slate-900"
        >
          ← Torna all’elenco sedi
        </Link>

        <div className="mt-10 max-w-3xl">
          {city ? (
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">
              {city}
            </p>
          ) : null}

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {name || "Centro TOEFL Ambassador"}
          </h1>

          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Informazioni ufficiali del centro: contatti rapidi, posizione e richiesta
            informazioni.
          </p>

          <div className="mt-8 h-1 w-24 rounded-full bg-sky-600" />
        </div>
      </div>
    </section>
  );
}
