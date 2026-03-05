import {
  applyTheme,
  getNextTheme,
  getStoredTheme,
  resolveTheme,
  type ThemeSetting,
} from "@utils/theme.utils";

const NEXT_LABEL: Record<ThemeSetting, string> = {
  light: "Switch to dark theme",
  dark: "Use system theme",
  system: "Switch to light theme",
};

/**
 * Handles the logic for a single theme toggle button.
 * Manages state synchronization, event handling, and ARIA attributes.
 */
class ThemeToggleHandler {
  private toggle: HTMLButtonElement;
  private initializing = true;

  constructor(toggle: HTMLButtonElement) {
    this.toggle = toggle;
    this.initializeState();
    this.attachEvents();

    queueMicrotask(() => (this.initializing = false));
  }

  /**
   * Initializes the toggle state based on the stored theme.
   */
  private initializeState(): void {
    const theme = getStoredTheme();
    this.syncState(theme);
  }

  /**
   * Attaches click event listeners to the toggle button.
   */
  private attachEvents(): void {
    this.toggle.addEventListener("click", () => {
      this.handleClick();
    });
  }

  /**
   * Handles button click events.
   * Cycles to the next theme, applies it, and dispatches a global change event.
   */
  private handleClick(): void {
    if (this.initializing) return;
    const next: ThemeSetting = getNextTheme(getStoredTheme());
    applyTheme(next);
    document.dispatchEvent(new CustomEvent("theme:change", { detail: { theme: next } }));
  }

  /**
   * Synchronizes the button's attributes with the current theme setting.
   * Updates data attributes and ARIA labels.
   *
   * @param theme - The current theme setting to sync with.
   */
  public syncState(theme: ThemeSetting): void {
    const resolved = resolveTheme(theme);
    const isDark = resolved === "dark";

    this.toggle.dataset.themeSetting = theme;
    this.toggle.dataset.themeResolved = resolved;
    this.toggle.setAttribute("aria-label", NEXT_LABEL[theme]);
    this.toggle.setAttribute("aria-pressed", String(isDark));
  }
}

// Track instances to prevent duplicate handlers and allow global updates
const toggleInstances = new WeakMap<HTMLButtonElement, ThemeToggleHandler>();
const activeToggles = new Set<HTMLButtonElement>();

/**
 * Scans the DOM for theme toggle buttons and initializes handlers for them.
 *
 * @param clearExisting - Whether to clear the list of active toggles (useful for view transitions).
 */
export function setupThemeToggles(clearExisting = false) {
  if (clearExisting) activeToggles.clear();

  document
    .querySelectorAll<HTMLButtonElement>("[data-theme-toggle]")
    .forEach((toggle) => {
      if (!toggleInstances.has(toggle)) {
        toggleInstances.set(toggle, new ThemeToggleHandler(toggle));
      }
      activeToggles.add(toggle);
    });
}

/**
 * Global event handler for theme changes.
 * Syncs all active toggle buttons when the theme changes.
 */
function handleThemeChange(event: Event) {
  const { theme } = (event as CustomEvent<{ theme: ThemeSetting }>).detail;
  activeToggles.forEach(toggle => toggleInstances.get(toggle)?.syncState(theme));
}

// Listen for global theme changes to keep multiple buttons in sync
document.addEventListener("theme:change", handleThemeChange);

/**
 * Initializes the theme system.
 * 1. Applies the stored theme.
 * 2. Sets up toggle buttons.
 * 3. Listens for system color scheme changes.
 */
export function initThemeToggle() {
  const initial = getStoredTheme();
  applyTheme(initial);
  setupThemeToggles(true);

  activeToggles.forEach(toggle => toggleInstances.get(toggle)?.syncState(initial));

  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemChange = () => {
    if (getStoredTheme() !== "system") return;
    applyTheme("system");
    document.dispatchEvent(new CustomEvent("theme:change", { detail: { theme: "system" } }));
  };
  mql.addEventListener("change", handleSystemChange);
}
