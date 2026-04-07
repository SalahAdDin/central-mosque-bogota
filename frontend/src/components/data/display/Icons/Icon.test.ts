import { getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";
import { describe, expect, it } from "vitest";

import Icon from "./Icon.astro";

describe("Icon.astro", () => {
  it("should render the icon name as text when name is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Icon, {
      props: { name: "menu" },
    });

    try {
      expect(getByText(root, "menu")).toBeInTheDocument();
    } finally {
      await close();
    }
  });

  it("should apply default variant and size classes when no variant/size is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Icon, {
      props: { name: "search" },
    });

    try {
      const el = getByText(root, "search");
      expect(el.className).toMatch(/material-symbols-outlined/);
      expect(el.className).toMatch(/text-base/);
    } finally {
      await close();
    }
  });

  it("should mark the icon as decorative when no ariaLabel is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Icon, {
      props: { name: "favorite" },
    });

    try {
      const el = getByText(root, "favorite");
      expect(el.getAttribute("aria-hidden")).toBe("true");
      expect(el.hasAttribute("aria-label")).toBe(false);
    } finally {
      await close();
    }
  });

  it("should use aria-label and not aria-hidden when ariaLabel is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Icon, {
      props: { name: "help", ariaLabel: "Help icon" },
    });

    try {
      const el = getByText(root, "help");
      expect(el.getAttribute("aria-label")).toBe("Help icon");
      expect(el.getAttribute("aria-hidden")).toBeNull();
    } finally {
      await close();
    }
  });

  it("should merge custom classes when class is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Icon, {
      props: { name: "language", class: "text-secondary" },
    });

    try {
      const el = getByText(root, "language");
      expect(el.className).toMatch(/text-secondary/);
    } finally {
      await close();
    }
  });
});
