import { PageIntro } from "@/components/sections/page-intro";
import { ServiceStory } from "@/components/sections/service-story";
import { serviceBySlug } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

const service = serviceBySlug["virtual-staging"];

export const metadata = buildMetadata({
  title: service.name,
  description: service.summary,
  path: "/services/virtual-staging"
});

export default function VirtualStagingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Virtual Staging"
        title={service.heroTitle}
        body={service.heroBody}
        aside="Turnaround is built to support active listings, and the visual direction stays warm and believable rather than trying to overpower the room."
      />
      <ServiceStory service={service} />
    </>
  );
}
