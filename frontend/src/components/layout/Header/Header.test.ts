import { renderAstroComponent } from "@utils/test.helpers";

import Header from "./Header.astro";

function getRenderedHeader(result: DocumentFragment): HTMLElement {
  const header = result.querySelector("header");
  if (!header) {
    throw new Error("Expected Header to render a <header> element");
  }
  return header;
}

function getIconByName(
  result: DocumentFragment,
  name: string
): HTMLSpanElement {
  const icon = Array.from(result.querySelectorAll("span")).find(element => element.textContent.trim() === name);
  if (!icon) {
    throw new Error(`Expected Header to render an icon with name "${name}"`);
  }
  return icon;
}

describe("Header", () => {
  it("should render branding and donate CTA when nav links are provided", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        navLinks: [
          { label: "Inicio", href: "/" },
          { label: "Eventos", href: "/events" },
        ],
      },
    });

    const header = getRenderedHeader(result);
    expect(header.textContent.includes("Mezquita Central")).toBe(true);
    expect(header.textContent.includes("de Bogotá")).toBe(true);

    const donateLinks = result.querySelectorAll("a[href=\"/donate\"]");
    expect(donateLinks.length).toBeGreaterThanOrEqual(1);
    expect(Array.from(donateLinks).some(a => a.textContent.includes("Donar"))).toBe(true);
  });

  it("should render nav links in both desktop and mobile menus when nav links are provided", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        navLinks: [
          { label: "Inicio", href: "/" },
          { label: "Eventos", href: "/events" },
        ],
      },
    });

    expect(result.querySelectorAll("a[href=\"/\"]").length).toBe(2);
    expect(result.querySelectorAll("a[href=\"/events\"]").length).toBe(2);
  });

  it("should render mosque and menu icons when the component is rendered", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        navLinks: [{ label: "Inicio", href: "/" }],
      },
    });

    expect(getIconByName(result, "mosque")).toBeDefined();
    expect(getIconByName(result, "menu")).toBeDefined();
  });
});
