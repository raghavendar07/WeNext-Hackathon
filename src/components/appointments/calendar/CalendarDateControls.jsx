import { Calendar } from "lucide-react";
import ViewSegmentedControl from "./ViewSegmentedControl.jsx";
import { formatRangeLabel, weekDates } from "./data.js";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function CalendarDateControls({ view, onViewChange, onToday }) {
  const dates = weekDates();
  const monthLabel = `${MONTHS[dates[0].getMonth()]} ${dates[0].getFullYear()}`;
  const rangeLabel = formatRangeLabel(dates);

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
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
        >
          <Calendar size={14} className="text-ink-muted" strokeWidth={1.75} />
          {rangeLabel}
        </button>
      </div>
    </div>
  );
}
