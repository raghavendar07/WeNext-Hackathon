import { useEffect, useRef, useState } from "react";
import CalendarPageHeader from "./CalendarPageHeader.jsx";
import CalendarDateControls from "./CalendarDateControls.jsx";
import CalendarWeekView from "./CalendarWeekView.jsx";
import { ROW_HEIGHT, TIME_COL_W, TIME_RANGE, formatTimeOfDay } from "./data.js";

export default function CalendarTab() {
  const [view, setView] = useState("week");
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col">
      <CalendarPageHeader query={query} onQueryChange={setQuery} />
      <CalendarDateControls
        view={view}
        onViewChange={setView}
        onToday={() => {}}
      />

      <div className="pt-1">
        {view === "week" && <CalendarWeekView activeCategory="all" />}
        {view === "day" && <DayView />}
        {view === "month" && <MonthView />}
      </div>
    </div>
  );
}

function clean12h(h) {
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12} ${ampm}`;
}

function DayView() {
  const dayStart = 8;
  const dayEnd = 20;
  const hours = [];
  for (let h = dayStart; h < dayEnd; h++) hours.push(h);

  // single mock event
  const mockEvent = {
    title: "Acme Demo",
    customer: "Rahul Verma",
    start: 10,
    end: 11.5,
  };

  const today = new Date();
  const decimal = today.getHours() + today.getMinutes() / 60;
  const showNow = decimal >= dayStart && decimal <= dayEnd;
  const nowTop = (decimal - dayStart) * ROW_HEIGHT;

  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const target = Math.max((mockEvent.start - dayStart) * ROW_HEIGHT - 80, 0);
    el.scrollTop = target;
  }, []);

  const dateLabel = today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="rounded-md border border-line bg-canvas">
      <div className="flex h-[68px] items-center justify-between border-b border-line bg-white px-5">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-emerald">
            Today
          </span>
          <span className="text-[18px] font-semibold text-ink-heading">{dateLabel}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-emerald">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald" />
          1 appointment
        </span>
      </div>
      <div
        ref={scrollRef}
        className="relative overflow-auto"
        style={{ maxHeight: "calc(100vh - 380px)" }}
      >
        <div
          className="grid"
          style={{ gridTemplateColumns: `${TIME_COL_W}px minmax(0, 1fr)` }}
        >
          {hours.map((h, rowIdx) => {
            const isStrong = h % 4 === 0 && rowIdx > 0;
            const dividerClass = isStrong
              ? "border-b border-dashed border-line-default"
              : "border-b border-dashed border-line";
            return (
              <div key={h} className="contents">
                <div
                  className="flex items-start justify-end border-r border-line bg-white pr-2.5 pt-1 text-[11px] font-medium text-ink-muted"
                  style={{ height: ROW_HEIGHT }}
                >
                  {clean12h(h)}
                </div>
                <div
                  className={["relative bg-white", dividerClass].join(" ")}
                  style={{ height: ROW_HEIGHT }}
                />
              </div>
            );
          })}
        </div>

        {/* mock event overlay */}
        <div
          className="absolute z-10"
          style={{
            left: TIME_COL_W + 16,
            right: 16,
            top: (mockEvent.start - dayStart) * ROW_HEIGHT + 4,
            height: (mockEvent.end - mockEvent.start) * ROW_HEIGHT - 8,
          }}
        >
          <div className="flex h-full flex-col gap-1 rounded-md border border-info bg-info-bg p-3 shadow-chip">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-info">
              Demo
            </span>
            <span className="text-[14px] font-semibold text-ink-heading">{mockEvent.title}</span>
            <span className="text-[12px] font-medium text-ink-muted">{mockEvent.customer}</span>
            <span className="mt-auto text-[11px] font-medium text-ink-muted">
              {formatTimeOfDay(mockEvent.start)} – {formatTimeOfDay(mockEvent.end)}
            </span>
          </div>
        </div>

        {/* current time line */}
        {showNow && (
          <div
            className="pointer-events-none absolute z-20 flex items-center"
            style={{ left: TIME_COL_W, right: 0, top: nowTop }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald" />
            <span className="h-[2px] flex-1 bg-brand-emerald" />
          </div>
        )}
      </div>
    </div>
  );
}

function MonthView() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // 0 = Mon
  const startDate = new Date(year, month, 1 - startWeekday);

  // 6 rows x 7 cols
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    days.push(d);
  }

  // mock event days within current month
  const eventDays = new Set([
    new Date(year, month, 5).toDateString(),
    new Date(year, month, 7).toDateString(),
    new Date(year, month, 12).toDateString(),
    new Date(year, month, 14).toDateString(),
    new Date(year, month, 18).toDateString(),
    new Date(year, month, 21).toDateString(),
    new Date(year, month, 26).toDateString(),
  ]);

  const DOW = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="rounded-md border border-line bg-canvas">
      <div className="grid grid-cols-7 border-b border-line bg-white">
        {DOW.map((d) => (
          <div
            key={d}
            className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d, idx) => {
          const inMonth = d.getMonth() === month;
          const isToday = d.toDateString() === today.toDateString();
          const hasEvent = inMonth && eventDays.has(d.toDateString());
          const isLastCol = (idx + 1) % 7 === 0;
          const isLastRow = idx >= 35;
          return (
            <div
              key={idx}
              className={[
                "relative flex h-[96px] flex-col p-2",
                isLastCol ? "" : "border-r border-line",
                isLastRow ? "" : "border-b border-line",
                inMonth ? "bg-white" : "bg-canvas",
                isToday ? "bg-brand-50" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold",
                  isToday
                    ? "bg-brand-emerald text-white"
                    : inMonth
                    ? "text-ink-heading"
                    : "text-ink-subtle",
                ].join(" ")}
              >
                {d.getDate()}
              </span>
              {hasEvent && (
                <div className="mt-auto flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-info" />
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
