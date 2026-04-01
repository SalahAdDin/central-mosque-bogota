import {
  getAllByRole,
  getByRole,
  getByText,
  queryAllByRole,
} from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import CommunityServicesSection from "./CommunityServicesSection.astro";

describe("CommunityServicesSection", () => {
  it("should render section title and a card per service when services are provided", async () => {
    const props = {
      title: "Servicios Comunitarios",
      services: [
        {
          icon: "menu_book",
          title: "Escuela Coránica",
          description:
            "Clases de árabe y memorización del Corán para niños y adultos de todos los niveles.",
        },
        {
          icon: "groups",
          title: "Juventud",
          description:
            "Espacio dedicado a actividades recreativas y educativas para jóvenes musulmanes.",
        },
      ],
    };

    const { root, close } = await renderAstroComponentToDom(
      CommunityServicesSection,
      { props }
    );

    try {
      expect(getByRole(root, "heading", { level: 2, name: props.title })).toBeInTheDocument();
      expect(getByText(root, props.services[0].description)).toBeInTheDocument();

      const titles = getAllByRole(root, "heading", { level: 3 });
      expect(titles.map(h => h.textContent.trim())).toEqual(expect.arrayContaining(props.services.map(s => s.title)));
    }
    finally {
      await close();
    }
  });

  it("should render no cards when services is empty", async () => {
    const { root, close } = await renderAstroComponentToDom(
      CommunityServicesSection,
      {
        props: {
          title: "Servicios",
          services: [],
        },
      }
    );

    try {
      expect(getByRole(root, "heading", { level: 2, name: "Servicios" })).toBeInTheDocument();
      expect(queryAllByRole(root, "heading", { level: 3 }).length).toBe(0);
    }
    finally {
      await close();
    }
  });
});
