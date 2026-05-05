import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import DropdownSelect from "../../campaigns/DropdownSelect.jsx";
import FilterChipGroup from "../../campaigns/FilterChipGroup.jsx";
import { CATEGORIES, CATEGORY_ORDER } from "../categories.js";
import { formatRangeLabel, weekDates } from "./data.js";

const VIEW_OPTIONS = [
  { id: "day",   label: "Day" },
  { id: "week",  label: "Week" },
  { id: "month", label: "Month" },
];

function CategoryDot({ tone }) {
  return <span aria-hidden className={["mr-1 inline-block h-2 w-2 rounded-full", tone].join(" ")} />;
}

export default function CalendarFilterRow({
  view,
  onViewChange,
  category,
  onCategoryChange,
  onPrevWeek,
  onNextWeek,
  onToday,
}) {
  const dates = weekDates();
  const range = formatRangeLabel(dates);

  const chips = [
    { id: "all", label: "All" },
    ...CATEGORY_ORDER.map((id) => ({
      id,
      label: (
        <span className="inline-flex items-center">
          <CategoryDot tone={CATEGORIES[id].dot} />
          {CATEGORIES[id].label}
        </span>
      ),
    })),
  ];

  return (
    <div className="flex flex-col">
      {/* Layer A — date + view controls */}
      <div className="flex items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-2">
          <IconButton ariaLabel="Previous week" onClick={onPrevWeek}>
            <ChevronLeft size={16} className="text-ink-body" strokeWidth={1.75} />
          </IconButton>
          <h2 className="text-[16px] font-semibold text-ink-heading">{range}</h2>
          <IconButton ariaLabel="Next week" onClick={onNextWeek}>
            <ChevronRight size={16} className="text-ink-body" strokeWidth={1.75} />
          </IconButton>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToday}
            className="inline-flex h-9 items-center rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Today
          </button>
          <DropdownSelect
            value={view}
            options={VIEW_OPTIONS}
            onChange={onViewChange}
            ariaLabel="View"
          />
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <Filter size={14} strokeWidth={1.75} />
            Filter
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
          >
            <Plus size={14} strokeWidth={2} />
            Add Event
          </button>
        </div>
      </div>

      {/* Layer B — category chips */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-line py-3">
        <FilterChipGroup chips={chips} active={category} onChange={onCategoryChange} />
      </div>
    </div>
  );
}

function IconButton({ children, ariaLabel, onClick }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white hover:bg-surface-subtle"
    >
      {children}
    </button>
  );
}
