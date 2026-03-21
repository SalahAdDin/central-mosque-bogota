import { renderAstroComponent } from "@utils/test.helpers";

import Link from "./Link.astro";

function getRenderedLink(result: DocumentFragment): HTMLAnchorElement {
  const link = result.querySelector("a");
  if (!link) {
    throw new Error("Expected Link to render an <a> element");
  }
  return link;
}

describe("Link", () => {
  it("should render an internal link when href and text content are provided", async () => {
    const href = "/about";
    const result = await renderAstroComponent(Link, {
      props: { href },
      slots: { default: "About us" },
    });

    const link = getRenderedLink(result);
    expect(link.getAttribute("href")).toBe(href);
    expect(link.getAttribute("target")).toBeNull();
    expect(link.getAttribute("rel")).toBeNull();
    expect(link.textContent.trim().startsWith("About us")).toBe(true);
  });

  it("should remove href and set aria-disabled when disabled is true", async () => {
    const result = await renderAstroComponent(Link, {
      props: { href: "/disabled", disabled: true },
      slots: { default: "Disabled link" },
    });

    const link = getRenderedLink(result);
    expect(link.getAttribute("href")).toBeNull();
    expect(link.getAttribute("aria-disabled")).toBe("true");
    const classValue = link.getAttribute("class") ?? "";
    expect(classValue.includes("pointer-events-none")).toBe(true);
    expect(classValue.includes("cursor-not-allowed")).toBe(true);
    expect(classValue.includes("line-through")).toBe(true);
    expect(classValue.includes("opacity-60")).toBe(true);
    expect(link.getAttribute("target")).toBeNull();
    expect(link.getAttribute("rel")).toBeNull();
  });

  it("should support icon-only links when ariaLabel is provided", async () => {
    const result = await renderAstroComponent(Link, {
      props: { href: "/", ariaLabel: "Open link" },
      slots: { default: "" },
    });

    const link = getRenderedLink(result);
    expect(link.getAttribute("aria-label")).toBe("Open link");
  });

  it("should apply size and color variants when variant props are provided", async () => {
    const result = await renderAstroComponent(Link, {
      props: { href: "/variants", size: "xs", color: "secondary" },
      slots: { default: "Variants" },
    });

    const link = getRenderedLink(result);
    const classValue = link.getAttribute("class") ?? "";
    expect(classValue.includes("text-xs")).toBe(true);
    expect(classValue.includes("text-secondary")).toBe(true);
  });
});
