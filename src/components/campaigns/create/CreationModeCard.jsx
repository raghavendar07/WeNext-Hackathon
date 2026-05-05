import { CheckCircle2 } from "lucide-react";

const TINTS = {
  brand:   { bg: "bg-brand-50",   text: "text-brand-emerald" },
  info:    { bg: "bg-info-bg",    text: "text-info" },
  warning: { bg: "bg-warning-bg", text: "text-warning" },
};

export default function CreationModeCard({
  eyebrow,
  title,
  description,
  tone = "brand",
  Illustration,
  selected,
  onClick,
}) {
  const tint = TINTS[tone] ?? TINTS.brand;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative flex w-full flex-col gap-4 rounded-lg border bg-white p-6 text-left transition-all",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        "hover:scale-[1.015] hover:border-line-default hover:shadow-card",
        "focus:outline-none focus-visible:shadow-focus",
        selected
          ? "border-2 border-brand-emerald bg-brand-50/40"
          : "border border-line",
      ].join(" ")}
    >
      {selected && (
        <span className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-emerald text-white">
          <CheckCircle2 size={16} strokeWidth={2} />
        </span>
      )}

      <div
        className={[
          "flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md",
          tint.bg,
        ].join(" ")}
      >
        <Illustration className={["h-3/4 w-3/4", tint.text].join(" ")} />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          {eyebrow}
        </span>
        <h3 className="text-[18px] font-semibold text-ink-heading">{title}</h3>
        <p className="line-clamp-3 text-[13px] font-medium text-ink-muted" style={{ lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
    </button>
  );
}
