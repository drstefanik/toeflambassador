"use client";

import Script from "next/script";
import { useCallback, useState } from "react";
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
      initPopupWidget?: (options: { url: string }) => void;
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
  const [isLoaded, setIsLoaded] = useState(() => typeof window !== "undefined" && Boolean(window.Calendly));

  const openCalendlyPopup = useCallback(() => {
    if (!calendlyUrl) {
      return;
    }

    if (window.Calendly?.initPopupWidget) {
      window.Calendly.initPopupWidget({ url: calendlyUrl });
      return;
    }

    window.open(calendlyUrl, "_blank", "noopener,noreferrer");
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
    <>
      <Script
        id={CALENDLY_SCRIPT_ID}
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => setIsLoaded(true)}
      />

      <button
        type="button"
        onClick={openCalendlyPopup}
        disabled={!isLoaded}
        className={cn(baseStyles, sizes[size], variants[variant], className)}
      >
        {isLoaded ? label : "Caricamento calendario..."}
      </button>
    </>
  );
}
