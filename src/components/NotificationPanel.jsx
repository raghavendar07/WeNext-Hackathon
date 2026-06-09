import { useEffect, useRef, useState } from "react";
import Modal from "./ui/Modal.jsx";

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

const ALL_NOTIFICATIONS = [
  {
    id: "n1",
    title: "New campaign approved",
    subtext: "Spring promo is live across WhatsApp and Instagram.",
    time: "Today, 9:42 AM",
    unread: true,
  },
  {
    id: "n2",
    title: "Engagement up +12% this week",
    subtext: "Compared to last 7 days across all channels.",
    time: "Today, 7:10 AM",
    unread: true,
  },
  {
    id: "n3",
    title: "Pro trial ends in 3 days",
    subtext: "Upgrade to keep advanced AI features.",
    time: "Today, 6:00 AM",
    unread: true,
  },
  {
    id: "n4",
    title: "12 new replies",
    subtext: "On the LinkedIn campaign you launched Friday.",
    time: "Yesterday, 4:32 PM",
    unread: false,
  },
  {
    id: "n5",
    title: "Riya joined your workspace",
    subtext: "Added as an editor.",
    time: "Yesterday, 11:18 AM",
    unread: false,
  },
  {
    id: "n6",
    title: "Catalog sync complete",
    subtext: "248 products synced from your Shopify store.",
    time: "Mon, 3:02 PM",
    unread: false,
  },
  {
    id: "n7",
    title: "Automation paused",
    subtext: "Abandoned cart recovery paused due to a template error.",
    time: "Sun, 9:55 AM",
    unread: false,
  },
  {
    id: "n8",
    title: "Invoice paid",
    subtext: "Your October invoice was paid successfully.",
    time: "Oct 28",
    unread: false,
  },
];

export default function NotificationPanel({
  open,
  onClose,
  triggerRef,
  groups = DEFAULT_GROUPS,
  onSeeAll,
  anchor = "bottom-left",
}) {
  const panelRef = useRef(null);
  const [showAll, setShowAll] = useState(false);

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

  // anchor positioning maps:
  // - bottom-left (default, sidebar): opens above its anchor (uses bottom-full)
  // - top-right (TopNav): opens below the trigger, right-aligned, fixed width
  const positionClasses =
    anchor === "top-right"
      ? "absolute right-0 top-full z-40 mt-2 w-[340px]"
      : "absolute bottom-full left-0 right-0 z-30 mb-2";

  const transitionOrigin =
    anchor === "top-right" ? "origin-top-right" : "origin-bottom";

  const handleSeeAll = () => {
    if (onSeeAll) {
      onSeeAll();
      return;
    }
    setShowAll(true);
  };

  return (
    <>
      <div
        ref={panelRef}
        id="notification-panel"
        role="menu"
        aria-hidden={!open}
        className={[
          positionClasses,
          "rounded-[12px] border border-[#DADADA] bg-white p-[12px] shadow-xl",
          transitionOrigin,
          "transform-gpu transition duration-200 ease-out",
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
          onClick={handleSeeAll}
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

      {showAll && (
        <AllNotificationsModal onClose={() => setShowAll(false)} />
      )}
    </>
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

function AllNotificationsModal({ onClose }) {
  const [items, setItems] = useState(ALL_NOTIFICATIONS);
  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  const toggleRead = (id) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );

  return (
    <Modal
      title={`All notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="inline-flex h-9 items-center rounded-lg border border-[#E5E7EB] bg-white px-3 text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark all as read
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-3 text-[13px] font-semibold text-white hover:bg-brand-700"
          >
            Done
          </button>
        </>
      }
    >
      <div className="flex max-h-[60vh] flex-col divide-y divide-[#F3F4F6] overflow-y-auto">
        {items.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => toggleRead(n.id)}
            className="flex items-start gap-3 px-1 py-3 text-left hover:bg-[#F9FAFB]"
          >
            <span
              className={[
                "mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full",
                n.unread ? "bg-[#4F46E5]" : "bg-transparent",
              ].join(" ")}
              aria-hidden="true"
            />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="flex items-center justify-between gap-3">
                <span
                  className={[
                    "truncate text-[13px]",
                    n.unread
                      ? "font-semibold text-[#111827]"
                      : "font-medium text-[#374151]",
                  ].join(" ")}
                >
                  {n.title}
                </span>
                <span className="shrink-0 text-[11px] text-[#9CA3AF]">
                  {n.time}
                </span>
              </span>
              <span className="truncate text-[12px] text-[#6B7280]">
                {n.subtext}
              </span>
            </span>
          </button>
        ))}
      </div>
    </Modal>
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
