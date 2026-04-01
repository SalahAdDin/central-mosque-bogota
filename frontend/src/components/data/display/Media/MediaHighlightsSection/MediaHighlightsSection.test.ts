import {
  getAllByRole,
  getByRole,
  getByText,
  queryAllByRole,
} from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import MediaHighlightsSection from "./MediaHighlightsSection.astro";

describe("MediaHighlightsSection", () => {
  it("should render section heading/description, CTA link and highlight cards when props are provided", async () => {
    const props = {
      title: "Podcast & Reflexiones",
      description: "Reflexiones, charlas y recursos para fortalecer tu fe.",
      mediaHref: "/media",
      ctaLabel: "Ver todo",
      cardCtaLabel: "Escuchar ahora",
      highlights: [
        {
          title: "La Virtud de Buscar el Conocimiento",
          href: "/media/podcast-3",
          imageUrl: "https://example.com/podcast-3.jpg",
          imageAlt: "Podcast cover",
        },
        {
          title: "El Valor de las 5 Oraciones Diarias",
          href: "/media/podcast-2",
          imageUrl: "https://example.com/podcast-2.jpg",
          imageAlt: "Podcast 2 cover",
        },
      ],
    };

    const { root, close } = await renderAstroComponentToDom(
      MediaHighlightsSection,
      { props }
    );

    try {
      expect(getByRole(root, "heading", { level: 2, name: props.title })).toBeInTheDocument();
      expect(getByText(root, props.description)).toBeInTheDocument();

      const cta = getByRole(root, "link", { name: /ver todo/i });
      expect(cta.getAttribute("href")).toBe(props.mediaHref);

      const cardHeadings = getAllByRole(root, "heading", { level: 3 });
      expect(cardHeadings.map(h => h.textContent.trim())).toEqual(expect.arrayContaining(props.highlights.map(h => h.title)));

      const cardCtas = getAllByRole(root, "link", { name: /escuchar ahora/i });
      expect(cardCtas.length).toBe(props.highlights.length);
    }
    finally {
      await close();
    }
  });

  it("should render no cards when highlights is empty", async () => {
    const { root, close } = await renderAstroComponentToDom(
      MediaHighlightsSection,
      {
        props: {
          title: "Podcast",
          description: "Descripción",
          mediaHref: "/media",
          ctaLabel: "Ver todo",
          cardCtaLabel: "Escuchar ahora",
          highlights: [],
        },
      }
    );

    try {
      expect(getByRole(root, "heading", { level: 2, name: "Podcast" })).toBeInTheDocument();
      expect(queryAllByRole(root, "heading", { level: 3 }).length).toBe(0);
    }
    finally {
      await close();
    }
  });
});
