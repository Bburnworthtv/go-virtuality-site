import { PageIntro } from "@/components/sections/page-intro";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Go Virtuality privacy policy.",
  path: "/legal/privacy"
});

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Privacy policy"
        body="We collect only the contact and project information required to respond to inquiries, schedule services, and deliver requested media."
      />
      <section className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-14">
        <div className="space-y-6 text-sm leading-8 text-muted">
          <p>
            Inquiry and booking details are used strictly for client communication,
            production planning, delivery, and service improvement.
          </p>
          <p>
            We do not sell client information. Project data may be retained as part of
            ongoing business records, asset delivery history, and service support.
          </p>
          <p>
            Questions about data handling can be directed through the contact page.
          </p>
        </div>
      </section>
    </>
  );
}
