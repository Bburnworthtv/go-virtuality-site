import Link from "next/link";

import { InquiryCta } from "@/components/sections/inquiry-cta";
import { packages, virtualStagingPricing } from "@/content/pricing";
import { portfolioProjects } from "@/content/portfolio";
import { services } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Real Estate Media",
  description:
    "Real estate photography, drone coverage, video walkthroughs, virtual staging, and commercial imagery with a cleaner, more polished presentation.",
  path: "/"
});

const featuredServices = services.slice(0, 4);
const featuredProjects = portfolioProjects.slice(0, 3);
const featuredTestimonials = testimonials.slice(0, 2);

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80"
            alt="Luxury residence interior"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(102deg,rgba(4,6,10,0.96),rgba(4,6,10,0.78),rgba(4,6,10,0.28))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,145,24,0.22),transparent_26%),radial-gradient(circle_at_76%_18%,rgba(105,118,138,0.12),transparent_22%)]" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100svh-92px)] max-w-7xl items-end gap-10 px-5 pb-10 pt-20 md:min-h-[calc(100svh-108px)] md:px-8 md:pb-14 md:pt-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="max-w-2xl text-surface">
            <img
              src="/brand/go-virtuality-logo-v2.png"
              alt="Go Virtuality"
              className="h-24 w-auto object-contain sm:h-28 md:h-32"
            />
            <h1 className="mt-8 max-w-2xl font-display text-4xl font-medium uppercase leading-[0.94] tracking-[-0.04em] text-surface md:text-6xl">
              Listing media that looks sharp and sells the space clearly.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-surface/90 md:text-base">
              Photography, drone, video, and staging built to give every property a stronger first impression.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/book" className="btn-primary">
                Book a Shoot
              </Link>
              <Link
                href="/portfolio"
                className="btn-secondary border-surface/40 text-surface hover:border-surface hover:text-surface"
              >
                View Portfolio
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex lg:justify-end">
            <div className="dark-panel relative w-full max-w-[34rem] overflow-hidden p-10">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff9b1f] to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,145,24,0.16),transparent_30%)]" />
              <img
                src="/brand/go-virtuality-logo-v2.png"
                alt="Go Virtuality logo"
                className="mx-auto h-auto w-full max-w-[28rem] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-6 md:grid-cols-3 md:px-8 md:py-8">
        {[
          "Residential photography",
          "FAA-certified drone",
          "Video, staging, commercial"
        ].map((item) => (
          <div
            key={item}
            className="border-b border-line pb-3 text-[0.72rem] uppercase tracking-[0.2em] text-text/88 md:border-b-0"
          >
            {item}
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.82fr_1.18fr] md:px-8 md:py-20">
        <div>
          <p className="eyebrow">Services</p>
          <h2 className="display-title mt-3 max-w-sm text-3xl leading-tight md:text-4xl">
            Built for listings that need a stronger presence.
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {featuredServices.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group border-b border-line pb-8"
            >
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#ffad27]">
                {service.shortName}
              </p>
              <h3 className="mt-3 font-display text-xl font-medium uppercase tracking-[0.02em] text-text transition group-hover:text-accent md:text-2xl">
                {service.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">{service.summary}</p>
              <p className="mt-4 text-[0.68rem] uppercase tracking-[0.18em] text-text/86">
                {service.priceNote}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Featured Work</p>
              <h2 className="display-title mt-3 max-w-xl text-3xl leading-tight md:text-4xl">
                Work that holds the same black and orange energy as the brand.
              </h2>
            </div>
            <Link href="/portfolio" className="btn-secondary">
              Full Portfolio
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
            {featuredProjects.map((project, index) => (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className={`group ${index === 0 ? "lg:row-span-2" : ""}`}
              >
                <div className="image-frame h-full min-h-[16rem] md:min-h-[18rem]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="image-scrim" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-surface">
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-surface/88">
                      {project.category}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-medium uppercase tracking-[0.01em] md:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-[0.8rem] text-surface/90">{project.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-20">
        <div className="space-y-5">
          <p className="eyebrow">Pricing</p>
          <h2 className="display-title text-3xl leading-tight md:text-4xl">
            Clear pricing. No overexplaining.
          </h2>
          <p className="shell-copy max-w-md">
            Start with the package that fits the listing, then add drone, video, or staging if needed.
          </p>
          <div className="space-y-3 text-sm leading-6 text-text/84">
            {virtualStagingPricing.map((item) => (
              <div key={item.label} className="flex justify-between border-b border-line pb-3">
                <span>{item.label}</span>
                <span className="font-display text-xl font-medium uppercase text-accent">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {packages.map((pkg) => (
            <div key={pkg.name} className="page-panel px-5 py-5">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-accent">
                {pkg.name}
              </p>
              <p className="mt-3 font-display text-3xl font-medium uppercase tracking-[0.01em]">
                {pkg.price}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">{pkg.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#070707] text-surface">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-18">
          <div>
            <p className="eyebrow !text-surface/70">FAA certified</p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-medium uppercase leading-tight tracking-[-0.03em] md:text-4xl">
              Drone coverage that stays useful.
            </h2>
          </div>
            <div className="space-y-4 text-sm leading-6 text-surface/88">
            <p>
              Waterfront, acreage, access, and neighborhood context all read better from the air when the coverage stays simple.
            </p>
            <Link
              href="/services/aerial-drone"
              className="btn-secondary border-surface/30 text-surface hover:border-surface hover:text-surface"
            >
              View Drone Service
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[0.78fr_1.22fr] md:px-8 md:py-20">
        <div>
          <p className="eyebrow">Process</p>
          <h2 className="display-title mt-3 text-3xl leading-tight md:text-4xl">
            Simple from booking to delivery.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["01", "Plan", "We confirm scope, timing, and what matters most before the shoot."],
            ["02", "Shoot", "The property is captured with a clean, consistent approach."],
            ["03", "Deliver", "Files arrive ready for MLS, web, and marketing use."]
          ].map(([step, title, body]) => (
            <div key={step} className="border-t border-line pt-5">
              <p className="font-display text-2xl font-medium uppercase text-accent">{step}</p>
              <h3 className="mt-3 font-display text-xl font-medium uppercase tracking-[0.02em]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Client Notes</p>
              <h2 className="display-title mt-3 max-w-xl text-3xl leading-tight md:text-4xl">
                Feedback from agents and marketing teams.
              </h2>
            </div>
            <Link href="/testimonials" className="btn-secondary">
              All Testimonials
            </Link>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {featuredTestimonials.map((testimonial) => (
              <blockquote key={testimonial.name} className="border-l border-accent pl-6">
                <p className="font-display text-xl font-medium leading-8 tracking-[-0.02em] text-text md:text-2xl">
                  "{testimonial.quote}"
                </p>
                <footer className="mt-4 text-[0.72rem] uppercase tracking-[0.18em] text-muted">
                  {testimonial.name} · {testimonial.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <InquiryCta
        eyebrow="Book"
        title="If the listing needs a cleaner presentation, let's talk."
        body="Send the property, timeline, and service needs. We'll recommend the right scope without padding it."
        primaryHref="/book"
        primaryLabel="Start Your Order"
        secondaryHref="/pricing"
        secondaryLabel="View Pricing"
      />
    </>
  );
}
