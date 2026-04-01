import preview from "@storybook/preview";

import CommunityServiceCard from "./CommunityServiceCard.astro";

const meta = preview.meta({
  title: "Components/Data/Display/CommunityServices/CommunityServiceCard",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: CommunityServiceCard,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    icon: "menu_book",
    title: "Escuela Coránica",
    description:
      "Clases de árabe y memorización del Corán para niños y adultos de todos los niveles.",
  },
});

export const Default = meta.story({});

export const Youth = meta.story({
  args: {
    icon: "groups",
    title: "Juventud",
    description:
      "Espacio dedicado a actividades recreativas y educativas para jóvenes musulmanes.",
  },
});
