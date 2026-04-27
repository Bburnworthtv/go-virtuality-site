import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { localBusinessSchema } from "@/lib/seo";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: {
    default: "Go Virtuality | Luxury Real Estate Media",
    template: "%s | Go Virtuality"
  },
  description:
    "Luxury-feeling real estate media including photography, drone coverage, cinematic walkthroughs, virtual staging, and commercial imagery.",
  metadataBase: new URL("https://govirtuality.com")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = localBusinessSchema();

  return (
    <html lang="en" className={`${bricolage.variable} ${GeistSans.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(255,145,24,0.08),transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.012),transparent_18%,transparent_82%,rgba(255,255,255,0.012))]" />
          {children}
        </main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}
