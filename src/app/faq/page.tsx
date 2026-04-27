import { InquiryCta } from "@/components/sections/inquiry-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { faqItems } from "@/content/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Operational questions about Go Virtuality's booking, turnaround, service area, and production process.",
  path: "/faq"
});

export default function FaqPage() {
  return (
    <>
      <PageIntro
        eyebrow="FAQ"
        title="Operational answers for booking, timing, delivery, and coverage."
        body="This page stays focused on practical questions so it remains genuinely useful instead of repeating the sales copy."
      />

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-14">
        <div className="space-y-6">
          {faqItems.map((item) => (
            <article key={item.question} className="border-b border-line pb-6">
              <h2 className="font-display text-3xl tracking-editorial">{item.question}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <InquiryCta
        eyebrow="Still have questions?"
        title="Reach out with the property details and we’ll answer what matters for your shoot."
        body="The fastest answers usually come once we know the listing type, location, timeline, and services you're considering."
      />
    </>
  );
}
