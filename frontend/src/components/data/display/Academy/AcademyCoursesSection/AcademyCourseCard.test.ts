import { getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import AcademyCourseCard from "./AcademyCourseCard.astro";

describe("AcademyCourseCard", () => {
  it("should render image, badge, title/description and CTA link when props are provided", async () => {
    const props = {
      title: "Introducción al Árabe Coránico",
      description:
        "Domina las bases de la lectura y escritura del idioma sagrado del Islam desde cero.",
      badgeLabel: "Fundacional",
      badgeTone: "primary" as const,
      href: "/academy/introduccion-arabe-coranico",
      ctaLabel: "Ver curso",
      ctaIcon: "menu_book" as const,
      imageAlt: "Arabic Calligraphy",
      imageUrl: "https://example.com/course.jpg",
    };

    const { root, close } = await renderAstroComponentToDom(AcademyCourseCard, {
      props,
    });

    try {
      const image = getByRole(root, "img", { name: props.imageAlt });
      expect(image.getAttribute("src")).toBe(props.imageUrl);
      expect(image.getAttribute("alt")).toBe(props.imageAlt);

      const badge = getByText(root, props.badgeLabel);
      const badgeClass = badge.getAttribute("class") ?? "";
      expect(badgeClass.includes("bg-primary")).toBe(true);

      expect(getByRole(root, "heading", { level: 3, name: props.title })).toBeInTheDocument();
      expect(getByText(root, props.description)).toBeInTheDocument();

      const cta = getByRole(root, "link", { name: /ver curso/i });
      expect(cta.getAttribute("href")).toBe(props.href);
      expect(cta.textContent.includes(props.ctaLabel)).toBe(true);
      expect(getByText(root, props.ctaIcon)).toBeInTheDocument();
    }
    finally {
      await close();
    }
  });

  it("should use secondary badge tone when badgeTone is secondary", async () => {
    const { root, close } = await renderAstroComponentToDom(AcademyCourseCard, {
      props: {
        title: "Curso",
        description: "Descripción",
        badgeLabel: "Intermedio",
        badgeTone: "secondary",
        href: "/academy/curso",
        ctaLabel: "Ver curso",
        ctaIcon: "school",
        imageAlt: "Course cover",
        imageUrl: "https://example.com/course.jpg",
      },
    });

    try {
      const badge = getByText(root, "Intermedio");
      const badgeClass = badge.getAttribute("class") ?? "";
      expect(badgeClass.includes("bg-secondary")).toBe(true);
    }
    finally {
      await close();
    }
  });
});
