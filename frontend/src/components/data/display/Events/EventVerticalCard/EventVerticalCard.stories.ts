import preview from "@storybook/preview";

import EventVerticalCard from "./EventVerticalCard.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Events/EventVerticalCard",
  component: EventVerticalCard as unknown,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    category: "Educación",
    title: "Clase de Tajwīd",
    description: "Reglas de recitación del Corán para todos los niveles.",
    schedule: "Sábados · 10:00",
    url: "/events/clase-tajwid",
    image: "https://picsum.photos/id/1073/1200/800",
    date: { month: "Nov", day: 2 },
  },
});

export const Default = meta.story({});

export const LongTitle = meta.story({
  args: {
    title:
      "Charla: Introducción al Islam y preguntas frecuentes para nuevos visitantes",
  },
});
