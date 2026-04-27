import { PageIntro } from "@/components/sections/page-intro";
import { ServiceStory } from "@/components/sections/service-story";
import { serviceBySlug } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

const service = serviceBySlug["real-estate-photography"];

export const metadata = buildMetadata({
  title: service.name,
  description: service.summary,
  path: "/services/real-estate-photography"
});

export default function RealEstatePhotographyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Residential Photography"
        title={service.heroTitle}
        body={service.heroBody}
        aside="Built for listings that need bright, believable imagery and a gallery that knows how to pace a showing before it happens."
      />
      <ServiceStory service={service} />
    </>
  );
}
