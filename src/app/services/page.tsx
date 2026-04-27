import Image from "next/image";
import Link from "next/link";

import { InquiryCta } from "@/components/sections/inquiry-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { services } from "@/content/services";
import { portfolioProjects } from "@/content/portfolio";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Explore Go Virtuality's real estate photography, drone, video walkthrough, virtual staging, and commercial photography services.",
  path: "/services"
});

const virtualTourExamples = portfolioProjects.filter(
  (project) => project.category === "Virtual Tours"
);

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Every service is built to sharpen value, not add clutter."
        body="The offering is intentionally tight: stills, motion, digital tours, staging, and aerial coverage that help listings feel premium, coherent, and easy to understand."
        aside="Use this page to find the right starting point. Each service page goes deeper without repeating the entire sales pitch."
      />

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <div className="grid gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          {services.map((service, index) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="group">
              <div className="page-panel grid gap-5 p-4 md:grid-cols-[0.92fr_1.08fr] md:gap-6 md:p-5">
                <div
                  className={`image-frame aspect-[4/3] min-h-[14rem] ${index % 2 ? "md:order-2" : ""}`}
                >
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="image-scrim opacity-60" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-accent">
                      {service.shortName}
                    </p>
                    <h2 className="mt-3 font-display text-[1.8rem] tracking-editorial transition group-hover:text-accent md:text-3xl">
                      {service.name}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-muted">{service.summary}</p>
                  </div>
                  <p className="mt-6 text-xs uppercase tracking-[0.26em] text-text/86">
                    {service.priceNote}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-band mt-8 md:mt-10">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-18">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Virtual Tours</p>
              <h2 className="display-title mt-3 max-w-xl text-3xl leading-tight md:text-4xl">
                Tour examples that help buyers understand the space before they walk in.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">
              For listings that benefit from remote walkthroughs, these examples show the kind
              of clean digital tour experience we can build around the home.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {virtualTourExamples.map((project) => (
              <Link key={project.slug} href={`/portfolio/${project.slug}`} className="group">
                <article className="page-panel overflow-hidden p-4 md:p-5">
                  <div className="image-frame aspect-[4/3] sm:aspect-[16/10]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="image-scrim" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-surface">
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-surface/92">
                        {project.category}
                      </p>
                      <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.01em]">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm text-surface/92">{project.location}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <p className="max-w-md text-sm leading-6 text-muted">{project.summary}</p>
                    <span className="shrink-0 text-[0.72rem] uppercase tracking-[0.18em] text-text/88 transition group-hover:text-accent">
                      View example
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <InquiryCta
        eyebrow="Need a recommendation?"
        title="Not sure which combination fits the property?"
        body="Send us the listing type, square footage, and whether you need stills, motion, tours, drone, or staging. We'll point you toward the simplest effective scope."
      />
    </>
  );
}
