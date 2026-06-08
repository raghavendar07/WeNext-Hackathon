import { useEffect, useRef } from "react";
import CalendarEventBlock from "./CalendarEventBlock.jsx";
import {
  EVENTS,
  ROW_HEIGHT,
  TIME_COL_W,
  TIME_RANGE,
  WORK_HOURS,
  formatTimeOfDay,
  weekDates,
} from "./data.js";

const DOW = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function clean12h(h) {
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12} ${ampm}`;
}

export default function CalendarWeekView({ activeCategory = "all" }) {
  const dates = weekDates();
  const today = new Date();
  const todayIdx = dates.findIndex(
    (d) => d.toDateString() === today.toDateString(),
  );
  const hours = [];
  for (let h = TIME_RANGE.start; h < TIME_RANGE.end; h++) hours.push(h);
  const nowDecimal = today.getHours() + today.getMinutes() / 60;
  const showNow = nowDecimal >= TIME_RANGE.start && nowDecimal <= TIME_RANGE.end;
  const nowTop = (nowDecimal - TIME_RANGE.start) * ROW_HEIGHT;
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const todayEvents = EVENTS.filter((e) => e.day === todayIdx);
    let anchor = todayEvents.reduce(
      (min, e) => (min == null || e.start < min ? e.start : min),
      null,
    );
    if (anchor == null) anchor = WORK_HOURS.start;
    if (showNow) anchor = Math.min(anchor, nowDecimal);
    const targetTop = Math.max((anchor - TIME_RANGE.start) * ROW_HEIGHT - 80, 0);
    el.scrollTop = targetTop;
  }, [todayIdx, nowDecimal, showNow]);

  const isPastEvent = (event) => {
    if (todayIdx < 0) return false;
    if (event.day < todayIdx) return true;
    if (event.day === todayIdx && event.end < nowDecimal) return true;
    return false;
  };

  return (
    <div
      ref={scrollRef}
      className="overflow-auto rounded-md border border-line bg-canvas"
      style={{ maxHeight: "calc(100vh - 320px)" }}
    >
      <div
        className="grid min-w-[840px]"
        style={{
          gridTemplateColumns: `${TIME_COL_W}px repeat(7, minmax(0, 1fr))`,
        }}
      >
        {/* Day header row */}
        <div
          className="sticky top-0 z-20 border-b border-r border-line bg-white"
          style={{ width: TIME_COL_W }}
        />
        {dates.map((d, i) => {
          const isToday = i === todayIdx;
          const isWeekend = i >= 5;
          const isPast = todayIdx >= 0 && i < todayIdx;
          return (
            <div
              key={i}
              className={[
                "sticky top-0 z-10 flex h-[68px] flex-col items-center justify-center gap-1",
                isToday
                  ? "border-b-2 border-brand-emerald bg-brand-50"
                  : "border-b border-line",
                isWeekend && !isToday ? "bg-canvas" : "",
                !isWeekend && !isToday ? "bg-white" : "",
                i < 6 ? "border-r border-line" : "",
                isPast ? "opacity-60" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "text-[11px] font-semibold uppercase tracking-wider",
                  isToday ? "text-brand-emerald" : "text-ink-muted",
                ].join(" ")}
              >
                {DOW[i]}
              </span>
              <span
                className={[
                  "text-[20px] font-semibold leading-none",
                  isToday ? "text-brand-emerald" : "text-ink-heading",
                ].join(" ")}
              >
                {d.getDate()}
              </span>
            </div>
          );
        })}

        {/* Time + day rows */}
        {hours.map((h, rowIdx) => {
          const isStrong = h % 4 === 0 && rowIdx > 0;
          return (
            <div key={`row-${h}`} className="contents">
              <div
                className={[
                  "flex items-start justify-end border-r border-line bg-white pr-2.5 pt-1 text-[11px] font-medium text-ink-muted",
                ].join(" ")}
                style={{ height: ROW_HEIGHT }}
              >
                {clean12h(h)}
              </div>
              {dates.map((_, colIdx) => {
                const isWeekend = colIdx >= 5;
                const isToday = colIdx === todayIdx;
                const isPast = todayIdx >= 0 && colIdx < todayIdx;
                const cellBg = isToday
                  ? "bg-brand-50/40"
                  : isWeekend || isPast
                  ? "bg-canvas"
                  : "bg-white";
                const dividerClass = isStrong
                  ? "border-b border-dashed border-line-default"
                  : "border-b border-dashed border-line";
                return (
                  <div
                    key={`cell-${rowIdx}-${colIdx}`}
                    onClick={() => alert('Create event mock')}
                    className={[
                      "relative cursor-pointer transition-colors",
                      colIdx < 6 ? "border-r border-line" : "",
                      dividerClass,
                      cellBg,
                      "hover:bg-brand-50",
                    ].join(" ")}
                    style={{ height: ROW_HEIGHT }}
                  />
                );
              })}
            </div>
          );
        })}

        {/* Event overlays per day column */}
        {dates.map((_, colIdx) => (
          <DayColumnOverlay
            key={`col-${colIdx}`}
            colIdx={colIdx}
            activeCategory={activeCategory}
            isPastEvent={isPastEvent}
          />
        ))}

        {/* Faded full-week current-time guide */}
        {showNow && <FullWeekCurrentTimeGuide top={nowTop} />}

        {/* Strong current-time line + pill on grid edge */}
        {showNow && todayIdx >= 0 && (
          <CurrentTimeIndicator colIdx={todayIdx} top={nowTop} />
        )}
      </div>
    </div>
  );
}

function DayColumnOverlay({ colIdx, activeCategory, isPastEvent }) {
  const colEvents = EVENTS.filter((e) => e.day === colIdx);
  const hourSpan = TIME_RANGE.end - TIME_RANGE.start;
  return (
    <div
      className="pointer-events-none relative"
      style={{
        gridColumnStart: colIdx + 2,
        gridColumnEnd: colIdx + 3,
        gridRowStart: 2,
        gridRowEnd: hourSpan + 2,
      }}
    >
      <div className="relative h-full w-full">
        {colEvents.map((e) => {
          const dim = activeCategory !== "all" && activeCategory !== e.category;
          return (
            <div key={e.id} className="pointer-events-auto">
              <CalendarEventBlock
                event={e}
                dim={dim}
                isPast={isPastEvent(e)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FullWeekCurrentTimeGuide({ top }) {
  const hourSpan = TIME_RANGE.end - TIME_RANGE.start;
  return (
    <div
      className="pointer-events-none relative"
      style={{
        gridColumnStart: 2,
        gridColumnEnd: 9,
        gridRowStart: 2,
        gridRowEnd: hourSpan + 2,
      }}
    >
      <div
        className="absolute inset-x-0 z-0 h-px bg-brand-emerald opacity-20"
        style={{ top }}
      />
    </div>
  );
}

function CurrentTimeIndicator({ colIdx, top }) {
  const hourSpan = TIME_RANGE.end - TIME_RANGE.start;
  const today = new Date();
  const decimal = today.getHours() + today.getMinutes() / 60;
  return (
    <>
      {/* Pill anchored to the grid edge (over the time column) */}
      <div
        className="pointer-events-none relative"
        style={{
          gridColumnStart: 1,
          gridColumnEnd: 2,
          gridRowStart: 2,
          gridRowEnd: hourSpan + 2,
        }}
      >
        <div
          className="absolute right-1 z-20 inline-flex h-5 -translate-y-1/2 items-center rounded-pill bg-ink-heading px-2 text-[10px] font-semibold text-white"
          style={{ top }}
        >
          {formatTimeOfDay(decimal)}
        </div>
      </div>
      {/* Strong line on today's column */}
      <div
        className="pointer-events-none relative"
        style={{
          gridColumnStart: colIdx + 2,
          gridColumnEnd: colIdx + 3,
          gridRowStart: 2,
          gridRowEnd: hourSpan + 2,
        }}
      >
        <div className="absolute inset-x-0 z-10 flex items-center" style={{ top }}>
          <span className="h-1.5 w-1.5 -ml-0.5 rounded-full bg-brand-emerald" aria-hidden />
          <span className="h-[2px] flex-1 bg-brand-emerald" />
        </div>
      </div>
    </>
  );
}
