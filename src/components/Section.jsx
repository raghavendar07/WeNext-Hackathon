import { Children, cloneElement, isValidElement, useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Section({
  label,
  icon: Icon,
  defaultOpen = true,
  open: openProp,
  onToggle,
  divider = false,
  children,
}) {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : internalOpen;
  const panelId = useId();

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen((v) => !v);
    }
  };

  return (
    <div
      className={divider ? "border-t border-side-divider pt-2" : ""}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={[
          "group flex w-full items-center gap-[6px] rounded-[8px] px-[10px] py-[8px] text-left",
          "transition-colors duration-150 ease-out hover:bg-[#F3F4F6]",
          "focus:outline-none focus-visible:shadow-focus",
        ].join(" ")}
      >
        {Icon && (
          <Icon
            size={18}
            strokeWidth={1.75}
            className={[
              "shrink-0",
              open ? "text-[#111827]" : "text-[#5E6373]",
            ].join(" ")}
            aria-hidden="true"
          />
        )}
        <span
          className={[
            "flex-1 text-[14px] font-semibold leading-none",
            open ? "text-[#111827]" : "text-[#5E6373]",
          ].join(" ")}
        >
          {label}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={[
            "transition-transform duration-150 ease-out",
            open ? "rotate-180 text-[#111827]" : "rotate-0 text-[#5E6373]",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>

      <div
        id={panelId}
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 pt-3">
            {Children.map(children, (child) =>
              isValidElement(child) ? cloneElement(child, { nested: true }) : child,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
