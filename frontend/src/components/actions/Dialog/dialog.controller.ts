type DialogRootOptions = {
  closeOnBackdropClick: boolean;
  closeOnEsc: boolean;
  lockScroll: boolean;
};

function isDialogSupported(): boolean {
  return typeof HTMLDialogElement !== "undefined";
}

function getClosestRoot(element: Element | null): HTMLElement | null {
  return element?.closest<HTMLElement>("[data-dialog-root]") ?? null;
}

function getRootOptions(root: HTMLElement): DialogRootOptions {
  const closeOnBackdropClick
    = root.getAttribute("data-close-on-backdrop-click") !== "false";
  const closeOnEsc = root.getAttribute("data-close-on-esc") !== "false";
  const lockScroll = root.getAttribute("data-lock-scroll") !== "false";

  return { closeOnBackdropClick, closeOnEsc, lockScroll };
}

function getDialogFromTrigger(trigger: HTMLElement): HTMLDialogElement | null {
  const targetId = trigger.getAttribute("data-dialog-target");
  if (targetId) {
    const maybeDialog = document.getElementById(targetId);
    if (maybeDialog instanceof HTMLDialogElement) return maybeDialog;
  }

  const root = getClosestRoot(trigger);
  if (!root) return null;
  return root.querySelector<HTMLDialogElement>("[data-dialog-content]");
}

function openDialog(
  dialog: HTMLDialogElement,
  opener: HTMLElement | null
): void {
  if (!isDialogSupported()) return;

  if (dialog.open) return;

  const canShowModal = typeof dialog.showModal === "function";
  if (canShowModal) dialog.showModal();
  if (!canShowModal) dialog.setAttribute("open", "");

  dialog.dataset.state = "open";
  if (opener) dialog.dataset.openerId = opener.id;
}

function closeDialog(dialog: HTMLDialogElement): void {
  if (!isDialogSupported()) return;

  const canClose = typeof dialog.close === "function";
  if (canClose) dialog.close();
  if (!canClose) dialog.removeAttribute("open");

  dialog.dataset.state = "closed";
}

class DialogRootController {
  private readonly root: HTMLElement;
  private readonly options: DialogRootOptions;
  private lastActiveElement: HTMLElement | null = null;
  private previousBodyOverflow: string | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
    this.options = getRootOptions(root);

    this.attach();
  }

  private attach(): void {
    const triggers = Array.from(this.root.querySelectorAll<HTMLElement>("[data-dialog-trigger]"));
    const closeButtons = Array.from(this.root.querySelectorAll<HTMLElement>("[data-dialog-close]"));
    const dialog = this.root.querySelector<HTMLDialogElement>("[data-dialog-content]");

    if (!dialog || triggers.length === 0) return;

    triggers.forEach((item) => {
      const isAsChild = item.hasAttribute("data-dialog-as-child");

      const trigger = isAsChild
        ? (item.firstElementChild as HTMLButtonElement)
        : item;

      trigger.addEventListener("click", () => {
        const targetDialog = getDialogFromTrigger(trigger);
        if (!targetDialog) return;

        if (this.options.lockScroll) this.lockScroll();
        this.lastActiveElement = trigger;
        openDialog(targetDialog, trigger);
        trigger.setAttribute("aria-expanded", "true");
      });
    });

    closeButtons.forEach((button) => {
      const isAsChild = button.hasAttribute("data-dialog-as-child");

      const closeButton = isAsChild
        ? (button.firstElementChild as HTMLButtonElement)
        : button;

      closeButton.addEventListener("click", () => {
        closeDialog(dialog);
      });
    });

    dialog.addEventListener("click", (event) => {
      if (!this.options.closeOnBackdropClick) return;
      if (event.target !== dialog) return;
      closeDialog(dialog);
    });

    dialog.addEventListener("cancel", (event) => {
      if (this.options.closeOnEsc) return;
      event.preventDefault();
    });

    dialog.addEventListener("close", () => {
      this.unlockScroll();
      triggers.forEach((trigger) => {
        trigger.setAttribute("aria-expanded", "false");
      });

      const openerId = dialog.dataset.openerId;
      if (openerId) {
        const opener = document.getElementById(openerId);
        if (opener instanceof HTMLElement) opener.focus();
        return;
      }

      if (this.lastActiveElement) this.lastActiveElement.focus();
    });
  }

  private lockScroll(): void {
    if (this.previousBodyOverflow !== null) return;
    this.previousBodyOverflow = document.body.style.overflow || "";
    document.body.style.overflow = "hidden";
  }

  private unlockScroll(): void {
    if (this.previousBodyOverflow === null) return;
    document.body.style.overflow = this.previousBodyOverflow;
    this.previousBodyOverflow = null;
  }
}

const dialogInstances = new WeakMap<HTMLElement, DialogRootController>();

export function initDialogs(): void {
  if (!isDialogSupported()) return;

  document
    .querySelectorAll<HTMLElement>("[data-dialog-root]")
    .forEach((root) => {
      if (!dialogInstances.has(root)) {
        dialogInstances.set(root, new DialogRootController(root));
      }
    });
}
