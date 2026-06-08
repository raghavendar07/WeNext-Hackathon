import { useEffect, useRef } from "react";

const DEFAULT_GROUPS = [
  {
    label: "Today",
    items: [
      {
        id: "t1",
        title: "New campaign approved",
        subtext: "Spring promo is live across Whatsapp and Instagram.",
      },
      {
        id: "t2",
        title: "Engagement is up",
        highlight: { text: "+12%", tone: "success" },
        suffix: "this week.",
        subtext: "Compared to last 7 days across all channels.",
      },
      {
        id: "t3",
        title: "Pro trial ends in 3 days",
        subtext: "Upgrade to keep advanced AI features.",
      },
    ],
  },
  {
    label: "Previous",
    items: [
      {
        id: "y1",
        title: "12 new replies",
        subtext: "On the Linkedin campaign you launched Friday.",
      },
      {
        id: "y2",
        title: "Riya joined your workspace",
        subtext: "Added as an editor.",
      },
    ],
  },
];

export default function NotificationPanel({
  open,
  onClose,
  triggerRef,
  groups = DEFAULT_GROUPS,
  onSeeAll,
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
      id="notification-panel"
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
      <div className="flex items-center px-[10px] py-2">
        <span className="text-[13px] font-semibold text-[#111827]">
          Notifications
        </span>
      </div>

      {groups.map((group, idx) => (
        <div key={group.label} className={idx === 0 ? "mt-1" : "mt-3"}>
          <div
            className="px-[10px] pb-1 pt-2 text-[11px] font-medium uppercase text-[#9CA3AF]"
            style={{ letterSpacing: "0.6px" }}
          >
            {group.label}
          </div>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <NotificationRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}

      <div className="my-2 h-px bg-[#DADADA]" />

      <button
        type="button"
        onClick={onSeeAll}
        className={[
          "flex min-h-[36px] w-full items-center rounded-[8px] px-[10px] py-[8px] text-left",
          "text-[13px] font-medium text-[#4F46E5]",
          "transition-colors duration-150 ease-out hover:bg-[#F3F4F6] hover:underline",
          "focus:outline-none focus-visible:shadow-focus",
        ].join(" ")}
      >
        See all notifications
      </button>
    </div>
  );
}

function NotificationRow({ item }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={item.onClick ?? (() => alert(item.title))}
      className={[
        "flex min-h-[44px] w-full flex-col items-start gap-0.5 rounded-[8px] px-[10px] py-[8px] text-left",
        "transition-colors duration-150 ease-out hover:bg-[#F3F4F6]",
        "focus:outline-none focus-visible:bg-[#F3F4F6] focus-visible:shadow-focus",
      ].join(" ")}
    >
      <span className="w-full truncate text-[13px] font-medium text-[#111827]">
        {item.title}
        {item.highlight && (
          <>
            {" "}
            <span className={highlightClass(item.highlight.tone)}>
              {item.highlight.text}
            </span>
          </>
        )}
        {item.suffix && <> {item.suffix}</>}
      </span>
      {item.subtext && (
        <span className="w-full truncate text-[12px] text-[#6B7280]">
          {item.subtext}
        </span>
      )}
    </button>
  );
}

function highlightClass(tone) {
  switch (tone) {
    case "success":
      return "font-semibold text-[#1EB677]";
    case "danger":
      return "font-semibold text-[#EF4444]";
    case "info":
      return "font-semibold text-[#4F46E5]";
    default:
      return "font-semibold text-[#111827]";
  }
}
