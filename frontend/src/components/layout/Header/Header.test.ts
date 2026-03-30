import { getAllByRole, getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import Header from "./Header.astro";

describe("Header", () => {
  it("should render branding and donate CTA when nav links are provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Header, {
      props: {
        navLinks: [
          { label: "Inicio", href: "/" },
          { label: "Eventos", href: "/events" },
        ],
      },
    });

    try {
      const header = getByRole(root, "banner");
      expect(header).toBeInTheDocument();
      expect(getByText(root, "Mezquita Central")).toBeInTheDocument();
      expect(getByText(root, "de Bogotá")).toBeInTheDocument();

      const donateLinks = getAllByRole(root, "link", { name: "Donar" });
      expect(donateLinks.length).toBe(1);
      expect(donateLinks[0].getAttribute("href")).toBe("/donate");
    }
    finally {
      await close();
    }
  });

  it("should render nav links in both desktop and mobile menus when nav links are provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Header, {
      props: {
        navLinks: [
          { label: "Inicio", href: "/" },
          { label: "Eventos", href: "/events" },
        ],
      },
    });

    try {
      expect(getAllByRole(root, "link", { name: "Inicio", hidden: true }).length).toBe(2);
      expect(getAllByRole(root, "link", { name: "Eventos", hidden: true }).length).toBe(2);
    }
    finally {
      await close();
    }
  });

  it("should render mosque and menu icons when the component is rendered", async () => {
    const { root, close } = await renderAstroComponentToDom(Header, {
      props: {
        navLinks: [{ label: "Inicio", href: "/" }],
      },
    });

    try {
      expect(getByText(root, "mosque")).toBeInTheDocument();
      expect(getByText(root, "menu")).toBeInTheDocument();
    }
    finally {
      await close();
    }
  });
});
