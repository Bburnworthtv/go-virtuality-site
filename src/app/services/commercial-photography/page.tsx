import { PageIntro } from "@/components/sections/page-intro";
import { ServiceStory } from "@/components/sections/service-story";
import { serviceBySlug } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

const service = serviceBySlug["commercial-photography"];

export const metadata = buildMetadata({
  title: service.name,
  description: service.summary,
  path: "/services/commercial-photography"
});

export default function CommercialPhotographyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Commercial Photography"
        title={service.heroTitle}
        body={service.heroBody}
        aside="For retail, hospitality, multifamily, architecture, and branded property visuals that need operational clarity alongside atmosphere."
      />
      <ServiceStory service={service} />
    </>
  );
}
