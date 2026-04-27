import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { InquiryCta } from "@/components/sections/inquiry-cta";
import { portfolioBySlug, portfolioProjects } from "@/content/portfolio";
import { buildMetadata } from "@/lib/seo";

type PortfolioDetailPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({
  params
}: PortfolioDetailPageProps): Metadata {
  const project = portfolioBySlug[params.slug];

  if (!project) {
    return {};
  }

  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/portfolio/${project.slug}`
  });
}

export default function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const project = portfolioBySlug[params.slug];

  if (!project) {
    notFound();
  }

  return (
    <>
      <section className="page-band">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 md:px-8 md:pb-14 md:pt-24">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:gap-10">
          <div className="max-w-2xl">
            <p className="eyebrow">{project.category}</p>
            <h1 className="mt-5 font-display text-[2.6rem] leading-[0.95] tracking-editorial sm:text-6xl md:text-7xl">
              {project.title}
            </h1>
            <p className="mt-5 text-sm uppercase tracking-[0.26em] text-muted">
              {project.location}
            </p>
            <p className="mt-6 text-base leading-8 text-muted">{project.summary}</p>
          </div>
          <div className="page-panel p-4 md:p-5">
            <div className="image-frame aspect-[4/5] min-h-[20rem] sm:aspect-[5/4] md:min-h-[34rem]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="image-scrim opacity-65" />
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:grid-cols-2 md:grid-cols-3 md:px-8 md:py-14">
        <article className="border-t border-line pt-5">
          <p className="eyebrow">Challenge</p>
          <p className="mt-4 text-sm leading-7 text-muted">{project.challenge}</p>
        </article>
        <article className="border-t border-line pt-5">
          <p className="eyebrow">Approach</p>
          <p className="mt-4 text-sm leading-7 text-muted">{project.solution}</p>
        </article>
        <article className="border-t border-line pt-5">
          <p className="eyebrow">Outcome</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
            {project.results.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <InquiryCta
        eyebrow="Inspired by this project?"
        title="Let’s create the same level of polish for your next listing."
        body="Share the property type, location, and timeline and we’ll suggest the right package or custom scope."
      />
    </>
  );
}
