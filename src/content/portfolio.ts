export type PortfolioProject = {
  slug: string;
  title: string;
  location: string;
  category: string;
  image: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "coastal-modern-estate",
    title: "Coastal Modern Estate",
    location: "Naples, Florida",
    category: "Residential Photography",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Waterfront home photographed to feel bright, calm, and easy to read.",
    challenge:
      "The house had strong architecture but needed softer pacing and cleaner tonal balance.",
    solution:
      "We kept the frames simple, opened with the strongest wide views, and used details sparingly.",
    results: [
      "A clear opening image set",
      "MLS-ready and marketing selects",
      "A calm, spacious overall feel"
    ]
  },
  {
    slug: "skyline-residences-virtual-tour",
    title: "Skyline Residences Tour",
    location: "Naples, Florida",
    category: "Virtual Tours",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Interactive listing tour built to give buyers a clean room-to-room sense of the home before showings.",
    challenge:
      "The property needed a guided digital experience that felt polished without overwhelming the viewer.",
    solution:
      "We mapped the tour around the strongest transitions, used calm starting views, and kept navigation simple.",
    results: [
      "A cleaner online walk-through",
      "Longer time spent with the listing",
      "Useful companion asset for agents and out-of-town buyers"
    ]
  },
  {
    slug: "gulf-view-penthouse",
    title: "Gulf View Penthouse",
    location: "Bonita Springs, Florida",
    category: "Video Walkthroughs",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    summary:
      "A video and stills package built around flow, light, and the water view.",
    challenge:
      "The view was strong, but the motion needed to feel controlled instead of rushed.",
    solution:
      "We mapped the route around slow reveals and let the view do most of the work.",
    results: [
      "A cleaner walkthrough edit",
      "Vertical social cuts",
      "Still and motion sets that matched"
    ]
  },
  {
    slug: "bayfront-townhome-3d-tour",
    title: "Bayfront Townhome 3D Tour",
    location: "Bonita Springs, Florida",
    category: "Virtual Tours",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=80",
    summary:
      "A guided 3D tour paired with stills to help remote buyers understand layout, light, and scale.",
    challenge:
      "The home showed well in person, but needed a digital presentation that clarified flow and room proportion.",
    solution:
      "We combined steady capture points with a simple navigation structure and supporting still imagery.",
    results: [
      "Better layout comprehension online",
      "A stronger remote-viewing experience",
      "A tour that fit cleanly into the listing workflow"
    ]
  },
  {
    slug: "harbor-retail-collection",
    title: "Harbor Retail Collection",
    location: "Fort Myers, Florida",
    category: "Commercial Photography",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    summary:
      "A mixed-use retail property photographed for leasing and marketing.",
    challenge:
      "The site needed coverage that showed traffic flow, storefronts, and overall identity.",
    solution:
      "We combined broad site views with a small set of detail frames to keep the presentation focused.",
    results: [
      "Leasing-ready image sets",
      "Stronger sense of place",
      "Flexible web and print use"
    ]
  }
];

export const portfolioBySlug = Object.fromEntries(
  portfolioProjects.map((project) => [project.slug, project])
) as Record<string, PortfolioProject>;
