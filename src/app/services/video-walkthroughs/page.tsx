import { PageIntro } from "@/components/sections/page-intro";
import { ServiceStory } from "@/components/sections/service-story";
import { serviceBySlug } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

const service = serviceBySlug["video-walkthroughs"];

export const metadata = buildMetadata({
  title: service.name,
  description: service.summary,
  path: "/services/video-walkthroughs"
});

export default function VideoWalkthroughsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Video Walkthroughs"
        title={service.heroTitle}
        body={service.heroBody}
        aside="Designed for websites, listing presentations, social campaigns, and agents who want movement without the overproduced reel look."
      />
      <ServiceStory service={service} />
    </>
  );
}
