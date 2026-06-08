import { Filter, MoreHorizontal, Plus, Search } from "lucide-react";

export default function CalendarPageHeader({ query, onQueryChange }) {
  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold leading-tight text-ink-heading">
          Calendar
        </h1>
        <p className="text-[13px] font-medium text-ink-muted">
          Stay organized and on track with your personalized schedule
        </p>
      </div>
      <div className="flex items-center gap-2">
        <label className="flex h-9 w-[240px] items-center gap-2 rounded-sm border border-line bg-white px-3">
          <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
          <input
            type="text"
            value={query ?? ""}
            onChange={(e) => onQueryChange?.(e.target.value)}
            placeholder="Search..."
            className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
        </label>
        <button
          type="button"
          onClick={() => alert('Filter — mock')}
          className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
        >
          <Filter size={14} strokeWidth={1.75} />
          Filter
        </button>
        <button
          type="button"
          aria-label="More actions"
          onClick={() => alert('More actions — mock')}
          className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white text-ink-muted hover:bg-surface-subtle"
        >
          <MoreHorizontal size={16} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => alert('New appointment — mock')}
          className="inline-flex h-9 items-center gap-2 rounded-sm bg-cta-gradient px-3 text-[13px] font-medium text-white"
        >
          <Plus size={14} strokeWidth={2} />
          New
        </button>
      </div>
    </header>
  );
}
