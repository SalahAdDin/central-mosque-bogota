import preview from "@storybook/preview";

import MediaHighlightsSection from "./MediaHighlightsSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Media/MediaHighlightsSection",
  component: MediaHighlightsSection as unknown,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    title: "Podcast & Reflexiones",
    description: "Reflexiones, charlas y recursos para fortalecer tu fe.",
    mediaHref: "/media",
    ctaLabel: "Ver todo",
    cardCtaLabel: "Escuchar ahora",
    highlights: [
      {
        title: "La Virtud de Buscar el Conocimiento",
        href: "/media/podcast-3",
        imageUrl:
          "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Podcast cover",
      },
      {
        title: "El Valor de las 5 Oraciones Diarias",
        href: "/media/podcast-2",
        imageUrl: "https://picsum.photos/id/1062/1200/800",
        imageAlt: "Podcast 2 cover",
      },
      {
        title: "Ramadán: Intenciones y Consistencia",
        href: "/media/podcast-4",
        imageUrl: "https://picsum.photos/id/1067/1200/800",
        imageAlt: "Podcast 3 cover",
      },
    ],
  },
});

export const Default = meta.story({});

export const Empty = meta.story({
  args: {
    highlights: [],
  },
});
