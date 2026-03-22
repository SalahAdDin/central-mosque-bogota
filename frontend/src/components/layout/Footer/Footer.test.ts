import { renderAstroComponent } from "@utils/test.helpers";

import Footer from "./Footer.astro";

function getRenderedFooter(result: DocumentFragment): HTMLElement {
  const footer = result.querySelector("footer");
  if (!footer) {
    throw new Error("Expected Footer to render a <footer> element");
  }
  return footer;
}

describe("Footer", () => {
  it("should render branding and lemma when props are provided", async () => {
    const lemma = "Unidos en oración y comunidad.";
    const result = await renderAstroComponent(Footer, {
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

    const footer = getRenderedFooter(result);
    expect(footer.textContent.includes("Mezquita Central")).toBe(true);
    expect(footer.textContent.includes("de Bogotá")).toBe(true);
    expect(footer.textContent.includes(lemma)).toBe(true);
  });

  it("should render translated section headings when the default language is used", async () => {
    const result = await renderAstroComponent(Footer, {
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

    const footer = getRenderedFooter(result);
    expect(footer.textContent.includes("Enlaces rápidos")).toBe(true);
    expect(footer.textContent.includes("Contacto")).toBe(true);
    expect(footer.textContent.includes("Boletín")).toBe(true);
  });

  it("should render quick links when fastLinks are provided", async () => {
    const result = await renderAstroComponent(Footer, {
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

    const eventsLink = result.querySelector("a[href=\"/events\"]");
    if (!eventsLink) {
      throw new Error("Expected Footer to render a link to \"/events\"");
    }
    expect(eventsLink.textContent.trim().startsWith("Eventos")).toBe(true);

    const donateLink = result.querySelector("a[href=\"/donate\"]");
    if (!donateLink) {
      throw new Error("Expected Footer to render a link to \"/donate\"");
    }
    expect(donateLink.textContent.trim().startsWith("Donar")).toBe(true);
  });

  it("should render social links when socialNetworkLinks are provided", async () => {
    const result = await renderAstroComponent(Footer, {
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

    const instagramLink = result.querySelector("a[href=\"https://instagram.com\"]");
    if (!instagramLink) {
      throw new Error("Expected Footer to render a link to \"https://instagram.com\"");
    }
    expect(instagramLink.getAttribute("aria-label")).toBe("Instagram");
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

    const result = await renderAstroComponent(Footer, {
      props: {
        lemma: "",
        socialNetworkLinks: [],
        fastLinks: [],
        contactInfo,
        rightsText,
      },
    });

    const address = result.querySelector("address");
    if (!address) {
      throw new Error("Expected Footer to render an <address> element");
    }
    expect(address.textContent.includes(contactInfo.address)).toBe(true);

    const phone = result.querySelector("phone");
    if (!phone) {
      throw new Error("Expected Footer to render a <phone> element");
    }
    expect(phone.textContent.includes(contactInfo.phone)).toBe(true);

    const email = result.querySelector("email");
    if (!email) {
      throw new Error("Expected Footer to render an <email> element");
    }
    expect(email.textContent.includes(contactInfo.email)).toBe(true);

    const input = result.querySelector("input[type=\"email\"]");
    if (!input) {
      throw new Error("Expected Footer to render an input[type=\"email\"]");
    }
    expect(input.getAttribute("placeholder")).toBe("Ingresa tu correo");

    const subscribeButton = result.querySelector("button");
    if (!subscribeButton) {
      throw new Error("Expected Footer to render a <button> element");
    }
    expect(subscribeButton.textContent.trim().startsWith("Suscribirse")).toBe(true);

    expect(result.textContent.includes(rightsText.copyRight)).toBe(true);

    const privacyLink = result.querySelector("a[href=\"/privacy\"]");
    if (!privacyLink) {
      throw new Error("Expected Footer to render a link to \"/privacy\"");
    }
    expect(privacyLink.textContent.trim().startsWith("Privacidad")).toBe(true);

    const termsLink = result.querySelector("a[href=\"/terms\"]");
    if (!termsLink) {
      throw new Error("Expected Footer to render a link to \"/terms\"");
    }
    expect(termsLink.textContent.trim().startsWith("Términos")).toBe(true);
  });
});
