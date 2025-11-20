"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { CenterPoint, CentersMap } from "./centers-map";

interface CenterCard extends CenterPoint {
  address?: string | null;
  slug?: string | null;
}

interface Props {
  centers: CenterCard[];
}

export function CentersDirectory({ centers }: Props) {
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const points = useMemo(() => centers.map((center) => ({
    id: center.id,
    name: center.name,
    city: center.city,
    latitude: center.latitude,
    longitude: center.longitude,
  })), [centers]);

  const handleSelect = (id: string) => {
    const ref = cardRefs.current[id];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
      ref.classList.add("ring", "ring-sky-500");
      setTimeout(() => ref.classList.remove("ring", "ring-sky-500"), 1200);
    }
  };

  return (
    <div className="space-y-8">
      <CentersMap centers={points} onSelect={handleSelect} />
      <div className="grid gap-6 md:grid-cols-2">
        {centers.map((center) => (
          <div
            key={center.id}
            ref={(element) => {
              cardRefs.current[center.id] = element;
            }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold text-sky-600">
              {center.city ?? "Località"}
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900">
              {center.name}
            </h3>
            {center.address && <p className="mt-2 text-slate-600">{center.address}</p>}
            {center.slug && (
              <Link
                href={`/centri/${center.slug}`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-sky-700"
              >
                Vai alla pagina del centro →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
