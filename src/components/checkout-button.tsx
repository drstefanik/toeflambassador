"use client";

import { useState } from "react";

interface Props {
  endpoint: string;
  label: string;
}

export function CheckoutButton({ endpoint, label }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint, { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Errore inatteso");
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-full bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
      >
        {loading ? "Reindirizzamento in corso..." : label}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
