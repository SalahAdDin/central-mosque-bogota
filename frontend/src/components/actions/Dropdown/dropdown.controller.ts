import type { TDropdownAlign } from "@utils/models/types";
import { getTransformOrigin, resolvePlacement } from "@utils/positioning.utils";

type DropdownSide = "bottom" | "top" | "left" | "right";

const dropdownInstances = new WeakMap<HTMLElement, DropdownRootController>();
const openDropdowns = new Set<DropdownRootController>();

let globalListenersAttached = false;
let idCounter = 0;

function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${String(idCounter)}`;
}

function resolveTriggerElement(wrapper: HTMLElement): HTMLElement | null {
  if (wrapper.hasAttribute("data-dropdown-as-child")) {
    return wrapper.firstElementChild instanceof HTMLElement
      ? wrapper.firstElementChild
      : null;
  }
  return wrapper;
}

function getMenuContainer(element: Element | null): HTMLElement | null {
  return (
    element?.closest<HTMLElement>(
      "[data-dropdown-content],[data-dropdown-sub-content]"
    ) ?? null
  );
}

function isDisabled(element: HTMLElement): boolean {
  if (element.getAttribute("aria-disabled") === "true") return true;
  if (element instanceof HTMLButtonElement) return element.disabled;
  return element.matches("[disabled]");
}

function getDurationMs(element: HTMLElement): number {
  const fromInline = element.style.animationDuration.trim();
  if (fromInline) {
    const value = parseFloat(fromInline);
    if (Number.isFinite(value)) {
      return fromInline.endsWith("ms") ? value : value * 1000;
    }
  }

  const computed = window.getComputedStyle(element).animationDuration.trim();
  if (!computed) return 150;

  const first = computed.split(",")[0]?.trim() ?? "";
  const value = parseFloat(first);
  if (!Number.isFinite(value)) return 150;
  return first.endsWith("ms") ? value : value * 1000;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getSide(element: HTMLElement): DropdownSide {
  const side = element.dataset.side;
  if (
    side === "bottom" ||
    side === "top" ||
    side === "left" ||
    side === "right"
  ) {
    return side;
  }
  return "bottom";
}

function getClosedOffset(side: DropdownSide): { x: number; y: number } {
  if (side === "top") return { x: 0, y: 8 };
  if (side === "bottom") return { x: 0, y: -8 };
  if (side === "left") return { x: 8, y: 0 };
  return { x: -8, y: 0 };
}

function getMatrixString(transform: string): DOMMatrixReadOnly {
  if (transform && transform !== "none") {
    return new DOMMatrixReadOnly(transform);
  }
  return new DOMMatrixReadOnly();
}

async function animateOpen(menu: HTMLElement): Promise<void> {
  if (prefersReducedMotion()) return;

  menu.getAnimations().forEach((animation) => {
    animation.cancel();
  });

  const base = getMatrixString(window.getComputedStyle(menu).transform);
  const side = getSide(menu);
  const offset = getClosedOffset(side);
  const from = base.multiply(
    new DOMMatrix().translate(offset.x, offset.y).scale(0.95)
  );

  const animation = menu.animate(
    [
      { opacity: 0, transform: from.toString() },
      { opacity: 1, transform: base.toString() },
    ],
    {
      duration: getDurationMs(menu),
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "backwards",
    }
  );

  try {
    await animation.finished;
  } catch {
    animation.cancel();
    return;
  }

  animation.cancel();
}

async function animateClose(menu: HTMLElement): Promise<void> {
  if (prefersReducedMotion()) return;

  menu.getAnimations().forEach((animation) => {
    animation.cancel();
  });

  const base = getMatrixString(window.getComputedStyle(menu).transform);
  const side = getSide(menu);
  const offset = getClosedOffset(side);
  const to = base.multiply(
    new DOMMatrix().translate(offset.x, offset.y).scale(0.95)
  );

  const animation = menu.animate(
    [
      { opacity: 1, transform: base.toString() },
      { opacity: 0, transform: to.toString() },
    ],
    {
      duration: getDurationMs(menu),
      easing: "cubic-bezier(0.4, 0, 1, 1)",
      fill: "forwards",
    }
  );

  try {
    await animation.finished;
  } catch {
    animation.cancel();
    return;
  }
}

function setMenuInteractive(menu: HTMLElement, interactive: boolean): void {
  menu.setAttribute("aria-hidden", interactive ? "false" : "true");
  const inertTarget = menu as HTMLElement & { inert?: boolean };
  inertTarget.inert = !interactive;
}

function getEnabledItems(menu: HTMLElement): Array<HTMLElement> {
  const candidates = Array.from(
    menu.querySelectorAll<HTMLElement>("[data-dropdown-item]")
  );
  return candidates
    .filter((el) => getMenuContainer(el) === menu)
    .filter((el) => !isDisabled(el));
}

function setRovingTabindex(
  menu: HTMLElement,
  active: HTMLElement | null
): void {
  const items = getEnabledItems(menu);
  items.forEach((item) => {
    item.tabIndex = active && item === active ? 0 : -1;
  });
}

function focusFirst(menu: HTMLElement): void {
  const items = getEnabledItems(menu);
  const first = items.at(0);
  if (!first) return;
  setRovingTabindex(menu, first);
  first.focus();
}

function focusLast(menu: HTMLElement): void {
  const items = getEnabledItems(menu);
  const last = items.at(-1);
  if (!last) return;
  setRovingTabindex(menu, last);
  last.focus();
}

function focusNext(menu: HTMLElement, direction: 1 | -1): void {
  const items = getEnabledItems(menu);
  if (!items.length) return;

  const active = document.activeElement as HTMLElement | null;
  const currentIndex = active ? items.indexOf(active) : -1;
  const startIndex =
    currentIndex === -1 ? (direction === 1 ? -1 : items.length) : currentIndex;
  const nextIndex = (startIndex + direction + items.length) % items.length;
  const next = items[nextIndex];
  setRovingTabindex(menu, next);
  next.focus();
}

function getItemText(item: HTMLElement): string {
  return item.textContent.trim().replace(/\s+/g, " ").toLowerCase();
}

function getAlign(element: HTMLElement): TDropdownAlign {
  const align = element.dataset.align;
  if (align === "start" || align === "center" || align === "end") {
    return align;
  }
  return "start";
}

function getSideOffset(element: HTMLElement): number {
  const raw = element.dataset.sideOffset;
  const parsed = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

// Find where the floating content should be appended so it escapes any
// `overflow`/stacking context (e.g. a dialog or sheet). Mirrors the
// `data-floating-root` markup our Dialog/Sheet content already render.
function resolvePortalTarget(trigger: HTMLElement): HTMLElement {
  const currentFloatingRoot = trigger.closest("[data-floating-root]");
  if (currentFloatingRoot instanceof HTMLElement) {
    return currentFloatingRoot;
  }

  const dialogHost = trigger.closest(
    "dialog[data-slot=dialog-content], dialog[data-slot=sheet-content]"
  );
  const dialogFloatingRoot = dialogHost?.querySelector<HTMLElement>(
    ":scope > [data-floating-root]"
  );
  if (dialogFloatingRoot instanceof HTMLElement) {
    return dialogFloatingRoot;
  }

  return document.body;
}

function positionMenu(
  content: HTMLElement,
  trigger: HTMLElement,
  portalTarget: HTMLElement | null,
  options?: { avoidCollisions?: boolean; anchorRect?: DOMRect | null }
): void {
  // Context menus anchor to the pointer position (a zero-size rect at the
  // cursor) rather than the trigger's bounding box.
  const triggerRect = options?.anchorRect ?? trigger.getBoundingClientRect();
  const resolved = resolvePlacement({
    side: getSide(content),
    align: getAlign(content),
    sideOffset: getSideOffset(content),
    triggerRect,
    contentWidth: content.offsetWidth,
    contentHeight: content.offsetHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    viewportPadding: 8,
    avoidCollisions: options?.avoidCollisions ?? true,
  });

  // When portaled into a floating root the content is positioned `absolute`
  // relative to that element, so subtract its origin from the viewport coords.
  const portalTargetRect =
    portalTarget && portalTarget !== document.body
      ? portalTarget.getBoundingClientRect()
      : null;
  const left = portalTargetRect
    ? resolved.left - portalTargetRect.left
    : resolved.left;
  const top = portalTargetRect
    ? resolved.top - portalTargetRect.top
    : resolved.top;

  content.style.left = `${String(Math.round(left))}px`;
  content.style.top = `${String(Math.round(top))}px`;
  content.style.transformOrigin = getTransformOrigin(
    resolved.side,
    resolved.align
  );
  content.setAttribute("data-side", resolved.side);
  content.setAttribute("data-align", resolved.align);
}

/**
 * Portals a menu's content to the resolved floating root, anchors it to its
 * trigger with collision-aware positioning, and keeps it positioned while open
 * via scroll/resize listeners and a `ResizeObserver`. Restores the content to
 * its original DOM location on `unmount`.
 */
class FloatingController {
  private placeholder: Comment | null = null;
  private portalTarget: HTMLElement | null = null;
  private cleanup: (() => void) | null = null;

  constructor(
    private readonly content: HTMLElement,
    private readonly trigger: HTMLElement,
    private readonly options: {
      shouldHover: () => boolean;
      onPointerEnter: () => void;
      onPointerLeave: () => void;
      getAnchorRect?: () => DOMRect | null;
    }
  ) {}

  public mount(): void {
    const portalTarget = resolvePortalTarget(this.trigger);
    if (this.placeholder || this.content.parentElement === portalTarget) {
      this.reposition({ avoidCollisions: true });
      return;
    }

    // Save the original position with a placeholder, then move the content out.
    this.placeholder = document.createComment("dropdown-content-placeholder");
    this.content.parentNode?.insertBefore(this.placeholder, this.content);
    portalTarget.appendChild(this.content);
    this.portalTarget = portalTarget;

    this.content.style.position =
      portalTarget === document.body ? "fixed" : "absolute";

    this.reposition({ avoidCollisions: true });

    const handleScroll = (): void => {
      this.reposition({ avoidCollisions: false });
    };
    const handleResize = (): void => {
      this.reposition({ avoidCollisions: true });
    };
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            this.reposition({ avoidCollisions: true });
          })
        : null;
    resizeObserver?.observe(this.content);
    resizeObserver?.observe(this.trigger);

    const onPointerEnter = (event: PointerEvent): void => {
      if (event.pointerType !== "mouse") return;
      this.options.onPointerEnter();
    };
    const onPointerLeave = (event: PointerEvent): void => {
      if (event.pointerType !== "mouse") return;
      this.options.onPointerLeave();
    };
    const hoverEnabled = this.options.shouldHover();
    if (hoverEnabled) {
      this.content.addEventListener("pointerenter", onPointerEnter);
      this.content.addEventListener("pointerleave", onPointerLeave);
    }

    this.cleanup = (): void => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      if (hoverEnabled) {
        this.content.removeEventListener("pointerenter", onPointerEnter);
        this.content.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }

  public reposition(options?: { avoidCollisions?: boolean }): void {
    positionMenu(this.content, this.trigger, this.portalTarget, {
      avoidCollisions: options?.avoidCollisions,
      anchorRect: this.options.getAnchorRect?.() ?? null,
    });
  }

  public unmount(): void {
    this.cleanup?.();
    this.cleanup = null;

    // Move content back to its original position.
    if (this.placeholder) {
      if (this.placeholder.parentNode) {
        this.placeholder.parentNode.insertBefore(
          this.content,
          this.placeholder
        );
      } else if (this.content.parentNode) {
        this.content.remove();
      }
      this.placeholder.remove();
      this.placeholder = null;
    } else if (
      this.content.parentNode &&
      this.portalTarget &&
      this.portalTarget !== document.body
    ) {
      this.content.remove();
    }

    this.portalTarget = null;
    this.content.style.removeProperty("position");
    this.content.style.removeProperty("top");
    this.content.style.removeProperty("left");
    this.content.style.removeProperty("transform-origin");
  }
}

class SubmenuController {
  public readonly wrapper: HTMLElement;
  public readonly trigger: HTMLButtonElement;
  public readonly menu: HTMLElement;
  private readonly root: DropdownRootController;
  private closeTimer: number | null = null;
  private floating: FloatingController | null = null;
  private open = false;

  constructor(
    root: DropdownRootController,
    wrapper: HTMLElement,
    trigger: HTMLButtonElement,
    menu: HTMLElement
  ) {
    this.root = root;
    this.wrapper = wrapper;
    this.trigger = trigger;
    this.menu = menu;

    this.ensureIds();
    this.applyA11y();
    this.attachEvents();
    this.closeInstant();
  }

  private ensureIds(): void {
    if (!this.trigger.id) this.trigger.id = nextId("dropdown-sub-trigger");
    if (!this.menu.id) this.menu.id = nextId("dropdown-sub-menu");
  }

  private applyA11y(): void {
    this.trigger.setAttribute("aria-haspopup", "menu");
    this.trigger.setAttribute("aria-controls", this.menu.id);
    this.menu.setAttribute("aria-labelledby", this.trigger.id);
  }

  private attachEvents(): void {
    // The content is portaled out of the root menu when open, so its keyboard
    // and click handling can no longer rely on bubbling to the root listener.
    // Delegate to the root controller and stop propagation to avoid the root
    // listener also handling the event while the submenu is still nested.
    this.menu.addEventListener("keydown", (event) => {
      this.root.handleMenuKeydown(event);
      event.stopPropagation();
    });
    this.menu.addEventListener("click", (event) => {
      this.root.handleMenuClick(event);
      event.stopPropagation();
    });

    this.trigger.addEventListener("click", (event) => {
      if (isDisabled(this.trigger)) return;
      event.preventDefault();
      if (this.open) {
        void this.close({ returnFocus: false });
        return;
      }
      this.root.openSubmenu(this);
      focusFirst(this.menu);
    });

    this.wrapper.addEventListener("pointerenter", () => {
      if (!this.root.openOnHoverEnabled()) return;
      if (isDisabled(this.trigger)) return;
      this.cancelCloseTimer();
      this.root.openSubmenu(this);
    });

    this.wrapper.addEventListener("pointerleave", () => {
      if (!this.root.openOnHoverEnabled()) return;
      if (!this.open) return;
      this.scheduleClose(this.root.getCloseDelay());
    });
  }

  public isOpen(): boolean {
    return this.open;
  }

  public scheduleClose(delayMs: number): void {
    this.cancelCloseTimer();
    this.closeTimer = window.setTimeout(() => {
      void this.close({ returnFocus: false });
    }, delayMs);
  }

  public cancelCloseTimer(): void {
    if (this.closeTimer !== null) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  public menuContains(node: Node): boolean {
    return this.menu.contains(node);
  }

  private mountFloating(): void {
    this.floating = new FloatingController(this.menu, this.trigger, {
      shouldHover: (): boolean => this.root.openOnHoverEnabled(),
      onPointerEnter: (): void => {
        this.cancelCloseTimer();
      },
      onPointerLeave: (): void => {
        this.scheduleClose(this.root.getCloseDelay());
      },
    });
    this.floating.mount();
  }

  public async openMenu(): Promise<void> {
    this.cancelCloseTimer();
    if (this.open) return;

    this.open = true;
    this.trigger.setAttribute("aria-expanded", "true");
    this.menu.dataset.state = "open";
    this.menu.style.display = "block";
    setMenuInteractive(this.menu, true);
    this.mountFloating();
    await animateOpen(this.menu);
  }

  public async close(options: { returnFocus: boolean }): Promise<void> {
    this.cancelCloseTimer();
    if (!this.open) return;

    this.open = false;
    this.trigger.setAttribute("aria-expanded", "false");
    this.menu.dataset.state = "closed";
    setMenuInteractive(this.menu, false);
    await animateClose(this.menu);
    this.menu.style.display = "none";
    this.floating?.unmount();
    this.floating = null;

    if (options.returnFocus) this.trigger.focus();
  }

  public closeInstant(): void {
    this.cancelCloseTimer();
    this.open = false;
    this.trigger.setAttribute("aria-expanded", "false");
    this.menu.dataset.state = "closed";
    setMenuInteractive(this.menu, false);
    this.menu.style.display = "none";
    this.floating?.unmount();
    this.floating = null;
  }
}

class DropdownRootController {
  private readonly root: HTMLElement;
  private triggers: Array<HTMLElement> = [];
  private primaryTrigger: HTMLElement | null = null;
  private menu: HTMLElement | null = null;
  private open = false;
  private closeTimer: number | null = null;
  private submenus: Array<SubmenuController> = [];
  private submenuByTrigger = new WeakMap<HTMLElement, SubmenuController>();
  private submenuByMenu = new WeakMap<HTMLElement, SubmenuController>();
  private typeahead = "";
  private typeaheadTimer: number | null = null;
  private returnFocusTo: HTMLElement | null = null;
  private floating: FloatingController | null = null;

  // Context-menu mode state
  private contextMenu = false;
  private contextAnchorRect: DOMRect | null = null;
  private longPressTimer: number | null = null;
  private touchStartPoint: { x: number; y: number } | null = null;
  private suppressContextMenuUntil = 0;
  private suppressItemClickUntil = 0;

  constructor(root: HTMLElement) {
    this.root = root;
    this.initialize();
  }

  private initialize(): void {
    const triggerWrapper = this.root.querySelector<HTMLElement>(
      "[data-dropdown-trigger]"
    );
    const menu = this.root.querySelector<HTMLElement>(
      "[data-dropdown-content]"
    );
    if (!triggerWrapper || !menu) return;

    this.menu = menu;
    this.contextMenu = this.root.dataset.menuMode === "context-menu";

    this.ensureRootId();
    this.ensureIds();
    this.registerTrigger(triggerWrapper);
    this.applyA11y();
    this.attachEvents();
    this.initSubmenus();
    this.closeInstant();
  }

  public ensureRootId(): string {
    if (!this.root.id) this.root.id = nextId("dropdown-root");
    return this.root.id;
  }

  private ensureIds(): void {
    if (!this.menu) return;
    if (!this.menu.id) this.menu.id = nextId("dropdown-menu");
  }

  private applyA11y(): void {
    if (!this.menu || !this.primaryTrigger) return;
    this.menu.setAttribute("aria-labelledby", this.primaryTrigger.id);
  }

  private attachEvents(): void {
    const menu = this.menu;
    if (!menu) return;

    menu.addEventListener("keydown", (event) => {
      this.onMenuKeydown(event);
    });
    menu.addEventListener("click", (event) => {
      this.onMenuClick(event);
    });

    this.root.addEventListener("pointerenter", () => {
      if (!this.openOnHoverEnabled()) return;
      if (!this.primaryTrigger || isDisabled(this.primaryTrigger)) return;
      this.cancelCloseTimer();
      void this.openMenu({ focus: "none" });
    });

    this.root.addEventListener("pointerleave", () => {
      if (!this.openOnHoverEnabled()) return;
      if (!this.open) return;
      this.scheduleClose(this.getCloseDelay());
    });

    this.root.addEventListener("dropdown:open", () => {
      void this.openMenu({ focus: "none" });
    });
    this.root.addEventListener("dropdown:close", () => {
      void this.close({ returnFocus: false });
    });
    this.root.addEventListener("dropdown:toggle", () => {
      if (this.open) {
        void this.close({ returnFocus: false });
        return;
      }
      void this.openMenu({ focus: "none" });
    });
  }

  private initSubmenus(): void {
    if (!this.menu) return;

    const wrappers = Array.from(
      this.menu.querySelectorAll<HTMLElement>("[data-dropdown-sub]")
    ).filter((wrapper) => getMenuContainer(wrapper) === this.menu);

    this.submenus = wrappers
      .map((wrapper) => {
        const trigger = wrapper.querySelector<HTMLButtonElement>(
          "[data-dropdown-sub-trigger]"
        );
        const menu = wrapper.querySelector<HTMLElement>(
          "[data-dropdown-sub-content]"
        );
        if (!trigger || !menu) return null;
        const controller = new SubmenuController(this, wrapper, trigger, menu);
        this.submenuByTrigger.set(trigger, controller);
        this.submenuByMenu.set(menu, controller);
        return controller;
      })
      .filter((c): c is SubmenuController => {
        return Boolean(c);
      });
  }

  public openOnHoverEnabled(): boolean {
    return this.root.dataset.openOnHover === "true";
  }

  public getCloseDelay(): number {
    const raw = this.root.dataset.closeDelay;
    const parsed = raw ? Number.parseInt(raw, 10) : 200;
    return Number.isFinite(parsed) ? parsed : 200;
  }

  private scheduleClose(delayMs: number): void {
    this.cancelCloseTimer();
    this.closeTimer = window.setTimeout(() => {
      void this.close({ returnFocus: false });
    }, delayMs);
  }

  private cancelCloseTimer(): void {
    if (this.closeTimer !== null) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  private updateTriggerA11y(): void {
    if (!this.menu) return;
    this.triggers.forEach((trigger) => {
      trigger.setAttribute("aria-haspopup", "menu");
      trigger.setAttribute("aria-expanded", this.open ? "true" : "false");
      trigger.setAttribute("aria-controls", this.menu?.id ?? "");
    });
  }

  private attachTriggerEvents(trigger: HTMLElement): void {
    if (this.contextMenu) {
      this.attachContextMenuTriggerEvents(trigger);
      return;
    }

    trigger.addEventListener("click", (event) => {
      if (isDisabled(trigger)) return;
      event.preventDefault();
      this.returnFocusTo = trigger;
      if (this.open) {
        void this.close({ returnFocus: true });
        return;
      }
      void this.openMenu({ focus: "none" });
    });

    trigger.addEventListener("keydown", (event) => {
      this.returnFocusTo = trigger;
      if (event.key === "Tab") {
        if (this.open) void this.close({ returnFocus: false });
        return;
      }
      if (event.key === "Escape") {
        if (this.open) {
          event.preventDefault();
          void this.close({ returnFocus: true });
        }
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        void this.openMenu({ focus: "first" });
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        void this.openMenu({ focus: "last" });
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        void this.openMenu({ focus: "first" });
      }
    });
  }

  private attachContextMenuTriggerEvents(trigger: HTMLElement): void {
    trigger.addEventListener("contextmenu", (event) => {
      if (isDisabled(trigger)) return;
      event.preventDefault();
      // Skip the synthetic contextmenu some browsers fire after a long-press.
      if (Date.now() < this.suppressContextMenuUntil) return;
      this.returnFocusTo = trigger;
      this.openAtPoint(event.clientX, event.clientY);
    });

    trigger.addEventListener("keydown", (event) => {
      if (
        event.key === "ContextMenu" ||
        (event.shiftKey && event.key === "F10")
      ) {
        if (isDisabled(trigger)) return;
        event.preventDefault();
        this.returnFocusTo = trigger;
        this.openAtTrigger(trigger);
        return;
      }
      if (event.key === "Escape" && this.open) {
        event.preventDefault();
        void this.close({ returnFocus: true });
        return;
      }
      if (this.open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        if (!this.menu) return;
        if (event.key === "ArrowDown") focusFirst(this.menu);
        else focusLast(this.menu);
      }
    });

    trigger.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length !== 1) {
          this.clearLongPressTimer();
          this.touchStartPoint = null;
          return;
        }
        const touch = event.touches[0];
        this.touchStartPoint = { x: touch.clientX, y: touch.clientY };
        this.returnFocusTo = trigger;
        this.clearLongPressTimer();
        this.longPressTimer = window.setTimeout(() => {
          if (!this.touchStartPoint || isDisabled(trigger)) return;
          this.openAtPoint(
            this.touchStartPoint.x,
            this.touchStartPoint.y,
            10,
            10
          );
          // Block the trailing synthetic contextmenu/click after the long-press.
          this.suppressContextMenuUntil = Date.now() + 700;
          this.suppressItemClickUntil = Date.now() + 700;
        }, 500);
      },
      { passive: true }
    );

    trigger.addEventListener(
      "touchmove",
      (event) => {
        if (!this.touchStartPoint || event.touches.length !== 1) {
          this.clearLongPressTimer();
          return;
        }
        const touch = event.touches[0];
        if (
          Math.abs(touch.clientX - this.touchStartPoint.x) > 10 ||
          Math.abs(touch.clientY - this.touchStartPoint.y) > 10
        ) {
          this.clearLongPressTimer();
        }
      },
      { passive: true }
    );

    const cancelLongPress = (): void => {
      this.clearLongPressTimer();
      this.touchStartPoint = null;
    };
    trigger.addEventListener("touchend", cancelLongPress);
    trigger.addEventListener("touchcancel", cancelLongPress);
  }

  private clearLongPressTimer(): void {
    if (this.longPressTimer !== null) {
      window.clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private openAtPoint(x: number, y: number, width = 0, height = 0): void {
    this.contextAnchorRect = new DOMRect(x, y, width, height);
    if (this.open) {
      this.floating?.reposition({ avoidCollisions: true });
      return;
    }
    void this.openMenu({ focus: "none" });
  }

  private openAtTrigger(trigger: HTMLElement): void {
    const rect = trigger.getBoundingClientRect();
    this.openAtPoint(rect.left, rect.bottom);
  }

  private registerTrigger(wrapper: HTMLElement): void {
    if (!this.menu) return;
    const trigger = resolveTriggerElement(wrapper);
    if (!trigger) return;

    if (!trigger.id) trigger.id = nextId("dropdown-trigger");
    this.primaryTrigger ??= trigger;
    if (this.triggers.includes(trigger)) return;

    this.triggers.push(trigger);
    this.attachTriggerEvents(trigger);
    this.updateTriggerA11y();
    this.applyA11y();
  }

  public registerExternalTrigger(wrapper: HTMLElement): void {
    this.registerTrigger(wrapper);
  }

  private mountFloating(): void {
    if (!this.menu) return;
    const trigger = this.returnFocusTo ?? this.primaryTrigger;
    if (!trigger) return;

    this.floating = new FloatingController(this.menu, trigger, {
      shouldHover: (): boolean => this.openOnHoverEnabled(),
      onPointerEnter: (): void => {
        this.cancelCloseTimer();
      },
      onPointerLeave: (): void => {
        this.scheduleClose(this.getCloseDelay());
      },
      getAnchorRect: (): DOMRect | null =>
        this.contextMenu ? this.contextAnchorRect : null,
    });
    this.floating.mount();
  }

  public handleMenuKeydown(event: KeyboardEvent): void {
    this.onMenuKeydown(event);
  }

  public handleMenuClick(event: MouseEvent): void {
    this.onMenuClick(event);
  }

  public async openMenu(options: {
    focus: "none" | "first" | "last";
  }): Promise<void> {
    if (!this.menu) return;
    this.cancelCloseTimer();

    if (!this.open) {
      closeAllDropdowns({ except: this });
      this.open = true;
      openDropdowns.add(this);

      this.menu.dataset.state = "open";
      this.menu.style.display = "block";
      setMenuInteractive(this.menu, true);
      this.updateTriggerA11y();
      this.mountFloating();
      await animateOpen(this.menu);
    }

    if (options.focus === "first") focusFirst(this.menu);
    if (options.focus === "last") focusLast(this.menu);
    if (options.focus === "none") {
      setRovingTabindex(this.menu, getEnabledItems(this.menu)[0] ?? null);
    }
  }

  public async close(options: { returnFocus: boolean }): Promise<void> {
    if (!this.menu) return;
    this.cancelCloseTimer();

    this.closeAllSubmenus({ returnFocus: false });

    if (!this.open) return;
    this.open = false;
    openDropdowns.delete(this);

    this.menu.dataset.state = "closed";
    setMenuInteractive(this.menu, false);
    this.updateTriggerA11y();
    await animateClose(this.menu);
    this.menu.style.display = "none";
    this.floating?.unmount();
    this.floating = null;
    this.contextAnchorRect = null;

    if (options.returnFocus) {
      (this.returnFocusTo ?? this.primaryTrigger)?.focus();
    }
    this.returnFocusTo = null;
  }

  public closeInstant(): void {
    if (!this.menu) return;

    this.cancelCloseTimer();
    this.closeAllSubmenus({ returnFocus: false, instant: true });

    this.open = false;
    openDropdowns.delete(this);

    this.menu.dataset.state = "closed";
    setMenuInteractive(this.menu, false);
    this.updateTriggerA11y();
    this.menu.style.display = "none";
    this.floating?.unmount();
    this.floating = null;
    this.contextAnchorRect = null;
    this.clearLongPressTimer();
    this.returnFocusTo = null;
  }

  public contains(node: Node): boolean {
    // Content (and submenu content) is portaled out of the root while open, so
    // check those elements directly in addition to the root wrapper.
    if (this.root.contains(node)) return true;
    if (this.menu?.contains(node)) return true;
    return this.submenus.some((submenu) => submenu.menuContains(node));
  }

  // Which nodes count as "inside" for outside-click/focus dismissal. A context
  // menu must dismiss when clicking its trigger region too (only the portaled
  // menu content keeps it open), whereas a regular dropdown counts its trigger.
  public containsOpenSurface(node: Node): boolean {
    if (this.menu?.contains(node)) return true;
    if (this.submenus.some((submenu) => submenu.menuContains(node)))
      return true;
    if (!this.contextMenu && this.root.contains(node)) return true;
    return false;
  }

  public isOpen(): boolean {
    return this.open;
  }

  public openSubmenu(submenu: SubmenuController): void {
    if (!this.menu) return;
    this.submenus.forEach((sibling) => {
      if (sibling !== submenu) sibling.closeInstant();
    });
    void submenu.openMenu();
  }

  private closeAllSubmenus(options: {
    returnFocus: boolean;
    instant?: boolean;
  }): void {
    this.submenus.forEach((submenu) => {
      if (options.instant) {
        submenu.closeInstant();
        return;
      }
      void submenu.close({ returnFocus: options.returnFocus });
    });
  }

  private toggleCheckboxItem(item: HTMLElement): boolean {
    if (!item.hasAttribute("data-dropdown-checkbox-item")) return false;

    const checked = item.getAttribute("aria-checked") === "true";
    item.setAttribute("aria-checked", checked ? "false" : "true");
    item.dispatchEvent(
      new CustomEvent("dropdown:checked-change", {
        bubbles: true,
        detail: { checked: !checked },
      })
    );
    return true;
  }

  private onMenuClick(event: MouseEvent): void {
    if (!this.menu) return;
    // Ignore the synthetic click fired by the finger lifting right after a
    // long-press opened a context menu over an item.
    if (Date.now() < this.suppressItemClickUntil) return;
    const target = event.target as Element | null;
    const item = target?.closest<HTMLElement>("[data-dropdown-item]");
    if (!item) return;
    if (getMenuContainer(item) !== getMenuContainer(target)) return;
    if (isDisabled(item)) return;

    if (item.hasAttribute("data-dropdown-sub-trigger")) return;

    // Checkbox items toggle in place and keep the menu open unless they opt in
    // to closing via `closeOnClick`.
    if (this.toggleCheckboxItem(item)) {
      if (item.getAttribute("data-close-on-click") === "true") {
        void this.close({ returnFocus: false });
      }
      return;
    }

    void this.close({ returnFocus: false });
  }

  private handleTypeahead(menu: HTMLElement, key: string): void {
    if (key.length !== 1) return;
    const isPrintable = !/[\s]/.test(key) && key !== " ";
    if (!isPrintable) return;

    this.typeahead += key.toLowerCase();
    if (this.typeaheadTimer !== null) {
      window.clearTimeout(this.typeaheadTimer);
    }
    this.typeaheadTimer = window.setTimeout(() => {
      this.typeahead = "";
      this.typeaheadTimer = null;
    }, 500);

    const items = getEnabledItems(menu);
    const query = this.typeahead;
    const current = document.activeElement as HTMLElement | null;
    const currentIndex = current ? items.indexOf(current) : -1;
    const ordered =
      currentIndex >= 0
        ? items.slice(currentIndex + 1).concat(items.slice(0, currentIndex + 1))
        : items;
    const match = ordered.find((item) => getItemText(item).startsWith(query));
    if (!match) return;
    setRovingTabindex(menu, match);
    match.focus();
  }

  private onMenuKeydown(event: KeyboardEvent): void {
    if (!this.menu) return;
    const target = event.target as Element | null;
    const menu = getMenuContainer(target);
    if (!menu) return;

    if (event.key === "Tab") {
      void this.close({ returnFocus: false });
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      const submenu = this.submenuByMenu.get(menu);
      if (submenu) {
        void submenu.close({ returnFocus: true });
        return;
      }
      void this.close({ returnFocus: true });
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const submenu = this.submenuByMenu.get(menu);
      if (!submenu) this.closeAllSubmenus({ returnFocus: false });
      focusNext(menu, 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const submenu = this.submenuByMenu.get(menu);
      if (!submenu) this.closeAllSubmenus({ returnFocus: false });
      focusNext(menu, -1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const submenu = this.submenuByMenu.get(menu);
      if (!submenu) this.closeAllSubmenus({ returnFocus: false });
      focusFirst(menu);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const submenu = this.submenuByMenu.get(menu);
      if (!submenu) this.closeAllSubmenus({ returnFocus: false });
      focusLast(menu);
      return;
    }

    if (event.key === "ArrowRight") {
      const active = document.activeElement as HTMLElement | null;
      if (!active) return;
      const submenu = this.submenuByTrigger.get(active);
      if (!submenu) return;
      event.preventDefault();
      this.openSubmenu(submenu);
      focusFirst(submenu.menu);
      return;
    }

    if (event.key === "ArrowLeft") {
      const currentSubmenu = this.submenuByMenu.get(menu);
      if (!currentSubmenu) return;
      event.preventDefault();
      void currentSubmenu.close({ returnFocus: true });
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      const active = document.activeElement as HTMLElement | null;
      if (!active) return;
      if (isDisabled(active)) return;

      const submenu = this.submenuByTrigger.get(active);
      if (submenu) {
        event.preventDefault();
        this.openSubmenu(submenu);
        focusFirst(submenu.menu);
        return;
      }

      if (active.hasAttribute("data-dropdown-item")) {
        event.preventDefault();
        // Defer to the click handler, which closes for plain items and toggles
        // (keeping the menu open) for checkbox items.
        active.click();
      }
      return;
    }

    this.handleTypeahead(menu, event.key);
  }
}

function closeAllDropdowns(
  options: { except?: DropdownRootController } = {}
): void {
  Array.from(openDropdowns).forEach((dropdown) => {
    if (options.except && dropdown === options.except) return;
    if (!dropdown.isOpen()) {
      openDropdowns.delete(dropdown);
      return;
    }
    void dropdown.close({ returnFocus: false });
  });
}

function attachGlobalListeners(): void {
  if (globalListenersAttached) return;
  globalListenersAttached = true;

  document.addEventListener(
    "pointerdown",
    (event) => {
      // Right-clicks open/reposition context menus; never let them dismiss.
      if (event.button === 2) return;
      const target = event.target as Node | null;
      if (!target) return;
      const inside = Array.from(openDropdowns).some((dropdown) =>
        dropdown.containsOpenSurface(target)
      );
      if (inside) return;
      closeAllDropdowns();
    },
    { capture: true }
  );

  document.addEventListener(
    "focusin",
    (event) => {
      const target = event.target as Node | null;
      if (!target) return;
      const inside = Array.from(openDropdowns).some((dropdown) =>
        dropdown.containsOpenSurface(target)
      );
      if (inside) return;
      closeAllDropdowns();
    },
    { capture: true }
  );

  window.addEventListener("blur", () => {
    closeAllDropdowns();
  });
}

export function initDropdowns(): void {
  attachGlobalListeners();

  const roots = Array.from(
    document.querySelectorAll<HTMLElement>("[data-dropdown-root]")
  );

  roots.forEach((root) => {
    if (!dropdownInstances.has(root)) {
      dropdownInstances.set(root, new DropdownRootController(root));
    }
  });

  const controllersById = new Map<string, DropdownRootController>();
  roots.forEach((root) => {
    const controller = dropdownInstances.get(root);
    if (!controller) return;
    controllersById.set(controller.ensureRootId(), controller);
  });

  document
    .querySelectorAll<HTMLElement>("[data-dropdown-trigger][data-dropdown-for]")
    .forEach((wrapper) => {
      const targetId = wrapper.getAttribute("data-dropdown-for");
      if (!targetId) return;
      const controller = controllersById.get(targetId);
      controller?.registerExternalTrigger(wrapper);
    });
}
