import Link from "next/link";

import { primaryNav, site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="group flex items-center">
          <img
            src="/brand/go-virtuality-logo-v2.png"
            alt={site.name}
            className="h-14 w-auto object-contain transition duration-300 group-hover:opacity-90 md:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-6 text-[0.82rem] uppercase tracking-[0.18em] text-text/92 md:flex">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-accent">
              {item.label}
            </Link>
          ))}
          <Link href="/book" className="btn-primary">
            {site.ctaLabel}
          </Link>
        </nav>

        <details className="relative md:hidden">
          <summary className="list-none rounded-full border border-line bg-surface px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-text">
            Menu
          </summary>
          <div className="absolute right-0 mt-3 min-w-56 border border-line bg-surface p-3 shadow-soft">
            <div className="flex flex-col gap-2">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded px-3 py-2 text-[0.78rem] uppercase tracking-[0.16em] text-text transition hover:bg-background"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/book" className="btn-primary mt-2 text-center">
                {site.ctaLabel}
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
