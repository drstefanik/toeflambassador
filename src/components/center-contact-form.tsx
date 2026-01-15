"use client";

import { type FormEvent, useState } from "react";

type Props = {
  centerSlug: string;
  centerName?: string;
};

export function CenterContactForm({ centerSlug, centerName }: Props) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<"idle" | "ok" | "error">("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const payload = {
      centerSlug,
      name: String(fd.get("name") || ""),
      mobile: String(fd.get("mobile") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
      company: String(fd.get("company") || ""),
    };

    setLoading(true);
    setSent("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setSent("ok");
        e.currentTarget.reset();
        return;
      }

      throw new Error("api_not_available");
    } catch {
      setSent("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-900">WRITE US</h3>
        <div className="h-1 w-14 rounded-full bg-sky-600" />
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Compila il form e ti ricontattiamo al più presto.
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="name"
            required
            placeholder="Nome e Cognome"
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200/50"
          />
          <input
            name="mobile"
            placeholder="Mobile"
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200/50"
          />
        </div>

        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200/50"
        />

        <input
          name="subject"
          placeholder="Oggetto"
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200/50"
        />

        <textarea
          name="message"
          required
          placeholder="Messaggio"
          rows={5}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200/50"
        />

        <input
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-sky-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Invio..." : "Scrivi ora"}
        </button>

        {sent === "ok" ? (
          <p className="text-sm text-slate-600">
            Messaggio inviato ✨
          </p>
        ) : null}
        {sent === "error" ? (
          <p className="text-sm text-rose-600">
            Errore durante l’invio. Riprova o scrivi direttamente via email.
          </p>
        ) : null}
      </form>
    </div>
  );
}
