import { cva, type VariantProps } from "class-variance-authority";

export const dropdownContentVariants = cva(
  `
    bg-popover text-popover-foreground z-50 min-w-[9rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md
    data-[state=open]:animate-in fade-in zoom-in-95  outline-none
    data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards fade-out zoom-out-95
    pointer-events-auto fixed isolate will-change-transform
  `,
  {
    variants: {
      side: {
        bottom: "slide-in-from-top-2 slide-out-to-top-2",
        top: "slide-in-from-bottom-2 slide-out-to-bottom-2",
        right: "slide-in-from-left-2 slide-out-to-left-2",
        left: "slide-in-from-right-2 slide-out-to-right-2",
      },
      align: {
        start: "",
        center: "",
        end: "",
      },
    },
    compoundVariants: [
      {
        side: ["top", "bottom"],
        align: "start",
        class: "slide-in-from-left-1 slide-out-to-left-1",
      },
      {
        side: ["top", "bottom"],
        align: "end",
        class: "slide-in-from-right-1 slide-out-to-right-1",
      },
    ],
    defaultVariants: {
      side: "bottom",
      align: "start",
    },
  }
);

export type DropdownContentVariants = VariantProps<
  typeof dropdownContentVariants
>;

export const dropdownItemVariants = cva(`
    focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 transition-colors outline-none select-none
    aria-disabled::pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50
    group/dropdown-item [&>svg]:size-4 [&>svg]:shrink-0
  `);

export type DropdownItemVariants = VariantProps<typeof dropdownItemVariants>;

export const dropdownTriggerVariants = cva(`
    inline-flex items-center justify-center
    focus-visible:ring-outline/50 transition-[color,box-shadow] outline-none focus-visible:ring-3
    disabled:pointer-events-none
  `);

export type DropdownTriggerVariants = VariantProps<
  typeof dropdownTriggerVariants
>;
