"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface CenterOption {
  id: string;
  name: string;
  slug?: string;
}

interface Props {
  centers: CenterOption[];
}

export function SignupCenterForm({ centers }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    otp: "",
    centerSlug: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/center/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registrazione non riuscita");
      }
      router.push("/center/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-600">Email istituzionale</label>
        <input
          type="email"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Password</label>
        <input
          type="password"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-600">OTP</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            value={form.otp}
            onChange={(event) => setForm((prev) => ({ ...prev, otp: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">Centro</label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            value={form.centerSlug}
            onChange={(event) => setForm((prev) => ({ ...prev, centerSlug: event.target.value }))}
            required
          >
            <option value="">Seleziona</option>
            {centers
              .filter((center) => center.slug)
              .map((center) => (
                <option key={center.id} value={center.slug}>
                  {center.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
      >
        {loading ? "Attivazione in corso..." : "Attiva il centro"}
      </button>
    </form>
  );
}
