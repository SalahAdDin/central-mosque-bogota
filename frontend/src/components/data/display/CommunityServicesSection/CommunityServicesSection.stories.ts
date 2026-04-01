import preview from "@storybook/preview";

import CommunityServicesSection from "./CommunityServicesSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/CommunityServices/CommunityServicesSection",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: CommunityServicesSection,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    title: "Servicios Comunitarios",
    services: [
      {
        icon: "menu_book",
        title: "Escuela Coránica",
        description:
          "Clases de árabe y memorización del Corán para niños y adultos de todos los niveles.",
      },
      {
        icon: "groups",
        title: "Juventud",
        description:
          "Espacio dedicado a actividades recreativas y educativas para jóvenes musulmanes.",
      },
      {
        icon: "volunteer_activism",
        title: "Voluntariado",
        description:
          "Oportunidades de servicio para apoyar proyectos y eventos de la comunidad.",
      },
      {
        icon: "schedule",
        title: "Charlas y Talleres",
        description:
          "Sesiones formativas para fortalecer el conocimiento y la práctica diaria.",
      },
    ],
  },
});

export const Default = meta.story({});

export const Empty = meta.story({
  args: {
    services: [],
  },
});
