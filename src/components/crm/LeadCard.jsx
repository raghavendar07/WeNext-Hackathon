import { ArrowRight } from "lucide-react";
import Avatar from "../inbox/Avatar.jsx";
import IntentBadge from "./IntentBadge.jsx";
import SourceBadge from "./SourceBadge.jsx";

const ACTION_TONE = {
  "Reply now":      "text-brand-emerald",
  "Send proposal":  "text-info",
  "Follow up":      "text-warning",
  "Close deal":     "text-danger",
  "Nurture":        "text-ink-muted",
  "Onboard":        "text-brand-emerald",
};

export default function LeadCard({ lead, isDragging, onDragStart, onDragEnd }) {
  const visibleTags = (lead.tags ?? []).slice(0, 2);
  const actionTone = ACTION_TONE[lead.action] ?? "text-brand-emerald";

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", lead.id);
        onDragStart?.();
      }}
      onDragEnd={onDragEnd}
      className={[
        "flex cursor-grab flex-col gap-2 rounded-md border border-line bg-white p-3",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all",
        "hover:shadow-chip active:cursor-grabbing",
        isDragging ? "rotate-1 opacity-40" : "rotate-0 opacity-100",
      ].join(" ")}
    >
      <header className="flex items-start gap-2">
        <Avatar name={lead.name} palette={lead.palette} size={32} />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[13px] font-semibold text-ink-heading">
              {lead.name}
            </span>
            <IntentBadge intent={lead.intent} />
          </div>
          <span className="truncate text-[11px] font-medium text-ink-muted">
            {lead.phone}
          </span>
        </div>
      </header>

      <div className="flex items-center justify-between gap-2 border-t border-line pt-2">
        <SourceBadge source={lead.source} />
        <span className="truncate text-[10px] font-medium text-ink-muted">
          {lead.lastActivity}
        </span>
      </div>

      <button
        type="button"
        className={[
          "inline-flex items-center gap-1 self-start text-[11px] font-semibold",
          actionTone,
        ].join(" ")}
      >
        {lead.action}
        <ArrowRight size={11} strokeWidth={2} />
      </button>

      {visibleTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {visibleTags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-xs border border-line bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-ink-muted"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
