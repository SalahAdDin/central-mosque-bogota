import {
  getAllByRole,
  getByRole,
  getByText,
  queryAllByRole,
} from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import AcademyCoursesSection from "./AcademyCoursesSection.astro";

describe("AcademyCoursesSection", () => {
  it("should render section heading/description, CTA link, and article cards when props are provided", async () => {
    const props = {
      title: "Academia de Estudios Islámicos",
      description: "Formación académica y espiritual para todos los niveles.",
      academyHref: "/academy",
      ctaLabel: "Ver academia",
      articleCtaLabel: "Ver curso",
      articles: [
        {
          title: "Introducción al Árabe Coránico",
          description: "Domina las bases desde cero.",
          badgeLabel: "Fundacional",
          badgeTone: "primary" as const,
          href: "/academy/introduccion-arabe-coranico",
          ctaLabel: "Ignored",
          ctaIcon: "menu_book" as const,
          imageAlt: "Arabic Calligraphy",
          imageUrl: "https://example.com/course-1.jpg",
        },
        {
          title: "Fiqh para la Vida Cotidiana",
          description: "Principios y prácticas.",
          badgeLabel: "Práctico",
          badgeTone: "secondary" as const,
          href: "/academy/fiqh-vida-cotidiana",
          ctaLabel: "Ignored",
          ctaIcon: "school" as const,
          imageAlt: "Books on a shelf",
          imageUrl: "https://example.com/course-2.jpg",
        },
      ],
    };

    const { root, close } = await renderAstroComponentToDom(
      AcademyCoursesSection,
      { props }
    );

    try {
      expect(getByRole(root, "heading", { level: 2, name: props.title })).toBeInTheDocument();
      expect(getByText(root, props.description)).toBeInTheDocument();

      const cta = getByRole(root, "link", { name: /ver academia/i });
      expect(cta.getAttribute("href")).toBe(props.academyHref);

      const articleHeadings = getAllByRole(root, "heading", { level: 3 });
      expect(articleHeadings.map(h => h.textContent.trim())).toEqual(expect.arrayContaining(props.articles.map(a => a.title)));

      const articleCtas = getAllByRole(root, "link", { name: /ver curso/i });
      expect(articleCtas.length).toBe(props.articles.length);
    }
    finally {
      await close();
    }
  });

  it("should render no article cards when articles is empty", async () => {
    const { root, close } = await renderAstroComponentToDom(
      AcademyCoursesSection,
      {
        props: {
          title: "Academia",
          description: "Descripción",
          academyHref: "/academy",
          ctaLabel: "Ver academia",
          articleCtaLabel: "Ver curso",
          articles: [],
        },
      }
    );

    try {
      expect(getByRole(root, "heading", { level: 2, name: "Academia" })).toBeInTheDocument();
      expect(queryAllByRole(root, "heading", { level: 3 }).length).toBe(0);
    }
    finally {
      await close();
    }
  });
});
