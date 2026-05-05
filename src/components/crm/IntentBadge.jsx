import { Flame, Snowflake, Zap } from "lucide-react";

const INTENT = {
  hot:  { Icon: Flame,     label: "Hot",  bg: "bg-danger-bg",  text: "text-danger" },
  warm: { Icon: Zap,       label: "Warm", bg: "bg-warning-bg", text: "text-warning" },
  cold: { Icon: Snowflake, label: "Cold", bg: "bg-info-bg",    text: "text-info" },
};

export default function IntentBadge({ intent }) {
  const cfg = INTENT[intent] ?? INTENT.cold;
  const Icon = cfg.Icon;
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[10px] font-semibold",
        cfg.bg,
        cfg.text,
      ].join(" ")}
    >
      <Icon size={11} strokeWidth={2} fill="currentColor" />
      {cfg.label}
    </span>
  );
}
