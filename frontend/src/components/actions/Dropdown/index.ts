import Dropdown from "./Dropdown.astro";
import DropdownContent from "./DropdownContent.astro";
import DropdownItem from "./DropdownItem.astro";
import DropdownLabel from "./DropdownLabel.astro";
import DropdownShortcut from "./DropdownShortcut.astro";
import DropdownSub from "./DropdownSub.astro";
import DropdownSubContent from "./DropdownSubContent.astro";
import DropdownSubTrigger from "./DropdownSubTrigger.astro";
import DropdownTrigger from "./DropdownTrigger.astro";
import {
  dropdownContentVariants,
  dropdownItemVariants,
  dropdownTriggerVariants,
} from "./variants";

const DropdownVariants = {
  dropdownContentVariants,
  dropdownItemVariants,
  dropdownTriggerVariants,
};

export {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownShortcut,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger,
  DropdownVariants,
};

/* TODO: Unsafe assignment of an error typed value.
export default {
  Root: Dropdown,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Label: DropdownLabel,
  Shortcut: DropdownShortcut,
  Sub: DropdownSub,
  SubTrigger: DropdownSubTrigger,
  SubContent: DropdownSubContent,
};
*/
