"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigationContent } from "@/content/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const navRef = useRef<HTMLDivElement>(null);

  const handleNavigate = () => {
    setOpenMenu(null);
    setIsMobileOpen(false);
    setMobileExpanded({});
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const toggleMobileSection = (label: string) => {
    setMobileExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div
        ref={navRef}
        className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:py-4"
      >
        {/* Logo + tagline (tagline sotto al logo) */}
<Link href="/" className="flex flex-col items-center gap-1 sm:items-center">
  <Image
    src="/toefl-ambassador-logo.png"
    alt="TOEFL Ambassador logo"
    width={160}
    height={64}
    priority
  />
  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
    PROGRAMMA UFFICIALE ETS PER IL TOEFL iBT®
  </span>
</Link>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            aria-expanded={isMobileOpen}
            aria-label="Apri menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
            onClick={() => setIsMobileOpen((open) => !open)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              {isMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 lg:flex">
          <nav className="flex items-center gap-4 text-sm font-semibold text-slate-700">
            {navigationContent.navItems.map((item) => {
              if (!item.children) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavigate}
                    className={`rounded-full px-3 py-2 transition hover:text-slate-900 ${
                      isActiveLink(item.href) ? "bg-slate-100 text-slate-900" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              const isOpen = openMenu === item.label;
              const isActive = isActiveLink(item.href);

              return (
                <div key={item.href} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(isOpen ? null : item.label)}
                    className={`flex items-center gap-1 rounded-full px-3 py-2 transition hover:text-slate-900 ${
                      isActive ? "bg-slate-100 text-slate-900" : ""
                    }`}
                  >
                    <span>{item.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                      <ul className="space-y-1 text-sm">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={handleNavigate}
                              className={`flex rounded-xl px-3 py-2 transition hover:bg-slate-50 hover:text-slate-900 ${
                                isActiveLink(child.href) ? "bg-slate-100 text-slate-900" : ""
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          {/* CTA rimosso per non mostrare la consulenza agli studenti */}
        </div>

        {/* Mobile nav */}
        {isMobileOpen && (
          <div className="absolute left-0 right-0 top-full border-t border-slate-200 bg-white shadow-lg lg:hidden">
            <div className="flex flex-col gap-2 px-4 py-4 text-sm font-semibold text-slate-800">
              {navigationContent.navItems.map((item) => {
                if (!item.children) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavigate}
                      className={`rounded-xl px-3 py-3 transition hover:bg-slate-50 ${
                        isActiveLink(item.href) ? "bg-slate-100 text-slate-900" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                const expanded = mobileExpanded[item.label];

                return (
                  <div key={item.href} className="rounded-xl border border-slate-100">
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between px-3 py-3 text-left ${
                        isActiveLink(item.href) ? "bg-slate-50 text-slate-900" : ""
                      }`}
                      onClick={() => toggleMobileSection(item.label)}
                    >
                      <span>{item.label}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`h-5 w-5 transition ${expanded ? "rotate-180" : ""}`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {expanded && (
                      <div className="border-t border-slate-100 bg-slate-50">
                        <ul className="flex flex-col">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={handleNavigate}
                                className={`block px-4 py-3 text-[15px] transition hover:bg-white ${
                                  isActiveLink(child.href)
                                    ? "bg-white text-slate-900"
                                    : "text-slate-700"
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* CTA mobile rimosso */}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
