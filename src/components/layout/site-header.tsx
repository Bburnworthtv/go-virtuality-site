"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { primaryNav, site } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointer(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

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

        <div ref={panelRef} className="relative md:hidden">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className="min-h-[2.75rem] rounded-full border border-line bg-surface px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-text transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {open ? "Close" : "Menu"}
          </button>

          {open ? (
            <div
              id={panelId}
              className="absolute right-0 mt-3 min-w-56 border border-line bg-surface p-3 shadow-soft"
            >
              <nav aria-label="Mobile primary" className="flex flex-col gap-2">
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
              </nav>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
