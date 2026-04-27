import { PageIntro } from "@/components/sections/page-intro";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "Go Virtuality terms of service.",
  path: "/legal/terms"
});

export default function TermsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Terms of service"
        body="Project scopes, scheduling, deliverables, and usage are confirmed during booking. These terms summarize the basic working relationship."
      />
      <section className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-14">
        <div className="space-y-6 text-sm leading-8 text-muted">
          <p>
            Booking dates are subject to availability, property readiness, weather, and
            safe operating conditions for any aerial work.
          </p>
          <p>
            Final deliverables, revision allowances, and usage expectations are defined
            at the time of scope confirmation.
          </p>
          <p>
            By scheduling services, clients confirm they have authority to request media
            coverage for the property or project.
          </p>
        </div>
      </section>
    </>
  );
}
