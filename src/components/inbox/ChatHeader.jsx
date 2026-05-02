import { forwardRef, useRef } from "react";
import { ChevronDown, MoreVertical, Search, Star, User } from "lucide-react";
import Avatar from "./Avatar.jsx";
import AssignedAgentPopover from "./AssignedAgentPopover.jsx";
import PriorityPopover from "./PriorityPopover.jsx";

export default function ChatHeader({ contact, popover, onTogglePopover }) {
  const assignedRef = useRef(null);
  const priorityRef = useRef(null);

  return (
    <header className="flex items-center justify-between border-b border-[#F0F2F5] px-5 py-[10px]">
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
        <IconButton aria-label="Search conversation">
          <Search size={20} className="text-ink-muted" strokeWidth={1.75} />
        </IconButton>
        <IconButton aria-label="More actions">
          <MoreVertical size={20} className="text-ink-muted" strokeWidth={1.75} />
        </IconButton>
      </div>
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

function IconButton({ children, ...props }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 ease-out hover:bg-surface-subtle"
      {...props}
    >
      {children}
    </button>
  );
}
