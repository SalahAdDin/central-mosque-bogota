import Table from "./Table.astro";
import TableBody from "./TableBody.astro";
import TableCaption from "./TableCaption.astro";
import TableCell from "./TableCell.astro";
import TableFooter from "./TableFooter.astro";
import TableHead from "./TableHead.astro";
import TableHeader from "./TableHeader.astro";
import TableRow from "./TableRow.astro";
import {
  tableBodyVariants,
  tableCaptionVariants,
  tableCellVariants,
  tableFooterVariants,
  tableHeadVariants,
  tableHeaderVariants,
  tableRowVariants,
  tableVariants,
} from "./variants";

const TableVariants = {
  tableVariants,
  tableBodyVariants,
  tableCaptionVariants,
  tableCellVariants,
  tableFooterVariants,
  tableHeadVariants,
  tableHeaderVariants,
  tableRowVariants,
};

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableVariants,
};
