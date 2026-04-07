import { slugifyFilenamePart } from "@utils/string.utils";

type PdfPlacement = {
  widthMm: number;
  heightMm: number;
  xMm: number;
  yMm: number;
};

export function computeLetterPortraitPlacement(input: {
  imageWidthPx: number;
  imageHeightPx: number;
  marginMm?: number;
  pageWidthMm?: number;
  pageHeightMm?: number;
}): PdfPlacement {
  const pageWidthMm = input.pageWidthMm ?? 215.9;
  const pageHeightMm = input.pageHeightMm ?? 279.4;
  const marginMm = input.marginMm ?? 10;

  const innerWidthMm = pageWidthMm - marginMm * 2;
  const innerHeightMm = pageHeightMm - marginMm * 2;

  const ratio = Math.min(
    innerWidthMm / input.imageWidthPx,
    innerHeightMm / input.imageHeightPx
  );

  const widthMm = input.imageWidthPx * ratio;
  const heightMm = input.imageHeightPx * ratio;

  const xMm = (innerWidthMm - widthMm) / 2 + marginMm;
  const yMm = (innerHeightMm - heightMm) / 2 + marginMm;

  return { widthMm, heightMm, xMm, yMm };
}

type InitDownloadPdfButtonsOptions = {
  buttonSelector?: string;
  defaultTargetAttr?: string;
};

const initializedButtons = new WeakSet<HTMLButtonElement>();

export function initDownloadPdfButtons(options: InitDownloadPdfButtonsOptions = {}): void {
  const buttonSelector
    = options.buttonSelector ?? "[data-action='download-pdf']";

  document
    .querySelectorAll<HTMLButtonElement>(buttonSelector)
    .forEach((btn) => {
      if (initializedButtons.has(btn)) return;
      initializedButtons.add(btn);
      btn.addEventListener("click", () => void handleClick(btn, options));
    });
}

function parseMarginMm(raw: string | undefined): number | null {
  if (!raw) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < 0) return null;
  return parsed;
}

async function handleClick(
  btn: HTMLButtonElement,
  options: InitDownloadPdfButtonsOptions
): Promise<void> {
  const targetAttr
    = btn.dataset.targetAttr
      ?? options.defaultTargetAttr
      ?? "data-document-prayer-calendar-table";

  const element = document.querySelector<HTMLElement>(`[${targetAttr}]`);
  if (!element) {
    alert(btn.dataset.errorLabel ?? "Target element not found");
    return;
  }

  const originalContent = btn.innerHTML;

  const root = document.documentElement;
  const prevTheme = root.dataset.theme;

  try {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-pulse">${btn.dataset.loadingLabel ?? "Preparing..."}</span>`;

    if (prevTheme === "dark") {
      root.dataset.theme = "light";
      await new Promise((response) => setTimeout(response, 50));
    }

    const [{ default: html2canvas }, { default: JsPdf }] = await Promise.all([
      import("html2canvas-pro"),
      import("jspdf"),
    ]);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: Math.max(element.scrollWidth, element.clientWidth),
      windowHeight: Math.max(element.scrollHeight, element.clientHeight),
      ignoreElements: (el) => {
        return (
          el.matches("[data-action='download-pdf']")
          || el.matches("[data-action='show-more']")
        );
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    const pdf = new JsPdf({
      unit: "mm",
      format: "letter",
      orientation: "portrait",
    });

    const marginMm = parseMarginMm(btn.dataset.pdfMarginMm) ?? 10;

    const placement = computeLetterPortraitPlacement({
      imageWidthPx: canvas.width,
      imageHeightPx: canvas.height,
      marginMm,
    });

    pdf.addImage(
      imgData,
      "JPEG",
      placement.xMm,
      placement.yMm,
      placement.widthMm,
      placement.heightMm
    );

    const title = btn.dataset.documentTitle ?? "";
    const filenameBase = slugifyFilenamePart(title);
    const filename = filenameBase.length > 0 ? filenameBase : "document";
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert(btn.dataset.errorLabel ?? "Failed to generate PDF. Please try again.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalContent;
    if (prevTheme) root.dataset.theme = prevTheme;
  }
}
