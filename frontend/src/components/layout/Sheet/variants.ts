import { cva, type VariantProps } from "class-variance-authority";

export const dialogBackdropVariants = cva(`
    fixed inset-0 top-0 left-0 z-50 h-screen w-screen bg-black/80
    pointer-events-none opacity-0
    transition-opacity ease-in-out
    duration-300 data-[state=open]:duration-500
    data-[state=open]:pointer-events-auto data-[state=open]:opacity-100
  `);

export const sheetContentVariants = cva(
  `
    bg-background fixed z-50 flex flex-col gap-4 shadow-lg
    pointer-events-none opacity-0 will-change-transform
    transition-[transform,opacity] ease-in-out
    duration-300 data-[state=open]:duration-500
    data-[state=open]:pointer-events-auto data-[state=open]:opacity-100
  `,
  {
    variants: {
      side: {
        right: [
          "inset-y-0 right-0 left-auto h-full max-h-[100dvh] w-3/4 border-l sm:max-w-sm",
          "translate-x-full data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full",
        ],
        left: [
          "inset-y-0 right-auto left-0 h-full max-h-[100dvh] w-3/4 border-r sm:max-w-sm",
          "-translate-x-full data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full",
        ],
        top: [
          "inset-x-0 top-0 bottom-auto h-auto w-full max-w-screen border-b",
          "-translate-y-full data-[state=open]:translate-y-0 data-[state=closed]:-translate-y-full",
        ],
        bottom: [
          "inset-x-0 top-auto bottom-0 h-auto w-full max-w-screen border-t",
          "translate-y-full data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full",
        ],
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

export type SheetContentVariants = VariantProps<typeof sheetContentVariants>;

export const sheetCloseButtonVariants = cva(`text-foreground absolute top-4 right-4 rounded-xs [&>span]:opacity-70 hover:[&>span]:opacity-100
  focus-visible:ring-outline/50 transition-[color,box-shadow] outline-none focus-visible:ring-3
  `);
