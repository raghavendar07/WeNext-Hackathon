import { CATEGORIES } from "../categories.js";
import {
  EVENT_MIN_H,
  ROW_HEIGHT,
  TIME_RANGE,
  formatTimeOfDay,
} from "./data.js";

const STATUS_DOT = {
  confirmed: "bg-success",
  pending:   "bg-warning",
  cancelled: "bg-danger",
  completed: "bg-ink-subtle",
};

export default function CalendarEventBlock({ event, dim, isPast }) {
  const cfg = CATEGORIES[event.category] ?? CATEGORIES.demo;
  const top = (event.start - TIME_RANGE.start) * ROW_HEIGHT;
  const naturalH = (event.end - event.start) * ROW_HEIGHT - 4;
  const height = Math.max(naturalH, EVENT_MIN_H);
  const single = event.end - event.start < 1;
  const dotClass = STATUS_DOT[event.status] ?? "bg-ink-subtle";

  return (
    <article
      className={[
        "absolute inset-x-[5px] flex flex-col gap-1 overflow-hidden rounded-md border p-2.5 transition-all",
        cfg.bg,
        cfg.border,
        "hover:shadow-chip",
        dim ? "opacity-30" : isPast ? "opacity-50" : "opacity-100",
      ].join(" ")}
      style={{ top, height }}
    >
      {single ? (
        <div className="flex min-w-0 items-center gap-1.5">
          <span aria-hidden className={["h-1.5 w-1.5 shrink-0 rounded-full", dotClass].join(" ")} />
          <span className={["shrink-0 text-[10px] font-semibold", cfg.text].join(" ")}>
            {formatTimeOfDay(event.start)}
          </span>
          <span aria-hidden className="text-[10px] text-ink-muted">·</span>
          <span className="truncate text-[11px] font-semibold text-ink-heading">
            {event.title}
          </span>
        </div>
      ) : (
        <>
          <div className="flex min-w-0 items-center gap-1.5">
            <span aria-hidden className={["h-1.5 w-1.5 shrink-0 rounded-full", dotClass].join(" ")} />
            <span className={["text-[10px] font-semibold uppercase tracking-wider", cfg.text].join(" ")}>
              {formatTimeOfDay(event.start)} – {formatTimeOfDay(event.end)}
            </span>
          </div>
          <p className="line-clamp-2 text-[12px] font-semibold leading-snug text-ink-heading">
            {event.title}
          </p>
        </>
      )}
    </article>
  );
}
