"use client";

import { useMemo, useState } from "react";
import { CentersDirectoryClient } from "@/components/centers-directory-client";

type CenterPoint = {
  id: string;
  name: string;
  city?: string | null;
  slug?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

interface CentersDirectoryShellProps {
  centers: CenterPoint[];
}

export function CentersDirectoryShell({ centers }: CentersDirectoryShellProps) {
  const [query, setQuery] = useState("");

  const filteredCenters = useMemo(() => {
    if (!query.trim()) return centers;

    const q = query.toLowerCase();

    return centers.filter((center) => {
      const name = center.name?.toLowerCase() ?? "";
      const city = center.city?.toLowerCase() ?? "";
      const address = center.address?.toLowerCase() ?? "";

      return (
        name.includes(q) ||
        city.includes(q) ||
        address.includes(q)
      );
    });
  }, [centers, query]);

  return (
    <div className="space-y-4">
      {/* Barra di ricerca */}
      <div className="flex flex-col gap-2 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200">
        <label className="text-sm font-semibold text-slate-800">
          Cerca un centro
        </label>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-xs focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
          <span className="text-slate-400" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per città, nome del centro o indirizzo…"
            className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
        <p className="text-xs text-slate-500">
          {filteredCenters.length === centers.length && !query.trim()
            ? `Centri attivi: ${centers.length}`
            : `Risultati trovati: ${filteredCenters.length} su ${centers.length}`}
        </p>
      </div>

      {/* Mappa + card, filtrate */}
      <CentersDirectoryClient centers={filteredCenters} />
    </div>
  );
}
