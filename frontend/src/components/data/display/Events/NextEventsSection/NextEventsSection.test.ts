import {
  getAllByRole,
  getByRole,
  getByText,
  queryAllByRole,
} from "@testing-library/dom";
import { renderAstroComponentToDom } from "@utils/test.helpers";

import NextEventsSection from "./NextEventsSection.astro";

describe("NextEventsSection", () => {
  it("should render title/description, CTA link and an event card per item when props are provided", async () => {
    const props = {
      title: "Próximos Eventos",
      description: "Únete a nuestras actividades comunitarias",
      ctaLabel: "Ver calendario completo",
      calendarHref: "/events",
      events: [
        {
          category: "Comunidad",
          title: "Cena Comunitaria",
          description: "Un espacio para compartir alimentos.",
          schedule: "19:30 - 21:30",
          location: "Mezquita Central de Bogotá",
          url: "/events/cena-comunitaria",
          image: "https://example.com/events-1.jpg",
          date: { month: "Oct", day: 18 },
        },
        {
          category: "Educación",
          title: "Clase de Tajwīd",
          description: "Reglas de recitación del Corán para todos los niveles.",
          schedule: "Sábados · 10:00",
          location: "Mezquita Central de Bogotá",
          url: "/events/clase-tajwid",
          image: "https://example.com/events-2.jpg",
          date: { month: "Nov", day: 2 },
        },
      ],
    };

    const { root, close } = await renderAstroComponentToDom(NextEventsSection, {
      props,
    });

    try {
      expect(getByRole(root, "heading", { level: 2, name: props.title })).toBeInTheDocument();
      expect(getByText(root, props.description)).toBeInTheDocument();

      const cta = getByRole(root, "link", { name: new RegExp(props.ctaLabel) });
      expect(cta.getAttribute("href")).toBe(props.calendarHref);

      const cardHeadings = getAllByRole(root, "heading", { level: 3 });
      expect(cardHeadings.length).toBe(props.events.length);
      expect(cardHeadings.map(h => h.textContent.trim())).toEqual(expect.arrayContaining(props.events.map(e => e.title)));
    }
    finally {
      await close();
    }
  });

  it("should render no event cards when events is empty", async () => {
    const { root, close } = await renderAstroComponentToDom(NextEventsSection, {
      props: {
        title: "Próximos Eventos",
        description: "Únete a nuestras actividades comunitarias",
        ctaLabel: "Ver calendario completo",
        calendarHref: "/events",
        events: [],
      },
    });

    try {
      expect(getByRole(root, "heading", { level: 2, name: "Próximos Eventos" })).toBeInTheDocument();
      expect(queryAllByRole(root, "heading", { level: 3 }).length).toBe(0);
    }
    finally {
      await close();
    }
  });
});
