import { getByRole } from "@testing-library/dom";
import {
  createUser,
  renderAstroComponentToDom,
  ensureElementGetAnimations,
  installDomGlobals,
  installMatchMedia,
  ensureDialogApi,
} from "@utils/test.helpers";
import { Window } from "happy-dom";

import DialogMock from "./Mock.astro";

type SetupResult = {
  window: Window;
  close: () => Promise<void>;
  trigger: HTMLButtonElement;
  dialog: HTMLDialogElement;
  backdrop: HTMLElement;
  closeButton: HTMLButtonElement;
  root: HTMLElement;
};

async function setupDialogDom(): Promise<SetupResult> {
  const { window, close } = await renderAstroComponentToDom(DialogMock);
  const document = window.document as unknown as Document;

  // Apply global shims
  installDomGlobals(window, document);
  installMatchMedia(window);

  // Query Elements
  const trigger = getByRole<HTMLButtonElement>(document.body, "button", {
    name: "Open Dialog",
  });

  const dialog = getByRole<HTMLDialogElement>(document.body, "dialog", {
    hidden: true,
  });

  // Ensure native API exists in test env
  ensureDialogApi(dialog);

  const backdrop = document.querySelector<HTMLElement>("[data-dialog-backdrop]");
  if (!backdrop)
    throw new Error("Expected dialog mock to render a backdrop element");
  ensureElementGetAnimations(backdrop);

  const root = dialog.closest<HTMLElement>("[data-dialog-root]");
  if (!root)
    throw new Error("Expected dialog to be wrapped in a data-dialog-root");

  // Disable animations for faster testing
  dialog.dataset.closeDuration = "0";
  backdrop.dataset.closeDuration = "0";

  const closeButton = getByRole<HTMLButtonElement>(document.body, "button", {
    name: "Cancel",
    hidden: true,
  });

  return { window, close, trigger, dialog, backdrop, closeButton, root };
}

describe("Dialog Component", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  it("should render default behavior attributes when no props are provided", async () => {
    const { close, root } = await setupDialogDom();

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

  it("should open the dialog when the trigger is clicked", async () => {
    const { initDialogs } = await import("./dialog.controller");
    const { window, close, trigger, dialog, backdrop } = await setupDialogDom();
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

  it("should close the dialog when a close control is clicked", async () => {
    const { initDialogs } = await import("./dialog.controller");
    const { window, close, trigger, dialog, closeButton }
      = await setupDialogDom();
    const user = await createUser(window);

    try {
      initDialogs();

      await user.click(trigger);
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

  it("should close the dialog when Escape is pressed", async () => {
    const { initDialogs } = await import("./dialog.controller");
    const { window, close, trigger, dialog } = await setupDialogDom();
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
