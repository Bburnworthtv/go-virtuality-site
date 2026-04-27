import { InquiryCta } from "@/components/sections/inquiry-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { addOns, packages, pricingFaq, virtualStagingPricing } from "@/content/pricing";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Reference pricing for real estate media packages, virtual staging, and add-ons from Go Virtuality.",
  path: "/pricing"
});

export default function PricingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Pricing"
        title="Clear package anchors, clean add-ons, and no mystery around where to start."
        body="Residential package pricing stays visible here. Commercial, hospitality, multifamily, and custom motion scopes are quoted to fit the actual assignment."
        aside="Use pricing as a reference, then book once we confirm the property, timeline, and any aerial, video, or staging needs."
      />

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {packages.map((pkg) => (
            <article key={pkg.name} className="page-panel px-5 py-6 md:px-6 md:py-8">
              <p className="text-xs uppercase tracking-[0.28em] text-accent">{pkg.name}</p>
              <h2 className="mt-4 font-display text-4xl tracking-editorial md:text-5xl">{pkg.price}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{pkg.description}</p>
              <ul className="mt-8 space-y-4 text-sm leading-7 text-text/84">
                {pkg.includes.map((item) => (
                  <li key={item} className="border-b border-line pb-4">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="page-band mt-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[0.8fr_1.2fr] md:gap-10 md:px-8 md:py-20">
          <div>
            <p className="eyebrow">Virtual Staging</p>
            <h2 className="mt-4 font-display text-[2rem] leading-tight tracking-editorial md:text-5xl">
              Fast, believable staging for vacant spaces that need instant warmth.
            </h2>
          </div>
          <div className="space-y-4">
            {virtualStagingPricing.map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b border-line py-4 text-sm md:text-base">
                <span className="text-text/84">{item.label}</span>
                <span className="font-display text-3xl tracking-editorial text-accent">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-band">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:px-8 md:py-20">
          <div>
            <p className="eyebrow">Add-ons</p>
            <h2 className="mt-4 font-display text-[2rem] leading-tight tracking-editorial md:text-5xl">
              Build the scope around the property instead of forcing every listing into the same package.
            </h2>
          </div>
          <ul className="grid gap-4 md:grid-cols-2">
            {addOns.map((item) => (
              <li key={item} className="border-b border-line pb-4 text-sm leading-7 text-muted">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-4 font-display text-[2rem] leading-tight tracking-editorial md:text-5xl">
              The pricing questions that matter before you book.
            </h2>
          </div>
          <div className="space-y-6">
            {pricingFaq.map((item) => (
              <article key={item.question} className="border-b border-line pb-6">
                <h3 className="font-display text-2xl tracking-editorial">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <InquiryCta
        eyebrow="Ready to book?"
        title="Let’s match the right scope to the property instead of overselling the package."
        body="Share the address, timeline, and any likely add-ons. We'll confirm the best package or build a custom quote."
        primaryHref="/book"
        primaryLabel="Book a Shoot"
        secondaryHref="/contact"
        secondaryLabel="Request Pricing"
      />
    </>
  );
}
