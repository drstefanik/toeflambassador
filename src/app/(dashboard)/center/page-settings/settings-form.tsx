"use client";

import { useState } from "react";
import type { CenterFields } from "@/lib/airtable";

interface Props {
  centerId: string;
  fields: CenterFields;
}

export function PageSettingsForm({ centerId, fields }: Props) {
  const [form, setForm] = useState({
    HeroImageUrl: fields.HeroImageUrl ?? "",
    CallSectionEnabled: Boolean(fields.CallSectionEnabled),
    CallSectionTitle: fields.CallSectionTitle ?? "",
    CallSectionSubtitle: fields.CallSectionSubtitle ?? "",
    CallSectionPhoneLabel: fields.CallSectionPhoneLabel ?? "",
    CallSectionPhoneNumber: fields.CallSectionPhoneNumber ?? "",
    WriteSectionEnabled: Boolean(fields.WriteSectionEnabled),
    WriteSectionTitle: fields.WriteSectionTitle ?? "",
    WriteSectionSubtitle: fields.WriteSectionSubtitle ?? "",
    ContactFormEmail: fields.ContactFormEmail ?? "",
    MapEnabled: Boolean(fields.MapEnabled),
    Latitude: fields.Latitude?.toString() ?? "",
    Longitude: fields.Longitude?.toString() ?? "",
    Address: fields.Address ?? "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setError(null);

    try {
      const response = await fetch("/api/center/page", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          centerId,
          fields: {
            ...form,
            Latitude: form.Latitude ? Number(form.Latitude) : undefined,
            Longitude: form.Longitude ? Number(form.Longitude) : undefined,
          },
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Impossibile salvare le modifiche");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-600">URL immagine Hero</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          value={form.HeroImageUrl}
          onChange={(event) => updateField("HeroImageUrl", event.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 p-4">
        <label className="flex items-center gap-3 text-base font-semibold text-slate-900">
          <input
            type="checkbox"
            checked={form.CallSectionEnabled}
            onChange={(event) => updateField("CallSectionEnabled", event.target.checked)}
          />
          Call Section
        </label>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            placeholder="Titolo"
            className="rounded-lg border border-slate-200 px-3 py-2"
            value={form.CallSectionTitle}
            onChange={(event) => updateField("CallSectionTitle", event.target.value)}
          />
          <input
            placeholder="Sottotitolo"
            className="rounded-lg border border-slate-200 px-3 py-2"
            value={form.CallSectionSubtitle}
            onChange={(event) => updateField("CallSectionSubtitle", event.target.value)}
          />
          <input
            placeholder="Etichetta telefono"
            className="rounded-lg border border-slate-200 px-3 py-2"
            value={form.CallSectionPhoneLabel}
            onChange={(event) => updateField("CallSectionPhoneLabel", event.target.value)}
          />
          <input
            placeholder="Numero di telefono"
            className="rounded-lg border border-slate-200 px-3 py-2"
            value={form.CallSectionPhoneNumber}
            onChange={(event) => updateField("CallSectionPhoneNumber", event.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-4">
        <label className="flex items-center gap-3 text-base font-semibold text-slate-900">
          <input
            type="checkbox"
            checked={form.WriteSectionEnabled}
            onChange={(event) => updateField("WriteSectionEnabled", event.target.checked)}
          />
          Write Section
        </label>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            placeholder="Titolo"
            className="rounded-lg border border-slate-200 px-3 py-2"
            value={form.WriteSectionTitle}
            onChange={(event) => updateField("WriteSectionTitle", event.target.value)}
          />
          <input
            placeholder="Sottotitolo"
            className="rounded-lg border border-slate-200 px-3 py-2"
            value={form.WriteSectionSubtitle}
            onChange={(event) => updateField("WriteSectionSubtitle", event.target.value)}
          />
          <input
            placeholder="Email contatto"
            className="rounded-lg border border-slate-200 px-3 py-2"
            value={form.ContactFormEmail}
            onChange={(event) => updateField("ContactFormEmail", event.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-4">
        <label className="flex items-center gap-3 text-base font-semibold text-slate-900">
          <input
            type="checkbox"
            checked={form.MapEnabled}
            onChange={(event) => updateField("MapEnabled", event.target.checked)}
          />
          Mappa
        </label>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            placeholder="Latitudine"
            className="rounded-lg border border-slate-200 px-3 py-2"
            value={form.Latitude}
            onChange={(event) => updateField("Latitude", event.target.value)}
          />
          <input
            placeholder="Longitudine"
            className="rounded-lg border border-slate-200 px-3 py-2"
            value={form.Longitude}
            onChange={(event) => updateField("Longitude", event.target.value)}
          />
        </div>
        <input
          placeholder="Indirizzo"
          className="mt-4 rounded-lg border border-slate-200 px-3 py-2"
          value={form.Address}
          onChange={(event) => updateField("Address", event.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {status === "success" && <p className="text-sm text-emerald-600">Impostazioni salvate.</p>}
      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full rounded-full bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
      >
        {status === "saving" ? "Salvataggio..." : "Salva modifiche"}
      </button>
    </form>
  );
}
