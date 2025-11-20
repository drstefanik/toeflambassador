import Image from "next/image";
import Link from "next/link";
import { CtaButton } from "@/components/cta-button";
import { navigationContent } from "@/content/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/toefl-ambassador-logo.png"
            alt="TOEFL Ambassador logo"
            width={160}
            height={64}
            priority
          />
          <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 sm:inline">
            {navigationContent.tagline}
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 lg:flex">
            {navigationContent.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <CtaButton href={navigationContent.primaryCta.href} size="sm">
            {navigationContent.primaryCta.label}
          </CtaButton>
        </div>
      </div>
    </header>
  );
}
