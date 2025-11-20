import Link from "next/link";
import { footerContent } from "@/content/footer";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 text-sm text-slate-600">
      <div className="mx-auto max-w-7xl px-4 space-y-10">

        {/* --- TOP: Brand + Navigation --- */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand + description */}
          <div className="md:col-span-2 space-y-3">
            <p className="font-semibold text-slate-800 text-lg">
              {footerContent.brandLine}
            </p>
            <p className="text-slate-600 max-w-lg leading-relaxed">
              {footerContent.description}
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-2">
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

            <div className="flex flex-col gap-2">
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
        </div>

        {/* --- CONTACTS AREA --- */}
        <div className="pt-8 border-t border-slate-200 flex flex-col gap-4 md:flex-row md:justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">{footerContent.contact.title}</h3>
            <ul className="mt-2 space-y-1">
              {footerContent.contact.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- LEGAL NOTE --- */}
        <div className="border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
            {footerContent.legalNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
