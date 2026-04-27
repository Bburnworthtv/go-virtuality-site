import Link from "next/link";

type InquiryCtaProps = {
  eyebrow: string;
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function InquiryCta({
  eyebrow,
  title,
  body,
  primaryHref = "/book",
  primaryLabel = "Book a Shoot",
  secondaryHref = "/contact",
  secondaryLabel = "Request Pricing"
}: InquiryCtaProps) {
  return (
    <section className="px-5 py-14 md:px-8 md:py-20">
      <div className="page-panel mx-auto max-w-7xl overflow-hidden px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-6 md:grid-cols-[1.25fr_0.75fr] md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="display-title mt-3 text-3xl leading-tight md:text-4xl">
              {title}
            </h2>
            <p className="shell-copy mt-3 max-w-lg">{body}</p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end md:justify-end">
            <Link href={primaryHref} className="btn-primary w-full text-center md:w-auto">
              {primaryLabel}
            </Link>
            <Link href={secondaryHref} className="btn-secondary w-full text-center md:w-auto">
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
