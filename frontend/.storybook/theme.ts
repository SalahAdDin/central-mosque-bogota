import { create } from "storybook/theming";

export const websiteThemeLight = create({
  base: "light",
  brandTitle: "Mezquita Central de Bogotá",
  brandUrl: "/",
  brandImage: "/favicon.svg",
  brandTarget: "_self",
  colorPrimary: "#c13026",
  colorSecondary: "#212e80",
  appBg: "#f8fafc",
  appContentBg: "#ffffff",
  appPreviewBg: "#f8fafc",
  appBorderColor: "#e2e8f0",
  appBorderRadius: 8,
  barBg: "#ffffff",
  barTextColor: "#0a0a0a",
  barSelectedColor: "#c13026",
  barHoverColor: "#212e80",
  textColor: "#0a0a0a",
  textInverseColor: "#f8fafc",
  inputBg: "#ffffff",
  inputBorder: "#e2e8f0",
  inputTextColor: "#0a0a0a",
  inputBorderRadius: 8,
  fontBase:
    "'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  fontCode:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
});

export const websiteThemeDark = create({
  base: "dark",
  brandTitle: "Mezquita Central de Bogotá",
  brandUrl: "/",
  brandImage: "/favicon.svg",
  brandTarget: "_self",
  colorPrimary: "#c13026",
  colorSecondary: "#212e80",
  appBg: "#0f172a",
  appContentBg: "#0b1220",
  appPreviewBg: "#0f172a",
  appBorderColor: "#1e293b",
  appBorderRadius: 8,
  barBg: "#0b1220",
  barTextColor: "#fafafa",
  barSelectedColor: "#c13026",
  barHoverColor: "#93c5fd",
  textColor: "#fafafa",
  textInverseColor: "#0f172a",
  inputBg: "#0f172a",
  inputBorder: "#334155",
  inputTextColor: "#fafafa",
  inputBorderRadius: 8,
  fontBase:
    "'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  fontCode:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
});
