import {
  experimental_AstroContainer as AstroContainer,
  type ContainerRenderOptions,
} from "astro/container";
import type { ComponentProps } from "astro/types";
import { Window } from "happy-dom";

type GlobalDomShim = {
  window: Window;
  document: Document;
  HTMLDialogElement: typeof HTMLDialogElement;
  HTMLButtonElement: typeof HTMLButtonElement;
  HTMLElement: typeof HTMLElement;
  Event: typeof Event;
  MouseEvent: typeof MouseEvent;
  KeyboardEvent: typeof KeyboardEvent;
  requestAnimationFrame: typeof requestAnimationFrame;
};

export function installDomGlobals(window: Window, document: Document): void {
  const globalDom = globalThis as unknown as GlobalDomShim;
  globalDom.window = window;
  globalDom.document = document;

  globalDom.HTMLDialogElement
    = window.HTMLDialogElement as unknown as typeof HTMLDialogElement;
  globalDom.HTMLButtonElement
    = window.HTMLButtonElement as unknown as typeof HTMLButtonElement;
  globalDom.HTMLElement = window.HTMLElement as unknown as typeof HTMLElement;
  globalDom.Event = window.Event as unknown as typeof Event;
  globalDom.MouseEvent = window.MouseEvent as unknown as typeof MouseEvent;
  globalDom.KeyboardEvent
    = window.KeyboardEvent as unknown as typeof KeyboardEvent;

  globalDom.requestAnimationFrame = ((cb: FrameRequestCallback): number => {
    cb(0);
    return 0;
  }) as typeof requestAnimationFrame;
}

export function installMatchMedia(window: Window): void {
  const win = window;
  const existingMatchMedia
    = typeof win.matchMedia === "function" ? win.matchMedia.bind(win) : null;

  type HappyDomMediaQueryList = ReturnType<Window["matchMedia"]>;

  win.matchMedia = (mediaQueryString: string): HappyDomMediaQueryList => {
    if (mediaQueryString.includes("prefers-reduced-motion")) {
      return {
        matches: true,
        media: mediaQueryString,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn().mockReturnValue(false),
      } as unknown as HappyDomMediaQueryList;
    }

    if (existingMatchMedia) return existingMatchMedia(mediaQueryString);

    return {
      matches: false,
      media: mediaQueryString,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn().mockReturnValue(false),
    } as unknown as HappyDomMediaQueryList;
  };
}

export function ensureElementGetAnimations(element: HTMLElement): void {
  const elAny = element as unknown as {
    getAnimations?: () => Array<Animation>;
  };
  if (typeof elAny.getAnimations !== "function") {
    elAny.getAnimations = (): Array<Animation> => [];
  }
}

export function ensureDialogApi(dialog: HTMLDialogElement): void {
  const dialogApi = dialog as unknown as {
    showModal?: () => void;
    show?: () => void;
    close?: () => void;
    open?: boolean;
    getAnimations?: () => Array<Animation>;
  };

  if (typeof dialogApi.showModal !== "function") {
    dialogApi.showModal = () => {
      dialog.setAttribute("open", "");
      dialogApi.open = true;
    };
  }

  if (typeof dialogApi.show !== "function") {
    dialogApi.show = () => {
      dialog.setAttribute("open", "");
      dialogApi.open = true;
    };
  }

  if (typeof dialogApi.close !== "function") {
    dialogApi.close = () => {
      dialog.removeAttribute("open");
      dialogApi.open = false;
      dialog.dispatchEvent(new Event("close"));
    };
  }

  if (typeof dialogApi.getAnimations !== "function") {
    dialogApi.getAnimations = (): Array<Animation> => [];
  }
}

type UserEventModule = typeof import("@testing-library/user-event");
type UserEventApi = ReturnType<UserEventModule["default"]["setup"]>;

export async function createUser(window: Window): Promise<UserEventApi> {
  const { default: userEvent } = await import("@testing-library/user-event");

  return userEvent.setup({
    document: window.document as unknown as Document,
    advanceTimers: vi.advanceTimersByTime,
  });
}

type TAstroComponentFactory = Parameters<AstroContainer["renderToString"]>[0];

type ComponentContainerRenderOptions<TProps extends TAstroComponentFactory>
  = Omit<ContainerRenderOptions, "props"> & {
    // @ts-expect-error ComponentProps expects a type that extends a function of arity 1, but
    // AstroComponentFactory is a function of arity 3. Either this is an internal mix up in Astro,
    // or I'm missing something.
    props?: ComponentProps<TProps>;
  };

export async function renderAstroComponentToDom<
  TComponent extends TAstroComponentFactory
>(
  Component: TComponent,
  options: ComponentContainerRenderOptions<TComponent> = {}
): Promise<{ window: Window; root: HTMLElement; close: () => Promise<void> }> {
  const astroContainer = await AstroContainer.create();
  const html = await astroContainer.renderToString(Component, options);

  const window = new Window({
    innerHeight: 768,
    innerWidth: 1024,
    url: "http://localhost:4321",
  });

  window.document.write("<html><head><title>Test page</title></head><body></body></html>");

  await window.happyDOM.waitUntilComplete();

  window.document.body.innerHTML = html;

  return {
    window,
    root: window.document.body as unknown as HTMLElement,
    close: () => window.happyDOM.close(),
  };
}
