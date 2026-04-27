import { InquiryCta } from "@/components/sections/inquiry-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Process",
  description:
    "See how Go Virtuality handles booking, preparation, capture, editing, and delivery for premium real estate media.",
  path: "/process"
});

const steps = [
  {
    number: "01",
    title: "Book and align",
    body:
      "We confirm the property, timeline, service mix, and any standout selling points before the date is set."
  },
  {
    number: "02",
    title: "Prepare the property",
    body:
      "You receive simple prep guidance so the space photographs cleanly and the strongest rooms are ready when we arrive."
  },
  {
    number: "03",
    title: "Capture with intent",
    body:
      "We work the listing in a deliberate sequence to make the final gallery read naturally from exterior to interior to detail."
  },
  {
    number: "04",
    title: "Refine and deliver",
    body:
      "Editing is completed with web, MLS, and marketing uses in mind so the assets arrive ready to publish."
  }
] as const;

export default function ProcessPage() {
  return (
    <>
      <PageIntro
        eyebrow="Process"
        title="A premium result starts with a simple, well-run process."
        body="From scheduling to delivery, every stage is designed to remove friction while protecting the quality of the final visuals."
        aside="Whether the assignment is a single listing or a broader commercial scope, the goal is the same: clarity, momentum, and polished deliverables."
      />

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-14">
        <div className="grid gap-8 md:grid-cols-2">
          {steps.map((step) => (
            <article key={step.number} className="border-t border-line pt-5">
              <p className="font-display text-4xl text-accent">{step.number}</p>
              <h2 className="mt-4 font-display text-3xl tracking-editorial">
                {step.title}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <InquiryCta
        eyebrow="Ready when you are"
        title="Tell us the property, timeline, and deliverables. We’ll take it from there."
        body="The fastest path to a smooth shoot is a clear brief. Start with the booking page and we’ll confirm the rest."
      />
    </>
  );
}
