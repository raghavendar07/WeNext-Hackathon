import { useMemo, useState } from "react";
import {
  Search,
  MoreHorizontal,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Download,
  Send,
} from "lucide-react";
import {
  PAYMENTS,
  INVOICES,
  PAYMENT_METHODS,
  PAYMENT_STATUS_PILLS,
  INVOICE_STATUS_PILLS,
  formatCurrency,
  formatDate,
  billingMetrics,
} from "./data.js";

const TYPE_FILTERS = [
  { id: "all",      label: "All" },
  { id: "payments", label: "Payments" },
  { id: "invoices", label: "Invoices" },
  { id: "overdue",  label: "Overdue" },
  { id: "refunded", label: "Refunded" },
];

function buildUnified() {
  const items = [];
  for (const p of PAYMENTS) {
    items.push({
      kind: "payment",
      id: p.id,
      date: p.date,
      reference: p.id,
      customer: p.customer,
      amount: p.amount,
      method: p.method,
      status: p.status,
      orderId: p.orderId,
      invoiceId: p.invoiceId,
    });
  }
  for (const i of INVOICES) {
    items.push({
      kind: "invoice",
      id: i.id,
      date: i.date,
      reference: i.id,
      customer: i.customer,
      amount: i.amount,
      method: null,
      status: i.status,
      orderId: null,
      invoiceId: i.id,
      paymentId: i.paymentId,
    });
  }
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function BillingPage() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const metrics = useMemo(() => billingMetrics(PAYMENTS, INVOICES), []);
  const items = useMemo(() => buildUnified(), []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (filter === "payments" && it.kind !== "payment") return false;
      if (filter === "invoices" && it.kind !== "invoice") return false;
      if (filter === "overdue" && it.status !== "overdue") return false;
      if (filter === "refunded" && it.status !== "refunded") return false;
      if (query) {
        const q = query.trim().toLowerCase();
        if (!it.id.toLowerCase().includes(q) && !it.customer.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [items, filter, query]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-ink-heading">Billing</h1>
          <p className="text-[13px] font-medium text-ink-muted">
            Track payments, manage invoices, and reconcile finances
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Record Payment — mock')}
            className="inline-flex h-10 items-center gap-2 rounded-button border border-line bg-white px-4 text-[13px] font-semibold text-ink-body hover:bg-surface-subtle"
          >
            + Record Payment
          </button>
          <button
            type="button"
            onClick={() => alert('Create Invoice — mock')}
            className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            + Create Invoice
          </button>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <MetricTile
          label="Received this month"
          value={formatCurrency(metrics.received)}
          delta={{ dir: "up", value: "+18%", period: "vs last month" }}
        />
        <MetricTile
          label="Outstanding"
          value={formatCurrency(metrics.outstanding)}
          sub="Unpaid invoices"
        />
        <MetricTile
          label="Overdue"
          value={formatCurrency(metrics.overdue)}
          tone={metrics.overdue > 0 ? "danger" : "default"}
          sub={metrics.overdue > 0 ? "Needs attention" : "All caught up"}
        />
        <MetricTile
          label="Refunded this month"
          value={formatCurrency(metrics.refunded)}
          sub={metrics.refunded > 0 ? "Customer credits" : "No refunds"}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {TYPE_FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={[
                "inline-flex h-9 items-center rounded-pill border px-4 text-[12px] font-medium transition-colors",
                active
                  ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                  : "border-line bg-white text-ink-muted hover:bg-surface-subtle",
              ].join(" ")}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search by reference or customer…" />
        <DropdownButton label="Last 30 days" />
      </div>

      <div className="overflow-hidden rounded-md border border-line bg-white">
        <table className="w-full text-[13px]">
          <thead className="bg-surface-subtle">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Reference</Th>
              <Th>Customer</Th>
              <Th align="right">Amount</Th>
              <Th>Method</Th>
              <Th>Status</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => {
              const pill = it.kind === "payment"
                ? PAYMENT_STATUS_PILLS[it.status]
                : INVOICE_STATUS_PILLS[it.status];
              const methodLabel = it.method
                ? PAYMENT_METHODS.find((m) => m.id === it.method)?.label
                : "—";
              return (
                <tr key={`${it.kind}-${it.id}`} className="border-t border-line transition-colors hover:bg-surface-subtle">
                  <td className="px-4 py-3 text-ink-muted">{formatDate(it.date)}</td>
                  <td className="px-4 py-3">
                    <TypeBadge kind={it.kind} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink-heading">{it.reference}</td>
                  <td className="px-4 py-3 text-ink-body">{it.customer}</td>
                  <td className="px-4 py-3 text-right font-medium text-ink-heading">
                    {formatCurrency(it.amount)}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{methodLabel}</td>
                  <td className="px-4 py-3">
                    {pill && (
                      <span className={["inline-flex h-6 items-center gap-1.5 rounded-pill px-2.5 text-[11px] font-semibold", pill.bg, pill.text].join(" ")}>
                        <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
                        {pill.label}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {it.kind === "invoice" && (it.status === "draft" || it.status === "sent" || it.status === "overdue") && (
                        <IconAction label="Send" icon={Send} />
                      )}
                      <IconAction label="Download PDF" icon={Download} />
                      <button
                        type="button"
                        aria-label="Row actions"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-[13px] text-ink-muted">
            No items match.
          </div>
        )}
      </div>
    </div>
  );
}

function TypeBadge({ kind }) {
  const styles = kind === "payment"
    ? "bg-brand-50 text-brand-700"
    : "bg-blue-50 text-blue-700";
  return (
    <span className={["inline-flex h-6 items-center rounded-pill px-2.5 text-[11px] font-semibold", styles].join(" ")}>
      {kind === "payment" ? "Payment" : "Invoice"}
    </span>
  );
}

function MetricTile({ label, value, sub, delta, tone = "default" }) {
  const toneClass = {
    default: "border-line",
    danger:  "border-red-200 bg-red-50/40",
  }[tone];
  return (
    <div className={["flex flex-col gap-1.5 rounded-md border bg-white p-5", toneClass].join(" ")}>
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</span>
      <span className={["text-[28px] font-semibold leading-none", tone === "danger" ? "text-danger" : "text-ink-heading"].join(" ")}>
        {value}
      </span>
      {delta && (
        <span className={["inline-flex items-center gap-1 text-[12px] font-medium", delta.dir === "up" ? "text-success" : "text-danger"].join(" ")}>
          {delta.dir === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta.value} {delta.period}
        </span>
      )}
      {sub && !delta && (
        <span className="text-[12px] font-medium text-ink-muted">{sub}</span>
      )}
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <label className="flex h-10 w-[260px] items-center gap-2 rounded-md border border-line bg-white px-3">
      <Search size={14} className="text-ink-subtle" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none"
      />
    </label>
  );
}

function DropdownButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick ?? (() => alert(`${label} — mock`))}
      className="inline-flex h-9 items-center gap-2 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
    >
      {label}
      <ChevronDown size={12} className="text-ink-muted" />
    </button>
  );
}

function IconAction({ label, icon: Icon }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
    >
      <Icon size={14} />
    </button>
  );
}

function Th({ children, align }) {
  return (
    <th className={["px-4 py-3", align === "right" ? "text-right" : "text-left"].join(" ")}>
      {children}
    </th>
  );
}
