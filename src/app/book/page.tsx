import { PageIntro } from "@/components/sections/page-intro";
import { services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Book a Shoot",
  description: "Start a booking with Go Virtuality for photography, drone, video, staging, or commercial coverage.",
  path: "/book"
});

const formEndpoint =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "https://formspree.io/f/your-form-id";

export default function BookPage() {
  return (
    <>
      <PageIntro
        eyebrow="Book"
        title="Start the order with the property, timeline, and service mix."
        body="This page is built to convert quickly. Give us the essentials and we’ll follow up with the right scope, pricing confirmation, and scheduling options."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-8 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-14">
        <div className="border border-line bg-surface p-6 shadow-soft md:p-8">
          <form
            className="grid gap-5"
            action={formEndpoint}
            method="POST"
            acceptCharset="UTF-8"
          >
            <input type="hidden" name="_subject" value="New booking request — Go Virtuality" />
            <input type="hidden" name="_source" value="govirtuality.com /book" />

            <div className="grid gap-5 md:grid-cols-2">
              <label htmlFor="book-company" className="grid gap-2 text-sm">
                <span>
                  Agent or company <span aria-hidden="true">*</span>
                </span>
                <input
                  id="book-company"
                  name="company"
                  type="text"
                  required
                  autoComplete="organization"
                  className="form-field"
                />
              </label>
              <label htmlFor="book-email" className="grid gap-2 text-sm">
                <span>
                  Best email <span aria-hidden="true">*</span>
                </span>
                <input
                  id="book-email"
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
              <label htmlFor="book-address" className="grid gap-2 text-sm">
                <span>
                  Property address <span aria-hidden="true">*</span>
                </span>
                <input
                  id="book-address"
                  name="property_address"
                  type="text"
                  required
                  autoComplete="street-address"
                  className="form-field"
                />
              </label>
              <label htmlFor="book-date" className="grid gap-2 text-sm">
                <span>Preferred date</span>
                <input
                  id="book-date"
                  name="preferred_date"
                  type="date"
                  className="form-field"
                />
              </label>
            </div>

            <fieldset className="grid gap-2">
              <legend className="text-sm">Services requested</legend>
              <div className="grid gap-3 md:grid-cols-2">
                {services.map((service) => (
                  <label
                    key={service.slug}
                    htmlFor={`book-service-${service.slug}`}
                    className="flex min-h-[2.75rem] items-center gap-3 border border-line bg-background px-4 py-3 text-sm transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/60"
                  >
                    <input
                      id={`book-service-${service.slug}`}
                      name="services"
                      value={service.slug}
                      type="checkbox"
                      className="h-4 w-4 accent-accent"
                    />
                    <span>{service.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label htmlFor="book-notes" className="grid gap-2 text-sm">
              <span>Notes</span>
              <textarea
                id="book-notes"
                name="notes"
                rows={6}
                className="form-field"
                placeholder="Square footage, waterfront details, social cut needs, staging needs, or anything else useful."
              />
            </label>

            <button type="submit" className="btn-primary w-full md:w-fit">
              Submit Booking Request
            </button>
          </form>
        </div>

        <aside className="space-y-6">
          <article className="border-t border-line pt-5">
            <p className="eyebrow">What to include</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
              <li>Property type and address</li>
              <li>Target listing date</li>
              <li>Which services you likely need</li>
              <li>Any access, drone, or turnaround considerations</li>
            </ul>
          </article>
          <article className="border-t border-line pt-5">
            <p className="eyebrow">What happens next</p>
            <p className="mt-4 text-sm leading-7 text-muted">
              We review the brief, confirm scope and timing, then recommend the cleanest
              path to get the property captured and published.
            </p>
          </article>
        </aside>
      </section>
    </>
  );
}
