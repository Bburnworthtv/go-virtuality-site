import { InquiryCta } from "@/components/sections/inquiry-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { testimonials } from "@/content/testimonials";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Testimonials",
  description: "Read what clients say about working with Go Virtuality.",
  path: "/testimonials"
});

export default function TestimonialsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Testimonials"
        title="Clients remember the calm process and the elevated result."
        body="These notes reflect what matters most in this category: trust, speed, taste, and deliverables that immediately improve how a property is perceived."
      />

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-14">
        <div className="grid gap-10 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.name} className="border-l border-accent pl-6">
              <p className="font-display text-3xl leading-10 tracking-editorial">
                “{testimonial.quote}”
              </p>
              <footer className="mt-5 text-sm uppercase tracking-[0.18em] text-muted">
                {testimonial.name} · {testimonial.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <InquiryCta
        eyebrow="Work together"
        title="A stronger first impression starts with the right visual partner."
        body="If you care about taste, clarity, and a smoother client experience, we’d love to hear about the property."
      />
    </>
  );
}
