import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  X,
  FileText,
  ChevronRight,
} from "lucide-react";
import { FLOWS, SUBMISSIONS } from "./mock-data.js";

// Form Data — table of all flow submissions w/ filter by Flow + Date range + Status.
// Row click opens a side drawer w/ all captured field values.
export default function FormDataPage() {
  const [flowId, setFlowId] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SUBMISSIONS.filter((s) => {
      if (flowId !== "all" && s.flowId !== flowId) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (dateRange === "today" && !s.date.startsWith("2026-06-10")) return false;
      if (dateRange === "week" && s.date < "2026-06-04") return false;
      if (q) {
        const hay = `${s.flowName} ${s.phone} ${Object.values(s.fields).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [flowId, statusFilter, dateRange, query]);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 py-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-ink-heading">
            Form Data Submissions
          </h1>
          <p className="text-[13px] font-medium text-ink-muted">
            Browse responses captured by your WhatsApp Flows
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert("Exported CSV (mock)")}
          className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
        >
          <Download size={14} strokeWidth={1.75} />
          Export CSV
        </button>
      </header>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Total submissions" value={SUBMISSIONS.length} />
        <Kpi label="Completed" value={SUBMISSIONS.filter((s) => s.status === "complete").length} />
        <Kpi label="Partial" value={SUBMISSIONS.filter((s) => s.status === "partial").length} />
        <Kpi label="Active flows" value={FLOWS.filter((f) => f.status === "published").length} />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={flowId}
            onChange={setFlowId}
            ariaLabel="Filter by flow"
            options={[
              { id: "all", label: "All flows" },
              ...FLOWS.map((f) => ({ id: f.id, label: f.name })),
            ]}
          />
          <Select
            value={dateRange}
            onChange={setDateRange}
            ariaLabel="Filter by date"
            options={[
              { id: "all",   label: "Any date" },
              { id: "today", label: "Today" },
              { id: "week",  label: "Last 7 days" },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            ariaLabel="Filter by status"
            options={[
              { id: "all",      label: "Any status" },
              { id: "complete", label: "Complete" },
              { id: "partial",  label: "Partial" },
            ]}
          />
          <button
            type="button"
            onClick={() => {
              setFlowId("all");
              setStatusFilter("all");
              setDateRange("all");
              setQuery("");
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-line bg-white px-3 text-[12px] font-medium text-ink-muted hover:bg-surface-subtle"
          >
            <Filter size={12} strokeWidth={1.75} />
            Reset
          </button>
        </div>

        <label className="flex h-9 w-[280px] items-center gap-2 rounded-sm border border-line bg-white px-3">
          <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search responses..."
            className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
        </label>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="border-b border-line bg-canvas text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              <Th>Date</Th>
              <Th>Flow</Th>
              <Th>Phone</Th>
              <Th>Status</Th>
              <Th>Captured fields</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText size={24} className="text-ink-subtle" strokeWidth={1.5} />
                    <span className="text-[13px] font-semibold text-ink-heading">
                      No submissions match your filters
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setActive(s)}
                  className="cursor-pointer border-b border-line last:border-0 hover:bg-surface-subtle"
                >
                  <Td>
                    <span className="text-[12px] font-medium text-ink-body">
                      {s.date}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-[13px] font-semibold text-ink-heading">
                      {s.flowName}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-[12px] font-medium text-ink-body">
                      {s.phone}
                    </span>
                  </Td>
                  <Td>
                    <StatusBadge status={s.status} />
                  </Td>
                  <Td>
                    <FieldPreview fields={s.fields} />
                  </Td>
                  <Td>
                    <ChevronRight size={14} className="text-ink-subtle" strokeWidth={1.75} />
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <SubmissionDrawer
        submission={active}
        onClose={() => setActive(null)}
      />
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-2.5">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 align-middle">{children}</td>;
}

function Kpi({ label, value }) {
  return (
    <div className="flex flex-col gap-1 rounded-[12px] border border-[#E5E7EB] bg-white p-4">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      <span className="text-[22px] font-semibold text-ink-heading">{value}</span>
    </div>
  );
}

function Select({ value, onChange, options, ariaLabel }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className="h-9 rounded-sm border border-line bg-white px-2.5 text-[13px] font-medium text-ink-heading focus:border-brand-500 focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function StatusBadge({ status }) {
  const tone =
    status === "complete"
      ? { bg: "bg-success-bg", border: "border-success-border", text: "text-success", dot: "bg-success", label: "Complete" }
      : { bg: "bg-warning-bg", border: "border-warning-border", text: "text-warning", dot: "bg-warning", label: "Partial" };
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-pill border px-2 py-0.5 text-[11px] font-semibold",
        tone.bg,
        tone.border,
        tone.text,
      ].join(" ")}
    >
      <span aria-hidden className={["h-1.5 w-1.5 rounded-full", tone.dot].join(" ")} />
      {tone.label}
    </span>
  );
}

function FieldPreview({ fields }) {
  const entries = Object.entries(fields).slice(0, 2);
  return (
    <div className="flex flex-col gap-0.5">
      {entries.map(([k, v]) => (
        <span key={k} className="text-[12px] font-medium text-ink-muted">
          <span className="text-ink-body">{k}:</span> {v}
        </span>
      ))}
      {Object.keys(fields).length > 2 && (
        <span className="text-[11px] font-medium text-ink-subtle">
          +{Object.keys(fields).length - 2} more
        </span>
      )}
    </div>
  );
}

function SubmissionDrawer({ submission, onClose }) {
  if (!submission) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative z-10 flex h-full w-full max-w-[440px] flex-col overflow-hidden border-l border-[#E5E7EB] bg-white shadow-modal">
        <div className="flex items-start justify-between gap-3 border-b border-[#E5E7EB] px-5 py-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-semibold text-ink-heading">
              Submission detail
            </h2>
            <p className="text-[12px] font-medium text-ink-muted">
              {submission.flowName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-ink-muted hover:bg-surface-subtle"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-5 py-5">
          <Meta label="Date"   value={submission.date} />
          <Meta label="Phone"  value={submission.phone} />
          <Meta label="Status" value={<StatusBadge status={submission.status} />} />

          <div className="flex flex-col gap-1 pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              Captured fields
            </span>
            <div className="mt-1 flex flex-col divide-y divide-line rounded-[10px] border border-[#E5E7EB]">
              {Object.entries(submission.fields).map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-3 px-3 py-2.5">
                  <span className="text-[12px] font-medium text-ink-muted">{k}</span>
                  <span className="text-[12px] font-semibold text-ink-heading text-right">
                    {String(v)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => alert("Marked as contacted (mock)")}
            className="inline-flex h-9 items-center rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
          >
            Mark contacted
          </button>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      <span className="text-[12px] font-semibold text-ink-heading">{value}</span>
    </div>
  );
}
