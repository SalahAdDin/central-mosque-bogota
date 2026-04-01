import preview from "@storybook/preview";

import DonationImpactSection from "./DonationImpactSection.astro";

const meta = preview.meta({
  title: "Components/Data/Display/Donations/DonationImpactSection",
  // https://github.com/storybook-astro/storybook-astro/issues/61
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: DonationImpactSection,
  tags: ["autodocs", "version:0.0.1", "new", "alpha"],
  args: {
    title: "Remodelación Sala de Oración",
    description:
      "Tu generosidad permite que la Mezquita Central siga siendo un faro de luz en Bogotá.",
    goal: "$100.000.000 COP",
    raised: "$75.000.000 COP",
    ctaHref: "/donate",
    imageUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Inside Mosque",
  },
});

export const Default = meta.story({});

export const OverGoal = meta.story({
  args: {
    raised: "$150.000.000 COP",
  },
});

export const InvalidGoal = meta.story({
  args: {
    goal: "",
  },
});
