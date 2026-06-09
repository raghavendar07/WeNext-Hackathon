import { useMemo, useState } from "react";
import { Filter, Plus, Search, Upload, X, UploadCloud } from "lucide-react";
import Avatar from "../inbox/Avatar.jsx";
import IntentBadge from "./IntentBadge.jsx";
import SourceBadge from "./SourceBadge.jsx";
import MetricCard from "./MetricCard.jsx";
import { LEADS } from "./data.js";

const SOURCE_OPTS = ["All", "Website", "Instagram", "WhatsApp", "Ads", "Referral"];
const OWNER_OPTS = ["All", "Aisha K.", "Rahul V.", "Priya M.", "Karthik R."];
const STATUS_OPTS = ["All", "Hot", "Warm", "Cold"];

export default function LeadsTablePage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ status: "All", source: "All", owner: "All" });
  const [openModal, setOpenModal] = useState(null); // 'filters' | 'import' | 'add'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LEADS.filter((l) => {
      if (q) {
        const matchQ =
          l.name.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchQ) return false;
      }
      if (filters.status !== "All" && l.intent !== filters.status.toLowerCase()) return false;
      if (filters.source !== "All" && l.source !== filters.source.toLowerCase()) return false;
      return true;
    });
  }, [query, filters]);

  const newLeads = LEADS.filter((l) => l.stage === "prospects").length;
  const hot = LEADS.filter((l) => l.intent === "hot").length;
  const noActivity = LEADS.filter((l) => /No response/i.test(l.lastActivity)).length;
  const unsubscribed = 4;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-stretch gap-3">
        <MetricCard value={newLeads} label="New leads" tone="brand" />
        <MetricCard value={hot} label="High priority" tone="danger" />
        <MetricCard value={unsubscribed} label="Unsubscribed" tone="muted" />
        <MetricCard value={noActivity} label="No activity" tone="warning" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex h-9 w-[300px] items-center gap-2 rounded-sm border border-line bg-white px-3">
          <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads..."
            className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpenModal("filters")}
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <Filter size={14} strokeWidth={1.75} />
            Filters
          </button>
          <button
            type="button"
            onClick={() => setOpenModal("import")}
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <Upload size={14} strokeWidth={1.75} />
            Import Leads
          </button>
          <button
            type="button"
            onClick={() => setOpenModal("add")}
            className="inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
          >
            <Plus size={14} strokeWidth={2} />
            Add Lead
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-line bg-white">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="border-b border-line bg-canvas text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              <Th>Lead</Th>
              <Th>Source</Th>
              <Th>Intent</Th>
              <Th>Last activity</Th>
              <Th>Tags</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => {
              const isPriority = lead.intent === "hot";
              return (
                <tr
                  key={lead.id}
                  className={[
                    "border-b border-line last:border-0",
                    isPriority ? "bg-danger-bg/30" : "hover:bg-surface-subtle",
                  ].join(" ")}
                >
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={lead.name} palette={lead.palette} size={32} />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-ink-heading">
                          {lead.name}
                        </span>
                        <span className="text-[11px] font-medium text-ink-muted">
                          {lead.phone}
                        </span>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <SourceBadge source={lead.source} />
                  </Td>
                  <Td>
                    <IntentBadge intent={lead.intent} />
                  </Td>
                  <Td>
                    <span className="text-[12px] font-medium text-ink-body">
                      {lead.lastActivity}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap items-center gap-1">
                      {lead.tags?.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-xs border border-line bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-ink-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {openModal === "filters" && (
        <FiltersModal
          filters={filters}
          onApply={(next) => {
            setFilters(next);
            setOpenModal(null);
          }}
          onReset={() => setFilters({ status: "All", source: "All", owner: "All" })}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === "import" && <ImportLeadsModal onClose={() => setOpenModal(null)} />}
      {openModal === "add" && <AddLeadModal onClose={() => setOpenModal(null)} />}
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-2.5">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 align-middle">{children}</td>;
}

function Modal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-[14px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3.5">
          <h2 className="text-[15px] font-semibold text-[#0F172A]">{title}</h2>
          <button
            onClick={onClose}
            className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function FiltersModal({ filters, onApply, onReset, onClose }) {
  const [local, setLocal] = useState(filters);
  return (
    <Modal
      title="Filter leads"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              onReset();
              setLocal({ status: "All", source: "All", owner: "All" });
            }}
            className="inline-flex h-9 items-center rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("[Filters] applied", local);
              onApply(local);
            }}
            className="inline-flex h-9 items-center rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
          >
            Apply
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Field label="Status">
          <Select
            value={local.status}
            onChange={(v) => setLocal({ ...local, status: v })}
            options={STATUS_OPTS}
          />
        </Field>
        <Field label="Source">
          <Select
            value={local.source}
            onChange={(v) => setLocal({ ...local, source: v })}
            options={SOURCE_OPTS}
          />
        </Field>
        <Field label="Owner">
          <Select
            value={local.owner}
            onChange={(v) => setLocal({ ...local, owner: v })}
            options={OWNER_OPTS}
          />
        </Field>
      </div>
    </Modal>
  );
}

function ImportLeadsModal({ onClose }) {
  return (
    <Modal
      title="Import leads"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              alert("Imported 0 leads (mock)");
            }}
            className="inline-flex h-9 items-center rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
          >
            Upload
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-line bg-canvas px-6 py-10 text-center">
          <UploadCloud size={28} className="text-ink-muted" strokeWidth={1.5} />
          <p className="text-[13px] font-semibold text-ink-heading">Drop CSV here</p>
          <p className="text-[11px] font-medium text-ink-muted">or click to browse</p>
        </div>
        <p className="text-[12px] font-medium text-ink-muted">
          CSV must include columns: name, phone, email (optional), source.
        </p>
        <p className="text-[12px] font-medium text-ink-muted">
          Up to 10,000 rows per import. Duplicates by phone are skipped.
        </p>
      </div>
    </Modal>
  );
}

function AddLeadModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Website",
    status: "Warm",
  });
  return (
    <Modal
      title="Add lead"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              alert(`Saved lead "${form.name || "Untitled"}" (mock)`);
            }}
            className="inline-flex h-9 items-center rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
          >
            Save
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Field label="Name">
          <Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Jane Doe" />
        </Field>
        <Field label="Email">
          <Input value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="jane@acme.com" />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91 90000 00000" />
        </Field>
        <Field label="Source">
          <Select
            value={form.source}
            onChange={(v) => setForm({ ...form, source: v })}
            options={["Website", "Instagram", "WhatsApp", "Referral"]}
          />
        </Field>
        <Field label="Status">
          <Select
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v })}
            options={["Hot", "Warm", "Cold"]}
          />
        </Field>
      </div>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
      {children}
    </label>
  );
}
function Input({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none"
    />
  );
}
function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-sm border border-line bg-white px-2.5 text-[13px] font-medium text-ink-heading focus:border-brand-500 focus:outline-none"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
