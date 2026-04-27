"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { primaryNav, site } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8 md:py-4">
        <Link href="/" className="group flex items-center">
          <Image
            src="/brand/go-virtuality-logo-v2.png"
            alt={site.name}
            width={220}
            height={64}
            priority
            className="h-12 w-auto object-contain transition duration-300 group-hover:opacity-90 md:h-16"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 text-[0.82rem] uppercase tracking-[0.18em] text-text/92 md:flex"
        >
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-accent">
              {item.label}
            </Link>
          ))}
          <Link href="/book" className="btn-primary">
            {site.ctaLabel}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="min-h-[2.75rem] rounded-full border border-line bg-surface px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-text transition md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <div className="border-t border-line/70 bg-background/98 md:hidden">
          <nav aria-label="Mobile primary" className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-[0.8rem] uppercase tracking-[0.16em] text-text transition hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/book" className="btn-primary mt-3 text-center">
              {site.ctaLabel}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
