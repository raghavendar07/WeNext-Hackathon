import { Star } from "lucide-react";
import DropdownPopover, { PopoverItem } from "./DropdownPopover.jsx";

export default function PriorityPopover({ open, onClose, anchorRef }) {
  return (
    <DropdownPopover open={open} onClose={onClose} anchorRef={anchorRef}>
      <PopoverItem
        icon={<Star size={14} className="text-ink-muted" strokeWidth={1.75} />}
        label="Priority"
      />
      <PopoverItem
        icon={
          <Star
            size={14}
            className="text-brand-emerald"
            fill="#1EB677"
            strokeWidth={1.75}
          />
        }
        label="Low"
      />
      <PopoverItem
        icon={
          <Star
            size={14}
            className="text-warning"
            fill="#F59E0B"
            strokeWidth={1.75}
          />
        }
        label="Medium"
      />
      <PopoverItem
        icon={
          <Star
            size={14}
            className="text-danger"
            fill="#EF4444"
            strokeWidth={1.75}
          />
        }
        label="High"
      />
    </DropdownPopover>
  );
}
