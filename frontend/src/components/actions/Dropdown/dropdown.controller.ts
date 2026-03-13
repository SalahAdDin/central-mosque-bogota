type DropdownSide = "bottom" | "top" | "left" | "right";

const dropdownInstances = new WeakMap<HTMLElement, DropdownRootController>();
const openDropdowns = new Set<DropdownRootController>();

let globalListenersAttached = false;
let idCounter = 0;

function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${String(idCounter)}`;
}

function getMenuContainer(element: Element | null): HTMLElement | null {
  return (
    element?.closest<HTMLElement>("[data-dropdown-content],[data-dropdown-sub-content]") ?? null
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
    side === "bottom"
    || side === "top"
    || side === "left"
    || side === "right"
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
  const from = base.multiply(new DOMMatrix().translate(offset.x, offset.y).scale(0.95));

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
  }
  catch {
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
  const to = base.multiply(new DOMMatrix().translate(offset.x, offset.y).scale(0.95));

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
  }
  catch {
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
  const candidates = Array.from(menu.querySelectorAll<HTMLElement>("[data-dropdown-item]"));
  return candidates
    .filter(el => getMenuContainer(el) === menu)
    .filter(el => !isDisabled(el));
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
  const startIndex
    = currentIndex === -1 ? (direction === 1 ? -1 : items.length) : currentIndex;
  const nextIndex = (startIndex + direction + items.length) % items.length;
  const next = items[nextIndex];
  setRovingTabindex(menu, next);
  next.focus();
}

function getItemText(item: HTMLElement): string {
  return item.textContent.trim().replace(/\s+/g, " ").toLowerCase();
}

class SubmenuController {
  public readonly wrapper: HTMLElement;
  public readonly trigger: HTMLButtonElement;
  public readonly menu: HTMLElement;
  private readonly root: DropdownRootController;
  private closeTimer: number | null = null;
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

  public async openMenu(): Promise<void> {
    this.cancelCloseTimer();
    if (this.open) return;

    this.open = true;
    this.trigger.setAttribute("aria-expanded", "true");
    this.menu.dataset.state = "open";
    this.menu.style.display = "block";
    setMenuInteractive(this.menu, true);
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

    if (options.returnFocus) this.trigger.focus();
  }

  public closeInstant(): void {
    this.cancelCloseTimer();
    this.open = false;
    this.trigger.setAttribute("aria-expanded", "false");
    this.menu.dataset.state = "closed";
    setMenuInteractive(this.menu, false);
    this.menu.style.display = "none";
  }
}

class DropdownRootController {
  private readonly root: HTMLElement;
  private trigger: HTMLButtonElement | null = null;
  private menu: HTMLElement | null = null;
  private open = false;
  private closeTimer: number | null = null;
  private submenus: Array<SubmenuController> = [];
  private submenuByTrigger = new WeakMap<HTMLElement, SubmenuController>();
  private submenuByMenu = new WeakMap<HTMLElement, SubmenuController>();
  private typeahead = "";
  private typeaheadTimer: number | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
    this.initialize();
  }

  private initialize(): void {
    const trigger = this.root.querySelector<HTMLButtonElement>("[data-dropdown-trigger]");
    const menu = this.root.querySelector<HTMLElement>("[data-dropdown-content]");
    if (!trigger || !menu) return;

    this.trigger = trigger;
    this.menu = menu;

    this.ensureIds();
    this.applyA11y();
    this.attachEvents();
    this.initSubmenus();
    this.closeInstant();
  }

  private ensureIds(): void {
    if (!this.trigger || !this.menu) return;
    if (!this.trigger.id) this.trigger.id = nextId("dropdown-trigger");
    if (!this.menu.id) this.menu.id = nextId("dropdown-menu");
  }

  private applyA11y(): void {
    if (!this.trigger || !this.menu) return;
    this.trigger.setAttribute("aria-haspopup", "menu");
    this.trigger.setAttribute("aria-expanded", "false");
    this.trigger.setAttribute("aria-controls", this.menu.id);

    this.menu.setAttribute("aria-labelledby", this.trigger.id);
  }

  private attachEvents(): void {
    const trigger = this.trigger;
    const menu = this.menu;
    if (!trigger || !menu) return;

    trigger.addEventListener("click", (event) => {
      if (isDisabled(trigger)) return;
      event.preventDefault();
      if (this.open) {
        void this.close({ returnFocus: true });
        return;
      }
      void this.openMenu({ focus: "none" });
    });

    trigger.addEventListener("keydown", (event) => {
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

    menu.addEventListener("keydown", (event) => {
      this.onMenuKeydown(event);
    });
    menu.addEventListener("click", (event) => {
      this.onMenuClick(event);
    });

    this.root.addEventListener("pointerenter", () => {
      if (!this.openOnHoverEnabled()) return;
      if (!this.trigger || isDisabled(this.trigger)) return;
      this.cancelCloseTimer();
      void this.openMenu({ focus: "none" });
    });

    this.root.addEventListener("pointerleave", () => {
      if (!this.openOnHoverEnabled()) return;
      if (!this.open) return;
      this.scheduleClose(this.getCloseDelay());
    });
  }

  private initSubmenus(): void {
    if (!this.menu) return;

    const wrappers = Array.from(this.menu.querySelectorAll<HTMLElement>("[data-dropdown-sub]")).filter(wrapper => getMenuContainer(wrapper) === this.menu);

    this.submenus = wrappers
      .map((wrapper) => {
        const trigger = wrapper.querySelector<HTMLButtonElement>("[data-dropdown-sub-trigger]");
        const menu = wrapper.querySelector<HTMLElement>("[data-dropdown-sub-content]");
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

  public async openMenu(options: {
    focus: "none" | "first" | "last";
  }): Promise<void> {
    if (!this.trigger || !this.menu) return;
    this.cancelCloseTimer();

    if (!this.open) {
      closeAllDropdowns({ except: this });
      this.open = true;
      openDropdowns.add(this);

      this.menu.dataset.state = "open";
      this.menu.style.display = "block";
      setMenuInteractive(this.menu, true);
      this.trigger.setAttribute("aria-expanded", "true");
      await animateOpen(this.menu);
    }

    if (options.focus === "first") focusFirst(this.menu);
    if (options.focus === "last") focusLast(this.menu);
    if (options.focus === "none") {
      setRovingTabindex(this.menu, getEnabledItems(this.menu)[0] ?? null);
    }
  }

  public async close(options: { returnFocus: boolean }): Promise<void> {
    if (!this.trigger || !this.menu) return;
    this.cancelCloseTimer();

    this.closeAllSubmenus({ returnFocus: false });

    if (!this.open) return;
    this.open = false;
    openDropdowns.delete(this);

    this.menu.dataset.state = "closed";
    setMenuInteractive(this.menu, false);
    this.trigger.setAttribute("aria-expanded", "false");
    await animateClose(this.menu);
    this.menu.style.display = "none";

    if (options.returnFocus) this.trigger.focus();
  }

  public closeInstant(): void {
    if (!this.trigger || !this.menu) return;

    this.cancelCloseTimer();
    this.closeAllSubmenus({ returnFocus: false, instant: true });

    this.open = false;
    openDropdowns.delete(this);

    this.menu.dataset.state = "closed";
    setMenuInteractive(this.menu, false);
    this.trigger.setAttribute("aria-expanded", "false");
    this.menu.style.display = "none";
  }

  public contains(node: Node): boolean {
    return this.root.contains(node);
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

  private onMenuClick(event: MouseEvent): void {
    if (!this.menu) return;
    const target = event.target as Element | null;
    const item = target?.closest<HTMLElement>("[data-dropdown-item]");
    if (!item) return;
    if (getMenuContainer(item) !== getMenuContainer(target)) return;
    if (isDisabled(item)) return;

    if (item.hasAttribute("data-dropdown-sub-trigger")) return;

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
    const ordered
      = currentIndex >= 0
        ? items.slice(currentIndex + 1).concat(items.slice(0, currentIndex + 1))
        : items;
    const match = ordered.find(item => getItemText(item).startsWith(query));
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
        active.click();
        void this.close({ returnFocus: false });
      }
      return;
    }

    this.handleTypeahead(menu, event.key);
  }
}

function closeAllDropdowns(options: { except?: DropdownRootController } = {}): void {
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
      const target = event.target as Node | null;
      if (!target) return;
      const inside = Array.from(openDropdowns).some(dropdown => dropdown.contains(target));
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
      const inside = Array.from(openDropdowns).some(dropdown => dropdown.contains(target));
      if (inside) return;
      closeAllDropdowns();
    },
    { capture: true }
  );

  window.addEventListener("blur", () => {
    closeAllDropdowns();
  });
  window.addEventListener("resize", () => {
    closeAllDropdowns();
  });
}

export function initDropdowns(): void {
  attachGlobalListeners();

  document
    .querySelectorAll<HTMLElement>("[data-dropdown-root]")
    .forEach((root) => {
      if (!dropdownInstances.has(root)) {
        dropdownInstances.set(root, new DropdownRootController(root));
      }
    });
}
