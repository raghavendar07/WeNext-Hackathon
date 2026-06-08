import { useMemo, useState } from "react";
import {
  ChevronDown,
  LayoutGrid,
  MoreHorizontal,
  Search,
  Table as TableIcon,
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

const STATUS_FILTERS = [
  { id: "all",     label: "All" },
  { id: "active",  label: "Active" },
  { id: "paused",  label: "Paused" },
  { id: "draft",   label: "Draft" },
  { id: "error",   label: "Errors" },
];

export default function AutomationsListPage({ automations = AUTOMATIONS, onCreate, onUseExample, onOpen }) {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("card");

  if (automations.length === 0) {
    return <EmptyState onCreate={onCreate} onUseExample={onUseExample} />;
  }

  const filtered = useMemo(() => {
    return automations.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (query && !a.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [automations, status, query]);

  const metrics = useMemo(() => buildMetrics(automations), [automations]);

  return (
    <div className="flex flex-col gap-6">
      <Header onCreate={onCreate} />
      <Metrics metrics={metrics} />
      <Toolbar
        status={status} onStatusChange={setStatus}
        query={query} onQueryChange={setQuery}
        view={view} onViewChange={setView}
      />
      {filtered.length === 0 ? (
        <NoMatch onReset={() => { setStatus("all"); setQuery(""); }} />
      ) : view === "card" ? (
        <CardGrid items={filtered} onOpen={onOpen} />
      ) : (
        <TableView items={filtered} onOpen={onOpen} />
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
      <Tile label="Messages sent this month" value={metrics.messagesThisMonth.toLocaleString()} sub="WhatsApp messages" />
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

function Toolbar({ status, onStatusChange, query, onQueryChange, view, onViewChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-10 w-[260px] items-center gap-2 rounded-lg border border-line bg-white px-3">
          <Search size={14} className="text-ink-subtle" />
          <input type="text" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search automations…"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none" />
        </label>
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
        <button type="button" onClick={() => alert('Trigger filter mock')} className="inline-flex h-9 items-center gap-2 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle">
          All triggers <ChevronDown size={12} className="text-ink-muted" />
        </button>
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

function CardGrid({ items, onOpen }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((a) => <Card key={a.id} automation={a} onOpen={onOpen} />)}
    </div>
  );
}

function Card({ automation: a, onOpen }) {
  const pill = statusOf(a);
  const trigger = findTriggerById(a.triggerType);
  return (
    <article
      onClick={() => onOpen?.(a.id)}
      role="button" tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen?.(a.id)}
      className="flex cursor-pointer flex-col gap-3 rounded-md border border-line bg-white p-5 transition-colors hover:border-line-strong hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:outline-none focus-visible:shadow-focus"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className={["inline-flex h-7 items-center gap-1.5 rounded-pill px-2.5 text-[11px] font-semibold", pill.bg, pill.text].join(" ")}>
            <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
            {pill.label}
          </span>
          <span className={["inline-flex h-7 w-7 items-center justify-center rounded-full text-[14px]", trigger?.tone ?? "bg-surface-muted"].join(" ")} title={trigger?.label}>
            {trigger?.icon ?? "⚙️"}
          </span>
        </div>
        <button type="button" aria-label="More" onClick={(e) => { e.stopPropagation(); alert('Card menu mock'); }} className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted">
          <MoreHorizontal size={14} />
        </button>
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
          <button type="button" onClick={(e) => { e.stopPropagation(); alert('Edit mock'); }} className="inline-flex h-8 items-center rounded-button px-3 text-[11px] font-medium text-ink-muted hover:bg-surface-subtle">
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

function TableView({ items, onOpen }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <table className="w-full text-[13px]">
        <thead className="bg-surface-subtle">
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
            <Th>Name</Th><Th>Status</Th><Th>Trigger</Th><Th>Steps</Th>
            <Th align="right">Runs (mo)</Th><Th align="right">Success</Th><Th />
          </tr>
        </thead>
        <tbody>
          {items.map((a) => {
            const pill = statusOf(a);
            return (
              <tr key={a.id} onClick={() => onOpen?.(a.id)} className="cursor-pointer border-t border-line hover:bg-surface-subtle">
                <td className="px-4 py-3"><span className="font-semibold text-ink-heading">{a.name}</span></td>
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
                  <button type="button" aria-label="More" onClick={(e) => { e.stopPropagation(); alert('Card menu mock'); }} className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted">
                    <MoreHorizontal size={14} />
                  </button>
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
