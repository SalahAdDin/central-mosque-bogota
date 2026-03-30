import { getByRole } from "@testing-library/dom";
import {
  createUser,
  ensureDialogApi,
  ensureElementGetAnimations,
  installDomGlobals,
  installMatchMedia,
  renderAstroComponentToDom,
} from "@utils/test.helpers";
import { Window } from "happy-dom";

import SheetMock from "./Mock.astro";

type SetupResult = {
  window: Window;
  close: () => Promise<void>;
  trigger: HTMLButtonElement;
  dialog: HTMLDialogElement;
  backdrop: HTMLElement;
  closeButton: HTMLButtonElement;
  root: HTMLElement;
};

async function setupSheetDom(): Promise<SetupResult> {
  const { window, close } = await renderAstroComponentToDom(SheetMock);
  const document = window.document as unknown as Document;

  installDomGlobals(window, document);
  installMatchMedia(window);

  const trigger = getByRole<HTMLButtonElement>(document.body, "button", {
    name: "Open Sheet",
  });

  const dialog = getByRole<HTMLDialogElement>(document.body, "dialog", {
    hidden: true,
  });
  ensureDialogApi(dialog);

  const backdrop = document.querySelector<HTMLElement>("[data-dialog-backdrop]");
  if (!backdrop)
    throw new Error("Expected sheet mock to render a backdrop element");
  ensureElementGetAnimations(backdrop);

  const root = dialog.closest<HTMLElement>("[data-dialog-root]");
  if (!root)
    throw new Error("Expected sheet to be wrapped in a data-dialog-root");

  dialog.dataset.closeDuration = "0";
  backdrop.dataset.closeDuration = "0";

  const closeButton = getByRole<HTMLButtonElement>(document.body, "button", {
    name: "Save changes",
    hidden: true,
  });

  return { window, close, trigger, dialog, backdrop, closeButton, root };
}

describe("Sheet Component", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  it("should render default behavior attributes when no props are provided", async () => {
    const { close, root } = await setupSheetDom();

    try {
      expect(root.dataset.closeOnBackdropClick).toBe("true");
      expect(root.dataset.closeOnEsc).toBe("true");
      expect(root.dataset.lockScroll).toBe("true");
      expect(root.className).toContain("relative");
    }
    finally {
      await close();
    }
  });

  it("should open the sheet when the trigger is clicked", async () => {
    const { initDialogs }
      = await import("@components/actions/Dialog/dialog.controller");
    const { window, close, trigger, dialog, backdrop } = await setupSheetDom();
    const user = await createUser(window);

    try {
      initDialogs();

      await user.click(trigger);
      await vi.runAllTimersAsync();

      expect(dialog.dataset.state).toBe("open");
      expect(backdrop.dataset.state).toBe("open");
      expect(window.document.body.style.overflow).toBe("hidden");
    }
    finally {
      await close();
    }
  });

  it("should close the sheet when a close control is clicked", async () => {
    const { initDialogs }
      = await import("@components/actions/Dialog/dialog.controller");
    const { window, close, trigger, dialog, closeButton }
      = await setupSheetDom();
    const user = await createUser(window);

    try {
      initDialogs();

      await user.click(trigger);
      await vi.runAllTimersAsync();

      expect(dialog.dataset.state).toBe("open");

      await user.click(closeButton);
      await vi.runAllTimersAsync();

      expect(dialog.dataset.state).toBe("closed");
      expect(dialog.hasAttribute("open")).toBe(false);
      expect(window.document.body.style.overflow).toBe("");
    }
    finally {
      await close();
    }
  });

  it("should close the sheet when Escape is pressed", async () => {
    const { initDialogs }
      = await import("@components/actions/Dialog/dialog.controller");
    const { window, close, trigger, dialog } = await setupSheetDom();
    const user = await createUser(window);

    try {
      initDialogs();

      await user.click(trigger);
      await vi.runAllTimersAsync();

      expect(dialog.dataset.state).toBe("open");

      dialog.focus();
      await user.keyboard("{Escape}");
      await vi.runAllTimersAsync();

      expect(dialog.dataset.state).toBe("closed");
      expect(dialog.hasAttribute("open")).toBe(false);
    }
    finally {
      await close();
    }
  });
});
