import { PageIntro } from "@/components/sections/page-intro";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact Go Virtuality for photography, drone, video, staging, and commercial real estate media inquiries.",
  path: "/contact"
});

const inquiryTopics = [
  "Residential listing photography",
  "Drone stills or aerial video",
  "Video walkthroughs",
  "Virtual staging",
  "Commercial photography"
] as const;

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Tell us what you’re marketing and when you need it."
        body="Whether you already know the scope or just need a recommendation, we’ll help you shape the right mix of services for the property."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-8 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-14">
        <div className="space-y-6">
          <article className="border-t border-line pt-5">
            <p className="eyebrow">Direct</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
              <p>{site.serviceArea}</p>
              <a href={`tel:${site.phone}`} className="block text-lg text-text hover:text-accent">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="block text-lg text-text hover:text-accent">
                {site.email}
              </a>
            </div>
          </article>
          <article className="border-t border-line pt-5">
            <p className="eyebrow">Common inquiries</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
              {inquiryTopics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className="border border-line bg-surface p-6 shadow-soft md:p-8">
          <form className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span>Name</span>
                <input className="border border-line bg-background px-4 py-3 outline-none" />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Email</span>
                <input className="border border-line bg-background px-4 py-3 outline-none" />
              </label>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span>Property location</span>
                <input className="border border-line bg-background px-4 py-3 outline-none" />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Desired service</span>
                <select className="border border-line bg-background px-4 py-3 outline-none">
                  <option>Photography</option>
                  <option>Drone</option>
                  <option>Video</option>
                  <option>Virtual Staging</option>
                  <option>Commercial</option>
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-sm">
              <span>Project details</span>
              <textarea
                rows={6}
                className="border border-line bg-background px-4 py-3 outline-none"
                placeholder="Property type, timeline, package idea, add-ons, or anything else we should know."
              />
            </label>
            <button type="submit" className="btn-primary w-full md:w-fit">
              Send Inquiry
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
