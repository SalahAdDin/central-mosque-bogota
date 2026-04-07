const INTERPOLATION_REGEX = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

export function interpolate(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template;

  return template.replace(INTERPOLATION_REGEX, (_match, key: string) => {
    const value = vars[key];

    return String(value);
  });
}

export function slugifyFilenamePart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
