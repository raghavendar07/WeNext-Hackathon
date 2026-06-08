import { useEffect, useRef } from "react";
import {
  Sparkles,
  Activity,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

export default function ProfilePanel({
  open,
  onClose,
  triggerRef,
  user = {
    name: "Raghav S",
    email: "design@photonxtech.com",
    initials: "RS",
    plan: "Pro plan",
  },
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e) {
      if (panelRef.current?.contains(e.target)) return;
      if (triggerRef?.current?.contains(e.target)) return;
      onClose?.();
    }

    function handleKey(e) {
      if (e.key === "Escape") {
        onClose?.();
        triggerRef?.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, triggerRef]);

  return (
    <div
      ref={panelRef}
      id="profile-panel"
      role="menu"
      aria-hidden={!open}
      className={[
        "absolute bottom-full left-0 right-0 z-30 mb-2",
        "rounded-[12px] border border-[#DADADA] bg-white p-[12px]",
        "origin-bottom transform-gpu transition duration-200 ease-out",
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-1 opacity-0",
      ].join(" ")}
    >
      {/* Top: identity */}
      <div className="flex items-center gap-2.5 px-[10px] py-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[12px] font-semibold text-brand-emerald">
          {user.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-[#111827]">
            {user.name}
          </div>
          <div className="truncate text-[11px] text-[#6B7280]">
            {user.email}
          </div>
          <div className="truncate text-[11px] text-[#6B7280]">
            {user.plan}
          </div>
        </div>
      </div>

      <div className="my-2 h-px bg-[#DADADA]" />

      <div className="flex flex-col gap-0.5">
        <Item
          icon={Sparkles}
          label="Upgrade plan"
          onClick={() => alert("Upgrade plan — mock")}
        />
        <Item
          icon={Activity}
          label="Activity"
          onClick={() => alert("Activity — mock")}
        />
        <Item
          icon={Settings}
          label="Settings"
          onClick={() => alert("Settings — mock")}
        />
      </div>

      <div className="my-2 h-px bg-[#DADADA]" />

      <div className="flex flex-col gap-0.5">
        <Item
          icon={HelpCircle}
          label="Help"
          onClick={() => alert("Help — mock")}
        />
        <Item
          icon={LogOut}
          label="Log out"
          onClick={() => alert("Log out — mock")}
        />
      </div>
    </div>
  );
}

function Item({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={[
        "flex min-h-[36px] w-full items-center gap-2.5 rounded-[8px] px-[10px] py-[8px] text-left",
        "transition-colors duration-150 ease-out hover:bg-[#F3F4F6]",
        "focus:outline-none focus-visible:bg-[#F3F4F6] focus-visible:shadow-focus",
      ].join(" ")}
    >
      {Icon && (
        <Icon
          size={16}
          strokeWidth={1.75}
          className="text-[#5E6373]"
          aria-hidden="true"
        />
      )}
      <span className="flex-1 text-[13px] font-medium text-[#5E6373]">
        {label}
      </span>
    </button>
  );
}
