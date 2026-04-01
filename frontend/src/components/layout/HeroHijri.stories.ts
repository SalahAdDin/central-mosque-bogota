import preview from "@storybook/preview";

import HeroHijri from "./HeroHijri.astro";

const meta = preview.meta({
  title: "Components/Layout/HeroHijri",
  // https://github.com/storybook-astro/storybook-astro/issues/61
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: HeroHijri,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    imageUrl: "https://picsum.photos/id/1011/1920/1080",
    imageAlt: "Beautiful Mosque Architecture",
    hijriDate: "15 Dhu al-Qi'dah",
    currentDate: "25 de Mayo, 2024",
    phrase:
      "Unidos en oración y comunidad. Bienvenidos al corazón de la espiritualidad islámica en Bogotá.",
  },
});

export const Default = meta.story({});

export const LongPhrase = meta.story({
  args: {
    phrase:
      "Unidos en oración y comunidad. Bienvenidos al corazón de la espiritualidad islámica en Bogotá. Aquí fortalecemos nuestra fe, cuidamos a nuestras familias y servimos a la comunidad con compasión y esperanza.",
  },
});
