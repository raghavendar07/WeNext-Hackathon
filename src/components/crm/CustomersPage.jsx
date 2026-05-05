import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import Avatar from "../inbox/Avatar.jsx";
import MetricCard from "./MetricCard.jsx";
import { CUSTOMERS } from "./data.js";

const LIFECYCLE = {
  champion: { label: "Champion", bg: "bg-success-bg", text: "text-success" },
  active:   { label: "Active",   bg: "bg-info-bg",    text: "text-info" },
  new:      { label: "New",      bg: "bg-brand-50",   text: "text-brand-emerald" },
  "at-risk": { label: "At Risk", bg: "bg-danger-bg",  text: "text-danger" },
};

const ENGAGEMENT = {
  high:   { label: "High",   bars: 3, tone: "text-success" },
  medium: { label: "Medium", bars: 2, tone: "text-warning" },
  low:    { label: "Low",    bars: 1, tone: "text-danger" },
};

export default function CustomersPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CUSTOMERS;
    return CUSTOMERS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [query]);

  const totalLtv = CUSTOMERS.reduce((acc, c) => acc + c.ltv, 0);
  const champions = CUSTOMERS.filter((c) => c.lifecycle === "champion").length;
  const atRisk = CUSTOMERS.filter((c) => c.lifecycle === "at-risk").length;
  const newCustomers = CUSTOMERS.filter((c) => c.lifecycle === "new").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-stretch gap-3">
        <MetricCard value={CUSTOMERS.length} label="Total customers" tone="muted" />
        <MetricCard value={champions} label="Champions" tone="brand" />
        <MetricCard value={atRisk} label="At risk" tone="danger" />
        <MetricCard value={newCustomers} label="New this month" tone="brand" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex h-9 w-[300px] items-center gap-2 rounded-sm border border-line bg-white px-3">
          <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers..."
            className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
        </label>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
        >
          <Plus size={14} strokeWidth={2} />
          Add Customer
        </button>
      </div>

      <div className="overflow-hidden rounded-md border border-line bg-white">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="border-b border-line bg-canvas text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              <Th>Customer</Th>
              <Th>Lifecycle</Th>
              <Th>Engagement</Th>
              <Th>LTV</Th>
              <Th>Last purchase</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const life = LIFECYCLE[c.lifecycle] ?? LIFECYCLE.active;
              const eng = ENGAGEMENT[c.engagement] ?? ENGAGEMENT.medium;
              return (
                <tr key={c.id} className="border-b border-line last:border-0 hover:bg-surface-subtle">
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={c.name} palette={c.palette} size={32} />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-ink-heading">
                          {c.name}
                        </span>
                        <span className="text-[11px] font-medium text-ink-muted">
                          {c.email}
                        </span>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span
                      className={[
                        "inline-flex items-center rounded-pill px-2 py-0.5 text-[10px] font-semibold",
                        life.bg,
                        life.text,
                      ].join(" ")}
                    >
                      {life.label}
                    </span>
                  </Td>
                  <Td>
                    <EngagementBars eng={eng} />
                  </Td>
                  <Td>
                    <span className="text-[13px] font-semibold text-ink-heading">
                      ${c.ltv.toLocaleString()}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-[12px] font-medium text-ink-body">
                      {c.lastPurchase}
                    </span>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-right text-[11px] font-medium text-ink-muted">
        Total LTV in view: <span className="font-semibold text-ink-heading">${totalLtv.toLocaleString()}</span>
      </p>
    </div>
  );
}

function EngagementBars({ eng }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-0.5">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={[
              "w-1 rounded-xs",
              i <= eng.bars ? "bg-current" : "bg-line",
              eng.tone,
            ].join(" ")}
            style={{ height: `${i * 4 + 4}px` }}
          />
        ))}
      </div>
      <span className={["text-[12px] font-medium", eng.tone].join(" ")}>
        {eng.label}
      </span>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-2.5">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 align-middle">{children}</td>;
}
