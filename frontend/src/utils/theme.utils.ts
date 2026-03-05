export type ThemeSetting = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

export function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function resolveTheme(setting: ThemeSetting): "light" | "dark" {
  return setting === "system" ? getSystemTheme() : setting;
}

export function getStoredTheme(): ThemeSetting {
  const value = window.localStorage.getItem(STORAGE_KEY) as ThemeSetting | null;
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return "system";
}

export function applyTheme(setting: ThemeSetting): void {
  const resolved = resolveTheme(setting);

  const root = document.documentElement;
  root.dataset.theme = resolved;

  window.localStorage.setItem(STORAGE_KEY, setting);
}

export function getNextTheme(setting: ThemeSetting): ThemeSetting {
  if (setting === "light") return "dark";
  if (setting === "dark") return "system";
  return "light";
}
