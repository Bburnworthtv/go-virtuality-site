export type Service = {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  heroTitle: string;
  heroBody: string;
  priceNote: string;
  image: string;
  accent: string;
  deliverables: string[];
  audience: string[];
  process: string[];
  differentiators: string[];
};

export const services: Service[] = [
  {
    slug: "real-estate-photography",
    name: "Real Estate Photography",
    shortName: "Residential",
    summary:
      "Clean listing photography for homes that need bright, balanced images and a polished first look.",
    heroTitle: "Listing photography with clean lines and steady color.",
    heroBody:
      "We shoot homes with a simple goal: make the space read clearly, feel inviting, and look ready to list.",
    priceNote: "Available inside Bronze, Silver, and Gold listing packages.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    accent: "Balanced interior light",
    deliverables: [
      "MLS-sized and high-resolution web exports",
      "Interior, exterior, and detail coverage",
      "Optional dusk and amenity frames"
    ],
    audience: [
      "Residential agents",
      "Brokerage marketing teams",
      "Builders and leasing teams"
    ],
    process: [
      "Pre-shoot preparation guidance",
      "On-site composition planning",
      "Retouching and final delivery"
    ],
    differentiators: [
      "Straight lines and natural color",
      "Room-to-room flow that reads clearly",
      "Coverage built around the strongest angles"
    ]
  },
  {
    slug: "aerial-drone",
    name: "Aerial Drone",
    shortName: "Drone",
    summary:
      "FAA-certified aerial coverage for property lines, setting, water access, and neighborhood context.",
    heroTitle: "Aerial coverage that adds context without overdoing it.",
    heroBody:
      "Drone work should clarify the property, not distract from it. We keep the coverage clean, controlled, and useful.",
    priceNote: "Add drone coverage to any listing package or request a dedicated aerial shoot.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    accent: "Clear site context",
    deliverables: [
      "FAA-certified drone stills",
      "Short aerial video clips",
      "Neighborhood and approach coverage"
    ],
    audience: [
      "Waterfront listings",
      "Large parcels and estates",
      "Developments and commercial properties"
    ],
    process: [
      "Airspace and weather review",
      "Flight planning and compliance checks",
      "Selective edit focused on context"
    ],
    differentiators: [
      "FAA-certified operation",
      "Useful angles over flashy moves",
      "Coverage that explains the setting fast"
    ]
  },
  {
    slug: "video-walkthroughs",
    name: "Video Walkthroughs",
    shortName: "Video",
    summary:
      "Short property films and walkthroughs cut for web, social, and listing pages.",
    heroTitle: "Property video with a steadier pace and cleaner finish.",
    heroBody:
      "The edit is built to show flow, light, and layout quickly, without the usual rushed reel style.",
    priceNote: "Custom-quoted based on run time, orientation, and platform mix.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    accent: "Measured walkthrough pacing",
    deliverables: [
      "Branded horizontal walkthroughs",
      "Vertical social cuts",
      "Simple titles and licensed music"
    ],
    audience: [
      "Luxury listings",
      "Developers",
      "Agents running social campaigns"
    ],
    process: [
      "Route mapping for camera movement",
      "On-site capture with stills coordination",
      "Edit delivery in web and social formats"
    ],
    differentiators: [
      "Clean movement and simpler cuts",
      "A clearer sense of layout",
      "Exports ready for web and social"
    ]
  },
  {
    slug: "virtual-staging",
    name: "Virtual Staging",
    shortName: "Staging",
    summary:
      "Virtual staging that adds warmth and scale without looking fake or overdone.",
    heroTitle: "Virtual staging that feels believable at first glance.",
    heroBody:
      "We keep the room itself in focus and use staging to help buyers understand how the space can live.",
    priceNote: "Starts at $99 for 4 staged images, with 3 additional images for $50.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    accent: "Believable before and after",
    deliverables: [
      "4 virtually staged images for $99",
      "3 additional staged images for $50",
      "Clean export sets for MLS and marketing"
    ],
    audience: [
      "Vacant listings",
      "Investors and flippers",
      "Agents needing a fast lift"
    ],
    process: [
      "Angle review and staging plan",
      "Furniture direction matched to buyer type",
      "Turnaround built for active listings"
    ],
    differentiators: [
      "Natural styling choices",
      "Better sense of scale",
      "Fast turnaround for active listings"
    ]
  },
  {
    slug: "commercial-photography",
    name: "Commercial Photography",
    shortName: "Commercial",
    summary:
      "Commercial photography for retail, hospitality, multifamily, and branded property work.",
    heroTitle: "Commercial imagery that stays clear, clean, and usable.",
    heroBody:
      "From leasing to hospitality, the goal is simple: strong images that show the space well and hold up across marketing use.",
    priceNote: "Quoted per scope, access, and usage needs.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
    accent: "Clean architectural coverage",
    deliverables: [
      "Exterior and interior coverage",
      "Amenity and detail imagery",
      "Files sized for web, leasing, and print"
    ],
    audience: [
      "Hospitality brands",
      "Developers and leasing teams",
      "Retail and mixed-use operators"
    ],
    process: [
      "Scope planning around intended use",
      "Production timing around operations",
      "Delivery formatted for marketing needs"
    ],
    differentiators: [
      "Straightforward production",
      "Clear images with atmosphere",
      "Flexible scope by property and use"
    ]
  }
];

export const serviceBySlug = Object.fromEntries(
  services.map((service) => [service.slug, service])
) as Record<string, Service>;
