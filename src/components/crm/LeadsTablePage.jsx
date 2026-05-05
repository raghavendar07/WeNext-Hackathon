import { useMemo, useState } from "react";
import { Filter, Plus, Search, Upload } from "lucide-react";
import Avatar from "../inbox/Avatar.jsx";
import IntentBadge from "./IntentBadge.jsx";
import SourceBadge from "./SourceBadge.jsx";
import MetricCard from "./MetricCard.jsx";
import { LEADS } from "./data.js";

export default function LeadsTablePage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LEADS;
    return LEADS.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query]);

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
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <Filter size={14} strokeWidth={1.75} />
            Filters
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <Upload size={14} strokeWidth={1.75} />
            Import Leads
          </button>
          <button
            type="button"
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
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-2.5">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 align-middle">{children}</td>;
}
