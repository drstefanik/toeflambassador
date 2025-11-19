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

export function SignupStudentForm({ centers }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    preferredCenterSlug: "",
  });
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Le password non coincidono");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/auth/student/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          country: form.country,
          preferredCenterSlug: form.preferredCenterSlug || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registrazione non riuscita");
      }

      router.push("/student/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-600">Nome e Cognome</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          value={form.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-600">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">Conferma Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            value={form.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Paese</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          value={form.country}
          onChange={(event) => updateField("country", event.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Centro preferito</label>
        <select
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          value={form.preferredCenterSlug}
          onChange={(event) => updateField("preferredCenterSlug", event.target.value)}
        >
          <option value="">Seleziona un centro</option>
          {centers
            .filter((center) => center.slug)
            .map((center) => (
              <option key={center.id} value={center.slug}>
                {center.name}
              </option>
            ))}
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
      >
        {status === "loading" ? "Registrazione in corso..." : "Registrati"}
      </button>
    </form>
  );
}
