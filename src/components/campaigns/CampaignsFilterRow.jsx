import { Search } from "lucide-react";
import FilterChipGroup from "./FilterChipGroup.jsx";

const TYPE_CHIPS = [
  { id: "all",        label: "All" },
  { id: "active",     label: "Active" },
  { id: "inprogress", label: "Inprogress" },
  { id: "scheduled",  label: "Scheduled" },
  { id: "completed",  label: "Completed" },
  { id: "draft",      label: "Draft" },
];

export default function CampaignsFilterRow({
  type,
  onTypeChange,
  query,
  onQueryChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3">
      <FilterChipGroup chips={TYPE_CHIPS} active={type} onChange={onTypeChange} />
      <label className="flex h-9 w-[300px] shrink-0 items-center gap-2 rounded-sm border border-line bg-white px-3 focus-within:shadow-focus">
        <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder="Search campaigns..."
          className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
        />
      </label>
    </div>
  );
}
