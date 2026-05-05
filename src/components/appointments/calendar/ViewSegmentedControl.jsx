const OPTIONS = [
  { id: "day",   label: "Day" },
  { id: "week",  label: "Week" },
  { id: "month", label: "Month" },
];

export default function ViewSegmentedControl({ value, onChange }) {
  return (
    <div role="tablist" className="inline-flex items-center gap-1 rounded-sm bg-canvas p-1">
      {OPTIONS.map((opt) => {
        const isActive = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(opt.id)}
            className={[
              "rounded-xs px-3 py-1 text-[12px] font-semibold transition-colors",
              isActive
                ? "bg-white text-ink-heading shadow-chip"
                : "text-ink-muted hover:text-ink-heading",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
