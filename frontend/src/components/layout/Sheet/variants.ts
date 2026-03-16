import { cva, type VariantProps } from "class-variance-authority";

export const dialogBackdropVariants = cva(`
    fixed inset-0 top-0 left-0 z-50 hidden h-screen w-screen bg-black/80
    data-[state=open]:animate-in fade-in
    data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards fade-out
    data-[state=closed]:duration-300 data-[state=open]:duration-500
  `);

export const sheetContentVariants = cva(
  `
    dialog-content
    bg-background fixed z-50 flex-col gap-4 shadow-lg transition ease-in-out open:flex
    data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards
    data-[state=closed]:duration-300 data-[state=open]:duration-500
  `,
  {
    variants: {
      side: {
        right: [
          "slide-out-to-right slide-in-from-right",
          "inset-y-0 right-0 left-auto h-full max-h-[100dvh] w-3/4 border-l sm:max-w-sm",
        ],
        left: [
          "slide-out-to-left slide-in-from-left",
          "inset-y-0 right-auto left-0 h-full max-h-[100dvh] w-3/4 border-r sm:max-w-sm",
        ],
        top: [
          "slide-out-to-top slide-in-from-top",
          "inset-x-0 top-0 bottom-auto h-auto w-full max-w-screen border-b",
        ],
        bottom: [
          "slide-out-to-bottom slide-in-from-bottom",
          "inset-x-0 top-auto bottom-0 h-auto w-full max-w-screen border-t",
        ],
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

export type SheetContentVariants = VariantProps<typeof sheetContentVariants>;

export const sheetCloseButtonVariants = cva(`
  text-foreground absolute top-4 right-4 rounded-xs [&>span]:opacity-70 hover:[&>span]:opacity-100
  focus-visible:ring-outline/50 transition-[color,box-shadow] outline-none focus-visible:ring-3
`);
