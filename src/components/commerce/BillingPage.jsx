import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  MoreHorizontal,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Download,
  Send,
  X,
  Plus,
  Trash2,
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
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
            onClick={() => setShowPaymentModal(true)}
            className="inline-flex h-10 items-center gap-2 rounded-button border border-line bg-white px-4 text-[13px] font-semibold text-ink-body hover:bg-surface-subtle"
          >
            + Record Payment
          </button>
          <button
            type="button"
            onClick={() => setShowInvoiceModal(true)}
            className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            + Create Invoice
          </button>
        </div>
      </header>

      {showPaymentModal && (
        <RecordPaymentModal onClose={() => setShowPaymentModal(false)} />
      )}
      {showInvoiceModal && (
        <CreateInvoiceModal onClose={() => setShowInvoiceModal(false)} />
      )}

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
        <DropdownButton
          label="Last 30 days"
          options={["Last 7 days", "Last 30 days", "Last 90 days"]}
        />
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

function DropdownButton({ label, options }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const opts = options ?? [];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-2 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
      >
        {selected}
        <ChevronDown size={12} className="text-ink-muted" />
      </button>
      {open && opts.length > 0 && (
        <div className="absolute left-0 top-full z-30 mt-1 min-w-[180px] overflow-hidden rounded-md border border-line bg-white shadow-modal">
          {opts.map((opt) => {
            const active = opt === selected;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => { setSelected(opt); setOpen(false); }}
                className={[
                  "flex w-full items-center px-3 py-2 text-left text-[12px] font-medium transition-colors",
                  active ? "bg-brand-50 text-brand-emerald" : "text-ink-body hover:bg-surface-subtle",
                ].join(" ")}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
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

/* ───── Record Payment modal ───── */

function RecordPaymentModal({ onClose }) {
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const methods = [
    { id: "card", label: "Card" },
    { id: "upi",  label: "UPI" },
    { id: "bank", label: "Bank transfer" },
    { id: "cash", label: "Cash" },
  ];

  return (
    <ModalShell onClose={onClose} title="Record payment" subtitle="Log a payment received outside the platform">
      <div className="flex flex-col gap-4">
        <Field label="Invoice ID">
          <input
            type="text"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            placeholder="INV-1042"
            className="h-10 w-full rounded-md border border-line bg-white px-3 text-[13px] focus:outline-none focus-visible:shadow-focus"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (₹)">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="2450"
              className="h-10 w-full rounded-md border border-line bg-white px-3 text-[13px] focus:outline-none focus-visible:shadow-focus"
            />
          </Field>
          <Field label="Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 w-full rounded-md border border-line bg-white px-3 text-[13px] focus:outline-none focus-visible:shadow-focus"
            />
          </Field>
        </div>
        <Field label="Method">
          <div className="grid grid-cols-4 gap-2">
            {methods.map((m) => {
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={[
                    "inline-flex h-10 items-center justify-center rounded-button border text-[12px] font-medium transition-colors",
                    active
                      ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                      : "border-line bg-white text-ink-body hover:bg-surface-subtle",
                  ].join(" ")}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[13px] font-semibold text-ink-body hover:bg-surface-subtle">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { alert('Payment recorded (mock)'); onClose(); }}
            className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            Save payment
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ───── Create Invoice modal ───── */

function CreateInvoiceModal({ onClose }) {
  const [customer, setCustomer] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([
    { id: 1, description: "Design retainer — June",    amount: 25000 },
    { id: 2, description: "Add-on social ad creatives", amount: 8500 },
  ]);

  const updateItem = (id, field, value) => {
    setItems((arr) => arr.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };
  const removeItem = (id) => setItems((arr) => arr.filter((it) => it.id !== id));
  const addItem = () => setItems((arr) => [...arr, { id: Date.now(), description: "", amount: 0 }]);

  const total = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);

  return (
    <ModalShell onClose={onClose} title="Create invoice" subtitle="Send a new invoice to a customer">
      <div className="flex flex-col gap-4">
        <Field label="Customer">
          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="e.g. Acme Pvt Ltd"
            className="h-10 w-full rounded-md border border-line bg-white px-3 text-[13px] focus:outline-none focus-visible:shadow-focus"
          />
        </Field>

        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-semibold text-ink-heading">Items</label>
          <div className="flex flex-col gap-2 rounded-md border border-line bg-surface-subtle p-3">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={it.description}
                  onChange={(e) => updateItem(it.id, "description", e.target.value)}
                  placeholder="Description"
                  className="h-9 flex-1 rounded-md border border-line bg-white px-2.5 text-[12px] focus:outline-none focus-visible:shadow-focus"
                />
                <input
                  type="number"
                  value={it.amount}
                  onChange={(e) => updateItem(it.id, "amount", e.target.value)}
                  placeholder="Amount"
                  className="h-9 w-[120px] rounded-md border border-line bg-white px-2 text-[12px] focus:outline-none focus-visible:shadow-focus"
                />
                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  aria-label="Remove item"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="inline-flex h-8 items-center gap-1.5 self-start rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
            >
              <Plus size={12} /> Add item
            </button>
          </div>
          <div className="flex items-center justify-between rounded-md border border-line bg-white px-3 py-2">
            <span className="text-[12px] font-medium text-ink-muted">Total</span>
            <span className="text-[14px] font-semibold text-ink-heading">{formatCurrency(total)}</span>
          </div>
        </div>

        <Field label="Due date">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="h-10 w-full rounded-md border border-line bg-white px-3 text-[13px] focus:outline-none focus-visible:shadow-focus"
          />
        </Field>

        <Field label="Notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment terms, late fees, etc."
            rows={3}
            className="w-full rounded-md border border-line bg-white p-3 text-[13px] focus:outline-none focus-visible:shadow-focus"
          />
        </Field>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[13px] font-semibold text-ink-body hover:bg-surface-subtle">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { alert('Invoice created (mock)'); onClose(); }}
            className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            Create invoice
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-ink-heading">{label}</label>
      {children}
    </div>
  );
}

function ModalShell({ onClose, title, subtitle, maxWidth = "max-w-[560px]", children }) {
  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-6" onClick={onClose}>
      <div
        className={["w-full overflow-hidden rounded-md bg-white shadow-modal", maxWidth].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] font-semibold text-ink-heading">{title}</h2>
            {subtitle && <p className="text-[13px] text-ink-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
          >
            <X size={16} />
          </button>
        </header>
        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
