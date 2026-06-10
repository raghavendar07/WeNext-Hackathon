import { useMemo, useState } from "react";
import { LayoutGrid, Table as TableIcon, Search, MoreHorizontal, Plus, X, UserPlus, Sparkles, Filter } from "lucide-react";
import KanbanColumn from "./KanbanColumn.jsx";
import LeadDetailDrawer from "./LeadDetailDrawer.jsx";
import IntentBadge from "./IntentBadge.jsx";
import SourceBadge from "./SourceBadge.jsx";
import Avatar from "../inbox/Avatar.jsx";
import { LEADS, CUSTOMERS, STAGES } from "./data.js";

const PALETTES = ["pink", "blue", "green", "coral", "rose"];
const randPalette = () => PALETTES[Math.floor(Math.random() * PALETTES.length)];

const TYPE_FILTERS = [
  { id: "all",       label: "All" },
  { id: "leads",     label: "Leads" },
  { id: "customers", label: "Customers" },
];

export default function LeadBoardPage({ onOpenLead, onOpenCustomer }) {
  const [view, setView] = useState("grid");
  const [leads, setLeads] = useState(LEADS);
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [draggingId, setDraggingId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [openLead, setOpenLead] = useState(null);

  // Table-only state
  const [typeFilter, setTypeFilter] = useState("all");
  const [query, setQuery] = useState("");

  // Modals + popovers
  const [addModal, setAddModal] = useState(null); // "lead" | "customer" | null
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const addLead = (data) => {
    const id = `l-new-${Date.now()}`;
    setLeads((prev) => [
      {
        id,
        name: data.name,
        phone: data.phone,
        source: data.source,
        intent: data.intent,
        lastActivity: "Just added",
        action: "Reply now",
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        stage: "prospects",
        palette: randPalette(),
      },
      ...prev,
    ]);
    setAddModal(null);
  };

  const addCustomer = (data) => {
    const id = `cu-new-${Date.now()}`;
    setCustomers((prev) => [
      {
        id,
        name: data.name,
        email: data.email,
        lifecycle: data.lifecycle,
        engagement: data.engagement,
        ltv: Number(data.ltv) || 0,
        lastPurchase: "Today",
        palette: randPalette(),
      },
      ...prev,
    ]);
    setAddModal(null);
  };

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
      <Toolbar
        view={view}
        onViewChange={setView}
        query={query}
        onQueryChange={setQuery}
        newMenuOpen={newMenuOpen}
        onToggleNewMenu={() => setNewMenuOpen((v) => !v)}
        onCloseNewMenu={() => setNewMenuOpen(false)}
        moreMenuOpen={moreMenuOpen}
        onToggleMoreMenu={() => setMoreMenuOpen((v) => !v)}
        onCloseMoreMenu={() => setMoreMenuOpen(false)}
        onAddLead={() => { setNewMenuOpen(false); setAddModal("lead"); }}
        onAddCustomer={() => { setNewMenuOpen(false); setAddModal("customer"); }}
        onFilter={() => alert("Filter (mock)")}
      />

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
          customers={customers}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          query={query}
          onQueryChange={setQuery}
          onOpenLead={handleOpenLead}
          onOpenCustomer={handleOpenCustomer}
        />
      )}

      {addModal === "lead" && (
        <AddLeadModal onClose={() => setAddModal(null)} onSave={addLead} />
      )}
      {addModal === "customer" && (
        <AddCustomerModal onClose={() => setAddModal(null)} onSave={addCustomer} />
      )}
    </div>
  );
}

function Toolbar({
  view, onViewChange,
  query, onQueryChange,
  newMenuOpen, onToggleNewMenu, onCloseNewMenu,
  moreMenuOpen, onToggleMoreMenu, onCloseMoreMenu,
  onAddLead, onAddCustomer, onFilter,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Left: view toggle */}
      <div className="inline-flex h-10 rounded-md border border-line bg-white p-0.5">
        <ToggleBtn active={view === "grid"} onClick={() => onViewChange("grid")} icon={<LayoutGrid size={14} />}>Grid</ToggleBtn>
        <ToggleBtn active={view === "table"} onClick={() => onViewChange("table")} icon={<TableIcon size={14} />}>Table</ToggleBtn>
      </div>

      {/* Right: search + filter + more + new */}
      <div className="flex items-center gap-2">
        <label className="flex h-10 w-[240px] items-center gap-2 rounded-lg border border-line bg-white px-3">
          <Search size={14} className="text-ink-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search..."
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
        </label>

        <button
          type="button"
          onClick={onFilter}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-[13px] font-semibold text-ink-body hover:bg-surface-subtle"
        >
          <Filter size={14} />
          Filter
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={onToggleMoreMenu}
            aria-label="More options"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-ink-muted hover:bg-surface-subtle"
          >
            <MoreHorizontal size={16} />
          </button>
          {moreMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={onCloseMoreMenu} />
              <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-[8px] border border-line bg-white p-1 shadow-lg">
                <MenuRow label="Export CSV" onClick={() => { onCloseMoreMenu(); alert("Export CSV (mock)"); }} />
                <MenuRow label="Import contacts" onClick={() => { onCloseMoreMenu(); alert("Import (mock)"); }} />
                <MenuRow label="Bulk actions" onClick={() => { onCloseMoreMenu(); alert("Bulk actions (mock)"); }} />
                <div className="my-1 h-px bg-line" />
                <MenuRow label="Board settings" onClick={() => { onCloseMoreMenu(); alert("Settings (mock)"); }} />
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={onToggleNewMenu}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-cta-gradient px-4 text-[13px] font-semibold text-white shadow-sm hover:opacity-90"
          >
            <Plus size={15} />
            New
          </button>
          {newMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={onCloseNewMenu} />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-[8px] border border-line bg-white p-1 shadow-lg">
                <MenuRow
                  icon={<UserPlus size={14} className="text-ink-muted" />}
                  label="New lead"
                  hint="Add to pipeline"
                  onClick={onAddLead}
                />
                <MenuRow
                  icon={<Sparkles size={14} className="text-brand-emerald" />}
                  label="New customer"
                  hint="Existing buyer"
                  onClick={onAddCustomer}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuRow({ icon, label, hint, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-start gap-2 rounded-[6px] px-2 py-1.5 text-left",
        danger ? "text-danger hover:bg-red-50" : "text-ink-body hover:bg-surface-subtle",
      ].join(" ")}
    >
      {icon}
      <div className="flex-1">
        <div className="text-[12px] font-semibold">{label}</div>
        {hint && <div className="text-[10px] text-ink-muted">{hint}</div>}
      </div>
    </button>
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
      {/* Type filter chips */}
      <div className="flex flex-wrap items-center gap-1.5">
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

/* ──────────── Add modals ──────────── */

function ModalShell({ title, subtitle, icon, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-[14px] bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-50 text-brand-emerald">
              {icon}
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-ink-heading">{title}</h2>
              {subtitle && <p className="mt-0.5 text-[12px] text-ink-muted">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1.5 text-ink-muted hover:bg-surface-subtle" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <label className="block py-1.5">
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
        {label}{required && <span className="ml-0.5 text-danger">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="h-10 w-full rounded-[8px] border border-line bg-white px-3 text-[13px] text-ink-heading outline-none focus:border-brand-emerald"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="h-10 w-full rounded-[8px] border border-line bg-white px-2 text-[13px] text-ink-heading outline-none focus:border-brand-emerald"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function AddLeadModal({ onClose, onSave }) {
  const [f, setF] = useState({
    name: "",
    phone: "",
    source: "website",
    intent: "warm",
    tags: "",
  });
  const update = (patch) => setF((prev) => ({ ...prev, ...patch }));
  const canSave = f.name.trim() && f.phone.trim();

  return (
    <ModalShell
      title="Add lead"
      subtitle="Capture a new prospect into your pipeline"
      icon={<Sparkles size={16} />}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-ink-muted hover:bg-surface-subtle">Cancel</button>
          <button
            disabled={!canSave}
            onClick={() => onSave(f)}
            className="rounded-[8px] bg-cta-gradient px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-40"
          >
            Save lead
          </button>
        </>
      }
    >
      <Field label="Full name" required>
        <Input value={f.name} onChange={(e) => update({ name: e.target.value })} placeholder="e.g. Aisha Khan" autoFocus />
      </Field>
      <Field label="Phone" required>
        <Input value={f.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="+91 98xxx xxxxx" />
      </Field>
      <Field label="Source">
        <Select
          value={f.source}
          onChange={(e) => update({ source: e.target.value })}
          options={[
            { value: "website",  label: "Website" },
            { value: "instagram", label: "Instagram" },
            { value: "whatsapp",  label: "WhatsApp" },
            { value: "ads",       label: "Ads" },
            { value: "referral",  label: "Referral" },
          ]}
        />
      </Field>
      <Field label="Intent">
        <Select
          value={f.intent}
          onChange={(e) => update({ intent: e.target.value })}
          options={[
            { value: "hot",  label: "🔥 Hot" },
            { value: "warm", label: "🌤 Warm" },
            { value: "cold", label: "❄️ Cold" },
          ]}
        />
      </Field>
      <Field label="Tags">
        <Input value={f.tags} onChange={(e) => update({ tags: e.target.value })} placeholder="Comma-separated, e.g. VIP, Demo" />
      </Field>
    </ModalShell>
  );
}

function AddCustomerModal({ onClose, onSave }) {
  const [f, setF] = useState({
    name: "",
    email: "",
    lifecycle: "new",
    engagement: "high",
    ltv: "",
  });
  const update = (patch) => setF((prev) => ({ ...prev, ...patch }));
  const canSave = f.name.trim() && f.email.trim();

  return (
    <ModalShell
      title="Add customer"
      subtitle="Add a new account to your customer base"
      icon={<UserPlus size={16} />}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-ink-muted hover:bg-surface-subtle">Cancel</button>
          <button
            disabled={!canSave}
            onClick={() => onSave(f)}
            className="rounded-[8px] bg-cta-gradient px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-40"
          >
            Save customer
          </button>
        </>
      }
    >
      <Field label="Full name" required>
        <Input value={f.name} onChange={(e) => update({ name: e.target.value })} placeholder="e.g. Karthik Rao" autoFocus />
      </Field>
      <Field label="Email" required>
        <Input value={f.email} onChange={(e) => update({ email: e.target.value })} placeholder="name@company.com" />
      </Field>
      <Field label="Lifecycle">
        <Select
          value={f.lifecycle}
          onChange={(e) => update({ lifecycle: e.target.value })}
          options={[
            { value: "new",       label: "New" },
            { value: "active",    label: "Active" },
            { value: "champion",  label: "Champion" },
            { value: "at-risk",   label: "At-risk" },
          ]}
        />
      </Field>
      <Field label="Engagement">
        <Select
          value={f.engagement}
          onChange={(e) => update({ engagement: e.target.value })}
          options={[
            { value: "high",   label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low",    label: "Low" },
          ]}
        />
      </Field>
      <Field label="Lifetime value (₹)">
        <Input
          value={f.ltv}
          onChange={(e) => update({ ltv: e.target.value.replace(/[^0-9]/g, "") })}
          placeholder="e.g. 4280"
        />
      </Field>
    </ModalShell>
  );
}
