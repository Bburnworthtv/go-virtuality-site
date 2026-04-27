import Link from "next/link";

import type { Service } from "@/content/services";

export function ServiceStory({ service }: { service: Service }) {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-14">
        <div className="page-panel p-4 md:p-5">
          <div className="relative min-h-[28rem] overflow-hidden">
            <img
              src={service.image}
              alt={service.name}
              className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
            />
            <div className="image-scrim" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-surface">
              <p className="eyebrow !text-surface/90">{service.accent}</p>
              <p className="mt-3 max-w-md text-sm leading-7 text-surface/94">
                {service.priceNote}
              </p>
            </div>
          </div>
        </div>
        <div className="page-panel space-y-10 p-6 md:p-8">
          <div>
            <p className="eyebrow">Why it works</p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-muted">
              {service.differentiators.map((item) => (
                <li key={item} className="border-b border-line pb-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="eyebrow">Deliverables</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-text/85">
                {service.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow">Best fit</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-text/85">
                {service.audience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p className="eyebrow">Process</p>
            <ol className="mt-4 space-y-4 text-sm leading-7 text-muted">
              {service.process.map((item, index) => (
                <li key={item} className="flex gap-4 border-b border-line pb-4">
                  <span className="font-display text-xl text-accent">
                    0{index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/book" className="btn-primary">
              Start Your Order
            </Link>
            <Link href="/pricing" className="btn-secondary">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
