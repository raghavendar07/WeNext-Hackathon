import { Search, ChevronDown } from "lucide-react";

const CHIPS = ["All", "Web", "Mobile", "Presentation", "Live"];

export default function Filters({
  query,
  onQueryChange,
  active = "All",
  onChipChange,
  sort = "Last edited",
  visibility = "Any visibility",
}) {
  return (
    <div className="space-y-3">
      <label className="relative block">
        <Search
          size={16}
          strokeWidth={1.5}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query ?? ""}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder="Search projects..."
          aria-label="Search projects"
          className={[
            "h-10 w-full rounded-sm border border-line-default bg-white pl-9 pr-3 text-[14px] font-medium text-ink-body placeholder:text-ink-placeholder",
            "transition-all duration-150 ease-out",
            "focus:border-brand-emerald focus:outline-none focus:shadow-focus",
          ].join(" ")}
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1">
          {CHIPS.map((chip) => (
            <Chip
              key={chip}
              active={active === chip}
              onClick={() => onChipChange?.(chip)}
            >
              {chip}
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Dropdown label={sort} />
          <Dropdown label={visibility} />
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "inline-flex h-8 items-center rounded-xl px-3 text-[13px] font-medium",
        "transition-colors duration-150 ease-out",
        active
          ? "bg-brand-50 text-brand-emerald"
          : "bg-surface-card text-ink-body hover:bg-surface-muted",
        "focus:outline-none focus-visible:shadow-focus",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Dropdown({ label }) {
  return (
    <button
      type="button"
      className={[
        "inline-flex h-8 items-center gap-1.5 rounded-sm border border-line-default bg-surface-card px-2.5 text-[13px] font-medium text-ink-body",
        "transition-colors duration-150 ease-out hover:bg-surface-muted",
        "focus:outline-none focus-visible:shadow-focus",
      ].join(" ")}
    >
      {label}
      <ChevronDown size={14} strokeWidth={1.5} className="text-ink-muted" />
    </button>
  );
}
