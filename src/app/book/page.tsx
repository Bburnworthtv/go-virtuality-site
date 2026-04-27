import { PageIntro } from "@/components/sections/page-intro";
import { services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Book a Shoot",
  description: "Start a booking with Go Virtuality for photography, drone, video, staging, or commercial coverage.",
  path: "/book"
});

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
          <form className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span>Agent or company</span>
                <input className="border border-line bg-background px-4 py-3 outline-none" />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Best email</span>
                <input className="border border-line bg-background px-4 py-3 outline-none" />
              </label>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span>Property address</span>
                <input className="border border-line bg-background px-4 py-3 outline-none" />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Preferred date</span>
                <input type="date" className="border border-line bg-background px-4 py-3 outline-none" />
              </label>
            </div>
            <label className="grid gap-2 text-sm">
              <span>Services requested</span>
              <div className="grid gap-3 md:grid-cols-2">
                {services.map((service) => (
                  <label
                    key={service.slug}
                    className="flex items-center gap-3 border border-line bg-background px-4 py-3 text-sm"
                  >
                    <input type="checkbox" />
                    <span>{service.name}</span>
                  </label>
                ))}
              </div>
            </label>
            <label className="grid gap-2 text-sm">
              <span>Notes</span>
              <textarea
                rows={6}
                className="border border-line bg-background px-4 py-3 outline-none"
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
