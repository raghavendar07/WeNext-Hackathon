import { useMemo, useState } from "react";
import {
  TextCursorInput as FormInput,
  Plus,
  Search,
  Eye,
  Pencil,
  Copy,
  Trash2,
  MoreVertical,
  FileText,
} from "lucide-react";
import {
  FLOWS,
  FLOW_STATUSES,
  FLOW_CATEGORIES,
  CATEGORY_LABEL,
  STATUS_LABEL,
} from "./mock-data.js";

// Flows list — header w/ Create Flow CTA, status + category filter chips,
// search, and a responsive card grid of flow forms.
export default function FlowsListPage({ onOpenFlow, onCreateFlow }) {
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FLOWS.filter((f) => {
      if (status !== "all" && f.status !== status) return false;
      if (category !== "all" && f.category !== category) return false;
      if (q) {
        const hay = `${f.name} ${f.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [status, category, query]);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 py-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-ink-heading">
            WhatsApp Flows
          </h1>
          <p className="text-[13px] font-medium text-ink-muted">
            Build interactive forms customers fill inside WhatsApp
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateFlow}
          className="inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white shadow-[0_0_10px_rgba(1,170,154,0.3)]"
        >
          <Plus size={14} strokeWidth={2} />
          Create Flow
        </button>
      </header>

      {/* Filter chips + search */}
      <div className="flex flex-col gap-3 border-b border-line pb-4">
        <div className="flex items-center justify-between gap-4">
          <ChipGroup
            chips={FLOW_STATUSES}
            active={status}
            onChange={setStatus}
          />
          <label className="flex h-9 w-[280px] shrink-0 items-center gap-2 rounded-sm border border-line bg-white px-3 focus-within:shadow-focus">
            <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search flows..."
              className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
            />
          </label>
        </div>
        <ChipGroup
          chips={FLOW_CATEGORIES}
          active={category}
          onChange={setCategory}
          tone="muted"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <FormInput size={28} className="text-ink-subtle" strokeWidth={1.5} />
          <h3 className="text-[14px] font-semibold text-ink-heading">
            No flows match your filters
          </h3>
          <p className="text-[12px] font-medium text-ink-muted">
            Try a different status, category, or search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((flow) => (
            <FlowCard
              key={flow.id}
              flow={flow}
              onOpen={() => onOpenFlow?.(flow)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChipGroup({ chips, active, onChange, tone = "primary" }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => {
        const isActive = c.id === active;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange?.(c.id)}
            className={[
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium",
              "transition-colors duration-150 ease-out",
              isActive
                ? tone === "muted"
                  ? "border-brand-600 bg-brand-50 text-brand-600"
                  : "border-ink-heading bg-ink-heading text-white"
                : "border-line bg-canvas text-ink-muted hover:bg-surface-subtle hover:text-ink-heading",
            ].join(" ")}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

const STATUS_TINTS = {
  published: { bg: "bg-success-bg", border: "border-success-border", text: "text-success", dot: "bg-success" },
  draft:     { bg: "bg-surface-muted", border: "border-line",        text: "text-ink-muted", dot: "bg-ink-subtle" },
  review:    { bg: "bg-warning-bg",    border: "border-warning-border", text: "text-warning",  dot: "bg-warning" },
  rejected:  { bg: "bg-danger-bg",     border: "border-danger-border",  text: "text-danger",   dot: "bg-danger" },
};

const CATEGORY_TINTS = {
  lead_gen: { bg: "bg-channel-whatsappBg", text: "text-channel-whatsappText" },
  booking:  { bg: "bg-info-bg",            text: "text-info" },
  survey:   { bg: "bg-warning-bg",         text: "text-warning" },
  signup:   { bg: "bg-channel-facebookBg", text: "text-channel-facebookText" },
  other:    { bg: "bg-surface-muted",      text: "text-ink-muted" },
};

function FlowCard({ flow, onOpen }) {
  const sTint = STATUS_TINTS[flow.status] ?? STATUS_TINTS.draft;
  const cTint = CATEGORY_TINTS[flow.category] ?? CATEGORY_TINTS.other;
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.();
        }
      }}
      className="flex cursor-pointer flex-col gap-4 rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:border-[#D1D5DB]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-sm",
              cTint.bg,
            ].join(" ")}
          >
            <FormInput size={20} className={cTint.text} strokeWidth={1.75} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h3 className="truncate text-[14px] font-semibold text-ink-heading">
              {flow.name}
            </h3>
            <p className="line-clamp-2 text-[12px] font-medium text-ink-muted">
              {flow.description}
            </p>
          </div>
        </div>

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label="Flow actions"
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle"
          >
            <MoreVertical size={16} strokeWidth={1.75} />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-[8px] border border-[#E5E7EB] bg-white p-1 shadow-lg">
                <MenuItem icon={<Eye size={12} />} onClick={() => { setMenuOpen(false); onOpen?.(); }}>
                  Open
                </MenuItem>
                <MenuItem icon={<Pencil size={12} />} onClick={() => { setMenuOpen(false); setToast("Opening editor…"); setTimeout(() => setToast(null), 1500); }}>
                  Edit
                </MenuItem>
                <MenuItem icon={<Copy size={12} />} onClick={() => { setMenuOpen(false); setToast("Flow duplicated"); setTimeout(() => setToast(null), 1500); }}>
                  Duplicate
                </MenuItem>
                <div className="my-1 h-px bg-[#F3F4F6]" />
                <MenuItem icon={<Trash2 size={12} />} danger onClick={() => { setMenuOpen(false); setToast("Flow deleted"); setTimeout(() => setToast(null), 1500); }}>
                  Delete
                </MenuItem>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tag row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-pill border px-2 py-0.5 text-[11px] font-semibold",
            sTint.bg,
            sTint.border,
            sTint.text,
          ].join(" ")}
        >
          <span aria-hidden className={["h-1.5 w-1.5 rounded-full", sTint.dot].join(" ")} />
          {STATUS_LABEL[flow.status]}
        </span>
        <span className="inline-flex items-center rounded-xs border border-line bg-canvas px-2 py-0.5 text-[10px] font-medium text-ink-muted">
          {CATEGORY_LABEL[flow.category]}
        </span>
      </div>

      {/* Metrics */}
      <div className="flex items-center justify-between border-t border-line pt-3 text-[12px] font-medium text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <FileText size={12} strokeWidth={1.75} />
          {flow.submissions.toLocaleString()} submissions
        </span>
        <span>Edited {flow.lastEdited}</span>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-[8px] bg-[#111827] px-3 py-2 text-[12px] font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </article>
  );
}

function MenuItem({ icon, onClick, danger, children }) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-[12px] font-medium",
        danger ? "text-red-600 hover:bg-red-50" : "text-[#374151] hover:bg-[#F3F4F6]",
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  );
}
