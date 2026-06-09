import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
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
  onOpenLead,
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  const q = query.trim().toLowerCase();
  const visible = q
    ? leads.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.tags?.some((t) => t.toLowerCase().includes(q)),
      )
    : leads;

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
            {visible.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search column"
            onClick={() => {
              setShowSearch((s) => {
                if (s) setQuery("");
                return !s;
              });
            }}
            className={[
              "inline-flex h-6 w-6 items-center justify-center rounded-xs hover:bg-white",
              showSearch ? "bg-white text-ink-heading" : "text-ink-muted",
            ].join(" ")}
          >
            <Search size={12} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Add lead to column"
            onClick={() => setShowAdd((s) => !s)}
            className={[
              "inline-flex h-6 w-6 items-center justify-center rounded-xs hover:bg-white",
              showAdd ? "bg-white text-ink-heading" : "text-ink-muted",
            ].join(" ")}
          >
            <Plus size={14} strokeWidth={2} />
          </button>
        </div>
      </header>

      {showSearch && (
        <label className="flex h-7 items-center gap-1.5 rounded-xs border border-line bg-white px-2">
          <Search size={11} className="text-ink-subtle" strokeWidth={1.75} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in column..."
            className="min-w-0 flex-1 bg-transparent text-[11px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear"
              className="text-ink-subtle hover:text-ink-heading"
            >
              <X size={11} strokeWidth={1.75} />
            </button>
          )}
        </label>
      )}

      {showAdd && (
        <div className="flex flex-col gap-2 rounded-sm border border-line bg-canvas p-2">
          <input
            type="text"
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Lead name"
            className="h-7 rounded-xs border border-line bg-white px-2 text-[12px] font-medium text-ink-heading placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none"
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => {
                setShowAdd(false);
                setNewName("");
              }}
              className="inline-flex h-6 items-center rounded-xs border border-line bg-white px-2 text-[11px] font-medium text-ink-body hover:bg-surface-subtle"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAdd(false);
                setNewName("");
              }}
              className="inline-flex h-6 items-center rounded-xs bg-cta-gradient px-2.5 text-[11px] font-medium text-white"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {visible.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-sm border border-dashed border-line py-6 text-[11px] font-medium text-ink-muted">
            {q ? "No matches" : "Drop leads here"}
          </div>
        ) : (
          visible.map((l) => (
            <LeadCard
              key={l.id}
              lead={l}
              isDragging={draggingId === l.id}
              onDragStart={() => onLeadDragStart?.(l.id)}
              onDragEnd={onLeadDragEnd}
              onOpen={onOpenLead}
            />
          ))
        )}
      </div>
    </section>
  );
}
