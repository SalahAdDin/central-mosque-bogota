import preview from "@storybook/preview";

import MediaHighlightCard from "./MediaHighlightCard.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Media/MediaHighlightCard",
  component: MediaHighlightCard as unknown,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    title: "La importancia de leer el Sagrado Corán",
    href: "/media/podcast-1",
    imageUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Podcast cover",
    ctaLabel: "Escuchar ahora",
  },
});

export const Default = meta.story({});

export const LongTitle = meta.story({
  args: {
    title:
      "La importancia de la recitación, reflexión y estudio constante del Sagrado Corán en la vida cotidiana",
  },
});
