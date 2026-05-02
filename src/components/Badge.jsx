const VARIANTS = {
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  info: "bg-info-bg text-info",
  neutral: "bg-surface-muted text-ink-muted",

  new: "bg-brand-50 text-brand-link",
  beta: "bg-warning-bg text-warning",
  coming: "bg-surface-muted text-ink-muted",
  default: "bg-surface-muted text-ink-body",
};

const LABELS = {
  new: "New",
  beta: "Beta",
  coming: "Coming Soon",
};

export default function Badge({ variant = "default", dot = false, children }) {
  const cls = VARIANTS[variant] || VARIANTS.default;
  const text = children ?? LABELS[variant];
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-xl px-2 py-1 text-[12px] font-semibold leading-none",
        cls,
      ].join(" ")}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      )}
      {text}
    </span>
  );
}
