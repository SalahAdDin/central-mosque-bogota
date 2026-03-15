import Dialog from "./Dialog.astro";
import DialogClose from "./DialogClose.astro";
import DialogContent from "./DialogContent.astro";
import DialogDescription from "./DialogDescription.astro";
import DialogFooter from "./DialogFooter.astro";
import DialogHeader from "./DialogHeader.astro";
import DialogTitle from "./DialogTitle.astro";
import DialogTrigger from "./DialogTrigger.astro";
import { dialogContentVariants } from "./variants";

const DialogVariants = {
  dialogContentVariants,
};

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogVariants,
};

/* TODO: Unsafe assignment of an error typed value.
export default {
  Root: Dialog,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};
*/
