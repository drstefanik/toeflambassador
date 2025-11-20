import Link from "next/link";
import { footerContent } from "@/content/footer";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 text-sm text-slate-600">
      <div className="mx-auto max-w-6xl px-4">
        {/* 3 colonne su una riga */}
        <div className="flex flex-col gap-8 md:grid md:grid-cols-3 md:items-start">
          {/* Colonna 1: brand + descrizione */}
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">
              {footerContent.brandLine}
            </p>
            <p className="text-slate-600 leading-relaxed">
              {footerContent.description}
            </p>
          </div>

          {/* Colonna 2: link di navigazione */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              {footerContent.primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-semibold text-sky-700 hover:text-sky-900 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              {footerContent.secondaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-semibold text-sky-700 hover:text-sky-900 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Colonna 3: contatti */}
          <div>
            <h3 className="font-semibold text-slate-800">
              {footerContent.contact.title}
            </h3>
            <ul className="mt-2 space-y-1">
              {footerContent.contact.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Riga nota legale sotto, sottile */}
        <div className="mt-6 border-t border-slate-200 pt-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            {footerContent.legalNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
