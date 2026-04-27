import type { Metadata } from "next";

import { site } from "@/content/site";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
};

export function buildMetadata({
  title,
  description,
  path = "/"
}: MetadataInput): Metadata {
  const url = new URL(path, site.url).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: site.name
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    areaServed: site.serviceArea,
    description:
      "Luxury-feeling real estate media services including photography, drone coverage, video walkthroughs, virtual staging, and commercial photography."
  };
}
