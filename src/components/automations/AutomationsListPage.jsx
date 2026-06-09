import { useMemo, useState } from "react";
import {
  ChevronDown,
  Copy,
  Eye,
  LayoutGrid,
  MoreHorizontal,
  Pause,
  Pencil,
  Search,
  Table as TableIcon,
  Trash2,
} from "lucide-react";
import {
  AUTOMATIONS,
  EXAMPLE_FLOWS,
  TRIGGERS,
  findTriggerById,
  statusOf,
  totalContactsInActive,
  totalMessagesThisMonth,
  totalRunsThisMonth,
} from "./data.js";

const TRIGGER_FILTERS = [
  { id: "all",            label: "All triggers" },
  { id: "form_submitted", label: "Form submitted" },
  { id: "cart_abandoned", label: "Cart abandoned" },
  { id: "order_placed",   label: "Order placed" },
  { id: "webhook",        label: "Webhook" },
  { id: "manual",         label: "Manual" },
];

function DropdownMenu({ open, onClose, anchor = "right", items }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className={`absolute ${anchor === "right" ? "right-0" : "left-0"} top-full mt-1 z-20 w-44 rounded-[8px] border border-[#E5E7EB] bg-white p-1 shadow-lg`}>
        {items.map((it, i) => it === "divider" ? (
          <div key={i} className="my-1 h-px bg-[#F3F4F6]" />
        ) : (
          <button
            key={i}
            type="button"
            onClick={(e) => { e.stopPropagation(); it.onClick?.(); onClose(); }}
            className={`flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-[12px] font-medium ${it.danger ? "text-red-600 hover:bg-red-50" : "text-[#374151] hover:bg-[#F3F4F6]"}`}
          >
            {it.icon}{it.label}
          </button>
        ))}
      </div>
    </>
  );
}

const STATUS_FILTERS = [
  { id: "all",     label: "All" },
  { id: "active",  label: "Active" },
  { id: "paused",  label: "Paused" },
  { id: "draft",   label: "Draft" },
  { id: "error",   label: "Errors" },
];

const CHANNEL_FILTERS = [
  { id: "all",       label: "All channels", icon: "🌐" },
  { id: "whatsapp",  label: "WhatsApp",     icon: "💬" },
  { id: "instagram", label: "Instagram",    icon: "📸" },
];

/**
 * AutomationsListPage
 * Props:
 *   automations   – list of automations to render (defaults to AUTOMATIONS seed)
 *   onCreate      – called when the user clicks "Create Automation"
 *   onUseExample  – called from the empty-state example tiles
 *   onOpen        – called with an automation id when the user opens one
 *   onEdit        – called with the automation object when the user clicks Edit on a card
 */
export default function AutomationsListPage({ automations = AUTOMATIONS, onCreate, onUseExample, onOpen, onEdit }) {
  const [status, setStatus] = useState("all");
  const [channel, setChannel] = useState("all");
  const [trigger, setTrigger] = useState("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("card");

  if (automations.length === 0) {
    return <EmptyState onCreate={onCreate} onUseExample={onUseExample} />;
  }

  const filtered = useMemo(() => {
    return automations.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (channel !== "all" && (a.channel ?? "whatsapp") !== channel) return false;
      if (trigger !== "all" && a.triggerType !== trigger) return false;
      if (query && !a.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [automations, status, channel, trigger, query]);

  const metrics = useMemo(() => buildMetrics(automations), [automations]);

  return (
    <div className="flex flex-col gap-6">
      <Header onCreate={onCreate} />
      <Metrics metrics={metrics} />
      <Toolbar
        status={status} onStatusChange={setStatus}
        channel={channel} onChannelChange={setChannel}
        trigger={trigger} onTriggerChange={setTrigger}
        query={query} onQueryChange={setQuery}
        view={view} onViewChange={setView}
      />
      {filtered.length === 0 ? (
        <NoMatch onReset={() => { setStatus("all"); setChannel("all"); setTrigger("all"); setQuery(""); }} />
      ) : view === "card" ? (
        <CardGrid items={filtered} onOpen={onOpen} onEdit={onEdit} />
      ) : (
        <TableView items={filtered} onOpen={onOpen} onEdit={onEdit} />
      )}
    </div>
  );
}

function Header({ onCreate }) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-semibold text-ink-heading">Automations</h1>
        <p className="text-[13px] font-medium text-ink-muted">Workflows that run on autopilot.</p>
      </div>
      <button type="button" onClick={onCreate} className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90">
        + Create Automation
      </button>
    </header>
  );
}

function Metrics({ metrics }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Tile label="Active automations" value={metrics.activeCount.toString()} sub="running now" />
      <Tile label="Contacts in active flows" value={metrics.contactsInFlows.toLocaleString()} sub="currently in some automation" />
      <Tile label="Messages sent this month" value={metrics.messagesThisMonth.toLocaleString()} sub="WhatsApp + Instagram" />
      <Tile label="Total runs this month" value={metrics.runsThisMonth.toLocaleString()} sub="across all automations" />
    </div>
  );
}

function Tile({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-line bg-white p-5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</span>
      <span className="text-[28px] font-semibold leading-none text-ink-heading">{value}</span>
      {sub && <span className="text-[12px] font-medium text-ink-muted">{sub}</span>}
    </div>
  );
}

function Toolbar({ status, onStatusChange, channel, onChannelChange, trigger, onTriggerChange, query, onQueryChange, view, onViewChange }) {
  const [triggerOpen, setTriggerOpen] = useState(false);
  const currentTrigger = TRIGGER_FILTERS.find((t) => t.id === trigger) ?? TRIGGER_FILTERS[0];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-10 w-[260px] items-center gap-2 rounded-lg border border-line bg-white px-3">
          <Search size={14} className="text-ink-subtle" />
          <input type="text" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search automations…"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none" />
        </label>
        <div className="flex items-center gap-1.5">
          {CHANNEL_FILTERS.map((c) => {
            const isActive = channel === c.id;
            return (
              <button key={c.id} type="button" onClick={() => onChannelChange(c.id)}
                className={["inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors",
                  isActive
                    ? c.id === "instagram" ? "border-pink-500 bg-pink-50 text-pink-700"
                    : c.id === "whatsapp" ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-brand-emerald bg-brand-50 text-brand-emerald"
                    : "border-line bg-white text-ink-muted hover:bg-surface-subtle"].join(" ")}>
                <span>{c.icon}</span>{c.label}
              </button>
            );
          })}
        </div>
        <div className="mx-1 h-6 w-px bg-line" />
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map((f) => {
            const isActive = status === f.id;
            return (
              <button key={f.id} type="button" onClick={() => onStatusChange(f.id)}
                className={["inline-flex h-9 items-center rounded-full border px-4 text-[12px] font-medium transition-colors", isActive ? "border-brand-emerald bg-brand-50 text-brand-emerald" : "border-line bg-white text-ink-muted hover:bg-surface-subtle"].join(" ")}>
                {f.label}
              </button>
            );
          })}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setTriggerOpen((v) => !v)}
            className={["inline-flex h-9 items-center gap-2 rounded-button border bg-white px-3 text-[12px] font-medium hover:bg-surface-subtle", trigger === "all" ? "border-line text-ink-body" : "border-brand-emerald text-brand-emerald"].join(" ")}
          >
            {currentTrigger.label} <ChevronDown size={12} className="text-ink-muted" />
          </button>
          <DropdownMenu
            open={triggerOpen}
            onClose={() => setTriggerOpen(false)}
            anchor="left"
            items={TRIGGER_FILTERS.map((t) => ({
              label: t.label,
              onClick: () => onTriggerChange(t.id),
            }))}
          />
        </div>
      </div>
      <div className="inline-flex h-9 rounded-md border border-line bg-white p-0.5">
        <ToggleBtn active={view === "card"} onClick={() => onViewChange("card")} ariaLabel="Card view"><LayoutGrid size={14} /></ToggleBtn>
        <ToggleBtn active={view === "table"} onClick={() => onViewChange("table")} ariaLabel="Table view"><TableIcon size={14} /></ToggleBtn>
      </div>
    </div>
  );
}

function ToggleBtn({ active, onClick, ariaLabel, children }) {
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={["inline-flex h-8 w-9 items-center justify-center rounded-sm", active ? "bg-brand-50 text-brand-emerald" : "text-ink-muted hover:bg-surface-subtle"].join(" ")}>
      {children}
    </button>
  );
}

function CardGrid({ items, onOpen, onEdit }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((a) => <Card key={a.id} automation={a} onOpen={onOpen} onEdit={onEdit} />)}
    </div>
  );
}

function buildRowMenu(a, onOpen, onEdit) {
  return [
    { label: "View",      icon: <Eye size={12} />,    onClick: () => onOpen?.(a.id) },
    { label: "Edit",      icon: <Pencil size={12} />, onClick: () => onEdit?.(a) },
    { label: "Duplicate", icon: <Copy size={12} />,   onClick: () => {} },
    { label: "Pause",     icon: <Pause size={12} />,  onClick: () => {} },
    "divider",
    { label: "Delete",    icon: <Trash2 size={12} />, danger: true, onClick: () => {} },
  ];
}

function Card({ automation: a, onOpen, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pill = statusOf(a);
  const trigger = findTriggerById(a.triggerType);
  const channelPill = a.channel === "instagram"
    ? { bg: "bg-pink-50", text: "text-pink-700", icon: "📸", label: "Instagram" }
    : { bg: "bg-emerald-50", text: "text-emerald-700", icon: "💬", label: "WhatsApp" };
  return (
    <article
      onClick={() => onOpen?.(a.id)}
      role="button" tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen?.(a.id)}
      className="flex cursor-pointer flex-col gap-3 rounded-md border border-line bg-white p-5 transition-colors hover:border-line-strong hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:outline-none focus-visible:shadow-focus"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={["inline-flex h-7 items-center gap-1.5 rounded-pill px-2.5 text-[11px] font-semibold", pill.bg, pill.text].join(" ")}>
            <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
            {pill.label}
          </span>
          <span className={["inline-flex h-7 items-center gap-1 rounded-pill px-2 text-[10px] font-semibold", channelPill.bg, channelPill.text].join(" ")} title={channelPill.label}>
            <span>{channelPill.icon}</span>{channelPill.label}
          </span>
          <span className={["inline-flex h-7 w-7 items-center justify-center rounded-full text-[14px]", trigger?.tone ?? "bg-surface-muted"].join(" ")} title={trigger?.label}>
            {trigger?.icon ?? "⚙️"}
          </span>
        </div>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label="More"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
          >
            <MoreHorizontal size={14} />
          </button>
          <DropdownMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            anchor="right"
            items={buildRowMenu(a, onOpen, onEdit)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[15px] font-semibold text-ink-heading">{a.name}</h3>
        <p className="line-clamp-2 text-[12px] leading-snug text-ink-body">{a.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-line pt-3">
        <Meta label="Trigger" value={a.triggerLabel} sub={a.triggerSub} />
        <Meta label="Steps"   value={`${a.stepsCount} steps`} />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-line pt-3 text-[12px]">
        <span className="font-medium text-ink-muted">
          {a.status === "active" ? `${a.runsThisMonth} runs this month · ${a.successRate}% success` :
           a.status === "error"  ? `Error: ${a.errorReason ?? "needs attention"}` :
           a.status === "paused" ? "Paused — no contacts entering" :
           "Draft — not yet activated"}
        </span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={(e) => { e.stopPropagation(); onOpen?.(a.id); }} className="inline-flex h-8 items-center rounded-button border border-line bg-white px-3 text-[11px] font-medium text-ink-body hover:bg-surface-subtle">
            View
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onEdit?.(a); }} className="inline-flex h-8 items-center rounded-button px-3 text-[11px] font-medium text-ink-muted hover:bg-surface-subtle">
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}

function Meta({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</span>
      <span className="text-[13px] font-medium text-ink-heading">{value}</span>
      {sub && <span className="text-[11px] text-ink-muted">{sub}</span>}
    </div>
  );
}

function TableView({ items, onOpen, onEdit }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <table className="w-full text-[13px]">
        <thead className="bg-surface-subtle">
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
            <Th>Name</Th><Th>Channel</Th><Th>Status</Th><Th>Trigger</Th><Th>Steps</Th>
            <Th align="right">Runs (mo)</Th><Th align="right">Success</Th><Th />
          </tr>
        </thead>
        <tbody>
          {items.map((a) => {
            const pill = statusOf(a);
            const ch = a.channel === "instagram"
              ? { bg: "bg-pink-50", text: "text-pink-700", icon: "📸", label: "Instagram" }
              : { bg: "bg-emerald-50", text: "text-emerald-700", icon: "💬", label: "WhatsApp" };
            return (
              <tr key={a.id} onClick={() => onOpen?.(a.id)} className="cursor-pointer border-t border-line hover:bg-surface-subtle">
                <td className="px-4 py-3"><span className="font-semibold text-ink-heading">{a.name}</span></td>
                <td className="px-4 py-3">
                  <span className={["inline-flex h-6 items-center gap-1 rounded-pill px-2 text-[10px] font-semibold", ch.bg, ch.text].join(" ")}>
                    <span>{ch.icon}</span>{ch.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={["inline-flex h-6 items-center gap-1.5 rounded-pill px-2 text-[10px] font-semibold", pill.bg, pill.text].join(" ")}>
                    <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
                    {pill.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-body">{a.triggerLabel}</td>
                <td className="px-4 py-3 text-ink-body">{a.stepsCount}</td>
                <td className="px-4 py-3 text-right font-semibold text-ink-heading">{a.runsThisMonth}</td>
                <td className="px-4 py-3 text-right text-ink-body">{a.successRate}%</td>
                <td className="px-2 py-3 text-right">
                  <RowMoreMenu automation={a} onOpen={onOpen} onEdit={onEdit} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, align }) {
  return <th className={["px-4 py-3", align === "right" ? "text-right" : "text-left"].join(" ")}>{children}</th>;
}

function RowMoreMenu({ automation, onOpen, onEdit }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label="More"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
      >
        <MoreHorizontal size={14} />
      </button>
      <DropdownMenu
        open={open}
        onClose={() => setOpen(false)}
        anchor="right"
        items={buildRowMenu(automation, onOpen, onEdit)}
      />
    </div>
  );
}

/* ──────────── Empty state ──────────── */

function EmptyState({ onCreate, onUseExample }) {
  return (
    <div className="mx-auto flex max-w-[680px] flex-col items-center gap-6 py-12 text-center">
      <h1 className="text-[28px] font-semibold leading-tight text-ink-heading">
        Automate the work you keep doing manually
      </h1>
      <p className="text-[15px] font-medium text-ink-muted">
        Build flows that send WhatsApp messages and update contact details automatically.
      </p>
      <FlowConceptDiagram />
      <div className="grid grid-cols-3 gap-3">
        {EXAMPLE_FLOWS.map((ex) => (
          <ExampleTile key={ex.id} example={ex} onClick={() => onUseExample?.(ex.id)} />
        ))}
      </div>
      <div className="flex flex-col items-center gap-2">
        <button type="button" onClick={onCreate} className="inline-flex h-12 items-center rounded-button bg-cta-gradient px-8 text-[14px] font-semibold text-white hover:opacity-90">
          + Create Automation
        </button>
        <span className="text-[12px] font-medium text-ink-muted">Or pick an example above to get started.</span>
      </div>
    </div>
  );
}

function FlowConceptDiagram() {
  const cells = [
    { label: "Trigger", caption: "When this happens" },
    { label: "Action",  caption: "do this" },
    { label: "Action",  caption: "then do this" },
  ];
  return (
    <div className="flex items-center gap-2 rounded-md border border-line bg-white px-4 py-3">
      {cells.map((c, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-0.5 rounded-sm border border-line bg-surface-subtle px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{c.label}</span>
            <span className="text-[10px] font-medium text-ink-body">{c.caption}</span>
          </div>
          {i < cells.length - 1 && <span aria-hidden className="text-ink-muted">→</span>}
        </div>
      ))}
    </div>
  );
}

function ExampleTile({ example, onClick }) {
  return (
    <button
      type="button" onClick={onClick}
      className="flex h-[160px] w-[240px] flex-col gap-3 rounded-md border border-line bg-white p-4 text-left transition-all hover:border-brand-emerald hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      <span className={["inline-flex h-8 w-8 items-center justify-center rounded-full text-[16px]", example.iconTone.bg, example.iconTone.text].join(" ")}>
        {example.icon}
      </span>
      <span className="text-[12px] font-semibold text-ink-heading">{example.name}</span>
      <span className="line-clamp-3 text-[10px] leading-snug text-ink-muted">{example.caption}</span>
      <div className="mt-auto flex items-center gap-1">
        {example.chips.map((chip, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-pill bg-surface-muted px-1.5 py-0.5 text-[9px] font-semibold text-ink-muted">
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
            {i < example.chips.length - 1 && <span aria-hidden className="text-ink-subtle">→</span>}
          </span>
        ))}
      </div>
    </button>
  );
}

function NoMatch({ onReset }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-line bg-canvas px-6 py-12 text-center">
      <h3 className="text-[14px] font-semibold text-ink-heading">No automations match</h3>
      <button type="button" onClick={onReset} className="text-[12px] font-semibold text-brand-emerald hover:underline">
        Reset filters
      </button>
    </div>
  );
}

function buildMetrics(automations) {
  return {
    activeCount: automations.filter((a) => a.status === "active").length,
    contactsInFlows: totalContactsInActive(automations),
    messagesThisMonth: totalMessagesThisMonth(automations),
    runsThisMonth: totalRunsThisMonth(automations),
  };
}
