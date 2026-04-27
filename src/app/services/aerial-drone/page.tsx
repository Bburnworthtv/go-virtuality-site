import { PageIntro } from "@/components/sections/page-intro";
import { ServiceStory } from "@/components/sections/service-story";
import { serviceBySlug } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

const service = serviceBySlug["aerial-drone"];

export const metadata = buildMetadata({
  title: service.name,
  description: service.summary,
  path: "/services/aerial-drone"
});

export default function AerialDronePage() {
  return (
    <>
      <PageIntro
        eyebrow="Aerial Coverage"
        title={service.heroTitle}
        body={service.heroBody}
        aside="Especially useful for waterfront, estate, agricultural, development, and context-heavy listings where land and proximity matter as much as interiors."
      />
      <ServiceStory service={service} />
    </>
  );
}
