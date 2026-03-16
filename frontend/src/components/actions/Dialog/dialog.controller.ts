type DialogRootOptions = {
  closeOnBackdropClick: boolean;
  closeOnEsc: boolean;
  lockScroll: boolean;
};

type CloseOptions = {
  returnFocus: boolean;
};

let idCounter = 0;
const dialogControllers = new WeakMap<HTMLDialogElement, DialogController>();
const openDialogStack: Array<DialogController> = [];

let scrollLockCount = 0;
let previousBodyOverflow: string | null = null;
let previousBodyPaddingRight: string | null = null;
let cachedScrollbarWidth: number | null = null;

function nextId(prefix: string): string {
  return `${prefix}-${String(++idCounter)}`;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getScrollbarWidth(): number {
  if (cachedScrollbarWidth !== null) return cachedScrollbarWidth;
  cachedScrollbarWidth
    = window.innerWidth - document.documentElement.clientWidth;
  return cachedScrollbarWidth;
}

function getDurationMs(element: HTMLElement): number {
  const fromDataset = element.dataset.closeDuration?.trim();
  if (fromDataset) {
    const value = Number(fromDataset);
    if (Number.isFinite(value)) return value;
  }

  const fromInline = element.style.animationDuration;
  if (fromInline) {
    const value = parseFloat(fromInline);
    if (Number.isFinite(value)) {
      return fromInline.endsWith("ms") ? value : value * 1000;
    }
  }

  const computed = window.getComputedStyle(element).animationDuration;
  if (!computed) return 200;

  const first = computed.split(",")[0]?.trim() ?? "";
  const value = parseFloat(first);
  if (!Number.isFinite(value)) return 200;
  return first.endsWith("ms") ? value : value * 1000;
}

function waitMs(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function usesCssStateAnimations(dialog: HTMLElement): boolean {
  return (
    dialog.dataset.slot === "sheet-content"
    || dialog.dataset.slot === "dialog-content"
  );
}

async function animateElement(
  element: HTMLElement,
  keyframes: Array<Keyframe>,
  options: KeyframeAnimationOptions
): Promise<void> {
  if (prefersReducedMotion()) return;

  element.getAnimations().forEach((a) => {
    a.cancel();
  });

  const animation = element.animate(keyframes, {
    ...options,
    duration: options.duration ?? getDurationMs(element),
  });

  try {
    await animation.finished;
  }
  catch {
    animation.cancel();
  }
  finally {
    animation.cancel();
  }
}

async function animateDialogOpen(dialog: HTMLElement): Promise<void> {
  if (prefersReducedMotion()) return;

  const base = window.getComputedStyle(dialog).transform;
  const matrix
    = base && base !== "none"
      ? new DOMMatrixReadOnly(base)
      : new DOMMatrixReadOnly();
  const from = matrix
    .multiply(new DOMMatrix().translate(0, 8).scale(0.95))
    .toString();

  await animateElement(
    dialog,
    [
      { opacity: 0, transform: from },
      { opacity: 1, transform: base },
    ],
    {
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "backwards",
    }
  );
}

async function animateDialogClose(dialog: HTMLElement): Promise<void> {
  if (prefersReducedMotion()) return;

  const base = window.getComputedStyle(dialog).transform;
  const matrix
    = base && base !== "none"
      ? new DOMMatrixReadOnly(base)
      : new DOMMatrixReadOnly();
  const to = matrix
    .multiply(new DOMMatrix().translate(0, 8).scale(0.95))
    .toString();

  await animateElement(
    dialog,
    [
      { opacity: 1, transform: base },
      { opacity: 0, transform: to },
    ],
    {
      easing: "cubic-bezier(0.4, 0, 1, 1)",
      fill: "forwards",
    }
  );
}

async function animateBackdropOpen(backdrop: HTMLElement): Promise<void> {
  if (prefersReducedMotion()) return;
  await animateElement(backdrop, [{ opacity: 0 }, { opacity: 1 }], {
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    fill: "backwards",
  });
}

async function animateBackdropClose(backdrop: HTMLElement): Promise<void> {
  if (prefersReducedMotion()) return;
  await animateElement(backdrop, [{ opacity: 1 }, { opacity: 0 }], {
    easing: "cubic-bezier(0.4, 0, 1, 1)",
    fill: "forwards",
  });
}

function lockScroll(): void {
  if (scrollLockCount++ !== 0) return;

  const body = document.body;
  previousBodyOverflow = body.style.overflow || "";
  previousBodyPaddingRight = body.style.paddingRight || "";

  body.style.overflow = "hidden";
  const width = getScrollbarWidth();
  body.style.paddingRight = width > 0 ? `${String(width)}px` : "";
}

function unlockScroll(): void {
  if (--scrollLockCount !== 0) return;

  const body = document.body;
  body.style.overflow = previousBodyOverflow ?? "";
  body.style.paddingRight = previousBodyPaddingRight ?? "";

  previousBodyOverflow = null;
  previousBodyPaddingRight = null;
  cachedScrollbarWidth = null;
}

function getRootOptions(root: HTMLElement | null): DialogRootOptions {
  return {
    closeOnBackdropClick: root?.dataset.closeOnBackdropClick !== "false",
    closeOnEsc: root?.dataset.closeOnEsc !== "false",
    lockScroll: root?.dataset.lockScroll !== "false",
  };
}

function resolveInteractiveElement(wrapper: HTMLElement): HTMLElement {
  if (!wrapper.hasAttribute("data-dialog-as-child")) return wrapper;
  return wrapper.firstElementChild as HTMLElement;
}

function findBackdropForDialog(dialog: HTMLElement): HTMLElement | null {
  let sibling = dialog.previousElementSibling;
  while (sibling) {
    if (sibling.matches("[data-dialog-backdrop]"))
      return sibling as HTMLElement;
    sibling = sibling.previousElementSibling;
  }
  return (
    dialog.parentElement?.querySelector<HTMLElement>("[data-dialog-backdrop]") ?? null
  );
}

function isVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return style.visibility !== "hidden" && style.display !== "none";
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

function getFocusableElements(container: HTMLElement): Array<HTMLElement> {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(el => isVisible(el)
    && !el.hasAttribute("disabled")
    && el.getAttribute("aria-disabled") !== "true");
}

function updateNestedDialogAttributes(): void {
  let i = openDialogStack.length;
  while (i--) {
    if (!openDialogStack[i].isConnected()) {
      openDialogStack.splice(i, 1);
    }
  }

  const total = openDialogStack.length;
  for (let i = 0; i < total; i++) {
    const controller = openDialogStack[i];
    const depth = total - 1 - i;
    controller.setNestedDepth(depth);
  }
}

class DialogController {
  private readonly dialog: HTMLDialogElement;
  private readonly backdrop: HTMLElement | null;
  private readonly options: DialogRootOptions;
  private open = false;
  private closing = false;
  private returnFocusTo: HTMLElement | null = null;

  private scrollLocked: boolean | undefined = undefined;
  private focusableCache: Array<HTMLElement> | null = null;

  constructor(dialog: HTMLDialogElement) {
    this.dialog = dialog;
    this.backdrop = findBackdropForDialog(dialog);
    this.options = getRootOptions(dialog.closest<HTMLElement>("[data-dialog-root]"));

    if (!this.dialog.id) this.dialog.id = nextId("dialog");
    this.dialog.setAttribute("aria-modal", "true");
    this.attachEvents();
    this.closeInstant({ returnFocus: false });
  }

  public isConnected(): boolean {
    return this.dialog.isConnected;
  }

  public setNestedDepth(depth: number): void {
    if (depth <= 0) {
      this.dialog.removeAttribute("data-nested-dialog-open");
      this.dialog.style.removeProperty("--nested-dialogs");
    }
    else {
      this.dialog.setAttribute("data-nested-dialog-open", "true");
      this.dialog.style.setProperty("--nested-dialogs", String(depth));
    }
  }

  private attachEvents(): void {
    this.dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      if (this.options.closeOnEsc) void this.close({ returnFocus: true });
    });

    this.dialog.addEventListener("keydown", (e) => {
      this.onKeydown(e);
    });

    this.dialog.addEventListener("click", (e) => {
      if (this.options.closeOnBackdropClick && e.target === this.dialog) {
        void this.close({ returnFocus: false });
      }
    });

    this.dialog.addEventListener("close", () => {
      if (this.closing || !this.open) return;
      this.cleanupClose();
    });

    this.backdrop?.addEventListener("click", () => {
      if (this.options.closeOnBackdropClick)
        void this.close({ returnFocus: false });
    });
  }

  public registerTrigger(trigger: HTMLElement): void {
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", this.dialog.id);
    trigger.setAttribute("aria-expanded", this.open ? "true" : "false");
  }

  private lockScrollIfNeeded(): void {
    if (this.options.lockScroll) {
      this.scrollLocked ??= true;
      if (this.scrollLocked) {
        lockScroll();
      }
    }
  }

  private unlockScrollIfNeeded(): void {
    if (this.scrollLocked) {
      this.scrollLocked = false;
      unlockScroll();
    }
  }

  private focusInitial(): void {
    const focusables = this.getFocusableElements();
    const initial = focusables[0] ?? this.dialog;
    initial.focus();
  }

  private getFocusableElements(): Array<HTMLElement> {
    this.focusableCache ??= getFocusableElements(this.dialog);

    return this.focusableCache;
  }

  private invalidateFocusCache(): void {
    this.focusableCache = null;
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      if (this.options.closeOnEsc) {
        event.preventDefault();
        void this.close({ returnFocus: true });
      }
      return;
    }

    if (event.key !== "Tab") return;

    const focusables = this.getFocusableElements();
    if (!focusables.length) {
      event.preventDefault();
      this.dialog.focus();
      return;
    }

    const active = document.activeElement as HTMLElement | null;
    const currentIndex = active ? focusables.indexOf(active) : -1;
    const lastIndex = focusables.length - 1;

    if (event.shiftKey) {
      if (currentIndex <= 0) {
        event.preventDefault();
        focusables[lastIndex].focus();
      }
    }
    else {
      if (currentIndex === -1 || currentIndex >= lastIndex) {
        event.preventDefault();
        focusables[0].focus();
      }
    }
  }

  public async openFromTrigger(trigger: HTMLElement | null): Promise<void> {
    if (trigger) this.registerTrigger(trigger);
    this.returnFocusTo
      = trigger ?? (document.activeElement as HTMLElement | null);
    await this.openDialog();
  }

  private async openDialog(): Promise<void> {
    if (this.open || !this.dialog.isConnected) return;

    this.invalidateFocusCache();
    this.dialog.dataset.state = "closed";

    if (this.backdrop) {
      this.backdrop.dataset.state = "closed";
      this.backdrop.style.display = "block";
    }

    try {
      this.dialog.showModal();
    }
    catch {
      try {
        this.dialog.show();
      }
      catch {
        return;
      }
    }

    this.open = true;
    this.closing = false;
    this.lockScrollIfNeeded();

    if (!openDialogStack.includes(this)) openDialogStack.push(this);
    updateNestedDialogAttributes();

    const finalizeOpen = (): void => {
      if (!this.dialog.isConnected) return;
      this.dialog.dataset.state = "open";
      if (this.backdrop) {
        this.backdrop.style.display = "block";
        this.backdrop.dataset.state = "open";
      }
      this.focusInitial();
    };

    if (usesCssStateAnimations(this.dialog)) {
      requestAnimationFrame(finalizeOpen);
      return;
    }

    finalizeOpen();
    const backdrop = this.backdrop;
    await Promise.all([
      animateDialogOpen(this.dialog),
      backdrop ? animateBackdropOpen(backdrop) : Promise.resolve(),
    ]);
  }

  public async close(options: CloseOptions): Promise<void> {
    if (!this.open || this.closing) return;
    this.closing = true;

    this.dialog.dataset.state = "closed";
    if (this.backdrop) this.backdrop.dataset.state = "closed";

    const doClose = (): void => {
      if (this.dialog.open) {
        try {
          this.dialog.close();
        }
        catch {
          this.dialog.removeAttribute("open");
        }
      }
      this.cleanupClose();
      if (options.returnFocus) this.returnFocusTo?.focus();
      this.returnFocusTo = null;
    };

    if (usesCssStateAnimations(this.dialog)) {
      const duration = prefersReducedMotion() ? 0 : getDurationMs(this.dialog);
      if (duration > 0) await waitMs(duration);
      doClose();

      if (this.backdrop) {
        const bdDuration = prefersReducedMotion()
          ? 0
          : getDurationMs(this.backdrop);
        setTimeout(() => {
          if (this.backdrop && !this.open) this.backdrop.style.display = "none";
        }, bdDuration);
      }
      return;
    }

    const backdrop = this.backdrop;
    await Promise.all([
      animateDialogClose(this.dialog),
      backdrop ? animateBackdropClose(backdrop) : Promise.resolve(),
    ]);
    doClose();
  }

  private cleanupClose(): void {
    this.open = false;
    this.closing = false;
    this.invalidateFocusCache();
    if (this.backdrop) this.backdrop.style.display = "none";
    this.unlockScrollIfNeeded();
    updateNestedDialogAttributes();
  }

  public closeInstant(options: CloseOptions): void {
    this.open = false;
    this.closing = false;
    this.invalidateFocusCache();
    this.dialog.dataset.state = "closed";
    this.dialog.getAnimations().forEach((a) => {
      a.cancel();
    });
    this.backdrop?.getAnimations().forEach((a) => {
      a.cancel();
    });

    if (this.dialog.open) {
      try {
        this.dialog.close();
      }
      catch {
        this.dialog.removeAttribute("open");
      }
    }

    if (this.backdrop) {
      this.backdrop.dataset.state = "closed";
      this.backdrop.style.display = "none";
    }

    this.unlockScrollIfNeeded();
    updateNestedDialogAttributes();
    if (options.returnFocus) this.returnFocusTo?.focus();
    this.returnFocusTo = null;
  }
}

function getControllerForDialog(dialog: HTMLDialogElement): DialogController {
  let controller = dialogControllers.get(dialog);
  if (!controller) {
    controller = new DialogController(dialog);
    dialogControllers.set(dialog, controller);
  }
  return controller;
}

function resolveDialogFromTrigger(triggerWrapper: HTMLElement): HTMLDialogElement | null {
  const targetId = triggerWrapper.dataset.dialogTarget?.trim();
  if (targetId) {
    const el = document.getElementById(targetId);
    if (el instanceof HTMLDialogElement) return el;
    const nested = el?.querySelector<HTMLDialogElement>("[data-dialog-content]");
    if (nested instanceof HTMLDialogElement) return nested;
  }

  const root = triggerWrapper.closest<HTMLElement>("[data-dialog-root]");
  const dialog = root?.querySelector<HTMLElement>("[data-dialog-content]");
  return dialog instanceof HTMLDialogElement ? dialog : null;
}

function setupDialogControllers(): void {
  document
    .querySelectorAll<HTMLElement>("[data-dialog-content]")
    .forEach((el) => {
      if (el instanceof HTMLDialogElement) getControllerForDialog(el);
    });
}

function handleGlobalClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;

  const triggerWrapper = target.closest<HTMLElement>("[data-dialog-trigger]");
  if (triggerWrapper) {
    const interactive = resolveInteractiveElement(triggerWrapper);

    if (interactive.contains(target) || triggerWrapper === target) {
      event.preventDefault();
      const dialog = resolveDialogFromTrigger(triggerWrapper);
      if (dialog) {
        const controller = getControllerForDialog(dialog);
        void controller.openFromTrigger(interactive);
      }
    }
    return;
  }

  const closeWrapper = target.closest<HTMLElement>("[data-dialog-close]");
  if (closeWrapper) {
    const interactive = resolveInteractiveElement(closeWrapper);
    if (interactive.contains(target) || closeWrapper === target) {
      event.preventDefault();
      const dialog = interactive.closest<HTMLDialogElement>("[data-dialog-content]");
      if (dialog) {
        const controller = getControllerForDialog(dialog);
        void controller.close({ returnFocus: true });
      }
    }
  }
}

let isInitialized = false;

export function initDialogs(): void {
  if (!isInitialized) {
    document.addEventListener("click", handleGlobalClick, true);
    isInitialized = true;
  }

  setupDialogControllers();
  updateNestedDialogAttributes();
}
