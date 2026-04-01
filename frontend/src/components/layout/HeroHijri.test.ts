import { getAllByText, getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import HeroHijri from "./HeroHijri.astro";

describe("HeroHijri", () => {
  it("should render background image, dates and phrase when all props are provided", async () => {
    const props = {
      imageUrl: "https://example.com/mosque.jpg",
      imageAlt: "Beautiful Mosque Architecture",
      hijriDate: "15 Dhu al-Qi'dah",
      currentDate: "25 de Mayo, 2024",
      phrase:
        "Unidos en oración y comunidad. Bienvenidos al corazón de la espiritualidad islámica en Bogotá.",
    };

    const { root, close } = await renderAstroComponentToDom(HeroHijri, {
      props,
    });

    try {
      const heading = getByRole(root, "heading", {
        level: 1,
        name: props.hijriDate,
      });
      expect(heading).toBeInTheDocument();

      const image = getByRole(root, "img", { name: props.imageAlt });
      expect(image.getAttribute("src")).toBe(props.imageUrl);
      expect(image.getAttribute("alt")).toBe(props.imageAlt);
      expect(image.getAttribute("fetchpriority")).toBe("high");

      expect(getAllByText(root, props.hijriDate).length).toBe(2);
      expect(getByText(root, props.currentDate)).toBeInTheDocument();
      expect(getByText(root, props.phrase)).toBeInTheDocument();

      const overlay = root.querySelector(".hero-overlay");
      expect(overlay).not.toBeNull();
    }
    finally {
      await close();
    }
  });
});
