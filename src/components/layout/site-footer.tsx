import Image from "next/image";
import Link from "next/link";

import { primaryNav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surfaceStrong text-text">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:grid-cols-[1.4fr_0.8fr_0.8fr] md:px-8">
        <div className="max-w-xl">
          <Image
            src="/brand/go-virtuality-logo-v2.png"
            alt={site.name}
            width={260}
            height={80}
            className="h-16 w-auto object-contain md:h-20"
          />
          <h2 className="display-title mt-5 text-2xl leading-tight md:text-3xl">
            Clean visuals. Fast delivery. Better first impressions.
          </h2>
          <p className="shell-copy mt-4 max-w-lg">
            Photography, drone, video, and staging for listings that need a sharper presentation.
          </p>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <div className="mt-5 flex flex-col gap-3 text-[0.8rem] uppercase tracking-[0.16em]">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-accent">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-text/84">
            <p>{site.serviceArea}</p>
            <a href={`tel:${site.phone}`} className="text-text transition hover:text-accent">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="text-text transition hover:text-accent">
              {site.email}
            </a>
            <div className="mt-4 flex gap-4 text-[0.7rem] uppercase tracking-[0.22em]">
              <Link href="/legal/privacy" className="transition hover:text-accent">
                Privacy
              </Link>
              <Link href="/legal/terms" className="transition hover:text-accent">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
