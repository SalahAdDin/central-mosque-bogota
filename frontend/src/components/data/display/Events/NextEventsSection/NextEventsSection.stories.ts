import preview from "@storybook/preview";

import NextEventsSection from "./NextEventsSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Events/NextEventsSection",
  component: NextEventsSection as unknown,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    title: "Próximos Eventos",
    description: "Únete a nuestras actividades comunitarias",
    ctaLabel: "Ver calendario completo",
    calendarHref: "/events",
    events: [
      {
        category: "Comunidad",
        title: "Cena Comunitaria",
        description: "Un espacio para compartir alimentos.",
        schedule: "19:30 - 21:30",
        location: "Mezquita Central de Bogotá",
        url: "/events/cena-comunitaria",
        image:
          "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
        date: { month: "Oct", day: 18 },
      },
      {
        category: "Educación",
        title: "Clase de Tajwīd",
        description: "Reglas de recitación del Corán para todos los niveles.",
        schedule: "Sábados · 10:00",
        location: "Mezquita Central de Bogotá",
        url: "/events/clase-tajwid",
        image: "https://picsum.photos/id/1060/1200/800",
        date: { month: "Nov", day: 2 },
      },
      {
        category: "Conferencia",
        title: "Charla: Introducción al Islam",
        description: "Sesión abierta para conocer los pilares de la fe.",
        schedule: "Viernes · 18:00",
        location: "Mezquita Central de Bogotá",
        url: "/events/introduccion-islam",
        image: "https://picsum.photos/id/1073/1200/800",
        date: { month: "Dic", day: 6 },
      },
    ],
  },
});

export const Default = meta.story({});

export const Empty = meta.story({
  args: {
    events: [],
  },
});
