import { Minus, TrendingDown, TrendingUp } from "lucide-react";

const TONE = {
  up: {
    Icon: TrendingUp,
    bg: "bg-success-bg",
    text: "text-success",
    sign: "+",
  },
  down: {
    Icon: TrendingDown,
    bg: "bg-danger-bg",
    text: "text-danger",
    sign: "-",
  },
  flat: {
    Icon: Minus,
    bg: "bg-warning-bg",
    text: "text-warning",
    sign: "",
  },
};

export default function DeltaTile({ direction = "up", value, period }) {
  const tone = TONE[direction] ?? TONE.up;
  const Icon = tone.Icon;
  const magnitude = Math.abs(value);

  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xs",
          tone.bg,
        ].join(" ")}
      >
        <Icon size={14} className={tone.text} strokeWidth={2} />
      </span>
      <span className="text-[12px] font-medium text-ink-muted">
        {tone.sign}
        {magnitude}% {period}
      </span>
    </div>
  );
}
