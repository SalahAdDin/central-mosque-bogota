import { getByRole } from "@testing-library/dom";
import {
  createUser,
  ensureElementGetAnimations,
  installDomGlobals,
  installMatchMedia,
  renderAstroComponentToDom,
} from "@utils/test.helpers";
import { Window } from "happy-dom";

import CheckboxMock from "./CheckboxMock.astro";
import DropdownMock from "./Mock.astro";

type SetupResult = {
  window: Window;
  close: () => Promise<void>;
  root: HTMLElement;
  trigger: HTMLButtonElement;
  menu: HTMLElement;
};

async function setupDropdownDom(): Promise<SetupResult> {
  const { window, close, root } = await renderAstroComponentToDom(DropdownMock);
  const document = window.document as unknown as Document;

  installDomGlobals(window, document);
  installMatchMedia(window);

  const trigger = getByRole<HTMLButtonElement>(document.body, "button", {
    name: "Open Menu",
  });

  const menu = getByRole(document.body, "menu", {
    hidden: true,
  });

  ensureElementGetAnimations(menu);

  return { window, close, root, trigger, menu };
}

describe("Dropdown Component", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  it("should render default root attributes when no props are provided", async () => {
    const { close, root } = await setupDropdownDom();

    try {
      const dropdownRoot = root.querySelector<HTMLElement>(
        "[data-dropdown-root]"
      );
      if (!dropdownRoot)
        throw new Error(
          "Expected dropdown mock to render a data-dropdown-root"
        );

      expect(dropdownRoot.className).toContain("relative");
      expect(dropdownRoot.getAttribute("data-open-on-hover")).toBeNull();
      expect(dropdownRoot.getAttribute("data-close-delay")).toBe("200");
    } finally {
      await close();
    }
  });

  it("should open the dropdown when the trigger is clicked", async () => {
    const { initDropdowns } = await import("./dropdown.controller");
    const { window, close, trigger, menu } = await setupDropdownDom();
    const user = await createUser(window);

    try {
      initDropdowns();

      expect(trigger.getAttribute("aria-disabled")).not.toBe("true");
      expect(trigger.matches("[disabled]")).toBe(false);
      expect(trigger.disabled).toBe(false);

      await user.click(trigger);
      await vi.runAllTimersAsync();
      await Promise.resolve();

      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(menu.style.display).toBe("block");
      expect(menu.dataset.state).toBe("open");
    } finally {
      await close();
    }
  });

  it("should close the dropdown when a menu item is clicked", async () => {
    const { initDropdowns } = await import("./dropdown.controller");
    const { window, close, trigger, menu } = await setupDropdownDom();
    const user = await createUser(window);

    try {
      initDropdowns();

      await user.click(trigger);
      await vi.runAllTimersAsync();
      await Promise.resolve();

      expect(menu.dataset.state).toBe("open");

      const item = getByRole(menu, "menuitem", {
        name: "Settings",
        hidden: true,
      });

      await user.click(item);
      await vi.runAllTimersAsync();
      await Promise.resolve();

      expect(menu.dataset.state).toBe("closed");
      expect(menu.style.display).toBe("none");
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    } finally {
      await close();
    }
  });

  it("should close the dropdown when Escape is pressed", async () => {
    const { initDropdowns } = await import("./dropdown.controller");
    const { window, close, trigger, menu } = await setupDropdownDom();
    const user = await createUser(window);

    try {
      initDropdowns();

      await user.click(trigger);
      await vi.runAllTimersAsync();
      await Promise.resolve();

      expect(menu.dataset.state).toBe("open");

      menu.focus();
      await user.keyboard("{Escape}");
      await vi.runAllTimersAsync();
      await Promise.resolve();

      expect(menu.dataset.state).toBe("closed");
      expect(menu.style.display).toBe("none");
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    } finally {
      await close();
    }
  });

  it("should portal and anchor the content when opened, then restore it on close", async () => {
    const { initDropdowns } = await import("./dropdown.controller");
    const { window, close, root, trigger, menu } = await setupDropdownDom();
    const user = await createUser(window);

    try {
      initDropdowns();

      const dropdownRoot = root.querySelector<HTMLElement>(
        "[data-dropdown-root]"
      );
      if (!dropdownRoot) throw new Error("Expected a data-dropdown-root");

      expect(dropdownRoot.contains(menu)).toBe(true);

      await user.click(trigger);
      await vi.runAllTimersAsync();
      await Promise.resolve();

      // Content is portaled out of the root (to document.body) and anchored.
      expect(dropdownRoot.contains(menu)).toBe(false);
      expect(menu.parentElement).toBe(window.document.body);
      expect(menu.style.position).toBe("fixed");
      expect(menu.style.top).not.toBe("");
      expect(menu.style.left).not.toBe("");
      expect(menu.getAttribute("data-side")).toBe("bottom");

      await user.keyboard("{Escape}");
      await vi.runAllTimersAsync();
      await Promise.resolve();

      // Content is moved back to its original location and positioning cleared.
      expect(dropdownRoot.contains(menu)).toBe(true);
      expect(menu.style.position).toBe("");
      expect(menu.style.top).toBe("");
    } finally {
      await close();
    }
  });

  it("should toggle a checkbox item in place when clicked, keeping the menu open", async () => {
    const { initDropdowns } = await import("./dropdown.controller");
    const { window, close, root } =
      await renderAstroComponentToDom(CheckboxMock);
    const document = window.document as unknown as Document;
    installDomGlobals(window, document);
    installMatchMedia(window);

    const trigger = getByRole<HTMLButtonElement>(document.body, "button", {
      name: "Open Menu",
    });
    const menu = getByRole(document.body, "menu", { hidden: true });
    ensureElementGetAnimations(menu);

    const user = await createUser(window);

    try {
      initDropdowns();

      await user.click(trigger);
      await vi.runAllTimersAsync();
      await Promise.resolve();

      const item = getByRole(menu, "menuitemcheckbox", {
        name: "Show toolbar",
        hidden: true,
      });
      expect(item.getAttribute("aria-checked")).toBe("false");

      await user.click(item);
      await vi.runAllTimersAsync();
      await Promise.resolve();

      expect(item.getAttribute("aria-checked")).toBe("true");
      expect(menu.dataset.state).toBe("open");

      await user.click(item);
      await vi.runAllTimersAsync();
      await Promise.resolve();

      expect(item.getAttribute("aria-checked")).toBe("false");
      expect(menu.dataset.state).toBe("open");
    } finally {
      await close();
      void root;
    }
  });

  it("should close after toggling a checkbox item when closeOnClick is set", async () => {
    const { initDropdowns } = await import("./dropdown.controller");
    const { window, close } = await renderAstroComponentToDom(CheckboxMock);
    const document = window.document as unknown as Document;
    installDomGlobals(window, document);
    installMatchMedia(window);

    const trigger = getByRole<HTMLButtonElement>(document.body, "button", {
      name: "Open Menu",
    });
    const menu = getByRole(document.body, "menu", { hidden: true });
    ensureElementGetAnimations(menu);

    const user = await createUser(window);

    try {
      initDropdowns();

      await user.click(trigger);
      await vi.runAllTimersAsync();
      await Promise.resolve();

      const item = getByRole(menu, "menuitemcheckbox", {
        name: "Show sidebar",
        hidden: true,
      });

      await user.click(item);
      await vi.runAllTimersAsync();
      await Promise.resolve();

      expect(item.getAttribute("aria-checked")).toBe("true");
      expect(menu.dataset.state).toBe("closed");
    } finally {
      await close();
    }
  });
});
