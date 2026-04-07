import { renderAstroComponentToDom } from "@utils/test.helpers";
import { describe, expect, it } from "vitest";

import DownloadPDF from "./DownloadPDF.astro";

describe("DownloadPDF", () => {
  it("should render a download button with the expected data attributes when required props are provided", async () => {
    const { root, close } = await renderAstroComponentToDom(DownloadPDF, {
      props: {
        documentTitle: "My Document",
        targetAttr: "data-test-target",
        marginMm: 12,
        class: "custom-class",
      },
    });

    try {
      const btn = root.querySelector<HTMLButtonElement>("[data-action='download-pdf']");
      expect(btn).toBeTruthy();
      if (!btn) throw new Error("Expected download button to be present");

      expect(btn.getAttribute("data-document-title")).toBe("My Document");
      expect(btn.getAttribute("data-target-attr")).toBe("data-test-target");
      expect(btn.getAttribute("data-pdf-margin-mm")).toBe("12");

      const classAttr = btn.getAttribute("class") ?? "";
      expect(classAttr).toMatch(/print:hidden/);
      expect(classAttr).toMatch(/custom-class/);

      expect(btn.getAttribute("data-loading-label")).toBe("Preparando...");
      expect(btn.getAttribute("data-error-label")).toMatch(/Error/i);
      expect(btn.getAttribute("aria-label")).toBe("Descargar PDF");
    } finally {
      await close();
    }
  });
});
