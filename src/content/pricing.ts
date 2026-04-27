export const packages = [
  {
    name: "Bronze",
    price: "$299",
    description: "A clean starting point for smaller listings or quick launches.",
    includes: [
      "Core interior and exterior photography",
      "MLS and web-ready delivery",
      "Best-fit edit for smaller listings"
    ]
  },
  {
    name: "Silver",
    price: "$399",
    description: "More coverage for listings that need a stronger presentation.",
    includes: [
      "Expanded room coverage",
      "Detail and curb appeal emphasis",
      "A stronger marketing set"
    ]
  },
  {
    name: "Gold",
    price: "$499",
    description: "Full listing coverage for homes where presentation matters most.",
    includes: [
      "Comprehensive photo coverage",
      "Higher-touch finishing",
      "Built for premium launches"
    ]
  }
] as const;

export const virtualStagingPricing = [
  { label: "4 virtually staged images", value: "$99" },
  { label: "3 additional staged images", value: "$50" }
] as const;

export const addOns = [
  "FAA-certified drone stills and clips",
  "Video walkthroughs and social cuts",
  "Twilight-style edits",
  "Commercial usage expansion",
  "Rush delivery when available"
] as const;

export const pricingFaq = [
  {
    question: "Do I need to choose a package first?",
    answer:
      "No. The packages are starting points. We can recommend the right fit once we know the property and timeline."
  },
  {
    question: "Can drone and video be added?",
    answer:
      "Yes. Those can be added to any package or quoted separately if the listing needs a custom scope."
  },
  {
    question: "How is commercial work priced?",
    answer:
      "Commercial work is quoted by scope, access, and usage rather than by residential package."
  }
] as const;
