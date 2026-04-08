import { slugifyFilenamePart } from "@utils/string.utils";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

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

function expandForPdfCapture(container: HTMLElement): () => void {
  const restoreActions: Array<() => void> = [];

  container
    .querySelectorAll<HTMLElement>("[data-monthly-table-root]")
    .forEach((root) => {
      const prev = root.dataset.monthlyTableState;
      root.dataset.monthlyTableState = "expanded";
      restoreActions.push(() => {
        if (typeof prev === "string") root.dataset.monthlyTableState = prev;
        else delete root.dataset.monthlyTableState;
      });
    });

  container
    .querySelectorAll<HTMLElement>("[data-monthly-table-clip]")
    .forEach((clip) => {
      const prevMaxHeight = clip.style.maxHeight;
      const prevOverflow = clip.style.overflow;
      const prevTransition = clip.style.transition;
      const prevWillChange = clip.style.willChange;

      clip.style.maxHeight = "none";
      clip.style.overflow = "visible";
      clip.style.transition = "none";
      clip.style.willChange = "auto";

      restoreActions.push(() => {
        clip.style.maxHeight = prevMaxHeight;
        clip.style.overflow = prevOverflow;
        clip.style.transition = prevTransition;
        clip.style.willChange = prevWillChange;
      });
    });

  return () => {
    restoreActions.reverse().forEach((restore) => {
      restore();
    });
  };
}

function parseMarginMm(raw: string | undefined): number | null {
  if (!raw) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < 0) return null;
  return parsed;
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
  let restoreExpandedLayout: (() => void) | null = null;

  try {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-pulse">${btn.dataset.loadingLabel ?? "Preparing..."}</span>`;

    if (prevTheme === "dark") {
      root.dataset.theme = "light";
      await new Promise((response) => setTimeout(response, 50));
    }

    restoreExpandedLayout = expandForPdfCapture(element);
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });

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

    const pdf = new jsPDF({
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
    restoreExpandedLayout?.();
    btn.disabled = false;
    btn.innerHTML = originalContent;
    if (prevTheme) root.dataset.theme = prevTheme;
  }
}
