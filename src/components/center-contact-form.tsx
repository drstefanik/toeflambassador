"use client";

import { useState } from "react";

interface Props {
  centerSlug: string;
}

export function CenterContactForm({ centerSlug }: Props) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/centers/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ centerSlug, ...formState }),
      });

      if (!response.ok) {
        throw new Error("Impossibile inviare il messaggio");
      }

      setStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow">
      <div>
        <label className="block text-sm font-medium text-slate-600">Nome</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          value={formState.name}
          onChange={(event) => updateField("name", event.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          value={formState.email}
          onChange={(event) => updateField("email", event.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Oggetto</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          value={formState.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Messaggio</label>
        <textarea
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          rows={4}
          value={formState.message}
          onChange={(event) => updateField("message", event.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {status === "success" && (
        <p className="text-sm text-emerald-600">Messaggio inviato con successo.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
      >
        {status === "loading" ? "Invio in corso..." : "Invia"}
      </button>
    </form>
  );
}
