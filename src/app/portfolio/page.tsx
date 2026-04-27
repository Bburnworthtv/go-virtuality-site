import Link from "next/link";

import { InquiryCta } from "@/components/sections/inquiry-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { portfolioProjects } from "@/content/portfolio";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Portfolio",
  description:
    "Browse selected real estate, drone, video, and commercial projects from Go Virtuality.",
  path: "/portfolio"
});

export default function PortfolioPage() {
  return (
    <>
      <PageIntro
        eyebrow="Portfolio"
        title="Selected work."
        body="A short set of residential, video, and commercial projects."
        aside="If you want examples closer to your property type, reach out and we can send them."
      />

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <div className="grid gap-8 lg:gap-10">
          {portfolioProjects.map((project) => (
            <Link key={project.slug} href={`/portfolio/${project.slug}`} className="group">
              <article className="page-panel grid gap-5 p-4 md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-8 md:p-5">
                <div className="image-frame aspect-[4/3] md:aspect-[5/4]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="image-scrim opacity-70" />
                </div>
                <div className="flex h-full flex-col justify-between gap-5">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-accent">
                      {project.category}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-medium uppercase tracking-[0.02em] transition group-hover:text-accent md:text-2xl">
                      {project.title}
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                      {project.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                      {project.location}
                    </p>
                    <span className="text-[0.68rem] uppercase tracking-[0.18em] text-text/90 transition group-hover:text-accent">
                      View project
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <InquiryCta
        eyebrow="Need more examples?"
        title="Tell us what you're marketing and we'll send a closer fit."
        body="We can point you toward residential, waterfront, commercial, or hospitality work."
      />
    </>
  );
}
