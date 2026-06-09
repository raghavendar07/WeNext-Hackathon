import { forwardRef, useEffect, useRef, useState } from "react";
import {
  BellOff,
  ChevronDown,
  Download,
  MoreVertical,
  Search,
  Star,
  User,
  UserX,
  X,
} from "lucide-react";
import Avatar from "./Avatar.jsx";
import AssignedAgentPopover from "./AssignedAgentPopover.jsx";
import PriorityPopover from "./PriorityPopover.jsx";
import DropdownPopover, { PopoverItem } from "./DropdownPopover.jsx";

export default function ChatHeader({ contact, popover, onTogglePopover }) {
  const assignedRef = useRef(null);
  const priorityRef = useRef(null);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
    function handleKey(e) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [searchOpen]);

  const submitSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      alert(`Searching: ${searchQuery}`);
    }
  };

  return (
    <header className="relative flex items-center justify-between border-b border-[#F0F2F5] px-5 py-[10px]">
      <div className="flex min-w-0 items-center gap-[10px]">
        <Avatar name={contact.name} palette={contact.palette} size={40} />
        <div className="flex min-w-0 flex-col">
          <span
            className="truncate text-[14px] font-medium text-ink-heading"
            style={{ letterSpacing: "0.5px" }}
          >
            {contact.name}
          </span>
          <span
            className="truncate text-[12px] font-medium text-ink-muted"
            style={{ letterSpacing: "0.5px" }}
          >
            {contact.phone}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-[10px]">
        <div className="relative">
          <Pill
            ref={assignedRef}
            onClick={() =>
              onTogglePopover?.(popover === "assigned" ? null : "assigned")
            }
            icon={<User size={16} className="text-ink-muted" />}
          >
            Assigned to Anita
          </Pill>
          <AssignedAgentPopover
            open={popover === "assigned"}
            onClose={() => onTogglePopover?.(null)}
            anchorRef={assignedRef}
          />
        </div>
        <div className="relative">
          <Pill
            ref={priorityRef}
            onClick={() =>
              onTogglePopover?.(popover === "priority" ? null : "priority")
            }
            icon={<Star size={16} className="text-warning" fill="#F59E0B" />}
          >
            Priority
          </Pill>
          <PriorityPopover
            open={popover === "priority"}
            onClose={() => onTogglePopover?.(null)}
            anchorRef={priorityRef}
          />
        </div>
        <IconButton
          aria-label="Search conversation"
          onClick={() => setSearchOpen(true)}
        >
          <Search size={20} className="text-ink-muted" strokeWidth={1.75} />
        </IconButton>
        <div className="relative">
          <IconButton
            ref={menuRef}
            aria-label="More actions"
            onClick={() =>
              onTogglePopover?.(popover === "menu" ? null : "menu")
            }
          >
            <MoreVertical size={20} className="text-ink-muted" strokeWidth={1.75} />
          </IconButton>
          <DropdownPopover
            open={popover === "menu"}
            onClose={() => onTogglePopover?.(null)}
            anchorRef={menuRef}
            align="right"
          >
            <PopoverItem
              icon={<BellOff size={14} className="text-ink-muted" strokeWidth={1.75} />}
              label="Mute chat"
              onClick={() => {
                onTogglePopover?.(null);
                alert("Chat muted (mock)");
              }}
            />
            <PopoverItem
              icon={<UserX size={14} className="text-danger" strokeWidth={1.75} />}
              label="Block contact"
              danger
              onClick={() => {
                onTogglePopover?.(null);
                alert("Contact blocked (mock)");
              }}
            />
            <PopoverItem
              icon={<Download size={14} className="text-ink-muted" strokeWidth={1.75} />}
              label="Export chat"
              onClick={() => {
                onTogglePopover?.(null);
                alert("Exporting chat (mock)");
              }}
            />
            <PopoverItem
              icon={<User size={14} className="text-ink-muted" strokeWidth={1.75} />}
              label="View profile"
              onClick={() => {
                onTogglePopover?.(null);
                alert("Opening profile (mock)");
              }}
            />
          </DropdownPopover>
        </div>
      </div>

      {searchOpen && (
        <div className="absolute inset-x-0 top-0 z-40 flex items-center gap-2 border-b border-[#F0F2F5] bg-white px-5 py-[14px] shadow-chip">
          <Search size={16} className="text-ink-muted" strokeWidth={1.75} />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={submitSearch}
            placeholder="Search in conversation..."
            className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-muted focus:outline-none"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-subtle"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
      )}
    </header>
  );
}

const Pill = forwardRef(function Pill({ icon, children, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-[5px] rounded-[6px] border border-line bg-[#F9FCFF] px-2 py-[6px]",
        "text-[12px] font-medium text-ink-heading",
        "transition-colors duration-150 ease-out hover:bg-white",
      ].join(" ")}
    >
      {icon}
      <span>{children}</span>
      <ChevronDown size={16} className="text-ink-subtle" strokeWidth={1.75} />
    </button>
  );
});

const IconButton = forwardRef(function IconButton({ children, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 ease-out hover:bg-surface-subtle"
      {...props}
    >
      {children}
    </button>
  );
});
