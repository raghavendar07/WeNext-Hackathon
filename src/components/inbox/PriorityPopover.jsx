import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import DropdownPopover, { PopoverItem } from "./DropdownPopover.jsx";

export default function PriorityPopover({
  open,
  onClose,
  anchorRef,
  onSelect,
}) {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 2000);
    return () => clearTimeout(t);
  }, [banner]);

  const handlePick = (priority) => {
    onClose?.();
    setBanner(priority);
    onSelect?.(priority);
  };

  return (
    <>
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
          onClick={() => handlePick("Low")}
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
          onClick={() => handlePick("Medium")}
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
          onClick={() => handlePick("High")}
        />
      </DropdownPopover>

      {banner && (
        <div className="fixed left-1/2 top-6 z-[60] -translate-x-1/2 rounded-md border border-line bg-white px-4 py-2 text-[12px] font-medium text-ink-heading shadow-float">
          Priority set to {banner}
        </div>
      )}
    </>
  );
}
