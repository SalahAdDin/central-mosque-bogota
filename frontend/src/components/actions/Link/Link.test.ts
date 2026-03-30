import { getByRole } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import Link from "./Link.astro";

describe("Link", () => {
  it("should render an internal link when href and text content are provided", async () => {
    const href = "/about";
    const { root, close } = await renderAstroComponentToDom(Link, {
      props: { href },
      slots: { default: "About us" },
    });

    try {
      const link = getByRole(root, "link", { name: /about us/i });
      expect(link.getAttribute("href")).toBe(href);
      expect(link.getAttribute("target")).toBeNull();
      expect(link.getAttribute("rel")).toBeNull();
    }
    finally {
      await close();
    }
  });

  it("should remove href and set aria-disabled when disabled is true", async () => {
    const { root, close } = await renderAstroComponentToDom(Link, {
      props: { href: "/disabled", disabled: true },
      slots: { default: "Disabled link" },
    });

    try {
      const link = root.querySelector("a");
      if (!link) {
        throw new Error("Expected Link to render an <a> element");
      }

      expect(link.getAttribute("href")).toBeNull();
      expect(link.getAttribute("aria-disabled")).toBe("true");
      const classValue = link.getAttribute("class") ?? "";
      expect(classValue.includes("pointer-events-none")).toBe(true);
      expect(classValue.includes("cursor-not-allowed")).toBe(true);
      expect(classValue.includes("line-through")).toBe(true);
      expect(classValue.includes("opacity-60")).toBe(true);
      expect(link.getAttribute("target")).toBeNull();
      expect(link.getAttribute("rel")).toBeNull();
    }
    finally {
      await close();
    }
  });

  it("should support icon-only links when ariaLabel is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Link, {
      props: { href: "/", ariaLabel: "Open link" },
      slots: { default: "" },
    });

    try {
      const link = getByRole(root, "link", { name: "Open link" });
      expect(link.getAttribute("aria-label")).toBe("Open link");
    }
    finally {
      await close();
    }
  });

  it("should apply size and color variants when variant props are provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Link, {
      props: { href: "/variants", size: "xs", color: "secondary" },
      slots: { default: "Variants" },
    });

    try {
      const link = getByRole(root, "link", { name: /variants/i });
      const classValue = link.getAttribute("class") ?? "";
      expect(classValue.includes("text-xs")).toBe(true);
      expect(classValue.includes("text-secondary")).toBe(true);
    }
    finally {
      await close();
    }
  });
});
