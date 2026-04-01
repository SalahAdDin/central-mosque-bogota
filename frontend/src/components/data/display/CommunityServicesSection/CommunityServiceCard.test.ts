import { getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import CommunityServiceCard from "./CommunityServiceCard.astro";

describe("CommunityServiceCard", () => {
  it("should render icon, title and description when props are provided", async () => {
    const props = {
      icon: "menu_book",
      title: "Escuela Coránica",
      description:
        "Clases de árabe y memorización del Corán para niños y adultos de todos los niveles.",
    };

    const { root, close } = await renderAstroComponentToDom(
      CommunityServiceCard,
      { props }
    );

    try {
      const title = getByRole(root, "heading", { level: 3, name: props.title });
      expect(title).toBeInTheDocument();
      expect(getByText(root, props.description)).toBeInTheDocument();
      expect(getByText(root, props.icon)).toBeInTheDocument();
    }
    finally {
      await close();
    }
  });
});
