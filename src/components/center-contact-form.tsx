"use client";

import { type FormEvent, useState } from "react";

type Props = {
  centerSlug: string;
  centerName?: string;
  title?: string;
  subtitle?: string;
};

export function CenterContactForm({ centerSlug, centerName, title, subtitle }: Props) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<"idle" | "ok" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSent("idle");
    setErrorMessage(null);

    try {
      const fd = new FormData(e.currentTarget);

      const payload = {
        centerSlug,
        name: String(fd.get("name") || "").trim(),
        mobile: String(fd.get("mobile") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        subject: String(fd.get("subject") || "").trim(),
        message: String(fd.get("message") || "").trim(),
        company: String(fd.get("company") || "").trim(),
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      console.debug("POST /api/contact", res.status, data);

      if (res.ok) {
        setSent("ok");
        setErrorMessage(null);
        e.currentTarget.reset();
      } else {
        console.error("Contact form failed", {
          status: res.status,
          error: data?.error,
          data,
        });
        setErrorMessage(
          data?.error || "Errore durante l'invio. Riprova o scrivi direttamente via email."
        );
        setSent("error");
      }
    } catch (err) {
      console.error("Contact form exception", err);
      setErrorMessage("Errore durante l'invio. Riprova o scrivi direttamente via email.");
      setSent("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-900">
          {title || "WRITE US"}
        </h3>
        <div className="h-1 w-14 rounded-full bg-sky-600" />
      </div>

      <p className="mt-2 text-sm text-slate-600">
        {subtitle || "Compila il form e ti ricontattiamo al più presto."}
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

        {sent === "error" && (
          <p className="text-red-600 mt-3">
            {errorMessage || "Errore durante l'invio. Riprova o scrivi direttamente via email."}
          </p>
        )}
        {sent === "ok" && (
          <p className="text-green-600 mt-3">
            Messaggio inviato correttamente. Ti ricontatteremo al più presto.
          </p>
        )}
      </form>
    </div>
  );
}
