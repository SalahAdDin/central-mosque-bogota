import { getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import MediaHighlightCard from "./MediaHighlightCard.astro";

describe("MediaHighlightCard", () => {
  it("should render title, image and CTA when props are provided", async () => {
    const props = {
      title: "La importancia de leer el Sagrado Corán",
      href: "/media/podcast-1",
      imageUrl: "https://example.com/podcast.jpg",
      imageAlt: "Podcast cover",
      ctaLabel: "Escuchar ahora",
    };

    const { root, close } = await renderAstroComponentToDom(
      MediaHighlightCard,
      { props }
    );

    try {
      const link = getByRole(root, "link", { name: new RegExp(props.title) });
      expect(link.getAttribute("href")).toBe(props.href);

      const image = getByRole(root, "img", { name: props.imageAlt });
      expect(image.getAttribute("src")).toBe(props.imageUrl);
      expect(image.getAttribute("alt")).toBe(props.imageAlt);

      expect(getByText(root, props.ctaLabel)).toBeInTheDocument();
      expect(getByText(root, "play_arrow")).toBeInTheDocument();
    } finally {
      await close();
    }
  });
});
