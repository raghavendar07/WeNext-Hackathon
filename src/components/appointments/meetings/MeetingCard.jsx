import { MoreHorizontal, Video } from "lucide-react";
import { CATEGORIES } from "../categories.js";

const STATUS_PILLS = {
  upcoming:     { label: "Upcoming",    bg: "bg-info-bg",    text: "text-info" },
  "in-progress":{ label: "In progress", bg: "bg-warning-bg", text: "text-warning" },
  completed:    { label: "Completed",   bg: "bg-success-bg", text: "text-success" },
  cancelled:    { label: "Cancelled",   bg: "bg-surface-muted", text: "text-ink-muted" },
  "no-show":    { label: "No-show",     bg: "bg-danger-bg",  text: "text-danger" },
};

const PAST_STATUSES = new Set(["completed", "cancelled", "no-show"]);

export default function MeetingCard({ meeting }) {
  const cfg = CATEGORIES[meeting.category] ?? CATEGORIES.demo;
  const pill = STATUS_PILLS[meeting.status] ?? STATUS_PILLS.upcoming;
  const isPast = PAST_STATUSES.has(meeting.status);
  const visibleAttendees = meeting.attendees.slice(0, 3);
  const overflow = Math.max(meeting.attendees.length - visibleAttendees.length, 0);

  return (
    <article
      className={[
        "flex min-h-[112px] items-center justify-between gap-4 rounded-md border border-line bg-white px-6 py-5",
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
              onClick={() => alert('View customer mock')}
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
            onClick={() => alert('Joining meeting mock')}
            className="inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-3 text-[12px] font-medium text-white"
          >
            <Video size={14} strokeWidth={1.75} />
            Join
          </button>
        )}
        <button
          type="button"
          aria-label="Meeting actions"
          onClick={() => alert('Meeting menu mock')}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle"
        >
          <MoreHorizontal size={16} strokeWidth={1.75} />
        </button>
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
