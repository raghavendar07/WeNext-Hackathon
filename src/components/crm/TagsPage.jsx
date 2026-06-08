import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import FilterChipGroup from "../campaigns/FilterChipGroup.jsx";
import MetricCard from "./MetricCard.jsx";
import TagCard from "./TagCard.jsx";
import { TAGS } from "./data.js";

const TYPE_FILTERS = [
  { id: "all",         label: "All" },
  { id: "manual",      label: "Manual" },
  { id: "auto",        label: "Auto" },
  { id: "rule-based",  label: "Rule-based" },
];

export default function TagsPage() {
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");

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
            onClick={() => alert('New Tag — mock')}
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
    </div>
  );
}
