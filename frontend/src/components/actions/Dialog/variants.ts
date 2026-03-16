import { cva, type VariantProps } from "class-variance-authority";

export const dialogBackdropVariants = cva(`
  fixed inset-0 top-0 left-0 z-50 hidden h-screen w-screen bg-black/80
  data-[state=open]:animate-in fade-in
  data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards fade-out
`);

export const dialogContentVariants = cva(`
  dialog-content
  fixed top-16 left-[50%] z-50 translate-x-[-50%] sm:top-[50%] sm:translate-y-[-50%]
  bg-background w-full max-w-md rounded-lg border p-8 shadow-lg
  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards transition-[translate,scale,opacity]
  fade-in zoom-in-95 slide-in-from-bottom-2
  fade-out zoom-out-95 slide-out-to-bottom-2
  data-[state=open]:data-[nested-dialog-open]:-translate-y-[calc(50%-var(--nested-offset)*var(--nested-dialogs,1))]
  data-[state=open]:data-[nested-dialog-open]:scale-[calc(1-var(--nested-scale)*var(--nested-dialogs,1))]
  max-sm:data-[state=open]:data-[nested-dialog-open]:translate-y-[calc(var(--nested-offset)*var(--nested-dialogs,1))]
`);

export type DialogContentVariants = VariantProps<typeof dialogContentVariants>;

export const dialogCloseButtonVariants = cva(`
  text-muted-foreground
  absolute top-5.5 right-5.5 rounded-sm [&>span]:opacity-70 hover:[&>span]:opacity-100
  focus-visible:ring-outline/50 transition-[color,box-shadow] outline-none focus-visible:ring-3
`);
