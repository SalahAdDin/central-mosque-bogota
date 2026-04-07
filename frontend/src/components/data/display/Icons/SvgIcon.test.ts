import { renderAstroComponentToDom } from "@utils/test.helpers";
import { describe, it, expect } from "vitest";

import SvgIcon from "./SvgIcon.astro";

describe("SvgIcon.astro", () => {
  it("should render an svg element when a valid name is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(SvgIcon, {
      props: { name: "facebook" },
    });
    try {
      const svg = root.querySelector("svg");
      expect(svg).toBeTruthy();
    } finally {
      await close();
    }
  });

  it("should include a path element when name is facebook", async () => {
    const { root, close } = await renderAstroComponentToDom(SvgIcon, {
      props: { name: "facebook" },
    });
    try {
      const svg = root.querySelector("svg");
      expect(svg).toBeTruthy();
      if (!svg) throw new Error("Expected svg to be present");
      expect(svg.innerHTML.toLowerCase()).toContain("<path");
    } finally {
      await close();
    }
  });

  it("should include defs/clipPath markup when name is instagram", async () => {
    const { root, close } = await renderAstroComponentToDom(SvgIcon, {
      props: { name: "instagram" },
    });
    try {
      const svg = root.querySelector("svg");
      expect(svg).toBeTruthy();
      if (!svg) throw new Error("Expected svg to be present");
      expect(svg.innerHTML).toContain("<defs>");
      expect(svg.innerHTML).toMatch(/clipPath/i);
    } finally {
      await close();
    }
  });

  it("should merge custom classes when class is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(SvgIcon, {
      props: { name: "youtube", class: "w-6 h-6" },
    });
    try {
      const svg = root.querySelector("svg");
      expect(svg).toBeTruthy();
      if (!svg) throw new Error("Expected svg to be present");
      const classAttr = svg.getAttribute("class") ?? "";
      expect(classAttr).toMatch(/w-6/);
      expect(classAttr).toMatch(/h-6/);
    } finally {
      await close();
    }
  });
});
