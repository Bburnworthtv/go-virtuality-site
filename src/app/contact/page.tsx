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

const serviceOptions = [
  { value: "photography", label: "Photography" },
  { value: "drone", label: "Drone" },
  { value: "video", label: "Video" },
  { value: "virtual-staging", label: "Virtual Staging" },
  { value: "commercial", label: "Commercial" }
] as const;

const formEndpoint =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "https://formspree.io/f/your-form-id";

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
          <form
            className="grid gap-5"
            action={formEndpoint}
            method="POST"
            acceptCharset="UTF-8"
          >
            <input type="hidden" name="_subject" value="New inquiry — Go Virtuality" />
            <input type="hidden" name="_source" value="govirtuality.com /contact" />

            <div className="grid gap-5 md:grid-cols-2">
              <label htmlFor="contact-name" className="grid gap-2 text-sm">
                <span>
                  Name <span aria-hidden="true">*</span>
                </span>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="form-field"
                />
              </label>
              <label htmlFor="contact-email" className="grid gap-2 text-sm">
                <span>
                  Email <span aria-hidden="true">*</span>
                </span>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  className="form-field"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label htmlFor="contact-location" className="grid gap-2 text-sm">
                <span>Property location</span>
                <input
                  id="contact-location"
                  name="property_location"
                  type="text"
                  autoComplete="address-level2"
                  className="form-field"
                />
              </label>
              <label htmlFor="contact-service" className="grid gap-2 text-sm">
                <span>Desired service</span>
                <select
                  id="contact-service"
                  name="desired_service"
                  className="form-field"
                  defaultValue={serviceOptions[0].value}
                >
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label htmlFor="contact-details" className="grid gap-2 text-sm">
              <span>
                Project details <span aria-hidden="true">*</span>
              </span>
              <textarea
                id="contact-details"
                name="details"
                required
                rows={6}
                className="form-field"
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
