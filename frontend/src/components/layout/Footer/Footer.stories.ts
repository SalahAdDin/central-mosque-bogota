import preview from "@storybook/preview";

import Footer from "./Footer.astro";

const meta = preview.meta({
  title: "Components/Layout/Footer",
  component: Footer as unknown,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    lemma:
      "Unidos en oración y comunidad. El corazón de la espiritualidad islámica en Bogotá.",
    socialNetworkLinks: [
      { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
      { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
      { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
    ],
    fastLinks: [
      { label: "Eventos", href: "/events" },
      { label: "Academia", href: "/academy" },
      { label: "Donar", href: "/donate" },
    ],
    contactInfo: {
      address: "Calle 100 #00-00, Bogotá D.C., Colombia",
      phone: "+57 300 000 0000",
      email: "info@mezquitacentralbogota.org",
    },
    rightsText: {
      copyRight:
        "© 2026 Mezquita Central de Bogotá. Todos los derechos reservados.",
      privacyPolicy: { label: "Política de privacidad", href: "/privacy" },
      termsAndConditions: { label: "Términos y condiciones", href: "/terms" },
    },
  },
});

export const Default = meta.story({});

export const WithoutSocialLinks = meta.story({
  args: {
    socialNetworkLinks: [],
  },
});
