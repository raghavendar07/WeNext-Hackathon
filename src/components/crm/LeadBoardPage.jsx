import { useMemo, useState } from "react";
import { LayoutGrid, Table as TableIcon, Search, MoreHorizontal } from "lucide-react";
import KanbanColumn from "./KanbanColumn.jsx";
import LeadDetailDrawer from "./LeadDetailDrawer.jsx";
import IntentBadge from "./IntentBadge.jsx";
import SourceBadge from "./SourceBadge.jsx";
import Avatar from "../inbox/Avatar.jsx";
import { LEADS, CUSTOMERS, STAGES } from "./data.js";

const TYPE_FILTERS = [
  { id: "all",       label: "All" },
  { id: "leads",     label: "Leads" },
  { id: "customers", label: "Customers" },
];

export default function LeadBoardPage({ onOpenLead, onOpenCustomer }) {
  const [view, setView] = useState("grid");
  const [leads, setLeads] = useState(LEADS);
  const [draggingId, setDraggingId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [openLead, setOpenLead] = useState(null);

  // Table-only state
  const [typeFilter, setTypeFilter] = useState("all");
  const [query, setQuery] = useState("");

  const handleOpenLead = (lead) => {
    if (onOpenLead) onOpenLead(lead);
    else setOpenLead(lead);
  };
  const handleOpenCustomer = (c) => {
    if (onOpenCustomer) onOpenCustomer(c);
  };

  const handleDragStart = (id) => setDraggingId(id);
  const handleDragEnd = () => {
    setDraggingId(null);
    setDropTarget(null);
  };
  const handleDropOn = (stageId) => {
    if (!draggingId) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === draggingId ? { ...l, stage: stageId } : l)),
    );
    setDraggingId(null);
    setDropTarget(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Toolbar view={view} onViewChange={setView} />

      {view === "grid" ? (
        <div className="-mx-6 flex flex-1 gap-3 overflow-x-auto px-6">
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              leads={leads.filter((l) => l.stage === stage.id)}
              draggingId={draggingId}
              isDropTarget={dropTarget === stage.id}
              onLeadDragStart={handleDragStart}
              onLeadDragEnd={handleDragEnd}
              onDragOverColumn={() => setDropTarget(stage.id)}
              onDragLeaveColumn={() => setDropTarget((c) => (c === stage.id ? null : c))}
              onDropOnColumn={() => handleDropOn(stage.id)}
              onOpenLead={handleOpenLead}
            />
          ))}
          {openLead && <LeadDetailDrawer lead={openLead} onClose={() => setOpenLead(null)} />}
        </div>
      ) : (
        <TableView
          leads={leads}
          customers={CUSTOMERS}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          query={query}
          onQueryChange={setQuery}
          onOpenLead={handleOpenLead}
          onOpenCustomer={handleOpenCustomer}
        />
      )}
    </div>
  );
}

function Toolbar({ view, onViewChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-semibold text-ink-muted">View:</span>
        <div className="inline-flex h-9 rounded-md border border-line bg-white p-0.5">
          <ToggleBtn active={view === "grid"} onClick={() => onViewChange("grid")} icon={<LayoutGrid size={14} />}>Grid</ToggleBtn>
          <ToggleBtn active={view === "table"} onClick={() => onViewChange("table")} icon={<TableIcon size={14} />}>Table</ToggleBtn>
        </div>
      </div>
    </div>
  );
}

function ToggleBtn({ active, onClick, icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-[12px] font-semibold",
        active ? "bg-brand-50 text-brand-emerald" : "text-ink-muted hover:bg-surface-subtle",
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  );
}

function TableView({ leads, customers, typeFilter, onTypeFilterChange, query, onQueryChange, onOpenLead, onOpenCustomer }) {
  const rows = useMemo(() => {
    const leadRows = leads.map((l) => ({
      kind: "lead",
      id: l.id,
      name: l.name,
      contact: l.phone,
      palette: l.palette,
      source: l.source,
      intent: l.intent,
      status: STAGES.find((s) => s.id === l.stage)?.label ?? l.stage,
      lastActivity: l.lastActivity,
      tags: l.tags,
      raw: l,
    }));
    const custRows = customers.map((c) => ({
      kind: "customer",
      id: c.id,
      name: c.name,
      contact: c.email,
      palette: c.palette,
      source: null,
      intent: null,
      status: c.lifecycle,
      lastActivity: c.lastPurchase,
      tags: [c.engagement],
      ltv: c.ltv,
      raw: c,
    }));
    return [...leadRows, ...custRows];
  }, [leads, customers]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (typeFilter === "leads" && r.kind !== "lead") return false;
      if (typeFilter === "customers" && r.kind !== "customer") return false;
      if (query) {
        const q = query.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.contact?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [rows, typeFilter, query]);

  const counts = useMemo(() => ({
    all: rows.length,
    leads: rows.filter((r) => r.kind === "lead").length,
    customers: rows.filter((r) => r.kind === "customer").length,
  }), [rows]);

  return (
    <div className="flex flex-col gap-3">
      {/* Filter row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-10 w-[260px] items-center gap-2 rounded-lg border border-line bg-white px-3">
            <Search size={14} className="text-ink-subtle" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search name, email, phone…"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-1.5">
            {TYPE_FILTERS.map((f) => {
              const isActive = typeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onTypeFilterChange(f.id)}
                  className={[
                    "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] font-semibold transition-colors",
                    isActive
                      ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                      : "border-line bg-white text-ink-muted hover:bg-surface-subtle",
                  ].join(" ")}
                >
                  {f.label}
                  <span className={isActive ? "rounded-full bg-white px-1.5 py-0.5 text-[10px]" : "rounded-full bg-surface-subtle px-1.5 py-0.5 text-[10px]"}>
                    {counts[f.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={() => alert("Export CSV (mock)")}
          className="inline-flex h-9 items-center gap-1.5 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
        >
          Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-line bg-white">
        <table className="w-full text-[13px]">
          <thead className="bg-surface-subtle text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
            <tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Contact</Th>
              <Th>Source / LTV</Th>
              <Th>Status</Th>
              <Th>Intent</Th>
              <Th>Last activity</Th>
              <Th align="right" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={`${r.kind}-${r.id}`}
                onClick={() => (r.kind === "lead" ? onOpenLead(r.raw) : onOpenCustomer(r.raw))}
                className="cursor-pointer border-t border-line hover:bg-surface-subtle"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={r.name} palette={r.palette} size={32} />
                    <span className="font-semibold text-ink-heading">{r.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {r.kind === "lead" ? (
                    <span className="inline-flex h-6 items-center gap-1 rounded-pill bg-pink-50 px-2 text-[10px] font-semibold text-pink-700">
                      🌱 Lead
                    </span>
                  ) : (
                    <span className="inline-flex h-6 items-center gap-1 rounded-pill bg-emerald-50 px-2 text-[10px] font-semibold text-emerald-700">
                      ★ Customer
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink-body">{r.contact}</td>
                <td className="px-4 py-3">
                  {r.kind === "lead" ? (
                    <SourceBadge source={r.source} />
                  ) : (
                    <span className="font-semibold text-ink-heading">₹{r.ltv?.toLocaleString?.() ?? r.ltv}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink-body capitalize">{r.status}</td>
                <td className="px-4 py-3">{r.intent ? <IntentBadge intent={r.intent} /> : <span className="text-ink-subtle">—</span>}</td>
                <td className="px-4 py-3 text-ink-body">{r.lastActivity}</td>
                <td className="px-2 py-3 text-right">
                  <button
                    type="button"
                    aria-label="More"
                    onClick={(e) => { e.stopPropagation(); alert("Row menu (mock)"); }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-[13px] text-ink-muted">
                  No matches. Reset filters and try again.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, align }) {
  return (
    <th className={["px-4 py-3", align === "right" ? "text-right" : "text-left"].join(" ")}>{children}</th>
  );
}
