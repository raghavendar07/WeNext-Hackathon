import { useEffect, useRef, useState } from "react";
import { Calendar } from "lucide-react";
import ViewSegmentedControl from "./ViewSegmentedControl.jsx";
import { formatRangeLabel, weekDates } from "./data.js";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const RANGE_PRESETS = ["Last week", "This week", "Next week", "Custom"];

export default function CalendarDateControls({ view, onViewChange, onToday }) {
  const dates = weekDates();
  const monthLabel = `${MONTHS[dates[0].getMonth()]} ${dates[0].getFullYear()}`;
  const rangeLabel = formatRangeLabel(dates);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("This week");
  const popRef = useRef(null);

  useEffect(() => {
    if (!rangeOpen) return;
    const handler = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setRangeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [rangeOpen]);

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3">
        <h2 className="text-[20px] font-semibold text-ink-heading">{monthLabel}</h2>
        <button
          type="button"
          onClick={onToday}
          className="inline-flex h-8 items-center rounded-sm border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
        >
          Today
        </button>
      </div>
      <div className="flex items-center gap-2">
        <ViewSegmentedControl value={view} onChange={onViewChange} />
        <div ref={popRef} className="relative">
          <button
            type="button"
            onClick={() => setRangeOpen((o) => !o)}
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <Calendar size={14} className="text-ink-muted" strokeWidth={1.75} />
            {rangeLabel}
          </button>
          {rangeOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-[200px] rounded-md border border-line bg-white shadow-chip">
              <div className="border-b border-line px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Date range
              </div>
              <div className="p-1">
                {RANGE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset);
                      setRangeOpen(false);
                    }}
                    className={[
                      "flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-[13px] font-medium",
                      selectedPreset === preset
                        ? "bg-brand-50 text-brand-emerald"
                        : "text-ink-body hover:bg-surface-subtle",
                    ].join(" ")}
                  >
                    {preset}
                    {selectedPreset === preset && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
