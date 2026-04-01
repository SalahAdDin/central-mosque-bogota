import preview from "@storybook/preview";

import AcademyCoursesSection from "./AcademyCoursesSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Academy/AcademyCoursesSection",
  component: AcademyCoursesSection as unknown,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    title: "Academia de Estudios Islámicos",
    description: "Formación académica y espiritual para todos los niveles.",
    academyHref: "/academy",
    ctaLabel: "Ver academia",
    articleCtaLabel: "Ver curso",
    articles: [
      {
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
      {
        title: "Fiqh para la Vida Cotidiana",
        description:
          "Principios y prácticas que te acompañan en tus actos de adoración y vida diaria.",
        badgeLabel: "Práctico",
        badgeTone: "secondary",
        href: "/academy/fiqh-vida-cotidiana",
        ctaLabel: "Ver curso",
        ctaIcon: "school",
        imageAlt: "Books on a shelf",
        imageUrl: "https://picsum.photos/id/1073/800/600",
      },
      {
        title: "Tafsir: Comprendiendo el Mensaje",
        description:
          "Explora el significado del Corán con guía contextual, reflexiones y aplicaciones.",
        badgeLabel: "Avanzado",
        badgeTone: "primary",
        href: "/academy/tafsir-comprendiendo",
        ctaLabel: "Ver curso",
        ctaIcon: "menu_book",
        imageAlt: "Open book",
        imageUrl: "https://picsum.photos/id/1050/800/600",
      },
    ],
  },
});

export const Default = meta.story({});

export const Empty = meta.story({
  args: {
    articles: [],
  },
});
