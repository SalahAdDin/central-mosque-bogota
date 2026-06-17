import Dropdown from "./Dropdown.astro";
import DropdownCheckboxItem from "./DropdownCheckboxItem.astro";
import DropdownContent from "./DropdownContent.astro";
import DropdownGroup from "./DropdownGroup.astro";
import DropdownItem from "./DropdownItem.astro";
import DropdownLabel from "./DropdownLabel.astro";
import DropdownSeparator from "./DropdownSeparator.astro";
import DropdownShortcut from "./DropdownShortcut.astro";
import DropdownSub from "./DropdownSub.astro";
import DropdownSubContent from "./DropdownSubContent.astro";
import DropdownSubTrigger from "./DropdownSubTrigger.astro";
import DropdownTrigger from "./DropdownTrigger.astro";
import {
  dropdownCheckboxItemVariants,
  dropdownContentVariants,
  dropdownItemVariants,
  dropdownLabelVariants,
  dropdownSeparatorVariants,
  dropdownTriggerVariants,
} from "./variants";

const DropdownVariants = {
  dropdownCheckboxItemVariants,
  dropdownContentVariants,
  dropdownItemVariants,
  dropdownLabelVariants,
  dropdownSeparatorVariants,
  dropdownTriggerVariants,
};

export {
  Dropdown,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
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
