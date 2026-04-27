export const site = {
  name: "Go Virtuality",
  shortName: "GV",
  url: "https://govirtuality.com",
  phone: "(239) 555-0147",
  email: "hello@govirtuality.com",
  serviceArea: "Southwest Florida and nearby Gulf Coast communities",
  ctaLabel: "Book a Shoot"
} as const;

export const primaryNav = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
] as const;
