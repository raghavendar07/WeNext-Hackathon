import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { POSTS, formatScheduledTime } from "./data.js";

const PLATFORM_TONE = {
  linkedin: "border-info-border bg-info-bg text-info",
  facebook: "border-info-border bg-info-bg text-info",
  instagram: "border-[#FCC2D7] bg-[#FCE7F3] text-[#DB2777]",
};

export default function CalendarTab() {
  const [anchor, setAnchor] = useState(() => new Date("2026-05-04T00:00:00"));

  const days = useMemo(() => {
    const start = new Date(anchor); start.setHours(0,0,0,0);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i);
      return d;
    });
  }, [anchor]);

  const postsByDay = useMemo(() => {
    const map = new Map();
    for (const p of POSTS) {
      if (p.status !== "scheduled") continue;
      const d = new Date(p.scheduledFor);
      const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(p);
    }
    return map;
  }, []);

  const monthLabel = `${days[0].toLocaleString("en-US", { month: "long" })} ${days[0].getFullYear()}`;
  const rangeLabel = `${days[0].toLocaleString("en-US", { month: "short", day: "numeric" })} – ${days[6].toLocaleString("en-US", { month: "short", day: "numeric" })}`;

  const shift = (delta) => {
    const next = new Date(anchor);
    next.setDate(next.getDate() + delta);
    setAnchor(next);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-semibold text-ink-heading">{monthLabel}</h2>
          <button type="button" onClick={() => setAnchor(new Date())} className="inline-flex h-8 items-center rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle">
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Previous week" onClick={() => shift(-7)} className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-line bg-white text-ink-body hover:bg-surface-subtle">
            <ChevronLeft size={14} />
          </button>
          <span className="text-[12px] font-medium text-ink-muted">{rangeLabel}</span>
          <button type="button" aria-label="Next week" onClick={() => shift(7)} className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-line bg-white text-ink-body hover:bg-surface-subtle">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          const items = postsByDay.get(k) ?? [];
          const dayLabel = d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric" });
          return (
            <div
              key={k}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); alert('Rescheduled to ' + dayLabel); }}
              className="flex min-h-[200px] flex-col gap-2 rounded-md border border-line bg-white p-3"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
                  {d.toLocaleString("en-US", { weekday: "short" })}
                </span>
                <span className="text-[16px] font-semibold text-ink-heading">{d.getDate()}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {items.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('postId', p.id)}
                    className={[
                      "flex h-6 w-full items-center gap-1 rounded-xs border px-1.5 text-[10px] font-medium",
                      PLATFORM_TONE[p.channels[0]] ?? "border-line bg-canvas text-ink-muted",
                    ].join(" ")}
                  >
                    <span>{formatScheduledTime(p.scheduledFor)}</span>
                    <span className="truncate">{p.caption.slice(0, 14)}</span>
                  </button>
                ))}
                {items.length > 3 && (
                  <span className="text-[10px] font-semibold text-brand-emerald">
                    +{items.length - 3} more
                  </span>
                )}
                {items.length === 0 && (
                  <button type="button" onClick={() => alert('Create post on ' + dayLabel)} className="rounded-xs border border-dashed border-transparent py-1 text-left text-[11px] font-medium text-ink-subtle hover:border-line hover:text-ink-muted">
                    + Add post
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] font-medium text-ink-muted">
        Tip: drag a post chip to a different day to reschedule.
      </p>
    </div>
  );
}
