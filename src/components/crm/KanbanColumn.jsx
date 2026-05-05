import { Plus, Search } from "lucide-react";
import LeadCard from "./LeadCard.jsx";

export default function KanbanColumn({
  stage,
  leads,
  draggingId,
  isDropTarget,
  onLeadDragStart,
  onLeadDragEnd,
  onDragOverColumn,
  onDragLeaveColumn,
  onDropOnColumn,
}) {
  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        onDragOverColumn?.();
      }}
      onDragLeave={onDragLeaveColumn}
      onDrop={(e) => {
        e.preventDefault();
        onDropOnColumn?.();
      }}
      className={[
        "flex h-full w-[280px] shrink-0 flex-col gap-3 rounded-lg border bg-white p-3 transition-colors",
        isDropTarget ? "border-brand-500 ring-2 ring-brand-500/40" : "border-line",
      ].join(" ")}
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-wide text-ink-heading">
            {stage.label}
          </h3>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-semibold text-ink-muted shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {leads.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search column"
            className="inline-flex h-6 w-6 items-center justify-center rounded-xs text-ink-muted hover:bg-white"
          >
            <Search size={12} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Add lead to column"
            className="inline-flex h-6 w-6 items-center justify-center rounded-xs text-ink-muted hover:bg-white"
          >
            <Plus size={14} strokeWidth={2} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {leads.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-sm border border-dashed border-line py-6 text-[11px] font-medium text-ink-muted">
            Drop leads here
          </div>
        ) : (
          leads.map((l) => (
            <LeadCard
              key={l.id}
              lead={l}
              isDragging={draggingId === l.id}
              onDragStart={() => onLeadDragStart?.(l.id)}
              onDragEnd={onLeadDragEnd}
            />
          ))
        )}
      </div>
    </section>
  );
}
