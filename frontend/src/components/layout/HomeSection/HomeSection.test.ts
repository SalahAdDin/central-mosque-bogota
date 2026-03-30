import { getByRole, getByText, queryByRole } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import HomeSection from "./HomeSection.astro";

describe("HomeSection", () => {
  it("should render title, description, CTA link and body slot content when provided", async () => {
    const { root, close } = await renderAstroComponentToDom(HomeSection, {
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

    try {
      const heading = getByRole(root, "heading", { name: "Section title" });
      expect(heading).toBeInTheDocument();

      expect(getByText(root, "Section description")).toBeInTheDocument();

      const ctaLink = getByRole(root, "link", { name: "See more" });
      expect(ctaLink).toBeInTheDocument();
      expect(ctaLink.getAttribute("href")).toBe("/more");

      const body = getByRole(root, "list");
      expect(body.getAttribute("class") ?? "").toContain("grid");
      expect(body.querySelectorAll("li").length).toBe(2);
    }
    finally {
      await close();
    }
  });

  it("should not render CTA when ctaLabel or ctaHref are missing", async () => {
    const { root, close } = await renderAstroComponentToDom(HomeSection, {
      props: {
        title: "Section title",
        description: "Section description",
      },
      slots: {
        default: "<div>Content</div>",
      },
    });

    try {
      expect(queryByRole(root, "link", { name: "See more" })).toBeNull();
    }
    finally {
      await close();
    }
  });

  it("should render the body wrapper when provided", async () => {
    const { root, close } = await renderAstroComponentToDom(HomeSection, {
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

    try {
      const body = root.querySelector<HTMLElement>("div.custom-body");
      if (!body) {
        throw new Error("Expected HomeSection to render a <div> body wrapper");
      }
      expect(body).toBeInTheDocument();
      expect(getByText(body, "Content")).toBeInTheDocument();
    }
    finally {
      await close();
    }
  });
});
