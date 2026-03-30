import { getByRole, getByText } from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import Footer from "./Footer.astro";

describe("Footer", () => {
  it("should render branding and lemma when props are provided", async () => {
    const lemma = "Unidos en oración y comunidad.";
    const { root, close } = await renderAstroComponentToDom(Footer, {
      props: {
        lemma,
        socialNetworkLinks: [
          {
            label: "Instagram",
            href: "https://instagram.com",
            icon: "instagram",
          },
        ],
        fastLinks: [
          { label: "Eventos", href: "/events" },
          { label: "Donar", href: "/donate" },
        ],
        contactInfo: {
          address: "Bogotá, Colombia",
          phone: "+57 300 000 0000",
          email: "info@centralmosque.co",
        },
        rightsText: {
          copyRight: "© Mezquita Central de Bogotá",
          privacyPolicy: { label: "Privacidad", href: "/privacy" },
          termsAndConditions: { label: "Términos", href: "/terms" },
        },
      },
    });

    try {
      const footer = getByRole(root, "contentinfo");
      expect(footer).toBeInTheDocument();
      expect(getByText(root, "Mezquita Central")).toBeInTheDocument();
      expect(getByText(root, "de Bogotá")).toBeInTheDocument();
      expect(getByText(root, lemma)).toBeInTheDocument();
    }
    finally {
      await close();
    }
  });

  it("should render translated section headings when the default language is used", async () => {
    const { root, close } = await renderAstroComponentToDom(Footer, {
      props: {
        lemma: "",
        socialNetworkLinks: [],
        fastLinks: [],
        contactInfo: {
          address: "Bogotá, Colombia",
          phone: "0",
          email: "a@b.co",
        },
        rightsText: {
          copyRight: "© Mezquita Central de Bogotá",
          privacyPolicy: { label: "Privacidad", href: "/privacy" },
          termsAndConditions: { label: "Términos", href: "/terms" },
        },
      },
    });

    try {
      const footer = getByRole(root, "contentinfo");
      expect(footer).toBeInTheDocument();
      expect(getByText(root, "Enlaces rápidos")).toBeInTheDocument();
      expect(getByText(root, "Contacto")).toBeInTheDocument();
      expect(getByText(root, "Boletín")).toBeInTheDocument();
    }
    finally {
      await close();
    }
  });

  it("should render quick links when fastLinks are provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Footer, {
      props: {
        lemma: "",
        socialNetworkLinks: [],
        fastLinks: [
          { label: "Eventos", href: "/events" },
          { label: "Donar", href: "/donate" },
        ],
        contactInfo: {
          address: "Bogotá, Colombia",
          phone: "0",
          email: "a@b.co",
        },
        rightsText: {
          copyRight: "© Mezquita Central de Bogotá",
          privacyPolicy: { label: "Privacidad", href: "/privacy" },
          termsAndConditions: { label: "Términos", href: "/terms" },
        },
      },
    });

    try {
      const eventsLink = getByRole(root, "link", { name: "Eventos" });
      expect(eventsLink).toBeInTheDocument();

      const donateLink = getByRole(root, "link", { name: "Donar" });
      expect(donateLink).toBeInTheDocument();
    }
    finally {
      await close();
    }
  });

  it("should render social links when socialNetworkLinks are provided", async () => {
    const { root, close } = await renderAstroComponentToDom(Footer, {
      props: {
        lemma: "",
        socialNetworkLinks: [
          {
            label: "Instagram",
            href: "https://instagram.com",
            icon: "instagram",
          },
        ],
        fastLinks: [],
        contactInfo: {
          address: "Bogotá, Colombia",
          phone: "0",
          email: "a@b.co",
        },
        rightsText: {
          copyRight: "© Mezquita Central de Bogotá",
          privacyPolicy: { label: "Privacidad", href: "/privacy" },
          termsAndConditions: { label: "Términos", href: "/terms" },
        },
      },
    });

    try {
      const instagramLink = getByRole(root, "link", { name: "Instagram" });
      expect(instagramLink).toBeInTheDocument();
      expect(instagramLink.getAttribute("aria-label")).toBe("Instagram");
    }
    finally {
      await close();
    }
  });

  it("should render contact info, newsletter form, and rights links when props are provided", async () => {
    const contactInfo = {
      address: "Bogotá, Colombia",
      phone: "+57 300 000 0000",
      email: "info@centralmosque.co",
    };
    const rightsText = {
      copyRight: "© Mezquita Central de Bogotá",
      privacyPolicy: { label: "Privacidad", href: "/privacy" },
      termsAndConditions: { label: "Términos", href: "/terms" },
    };

    const { root, close } = await renderAstroComponentToDom(Footer, {
      props: {
        lemma: "",
        socialNetworkLinks: [],
        fastLinks: [],
        contactInfo,
        rightsText,
      },
    });

    try {
      const address = getByText(root, contactInfo.address);
      expect(address).toBeInTheDocument();

      const phone = getByText(root, contactInfo.phone);
      expect(phone).toBeInTheDocument();

      const email = getByText(root, contactInfo.email);
      expect(email).toBeInTheDocument();

      const input = getByRole(root, "textbox", { type: "email" });
      expect(input.getAttribute("placeholder")).toBe("Ingresa tu correo");

      const subscribeButton = getByRole(root, "button", {
        name: "Suscribirse",
      });
      expect(subscribeButton).toBeInTheDocument();

      expect(root.textContent.includes(rightsText.copyRight)).toBe(true);

      const privacyLink = getByText(root, rightsText.privacyPolicy.label);
      expect(privacyLink).toBeInTheDocument();

      const termsLink = getByText(root, rightsText.termsAndConditions.label);
      expect(termsLink).toBeInTheDocument();
    }
    finally {
      await close();
    }
  });
});
