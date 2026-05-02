import { useEffect, useRef } from "react";

export default function DropdownPopover({
  open,
  onClose,
  anchorRef,
  align = "left",
  children,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current?.contains(e.target)) return;
      if (anchorRef?.current?.contains(e.target)) return;
      onClose?.();
    }
    function handleKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      role="menu"
      className={[
        "absolute top-full z-30 mt-1 min-w-[180px] rounded-md border border-line bg-white p-2 shadow-float",
        align === "right" ? "right-0" : "left-0",
      ].join(" ")}
    >
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

export function PopoverItem({ icon, label, danger, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="menuitem"
      className={[
        "flex w-full items-center gap-2 rounded-xs px-2 py-2 text-left text-[12px] font-medium",
        "transition-colors hover:bg-canvas",
        danger ? "text-danger" : "text-ink-heading",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
