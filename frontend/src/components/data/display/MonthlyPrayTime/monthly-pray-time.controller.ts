const COLLAPSED_ROWS = 7;

/**
 * Wires up the "show more / show less" progressive-disclosure behavior for a
 * single monthly prayer-times table.
 *
 * The collapsed view shows the first {@link COLLAPSED_ROWS} rows; clicking the
 * toggle animates the clip height between the collapsed and full table heights
 * and mirrors the state in `data-monthly-expanded` (used by CSS for row
 * visibility) and the toggle's `aria-expanded`. Animations are skipped when the
 * user prefers reduced motion.
 *
 * Idempotent per `root` via the `data-monthly-toggle-ready` guard.
 */
export function initMonthlyPrayTimeTable(root: HTMLElement): void {
  const clip = root.querySelector<HTMLElement>("[data-monthly-table-clip]");
  const toggle = root.querySelector<HTMLButtonElement>(
    "[data-action=show-more]"
  );
  const table = clip?.querySelector<HTMLTableElement>("table");
  const body = root.querySelector<HTMLTableSectionElement>("#full-month-table");

  if (!clip || !toggle || !table || !body) return;
  if (root.dataset.monthlyToggleReady === "true") return;
  root.dataset.monthlyToggleReady = "true";

  const rows = Array.from(body.querySelectorAll<HTMLTableRowElement>("tr"));

  if (rows.length <= COLLAPSED_ROWS) {
    toggle.style.display = "none";
    clip.style.height = "";
    clip.dataset.monthlyAnimate = "";
    root.dataset.monthlyExpanded = "true";
    return;
  }

  toggle.style.display = "";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const computeCollapsedHeight = (): number => {
    const clipTop = clip.getBoundingClientRect().top;
    const collapsedRow = rows[Math.min(COLLAPSED_ROWS - 1, rows.length - 1)];
    return Math.ceil(collapsedRow.getBoundingClientRect().bottom - clipTop);
  };

  const computeExpandedHeight = (): number =>
    Math.ceil(table.getBoundingClientRect().height);

  const setClipHeight = (
    height: number,
    options: { animate: boolean }
  ): void => {
    const { animate } = options;
    if (animate) clip.dataset.monthlyAnimate = "true";
    else clip.dataset.monthlyAnimate = "";

    clip.style.height = `${String(height)}px`;
  };

  const setExpanded = (
    expanded: boolean,
    options: { animate: boolean }
  ): void => {
    root.dataset.monthlyExpanded = expanded ? "true" : "false";
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (expanded) setClipHeight(computeExpandedHeight(), options);
    else setClipHeight(computeCollapsedHeight(), options);
  };

  setExpanded(false, { animate: false });
  requestAnimationFrame(() => {
    clip.dataset.monthlyAnimate = "true";
  });

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      const collapsedHeight = computeCollapsedHeight();
      toggle.setAttribute("aria-expanded", "false");
      setClipHeight(collapsedHeight, { animate: !prefersReducedMotion });

      if (prefersReducedMotion) {
        root.dataset.monthlyExpanded = "false";
        return;
      }

      const onEnd = (event: TransitionEvent): void => {
        if (event.propertyName !== "height") return;
        clip.removeEventListener("transitionend", onEnd);
        if (toggle.getAttribute("aria-expanded") === "false") {
          root.dataset.monthlyExpanded = "false";
        }
      };
      clip.addEventListener("transitionend", onEnd);
      return;
    }

    root.dataset.monthlyExpanded = "true";
    toggle.setAttribute("aria-expanded", "true");

    requestAnimationFrame(() => {
      setClipHeight(computeExpandedHeight(), {
        animate: !prefersReducedMotion,
      });
    });
  });

  const onResize = (): void => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      root.dataset.monthlyExpanded = "true";
      setClipHeight(computeExpandedHeight(), { animate: false });
    } else {
      root.dataset.monthlyExpanded = "false";
      setClipHeight(computeCollapsedHeight(), { animate: false });
    }
    requestAnimationFrame(() => {
      clip.dataset.monthlyAnimate = "true";
    });
  };

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("load", onResize, { passive: true });
}

/**
 * Initializes every monthly prayer-times table currently in the document.
 */
export function initMonthlyPrayTimes(): void {
  const roots = Array.from(
    document.querySelectorAll<HTMLElement>("[data-monthly-table-root]")
  );
  for (const root of roots) initMonthlyPrayTimeTable(root);
}
