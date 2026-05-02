import { UserCog, UserMinus } from "lucide-react";
import DropdownPopover, { PopoverItem } from "./DropdownPopover.jsx";

export default function AssignedAgentPopover({
  open,
  onClose,
  anchorRef,
  agentName = "Anita",
}) {
  return (
    <DropdownPopover open={open} onClose={onClose} anchorRef={anchorRef}>
      <PopoverItem
        icon={<UserCog size={14} className="text-ink-muted" strokeWidth={1.75} />}
        label={`Take over from ${agentName}`}
      />
      <PopoverItem
        icon={<UserMinus size={14} className="text-danger" strokeWidth={1.75} />}
        label="Remove Agent"
        danger
      />
    </DropdownPopover>
  );
}
