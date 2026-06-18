import { cva } from "class-variance-authority";

export const tableVariants = cva("w-full caption-bottom text-sm");

export const tableBodyVariants = cva("[&_tr:last-child]:border-0");

export const tableCaptionVariants = cva("mt-4 text-sm text-muted-foreground");

export const tableCellVariants = cva(`
  p-2 align-middle whitespace-nowrap
  [&:has([role=checkbox])]:pr-0
  [&>[role=checkbox]]:translate-y-[2px]
`);

export const tableFooterVariants = cva(`
  border-t bg-muted/50 font-medium
  [&>tr]:last:border-b-0
`);

export const tableHeadVariants = cva(`
  h-10 px-2 text-left align-middle font-medium text-muted-foreground whitespace-nowrap
  [&:has([role=checkbox])]:pr-0
  [&>[role=checkbox]]:translate-y-[2px]
`);

export const tableHeaderVariants = cva("[&_tr]:border-b");

export const tableRowVariants = cva(`
  border-b transition-colors
  hover:bg-muted/50
  data-[state=selected]:bg-muted
`);
