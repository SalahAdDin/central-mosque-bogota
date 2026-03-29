import { renderAstroComponent } from "@utils/test.helpers";

import HomeSection from "./HomeSection.astro";

describe("HomeSection", () => {
  it("should render title, description, CTA link and body slot content when provided", async () => {
    const result = await renderAstroComponent(HomeSection, {
      props: {
        title: "Section title",
        description: "Section description",
        ctaLabel: "See more",
        ctaHref: "/more",
        bodyClass: "grid",
      },
      slots: {
        default: "<li>Item A</li><li>Item B</li>",
      },
    });

    const heading = result.querySelector("h2");
    if (!heading) {
      throw new Error("Expected HomeSection to render an <h2> element");
    }
    expect(heading.textContent.trim()).toBe("Section title");

    expect(result.textContent.includes("Section description")).toBe(true);

    const ctaLink = result.querySelector("a[href='/more']");
    if (!ctaLink) {
      throw new Error("Expected HomeSection to render a CTA link");
    }
    expect(ctaLink.textContent.includes("See more")).toBe(true);

    const body = result.querySelector("ul");
    if (!body) {
      throw new Error("Expected HomeSection to render an <ul> body wrapper");
    }
    expect(body.getAttribute("class") ?? "").toContain("grid");
    expect(body.querySelectorAll("li").length).toBe(2);
  });

  it("should not render CTA when ctaLabel or ctaHref are missing", async () => {
    const result = await renderAstroComponent(HomeSection, {
      props: {
        title: "Section title",
        description: "Section description",
      },
      slots: {
        default: "<div>Content</div>",
      },
    });

    expect(result.querySelector("a")).toBeNull();
  });

  it("should render the body wrapper when provided", async () => {
    const result = await renderAstroComponent(HomeSection, {
      props: {
        title: "Section title",
        description: "Section description",
        bodyAs: "div",
        bodyClass: "custom-body",
      },
      slots: {
        default: "<span>Content</span>",
      },
    });

    const body = result.querySelector("div.custom-body");
    if (!body) {
      throw new Error("Expected HomeSection to render a <div> body wrapper");
    }
    expect(body.textContent.includes("Content")).toBe(true);
  });
});
