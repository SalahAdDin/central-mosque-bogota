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

  const backdrop = document.querySelector<HTMLElement>(
    "[data-dialog-backdrop]"
  );
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
    } finally {
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
    } finally {
      await close();
    }
  });

  it("should close the dialog when a close control is clicked", async () => {
    const { initDialogs } = await import("./dialog.controller");
    const { window, close, trigger, dialog, closeButton } =
      await setupDialogDom();
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
    } finally {
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
    } finally {
      await close();
    }
  });

  it("should derive an accessible name from the first heading when no aria-label is provided", async () => {
    const { initDialogs } = await import("./dialog.controller");
    const { close, dialog } = await setupDialogDom();

    try {
      initDialogs();

      const labelledBy = dialog.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();

      const heading = dialog.querySelector("h1, h2, h3, h4, h5, h6");
      expect(heading?.id).toBe(labelledBy);
      expect(heading?.textContent).toContain("Example Dialog");
    } finally {
      await close();
    }
  });

  it("should open and close when dialog:open and dialog:close events are dispatched", async () => {
    const { initDialogs } = await import("./dialog.controller");
    const { window, close, dialog, backdrop } = await setupDialogDom();

    try {
      initDialogs();

      dialog.dispatchEvent(new window.CustomEvent("dialog:open"));
      await vi.runAllTimersAsync();

      expect(dialog.dataset.state).toBe("open");
      expect(backdrop.dataset.state).toBe("open");

      dialog.dispatchEvent(new window.CustomEvent("dialog:close"));
      await vi.runAllTimersAsync();

      expect(dialog.dataset.state).toBe("closed");
      expect(dialog.hasAttribute("open")).toBe(false);
    } finally {
      await close();
    }
  });

  it("should toggle open and closed when the dialog:toggle event is dispatched", async () => {
    const { initDialogs } = await import("./dialog.controller");
    const { window, close, dialog } = await setupDialogDom();

    try {
      initDialogs();

      dialog.dispatchEvent(new window.CustomEvent("dialog:toggle"));
      await vi.runAllTimersAsync();
      expect(dialog.dataset.state).toBe("open");

      dialog.dispatchEvent(new window.CustomEvent("dialog:toggle"));
      await vi.runAllTimersAsync();
      expect(dialog.dataset.state).toBe("closed");
    } finally {
      await close();
    }
  });

  it("should close when a method=\"dialog\" form is submitted", async () => {
    const { initDialogs } = await import("./dialog.controller");
    const { window, close, trigger, dialog } = await setupDialogDom();
    const user = await createUser(window);

    try {
      initDialogs();

      await user.click(trigger);
      await vi.runAllTimersAsync();
      expect(dialog.dataset.state).toBe("open");

      const form = dialog.querySelector("form");
      expect(form?.method).toBe("dialog");

      form?.dispatchEvent(
        new window.Event("submit", { bubbles: true, cancelable: true })
      );
      await vi.runAllTimersAsync();

      expect(dialog.dataset.state).toBe("closed");
      expect(dialog.hasAttribute("open")).toBe(false);
    } finally {
      await close();
    }
  });
});
