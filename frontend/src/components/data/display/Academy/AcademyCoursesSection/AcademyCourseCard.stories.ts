import preview from "@storybook/preview";

import AcademyCourseCard from "./AcademyCourseCard.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Academy/AcademyCourseCard",
  component: AcademyCourseCard as unknown,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    title: "Introducción al Árabe Coránico",
    description:
      "Domina las bases de la lectura y escritura del idioma sagrado del Islam desde cero.",
    badgeLabel: "Fundacional",
    badgeTone: "primary",
    href: "/academy/introduccion-arabe-coranico",
    ctaLabel: "Ver curso",
    ctaIcon: "menu_book",
    imageAlt: "Arabic Calligraphy",
    imageUrl: "https://picsum.photos/id/1060/800/600",
  },
});

export const Default = meta.story({});

export const SecondaryBadge = meta.story({
  args: {
    badgeTone: "secondary",
    badgeLabel: "Intermedio",
  },
});

export const LongTitleAndDescription = meta.story({
  args: {
    title:
      "Tajwīd: Reglas de Recitación para una Lectura Correcta y Consciente del Corán",
    description:
      "Aprende las reglas esenciales de pronunciación y entonación para recitar el Corán con precisión. Incluye ejercicios guiados, ejemplos auditivos y práctica progresiva para todos los niveles.",
  },
});
