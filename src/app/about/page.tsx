import { InquiryCta } from "@/components/sections/inquiry-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn about Go Virtuality's visual philosophy, quality standard, and FAA-certified approach to real estate media.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About"
        title="Go Virtuality exists for listings that deserve more than a fast template shoot."
        body="We approach real estate media with an editorial eye, a calm production process, and a bias toward imagery that feels premium without becoming artificial."
        aside="That means better pacing, better tonal control, stronger architectural respect, and a smoother client experience from first inquiry through delivery."
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-8 md:grid-cols-[1fr_1fr] md:px-8 md:py-14">
        <div className="page-panel p-4 md:p-5">
          <div className="image-frame min-h-[30rem]">
          <img
            src="https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1400&q=80"
            alt="Refined living room"
            className="h-full w-full object-cover"
          />
            <div className="image-scrim opacity-55" />
          </div>
        </div>
        <div className="page-panel space-y-8 p-6 md:p-8">
          <div>
            <p className="eyebrow">Philosophy</p>
            <p className="mt-4 text-base leading-8 text-muted">
              The best property media feels composed, not crowded. We favor
              restrained styling, clean geometry, natural contrast, and a gallery flow
              that helps buyers understand a space quickly.
            </p>
          </div>
          <div>
            <p className="eyebrow">Quality Standard</p>
            <p className="mt-4 text-base leading-8 text-muted">
              We protect verticals, color, room proportion, and atmosphere. Editing
              is meant to elevate the property rather than leave visible fingerprints.
            </p>
          </div>
          <div>
            <p className="eyebrow">FAA Trust Signal</p>
            <p className="mt-4 text-base leading-8 text-muted">
              Drone operations are handled with certification-first discipline. Safety,
              legal compliance, and suitability of conditions are part of the service,
              not an afterthought.
            </p>
          </div>
        </div>
      </section>

      <InquiryCta
        eyebrow="Work together"
        title="If the visual standard matters, the process should too."
        body="We keep communication clear, prep simple, and delivery aligned to the way agents and marketing teams actually work."
      />
    </>
  );
}
