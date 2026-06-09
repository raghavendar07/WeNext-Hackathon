import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import FilterChipGroup from "../campaigns/FilterChipGroup.jsx";
import MetricCard from "./MetricCard.jsx";
import TagCard from "./TagCard.jsx";
import { TAGS } from "./data.js";

const SWATCHES = [
  { id: "emerald", color: "#1EB677" },
  { id: "blue",    color: "#1877F2" },
  { id: "amber",   color: "#F59E0B" },
  { id: "violet",  color: "#7C3AED" },
  { id: "rose",    color: "#E84F87" },
];

const TYPE_FILTERS = [
  { id: "all",         label: "All" },
  { id: "manual",      label: "Manual" },
  { id: "auto",        label: "Auto" },
  { id: "rule-based",  label: "Rule-based" },
];

export default function TagsPage() {
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [newOpen, setNewOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TAGS.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (q && !t.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [type, query]);

  const totalContacts = TAGS.reduce((acc, t) => acc + t.count, 0);
  const totalAutomations = TAGS.reduce((acc, t) => acc + t.automations, 0);
  const totalCampaigns = TAGS.reduce((acc, t) => acc + t.campaigns, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-stretch gap-3">
        <MetricCard value={TAGS.length} label="Tags" tone="muted" />
        <MetricCard value={totalContacts} label="Tagged contacts" tone="brand" />
        <MetricCard value={totalAutomations} label="Tag-driven automations" tone="muted" />
        <MetricCard value={totalCampaigns} label="Tag-driven campaigns" tone="muted" />
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
        <FilterChipGroup chips={TYPE_FILTERS} active={type} onChange={setType} />
        <div className="flex items-center gap-2">
          <label className="flex h-9 w-[260px] items-center gap-2 rounded-sm border border-line bg-white px-3">
            <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tags..."
              className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => setNewOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
          >
            <Plus size={14} strokeWidth={2} />
            New Tag
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <h3 className="text-[14px] font-semibold text-ink-heading">No tags match</h3>
          <p className="text-[12px] font-medium text-ink-muted">
            Adjust the filter or create a new tag.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TagCard key={t.id} tag={t} />
          ))}
        </div>
      )}

      {newOpen && <NewTagModal onClose={() => setNewOpen(false)} />}
    </div>
  );
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

function NewTagModal({ onClose }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(SWATCHES[0].color);
  return (
    <Modal
      title="New tag"
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
              alert(`Tag "${name || "Untitled"}" created (mock)`);
            }}
            className="inline-flex h-9 items-center rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
          >
            Create
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. VIP"
            className="h-9 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none"
          />
        </label>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Color</span>
          <div className="flex items-center gap-2">
            {SWATCHES.map((s) => {
              const active = color === s.color;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setColor(s.color)}
                  aria-label={s.id}
                  className={[
                    "h-7 w-7 rounded-full border-2 transition-transform",
                    active ? "border-ink-heading scale-110" : "border-white",
                  ].join(" ")}
                  style={{ backgroundColor: s.color }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
