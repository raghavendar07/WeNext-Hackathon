const STYLE_TINTS = {
  warning: { bg: "bg-warning-bg", border: "border-warning-border", accent: "text-warning" },
  info:    { bg: "bg-info-bg",    border: "border-info-border",    accent: "text-info" },
  violet:  { bg: "bg-[#EBE7FF]",  border: "border-[#D9D2FF]",      accent: "text-[#7C3AED]" },
  brand:   { bg: "bg-brand-50",   border: "border-brand-200",      accent: "text-brand-emerald" },
  danger:  { bg: "bg-danger-bg",  border: "border-danger-border",  accent: "text-danger" },
};

export default function TemplateStyleCard({ label, tone = "warning", onClick }) {
  const t = STYLE_TINTS[tone] ?? STYLE_TINTS.warning;
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex h-[110px] w-[165px] shrink-0 cursor-pointer flex-col gap-2 rounded-md border p-3 transition-all",
        t.bg,
        t.border,
        "hover:scale-[1.02] hover:shadow-chip",
      ].join(" ")}
    >
      <span className="self-start rounded-pill border border-line bg-white px-2 py-0.5 text-[10px] font-semibold text-ink-heading">
        {label}
      </span>
      <div className="flex flex-1 items-center justify-center">
        <MiniMockup tone={t.accent} />
      </div>
    </button>
  );
}

function MiniMockup({ tone }) {
  return (
    <svg width="80" height="56" viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="1" width="78" height="54" rx="4" fill="#fff" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="8" y="8" width="40" height="3" rx="1.5" fill="currentColor" />
      <rect x="8" y="16" width="64" height="2" rx="1" fill="currentColor" fillOpacity="0.4" />
      <rect x="8" y="22" width="50" height="2" rx="1" fill="currentColor" fillOpacity="0.4" />
      <rect x="8" y="34" width="22" height="14" rx="3" fill="currentColor" />
      <text className={tone} />
    </svg>
  );
}
