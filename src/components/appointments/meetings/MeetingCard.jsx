import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarClock,
  FileText,
  Loader2,
  Mail,
  MoreHorizontal,
  Phone,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { CATEGORIES } from "../categories.js";

const STATUS_PILLS = {
  upcoming:     { label: "Upcoming",    bg: "bg-info-bg",    text: "text-info" },
  "in-progress":{ label: "In progress", bg: "bg-warning-bg", text: "text-warning" },
  completed:    { label: "Completed",   bg: "bg-success-bg", text: "text-success" },
  cancelled:    { label: "Cancelled",   bg: "bg-surface-muted", text: "text-ink-muted" },
  "no-show":    { label: "No-show",     bg: "bg-danger-bg",  text: "text-danger" },
};

const PAST_STATUSES = new Set(["completed", "cancelled", "no-show"]);

export default function MeetingCard({ meeting, onOpen }) {
  const cfg = CATEGORIES[meeting.category] ?? CATEGORIES.demo;
  const pill = STATUS_PILLS[meeting.status] ?? STATUS_PILLS.upcoming;
  const isPast = PAST_STATUSES.has(meeting.status);
  const visibleAttendees = meeting.attendees.slice(0, 3);
  const overflow = Math.max(meeting.attendees.length - visibleAttendees.length, 0);

  const [customerOpen, setCustomerOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
    <article
      onClick={() => onOpen?.(meeting)}
      className={[
        "flex min-h-[112px] cursor-pointer items-center justify-between gap-4 rounded-md border border-line bg-white px-6 py-5",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-chip",
        isPast ? "opacity-80" : "opacity-100",
      ].join(" ")}
    >
      {/* Left cluster — category pill on top, avatar + (title over customer) below */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span
          className={[
            "inline-flex w-fit items-center gap-1 rounded-pill px-2 py-0.5 text-[10px] font-semibold uppercase",
            cfg.bg,
            cfg.text,
          ].join(" ")}
        >
          <span aria-hidden className={["h-1.5 w-1.5 rounded-full", cfg.dot].join(" ")} />
          {cfg.label}
        </span>
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
            style={{ backgroundColor: hashBg(meeting.customer), color: hashFg(meeting.customer) }}
            title={meeting.customer}
          >
            {meeting.customer?.[0]?.toUpperCase() ?? "?"}
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h3 className="truncate text-[14px] font-semibold text-ink-heading" title={meeting.title}>
              {meeting.title}
            </h3>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setCustomerOpen(true); }}
              className="text-left text-[12px] font-medium text-ink-muted hover:text-ink-heading"
            >
              {meeting.customer}
            </button>
          </div>
        </div>
      </div>

      {/* Right cluster — date/time, attendees, Join, more, status pill all inline */}
      <div className="flex items-center gap-4">
        <div className="hidden flex-col items-end md:flex">
          <span className="text-[12px] font-semibold text-ink-heading">{meeting.when}</span>
          <span className="text-[11px] font-medium text-ink-muted">{meeting.duration}</span>
        </div>
        <AttendeeStack attendees={visibleAttendees} overflow={overflow} />
        {meeting.joinable && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setJoinOpen(true); }}
            className="inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-3 text-[12px] font-medium text-white"
          >
            <Video size={14} strokeWidth={1.75} />
            Join
          </button>
        )}
        <div onClick={(e) => e.stopPropagation()}>
          <MeetingMenu open={menuOpen} setOpen={setMenuOpen} />
        </div>
        <span
          className={[
            "inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[10px] font-semibold",
            pill.bg,
            pill.text,
          ].join(" ")}
        >
          <span className="h-1 w-1 rounded-full bg-current" aria-hidden />
          {pill.label}
        </span>
      </div>
    </article>

    {customerOpen && (
      <CustomerProfileDrawer
        customer={meeting.customer}
        onClose={() => setCustomerOpen(false)}
      />
    )}
    {joinOpen && <JoinModal onClose={() => setJoinOpen(false)} />}
    </>
  );
}

function MeetingMenu({ open, setOpen }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Meeting actions"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle"
      >
        <MoreHorizontal size={16} strokeWidth={1.75} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-[180px] rounded-md border border-line bg-white shadow-chip">
          <MenuRow icon={CalendarClock} label="Reschedule" onClick={() => setOpen(false)} />
          <MenuRow icon={Trash2} label="Cancel meeting" onClick={() => setOpen(false)} danger />
          <MenuRow icon={Bell} label="Send reminder" onClick={() => setOpen(false)} />
          <MenuRow icon={FileText} label="View notes" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

function MenuRow({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium hover:bg-surface-subtle",
        danger ? "text-danger" : "text-ink-body",
      ].join(" ")}
    >
      <Icon size={14} strokeWidth={1.75} className={danger ? "text-danger" : "text-ink-muted"} />
      {label}
    </button>
  );
}

function CustomerProfileDrawer({ customer, onClose }) {
  const upcoming = [
    { title: "Strategy review",        when: "May 12, 10:00 AM", duration: "30 min" },
    { title: "Renewal discussion",     when: "May 19, 2:00 PM",  duration: "45 min" },
    { title: "Quarterly check-in",     when: "Jun 02, 11:00 AM", duration: "60 min" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="h-full w-[360px] overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-3.5">
          <div className="text-[15px] font-semibold text-ink-heading">Customer</div>
          <button onClick={onClose} className="rounded p-1.5 text-ink-muted hover:bg-surface-subtle">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-5">
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full text-[16px] font-semibold"
              style={{ backgroundColor: hashBg(customer), color: hashFg(customer) }}
            >
              {customer?.[0]?.toUpperCase() ?? "?"}
            </span>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-ink-heading">{customer}</span>
              <span className="text-[12px] font-medium text-ink-muted">Customer since Mar 2024</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-md border border-line bg-canvas p-3">
            <ContactRow icon={Mail} value={`${customer?.split(" ")[0]?.toLowerCase() ?? "customer"}@example.com`} />
            <ContactRow icon={Phone} value="+91 98765 43210" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Last visit
            </span>
            <span className="text-[13px] font-medium text-ink-heading">
              Apr 24, 2024 · Demo session
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Upcoming appointments
            </span>
            <div className="flex flex-col gap-1.5">
              {upcoming.map((u, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border border-line bg-white px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-ink-heading">{u.title}</span>
                    <span className="text-[11px] font-medium text-ink-muted">{u.when}</span>
                  </div>
                  <span className="text-[11px] font-medium text-ink-muted">{u.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-ink-body">
      <Icon size={14} strokeWidth={1.75} className="text-ink-muted" />
      {value}
    </div>
  );
}

function JoinModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-[14px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="text-[15px] font-semibold text-ink-heading">Joining meeting</div>
          <button onClick={onClose} className="rounded p-1.5 text-ink-muted hover:bg-surface-subtle">
            <X size={16} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 px-5 py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-info-bg text-info">
            <Video size={28} strokeWidth={1.75} />
          </div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-ink-body">
            <Loader2 size={14} className="animate-spin text-brand-emerald" strokeWidth={2} />
            Connecting to Zoom / Meet…
          </div>
          <p className="text-center text-[12px] font-medium text-ink-muted">
            Sit tight — opening your video room in a new tab.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-button border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function AttendeeStack({ attendees, overflow }) {
  return (
    <div className="hidden items-center md:flex">
      {attendees.map((name, i) => {
        const initial = name?.[0]?.toUpperCase() ?? "?";
        return (
          <span
            key={i}
            className="-ml-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold first:ml-0"
            style={{ backgroundColor: hashBg(name), color: hashFg(name) }}
            title={name}
          >
            {initial}
          </span>
        );
      })}
      {overflow > 0 && (
        <span className="-ml-1.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white bg-surface-muted px-1.5 text-[10px] font-semibold text-ink-muted">
          +{overflow}
        </span>
      )}
    </div>
  );
}

const PALETTES = [
  ["#FFE2DC", "#FF6F4F"],
  ["#D6E5FF", "#3B7BFF"],
  ["#D6F4D9", "#1EB677"],
  ["#FFD6E5", "#E84F87"],
  ["#FEE2E2", "#EF4444"],
];
function hashIdx(name) {
  const c = name?.charCodeAt(0) ?? 0;
  return ((c - 65) % PALETTES.length + PALETTES.length) % PALETTES.length;
}
function hashBg(name) { return PALETTES[hashIdx(name)][0]; }
function hashFg(name) { return PALETTES[hashIdx(name)][1]; }
