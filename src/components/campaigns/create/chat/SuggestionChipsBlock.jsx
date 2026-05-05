const TINTS = {
  info:    { bg: "bg-info-bg",    text: "text-info" },
  warning: { bg: "bg-warning-bg", text: "text-warning" },
  brand:   { bg: "bg-brand-50",   text: "text-brand-emerald" },
  violet:  { bg: "bg-[#EBE7FF]",  text: "text-[#7C3AED]" },
  danger:  { bg: "bg-danger-bg",  text: "text-danger" },
};

export default function SuggestionChipsBlock({ chips, onPick }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => {
        const tint = TINTS[c.tone] ?? TINTS.brand;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick?.(c)}
            className={[
              "inline-flex items-center gap-1.5 rounded-pill border border-line px-3 py-1.5 text-[12px] font-medium",
              tint.bg,
              "text-ink-heading transition-colors hover:border-line-default",
            ].join(" ")}
          >
            <span className={["text-[11px] font-semibold", tint.text].join(" ")}>
              {c.indicator ?? "Aa"}
            </span>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
