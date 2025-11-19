import Link from "next/link";
import { footerContent } from "@/content/footer";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 text-sm text-slate-600">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row">
        <p className="max-w-2xl">{footerContent.claim}</p>
        <div className="flex flex-wrap gap-4">
          {footerContent.links.map((link) => (
            <Link key={link.href} href={link.href} className="font-semibold text-sky-700">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
