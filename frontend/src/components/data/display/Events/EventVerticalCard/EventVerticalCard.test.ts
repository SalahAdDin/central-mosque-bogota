import { getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import EventVerticalCard from "./EventVerticalCard.astro";

describe("EventVerticalCard", () => {
  it("should render title/description, schedule and CTA link when props are provided", async () => {
    const props = {
      category: "Comunidad",
      title: "Cena Comunitaria",
      description: "Un espacio para compartir alimentos.",
      schedule: "19:30 - 21:30",
      url: "/events/cena-comunitaria",
      image: "https://example.com/events-1.jpg",
      date: { month: "Oct", day: 18 },
    };

    const { root, close } = await renderAstroComponentToDom(EventVerticalCard, {
      props,
    });

    try {
      const image = getByRole(root, "img", { name: props.title });
      expect(image.getAttribute("src")).toBe(props.image);

      expect(getByText(root, props.category)).toBeInTheDocument();
      expect(getByRole(root, "heading", { level: 3, name: props.title })).toBeInTheDocument();
      expect(getByText(root, props.description)).toBeInTheDocument();
      expect(getByText(root, props.schedule)).toBeInTheDocument();
      expect(getByText(root, props.date.month)).toBeInTheDocument();
      expect(getByText(root, String(props.date.day))).toBeInTheDocument();

      const cta = getByRole(root, "link", { name: /ver más/i });
      expect(cta.getAttribute("href")).toBe(props.url);
    }
    finally {
      await close();
    }
  });
});
