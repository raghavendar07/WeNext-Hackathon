const TONE = {
  brand:   "text-brand-emerald",
  danger:  "text-danger",
  warning: "text-warning",
  muted:   "text-ink-muted",
};

export default function MetricCard({ value, label, tone = "muted" }) {
  return (
    <article className="flex flex-1 flex-col gap-1 rounded-md border border-line bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <span className={["text-[24px] font-semibold leading-none", TONE[tone]].join(" ")}>
        {value.toLocaleString()}
      </span>
      <span className="text-[12px] font-medium text-ink-muted">{label}</span>
    </article>
  );
}
