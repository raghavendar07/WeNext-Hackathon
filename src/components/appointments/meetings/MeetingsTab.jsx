import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import FilterChipGroup from "../../campaigns/FilterChipGroup.jsx";
import CampaignKpiCard from "../../campaigns/CampaignKpiCard.jsx";
import MeetingCard from "./MeetingCard.jsx";
import { MEETINGS } from "./data.js";

const STATUS_CHIPS = [
  { id: "all",         label: "All" },
  { id: "upcoming",    label: "Upcoming" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed",   label: "Completed" },
  { id: "cancelled",   label: "Cancelled" },
  { id: "no-show",     label: "No-show" },
];

export default function MeetingsTab({ onOpen }) {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEETINGS.filter((m) => {
      if (status !== "all" && m.status !== status) return false;
      if (q && !m.title.toLowerCase().includes(q) && !m.customer.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [status, query]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const m of filtered) {
      const dateKey = m.when.split(",")[0];
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey).push(m);
    }
    return Array.from(map.entries()).map(([day, items]) => ({ day, items }));
  }, [filtered]);

  const kpis = useMemo(() => {
    const total = MEETINGS.length;
    const confirmed = MEETINGS.filter((m) => m.status === "upcoming" || m.status === "in-progress").length;
    const completed = MEETINGS.filter((m) => m.status === "completed").length;
    const noShows = MEETINGS.filter((m) => m.status === "no-show").length;
    const rate = (n, d) => (d > 0 ? Math.round((n / d) * 100) : 0);
    return [
      { id: "total", title: "Total Meetings", value: total,                delta: { value: 4, direction: "up", period: "vs last week" } },
      { id: "conf",  title: "Confirmed",      value: rate(confirmed, total), suffix: "%", delta: { value: 8, direction: "up", period: "vs last week" } },
      { id: "comp",  title: "Completed",      value: rate(completed, total), suffix: "%", delta: { value: 3, direction: "up", period: "vs last week" } },
      { id: "ns",    title: "No-shows",       value: rate(noShows, total),   suffix: "%", delta: { value: 2, direction: "down", period: "vs last week" } },
    ];
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-stretch gap-3">
        {kpis.map((k) => (
          <CampaignKpiCard key={k.id} {...k} />
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 border-b border-line py-3">
        <FilterChipGroup chips={STATUS_CHIPS} active={status} onChange={setStatus} />
        <label className="flex h-9 w-[260px] items-center gap-2 rounded-sm border border-line bg-white px-3">
          <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings..."
            className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
        </label>
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <h3 className="text-[14px] font-semibold text-ink-heading">No meetings match</h3>
          <p className="text-[12px] font-medium text-ink-muted">Try a different status or search.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <section key={group.day} className="flex flex-col gap-2">
              <header className="sticky top-0 z-10 flex items-center gap-2 bg-white py-2 text-[12px] font-semibold text-ink-heading">
                <span>{group.day}</span>
                <span aria-hidden className="text-ink-muted">·</span>
                <span className="text-[11px] font-medium text-ink-muted">
                  {group.items.length} meeting{group.items.length === 1 ? "" : "s"}
                </span>
              </header>
              <div className="flex flex-col gap-3">
                {group.items.map((m) => (
                  <MeetingCard key={m.id} meeting={m} onOpen={onOpen} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
