import { getByRole } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import Button from "./Button.astro";

describe("Button", () => {
  it("should render a button when href is not provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Button, {
      slots: { default: "Click me" },
    });

    const button = getByRole(root, "button", { name: "Click me" });
    expect(button.textContent.trim().startsWith("Click me")).toBe(true);

    await close();
  });

  it("should render an anchor when href is provided", async () => {
    const href = "https://example.com";
    const { root, close } = await renderAstroComponentToDom(Button, {
      props: { href, as: "a" },
      slots: { default: "Visit site" },
    });

    const anchor = getByRole(root, "link", { name: "Visit site" });
    expect(anchor.getAttribute("href")).toBe(href);

    await close();
  });

  it("should set disabled attribute when disabled is true and renders as a button", async () => {
    const { root, close } = await renderAstroComponentToDom(Button, {
      props: { disabled: true },
      slots: { default: "Disabled" },
    });

    const button = getByRole(root, "button", { name: "Disabled" });
    expect(button.hasAttribute("disabled")).toBe(true);
    const classValue = button.getAttribute("class") ?? "";
    expect(classValue.includes("pointer-events-none")).toBe(true);

    await close();
  });

  it("should remove href and set aria-disabled when disabled is true and href is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Button, {
      props: { href: "https://example.com", disabled: true, as: "a" },
      slots: { default: "Disabled link" },
    });

    const anchor = root.querySelector("a");
    if (!anchor) {
      throw new Error("Expected Link to render an <a> element");
    }

    expect(anchor.getAttribute("href")).toBeNull();
    expect(anchor.getAttribute("aria-disabled")).toBe("true");
    const classValue = anchor.getAttribute("class") ?? "";
    expect(classValue.includes("pointer-events-none")).toBe(true);

    await close();
  });

  it("should apply size, variant, and color classes when variant props are provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Button, {
      props: { size: "xs", variant: "outline", color: "secondary" },
      slots: { default: "Variants" },
    });

    const button = getByRole(root, "button", { name: "Variants" });
    const classValue = button.getAttribute("class") ?? "";
    expect(classValue.includes("px-3")).toBe(true);
    expect(classValue.includes("py-1.5")).toBe(true);
    expect(classValue.includes("text-xs")).toBe(true);
    expect(classValue.includes("border")).toBe(true);
    expect(classValue.includes("border-secondary")).toBe(true);
    expect(classValue.includes("text-secondary")).toBe(true);

    await close();
  });

  it("should apply full width when fullWidth is true", async () => {
    const { root, close } = await renderAstroComponentToDom(Button, {
      props: { fullWidth: true },
      slots: { default: "Full width" },
    });

    const button = getByRole(root, "button", { name: "Full width" });
    const classValue = button.getAttribute("class") ?? "";
    expect(classValue.includes("w-full")).toBe(true);

    await close();
  });

  it("should set aria-label when ariaLabel is provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Button, {
      props: { ariaLabel: "Submit" },
      slots: { default: "" },
    });

    const button = getByRole(root, "button", { name: "Submit" });
    expect(button.getAttribute("aria-label")).toBe("Submit");

    await close();
  });
});
