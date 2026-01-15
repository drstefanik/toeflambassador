"use client";

import { type FormEvent, useMemo, useState } from "react";

type Props = {
  toEmail?: string;
  centerName?: string;
};

export function CenterContactForm({ toEmail, centerName }: Props) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<"idle" | "ok" | "error">("idle");

  const canSend = useMemo(
    () => Boolean(toEmail && toEmail.includes("@")),
    [toEmail]
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSend) return;

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      mobile: String(fd.get("mobile") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
      to: toEmail,
      centerName: centerName || "",
    };

    setLoading(true);
    setSent("idle");

    try {
      const res = await fetch("/api/public/center-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSent("ok");
        e.currentTarget.reset();
        return;
      }

      throw new Error("api_not_available");
    } catch {
      try {
        const subject = encodeURIComponent(
          payload.subject ||
            `Richiesta informazioni – ${centerName || "Centro"}`
        );
        const body = encodeURIComponent(
          `Nome e Cognome: ${payload.name}\nMobile: ${payload.mobile}\nEmail: ${payload.email}\n\nMessaggio:\n${payload.message}\n`
        );

        window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
        setSent("ok");
        e.currentTarget.reset();
      } catch {
        setSent("error");
      }
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

      {!canSend ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Email del centro non disponibile. Aggiungi <b>ContactFormEmail</b> (o
          <b> Email</b>) su Airtable.
        </p>
      ) : null}

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

        {canSend ? (
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-sky-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Invio..." : "Scrivi ora"}
          </button>
        ) : null}

        {sent === "ok" ? (
          <p className="text-sm text-slate-600">
            Messaggio pronto ✨ (se non hai endpoint, si aprirà il client email).
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
