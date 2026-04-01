import preview from "@storybook/preview";

import Icon from "./Icon.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Icons/Icon",
  // TODO: https://github.com/storybook-astro/storybook-astro/issues/61
  component: Icon as unknown,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    name: "menu",
    size: "md",
    variant: "outlined",
    ariaLabel: "Icon",
  },
});

export const Menu = meta.story({ args: { name: "menu" } });
export const Search = meta.story({ args: { name: "search" } });
export const ChevronRight = meta.story({ args: { name: "chevron_right" } });
export const Favorite = meta.story({ args: { name: "favorite" } });
export const LocationOn = meta.story({ args: { name: "location_on" } });
export const Help = meta.story({ args: { name: "help" } });
export const Language = meta.story({ args: { name: "language" } });
export const LightMode = meta.story({ args: { name: "light_mode" } });
export const DarkMode = meta.story({ args: { name: "dark_mode" } });
export const Computer = meta.story({ args: { name: "computer" } });
export const Mosque = meta.story({ args: { name: "mosque" } });
export const Phone = meta.story({ args: { name: "phone" } });
export const Email = meta.story({ args: { name: "email" } });
export const Close = meta.story({ args: { name: "close" } });
export const ArrowForward = meta.story({ args: { name: "arrow_forward" } });
export const School = meta.story({ args: { name: "school" } });
export const Schedule = meta.story({ args: { name: "schedule" } });
export const PlayArrow = meta.story({ args: { name: "play_arrow" } });
export const MenuBook = meta.story({ args: { name: "menu_book" } });
export const VolunteerActivism = meta.story({
  args: { name: "volunteer_activism" },
});
export const Church = meta.story({ args: { name: "church" } });
export const Groups = meta.story({ args: { name: "groups" } });
