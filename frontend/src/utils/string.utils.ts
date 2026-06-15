const INTERPOLATION_REGEX = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

/**
 * Performs simple string interpolation using `{{ key }}` placeholders.
 *
 * - Placeholders are matched by the `INTERPOLATION_REGEX` pattern.
 * - Values are stringified with `String(...)`.
 * - When `vars` is omitted, the original template is returned.
 *
 * @param template - The template string containing `{{ key }}` placeholders.
 * @param vars - Key/value pairs used to replace placeholders.
 * @returns The interpolated string.
 */
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

/**
 * Converts a string into a safe, URL/filename-friendly slug segment.
 *
 * Transformations:
 * - Trims and lowercases
 * - Converts whitespace/underscores to `-`
 * - Removes non `[a-z0-9-]` characters
 * - Collapses multiple `-` and strips leading/trailing `-`
 *
 * @param value - Input string to slugify.
 * @returns Slugified string suitable for filenames/URLs.
 */
export function slugifyFilenamePart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
