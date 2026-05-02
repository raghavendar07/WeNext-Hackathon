import { Pencil, Trash2 } from "lucide-react";
import DatePill from "./DatePill.jsx";

const TINT_BY_TONE = {
  info: "bg-info-bg",
  warning: "bg-warning-bg",
  success: "bg-success-bg",
  neutral: "bg-surface-subtle",
};

export default function ScheduledMessageCard({
  date,
  message,
  time,
  relative,
  tone = "info",
  onEdit,
  onDelete,
}) {
  return (
    <article className="group flex flex-col gap-2 rounded-sm border border-line bg-white p-3 shadow-chip">
      <div className="flex items-center justify-between gap-2 border-b border-line pb-2">
        <DatePill>{date}</DatePill>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <IconBtn label="Edit scheduled message" onClick={onEdit}>
            <Pencil size={14} className="text-ink-muted" strokeWidth={1.75} />
          </IconBtn>
          <IconBtn label="Delete scheduled message" onClick={onDelete}>
            <Trash2 size={14} className="text-danger" strokeWidth={1.75} />
          </IconBtn>
        </div>
      </div>

      <div
        className={[
          "rounded-xs p-2",
          TINT_BY_TONE[tone] ?? TINT_BY_TONE.info,
        ].join(" ")}
      >
        <p
          className="text-[12px] font-medium text-ink-body"
          style={{ lineHeight: 1.5 }}
        >
          {message}
        </p>
        <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-ink-muted">
          <span>{time}</span>
          <span aria-hidden className="inline-block h-[6px] w-[6px] rounded-full bg-ink-subtle" />
          <span>{relative}</span>
        </div>
      </div>
    </article>
  );
}

function IconBtn({ children, label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-xs hover:bg-surface-subtle"
    >
      {children}
    </button>
  );
}
