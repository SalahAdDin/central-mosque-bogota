import { getAllByText, getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import DonationImpactSection from "./DonationImpactSection.astro";

describe("DonationImpactSection", () => {
  it("should render localized copy, progress, image, and CTA when props are provided", async () => {
    const props = {
      title: "Remodelación Sala de Oración",
      description:
        "Tu generosidad permite que la Mezquita Central siga siendo un faro de luz en Bogotá.",
      goal: "$100.000.000 COP",
      raised: "$75.000.000 COP",
      ctaHref: "/donate",
      imageUrl: "https://example.com/inside-mosque.jpg",
      imageAlt: "Inside Mosque",
    };

    const { root, close } = await renderAstroComponentToDom(
      DonationImpactSection,
      { props }
    );

    try {
      expect(getByRole(root, "heading", {
        level: 2,
        name: "Impacto de tus Donaciones",
      })).toBeInTheDocument();

      expect(getByText(root, props.description)).toBeInTheDocument();

      const projectLabel = `Proyecto: ${props.title}`;
      const progressBar = getByRole(root, "progressbar", {
        name: projectLabel,
      });
      expect(progressBar.getAttribute("value")).toBe("75");
      expect(getAllByText(root, "75%").length).toBeGreaterThan(0);

      expect(getByText(root, `Meta: ${props.goal} • Recaudado: ${props.raised}`)).toBeInTheDocument();

      const cta = getByRole(root, "link", { name: "Haz una donación ahora" });
      expect(cta.getAttribute("href")).toBe(props.ctaHref);

      const image = getByRole(root, "img", { name: props.imageAlt });
      expect(image.getAttribute("src")).toBe(props.imageUrl);
      expect(image.getAttribute("alt")).toBe(props.imageAlt);
    }
    finally {
      await close();
    }
  });

  it("should clamp progress to 100 when raised is above goal", async () => {
    const props = {
      title: "Mantenimiento",
      description:
        "Tu aporte sostiene nuestros programas y espacios comunitarios.",
      goal: "$100 COP",
      raised: "$150 COP",
      ctaHref: "/donate",
      imageUrl: "https://example.com/donations.jpg",
      imageAlt: "Community at the mosque",
    };

    const { root, close } = await renderAstroComponentToDom(
      DonationImpactSection,
      { props }
    );

    try {
      const projectLabel = `Proyecto: ${props.title}`;
      const progressBar = getByRole(root, "progressbar", {
        name: projectLabel,
      });
      expect(progressBar.getAttribute("value")).toBe("100");
      expect(getAllByText(root, "100%").length).toBeGreaterThan(0);
    }
    finally {
      await close();
    }
  });

  it("should render 0 progress when goal cannot be parsed", async () => {
    const props = {
      title: "Apoyo",
      description: "Donaciones para sostener el trabajo comunitario.",
      goal: "",
      raised: "$123 COP",
      ctaHref: "/donate",
      imageUrl: "https://example.com/donations.jpg",
      imageAlt: "Donation image",
    };

    const { root, close } = await renderAstroComponentToDom(
      DonationImpactSection,
      { props }
    );

    try {
      const projectLabel = `Proyecto: ${props.title}`;
      const progressBar = getByRole(root, "progressbar", {
        name: projectLabel,
      });
      expect(progressBar.getAttribute("value")).toBe("0");
      expect(getAllByText(root, "0%").length).toBeGreaterThan(0);
    }
    finally {
      await close();
    }
  });
});
