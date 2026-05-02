import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import DropdownPopover, { PopoverItem } from "../inbox/DropdownPopover.jsx";

export default function DropdownSelect({ value, options, onChange, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const current = options.find((o) => o.id === value) ?? options[0];

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className={[
          "inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3",
          "text-[13px] font-medium text-ink-heading shadow-chip",
          "transition-colors duration-150 ease-out hover:bg-surface-subtle",
          "focus:outline-none focus-visible:shadow-focus",
        ].join(" ")}
      >
        <span>{current.label}</span>
        <ChevronDown size={14} className="text-ink-muted" strokeWidth={1.75} />
      </button>
      <DropdownPopover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={triggerRef}
        align="right"
      >
        {options.map((o) => (
          <PopoverItem
            key={o.id}
            label={o.label}
            onClick={() => {
              onChange?.(o.id);
              setOpen(false);
            }}
          />
        ))}
      </DropdownPopover>
    </div>
  );
}
