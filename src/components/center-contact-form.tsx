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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold">WRITE US</h3>
        <div className="h-1 w-14 rounded-full bg-red-600" />
      </div>

      <p className="mt-2 text-sm text-white/75">
        Compila il form e ti ricontattiamo al più presto.
      </p>

      {!canSend ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
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
            className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-red-500/60"
          />
          <input
            name="mobile"
            placeholder="Mobile"
            className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-red-500/60"
          />
        </div>

        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-red-500/60"
        />

        <input
          name="subject"
          placeholder="Oggetto"
          className="h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-red-500/60"
        />

        <textarea
          name="message"
          required
          placeholder="Messaggio"
          rows={5}
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-red-500/60"
        />

        {canSend ? (
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-2xl bg-red-600 px-6 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Invio..." : "Scrivi ora"}
          </button>
        ) : null}

        {sent === "ok" ? (
          <p className="text-sm text-white/80">
            Messaggio pronto ✨ (se non hai endpoint, si aprirà il client email).
          </p>
        ) : null}
        {sent === "error" ? (
          <p className="text-sm text-red-200">
            Errore durante l’invio. Riprova o scrivi direttamente via email.
          </p>
        ) : null}
      </form>
    </div>
  );
}
