import { InquiryCta } from "@/components/sections/inquiry-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { areaGroups } from "@/content/service-area";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Service Area",
  description: "See the primary and extended service areas covered by Go Virtuality.",
  path: "/service-area"
});

export default function ServiceAreaPage() {
  return (
    <>
      <PageIntro
        eyebrow="Service Area"
        title="Based in Southwest Florida, available across the surrounding Gulf Coast market."
        body="Most bookings center on our primary service region, with additional travel available for extended scopes, higher-value listings, and commercial assignments."
      />

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-14">
        <div className="grid gap-10 md:grid-cols-2">
          {areaGroups.map((group) => (
            <article key={group.region} className="border-t border-line pt-5">
              <p className="eyebrow">{group.region}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">
                {group.areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <InquiryCta
        eyebrow="Outside core coverage?"
        title="Send the location and we’ll confirm travel and scope."
        body="Extended coverage is available by request, especially for commercial, waterfront, and premium listing assignments."
      />
    </>
  );
}
