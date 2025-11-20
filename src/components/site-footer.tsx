import Link from "next/link";
import { footerContent } from "@/content/footer";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 text-sm text-slate-600">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="font-semibold text-slate-800">{footerContent.brandLine}</p>
            <p>{footerContent.description}</p>
          </div>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              {footerContent.primaryLinks.map((link) => (
                <Link key={link.href} href={link.href} className="font-semibold text-sky-700">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {footerContent.secondaryLinks.map((link) => (
                <Link key={link.href} href={link.href} className="font-semibold text-sky-700">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">{footerContent.contact.title}</h3>
            <ul className="mt-2 space-y-1">
              {footerContent.contact.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <p className="max-w-xl text-xs text-slate-500">{footerContent.legalNote}</p>
        </div>
      </div>
    </footer>
  );
}
