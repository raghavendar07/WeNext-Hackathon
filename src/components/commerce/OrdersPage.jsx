import { useEffect, useMemo, useState } from "react";
import { Search, MoreHorizontal, ChevronDown, Lightbulb } from "lucide-react";
import {
  ORDERS,
  ORDER_STATUS_PILLS,
  formatCurrency,
  formatDate,
  abandonedSummary,
} from "./data.js";

const STATUS_FILTERS = [
  { id: "all",       label: "All Orders" },
  { id: "abandoned", label: "Abandoned" },
  { id: "refunded",  label: "Refunded" },
];

function readStatusFromURL() {
  if (typeof window === "undefined") return "all";
  const param = new URLSearchParams(window.location.search).get("status");
  return STATUS_FILTERS.some((s) => s.id === param) ? param : "all";
}

function writeStatusToURL(status) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (status && status !== "all") url.searchParams.set("status", status);
  else url.searchParams.delete("status");
  window.history.replaceState(null, "", url.toString());
}

export default function OrdersPage({ onNavigate }) {
  const [status, setStatus] = useState(() => readStatusFromURL());

  useEffect(() => {
    writeStatusToURL(status);
  }, [status]);

  useEffect(() => {
    const onPop = () => setStatus(readStatusFromURL());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-ink-heading">Orders</h1>
          <p className="text-[13px] font-medium text-ink-muted">
            Manage incoming orders, fulfillment, and recovery
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Create Order — mock')}
          className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90"
        >
          + Create Order
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = status === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatus(f.id)}
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

      {status === "all"       && <AllOrdersContent />}
      {status === "abandoned" && <AbandonedContent onNavigate={onNavigate} />}
      {status === "refunded"  && <RefundedContent />}
    </div>
  );
}

function AllOrdersContent() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      if (!query) return true;
      const q = query.trim().toLowerCase();
      return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
    });
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search by order # or customer…" />
        <DropdownButton label="Last 30 days" />
        <DropdownButton label="Sort: Newest" />
      </div>

      <OrdersTable orders={filtered} />
    </div>
  );
}

function AbandonedContent({ onNavigate }) {
  const [query, setQuery] = useState("");
  const abandoned = abandonedSummary(ORDERS);
  const filtered = useMemo(() => {
    const list = ORDERS.filter((o) => o.status === "abandoned");
    if (!query) return list;
    const q = query.trim().toLowerCase();
    return list.filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      {abandoned.count > 0 && (
        <aside className="flex items-start gap-3 rounded-r-xl border-l-4 border-amber-500 bg-amber-50/40 p-4">
          <Lightbulb size={18} className="mt-0.5 text-amber-600" />
          <div className="flex flex-1 flex-col gap-3">
            <p className="text-[13px] leading-relaxed text-ink-body">
              You have <strong>{abandoned.count} abandoned cart{abandoned.count === 1 ? "" : "s"}</strong> worth{" "}
              <strong>{formatCurrency(abandoned.totalValue)}</strong> in potential revenue.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate?.("campaigns", { abandoned: 1 })}
                className="inline-flex h-9 items-center rounded-button bg-cta-gradient px-4 text-[12px] font-semibold text-white hover:opacity-90"
              >
                Send recovery message
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("automations", { trigger: "abandoned-cart" })}
                className="inline-flex h-9 items-center rounded-button border border-line bg-white px-4 text-[12px] font-semibold text-ink-body hover:bg-surface-subtle"
              >
                Set up auto-recovery
              </button>
            </div>
          </div>
        </aside>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search abandoned carts…" />
        <DropdownButton label="Last 30 days" />
      </div>

      <OrdersTable orders={filtered} />
    </div>
  );
}

function RefundedContent() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const list = ORDERS.filter((o) => o.status === "refunded");
    if (!query) return list;
    const q = query.trim().toLowerCase();
    return list.filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search refunded orders…" />
        <DropdownButton label="Last 30 days" />
      </div>

      <div className="overflow-hidden rounded-md border border-line bg-white">
        <table className="w-full text-[13px]">
          <thead className="bg-surface-subtle">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Order date</Th>
              <Th align="right">Order total</Th>
              <Th align="right">Refund amount</Th>
              <Th>Refund date</Th>
              <Th>Reason</Th>
              <Th align="right" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="cursor-pointer border-t border-line transition-colors hover:bg-surface-subtle">
                <td className="px-4 py-3 font-semibold text-ink-heading">{o.id}</td>
                <td className="px-4 py-3 text-ink-body">{o.customer}</td>
                <td className="px-4 py-3 text-ink-muted">{formatDate(o.date)}</td>
                <td className="px-4 py-3 text-right text-ink-body">{formatCurrency(o.total)}</td>
                <td className="px-4 py-3 text-right font-medium text-danger">
                  −{formatCurrency(o.refundAmount ?? o.total)}
                </td>
                <td className="px-4 py-3 text-ink-muted">
                  {o.refundDate ? formatDate(o.refundDate) : "—"}
                </td>
                <td className="px-4 py-3 text-ink-body">{o.refundReason || "—"}</td>
                <td className="px-2 py-3 text-right">
                  <button
                    type="button"
                    aria-label="Row actions"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-[13px] text-ink-muted">
            No refunds in this period.
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersTable({ orders }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <table className="w-full text-[13px]">
        <thead className="bg-surface-subtle">
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
            <Th>Order</Th>
            <Th>Customer</Th>
            <Th>Date</Th>
            <Th align="right">Items</Th>
            <Th align="right">Total</Th>
            <Th>Channel</Th>
            <Th>Status</Th>
            <Th align="right" />
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const pill = ORDER_STATUS_PILLS[o.status];
            return (
              <tr key={o.id} className="cursor-pointer border-t border-line transition-colors hover:bg-surface-subtle">
                <td className="px-4 py-3 font-semibold text-ink-heading">{o.id}</td>
                <td className="px-4 py-3 text-ink-body">{o.customer}</td>
                <td className="px-4 py-3 text-ink-muted">{formatDate(o.date)}</td>
                <td className="px-4 py-3 text-right text-ink-body">{o.items}</td>
                <td className="px-4 py-3 text-right font-medium text-ink-heading">
                  {formatCurrency(o.total)}
                </td>
                <td className="px-4 py-3 text-ink-muted">{o.channel}</td>
                <td className="px-4 py-3">
                  <span className={["inline-flex h-6 items-center gap-1.5 rounded-pill px-2.5 text-[11px] font-semibold", pill.bg, pill.text].join(" ")}>
                    <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
                    {pill.label}
                  </span>
                </td>
                <td className="px-2 py-3 text-right">
                  <button
                    type="button"
                    aria-label="Row actions"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div className="px-6 py-12 text-center text-[13px] text-ink-muted">
          No orders match.
        </div>
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

function Th({ children, align }) {
  return (
    <th className={["px-4 py-3", align === "right" ? "text-right" : "text-left"].join(" ")}>
      {children}
    </th>
  );
}
