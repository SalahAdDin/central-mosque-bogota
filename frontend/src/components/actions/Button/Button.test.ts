import { renderAstroComponent } from "@utils/test.helpers";

import Button from "./Button.astro";

function getRenderedButton(result: DocumentFragment): HTMLButtonElement {
  const button = result.querySelector("button");
  if (!button) {
    throw new Error("Expected Button to render a <button> element");
  }
  return button;
}

function getRenderedAnchor(result: DocumentFragment): HTMLAnchorElement {
  const anchor = result.querySelector("a");
  if (!anchor) {
    throw new Error("Expected Button to render an <a> element");
  }
  return anchor;
}

describe("Button", () => {
  it("should render a button when href is not provided", async () => {
    const result = await renderAstroComponent(Button, {
      slots: { default: "Click me" },
    });

    const button = getRenderedButton(result);
    expect(button.getAttribute("href")).toBeNull();
    expect(button.textContent.trim().startsWith("Click me")).toBe(true);
  });

  it("should render an anchor when href is provided", async () => {
    const href = "https://example.com";
    const result = await renderAstroComponent(Button, {
      props: { href, as: "a" },
      slots: { default: "Visit site" },
    });

    const anchor = getRenderedAnchor(result);
    expect(anchor.getAttribute("href")).toBe(href);
    expect(anchor.textContent.trim().startsWith("Visit site")).toBe(true);
  });

  it("should set disabled attribute when disabled is true and renders as a button", async () => {
    const result = await renderAstroComponent(Button, {
      props: { disabled: true },
      slots: { default: "Disabled" },
    });

    const button = getRenderedButton(result);
    expect(button.hasAttribute("disabled")).toBe(true);
    const classValue = button.getAttribute("class") ?? "";
    expect(classValue.includes("pointer-events-none")).toBe(true);
  });

  it("should remove href and set aria-disabled when disabled is true and href is provided", async () => {
    const result = await renderAstroComponent(Button, {
      props: { href: "https://example.com", disabled: true, as: "a" },
      slots: { default: "Disabled link" },
    });

    const anchor = getRenderedAnchor(result);
    expect(anchor.getAttribute("href")).toBeNull();
    expect(anchor.getAttribute("aria-disabled")).toBe("true");
    const classValue = anchor.getAttribute("class") ?? "";
    expect(classValue.includes("pointer-events-none")).toBe(true);
  });

  it("should apply size, variant, and color classes when variant props are provided", async () => {
    const result = await renderAstroComponent(Button, {
      props: { size: "xs", variant: "outline", color: "secondary" },
      slots: { default: "Variants" },
    });

    const button = getRenderedButton(result);
    const classValue = button.getAttribute("class") ?? "";
    expect(classValue.includes("px-3")).toBe(true);
    expect(classValue.includes("py-1.5")).toBe(true);
    expect(classValue.includes("text-xs")).toBe(true);
    expect(classValue.includes("border")).toBe(true);
    expect(classValue.includes("border-secondary")).toBe(true);
    expect(classValue.includes("text-secondary")).toBe(true);
  });

  it("should apply full width when fullWidth is true", async () => {
    const result = await renderAstroComponent(Button, {
      props: { fullWidth: true },
      slots: { default: "Full width" },
    });

    const button = getRenderedButton(result);
    const classValue = button.getAttribute("class") ?? "";
    expect(classValue.includes("w-full")).toBe(true);
  });

  it("should set aria-label when ariaLabel is provided", async () => {
    const result = await renderAstroComponent(Button, {
      props: { ariaLabel: "Submit" },
      slots: { default: "" },
    });

    const button = getRenderedButton(result);
    expect(button.getAttribute("aria-label")).toBe("Submit");
  });
});
