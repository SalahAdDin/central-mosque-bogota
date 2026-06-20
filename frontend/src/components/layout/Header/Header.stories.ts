import preview from "@storybook/preview";

import Header from "./Header.astro";

const meta = preview.meta({
  title: "Components/Layout/Header",
  component: Header,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    navLinks: [
      { label: "Inicio", href: "/" },
      { label: "Eventos", href: "/events" },
      { label: "Academia", href: "/academy" },
      { label: "Comunidad", href: "/community" },
      { label: "Donar", href: "/donate" },
    ],
  },
});

export const Default = meta.story({});

export const FewLinks = meta.story({
  args: {
    navLinks: [
      { label: "Inicio", href: "/" },
      { label: "Donar", href: "/donate" },
    ],
  },
});
