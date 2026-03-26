"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CalendlyButtonProps = {
  label: string;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
};

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const CALENDLY_SCRIPT_ID = "calendly-widget-script";
const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_STUDENT_URL;

export function CalendlyButton({
  label,
  className,
  variant = "primary",
  size = "md",
}: CalendlyButtonProps) {
  const [scriptReady, setScriptReady] = useState(() => typeof window !== "undefined" && Boolean(window.Calendly));

  useEffect(() => {
    if (!calendlyUrl) {
      return;
    }

    if (window.Calendly) {
      queueMicrotask(() => setScriptReady(true));
      return;
    }

    const existingScript = document.getElementById(CALENDLY_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        queueMicrotask(() => setScriptReady(true));
        return;
      }

      const markReady = () => setScriptReady(true);
      existingScript.addEventListener("load", markReady);
      return () => existingScript.removeEventListener("load", markReady);
    }

    const script = document.createElement("script");
    script.id = CALENDLY_SCRIPT_ID;
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      setScriptReady(true);
    };
    document.body.appendChild(script);
  }, []);

  const openCalendlyPopup = useCallback(() => {
    if (!calendlyUrl || !window.Calendly) {
      return;
    }

    window.Calendly.initPopupWidget({ url: calendlyUrl });
  }, []);

  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    primary: "bg-sky-600 text-white hover:bg-sky-700",
    secondary: "border border-sky-600 text-sky-600 hover:bg-sky-50",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
  };

  if (!calendlyUrl) {
    return (
      <button
        type="button"
        disabled
        className={cn(baseStyles, sizes[size], variants.secondary, className)}
      >
        Calendly non disponibile
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openCalendlyPopup}
      disabled={!scriptReady}
      className={cn(baseStyles, sizes[size], variants[variant], className)}
    >
      {scriptReady ? label : "Caricamento calendario..."}
    </button>
  );
}
