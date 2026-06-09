import { useMemo } from "react";
import {
  ChevronLeft,
  Printer,
  RotateCcw,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  CheckCircle2,
  Truck,
  Home,
  Circle,
  ExternalLink,
} from "lucide-react";
import {
  ORDER_STATUS_PILLS,
  formatCurrency,
  formatDate,
} from "./data.js";

const MOCK_ITEMS = [
  { id: 1, title: "Cold Pressed Almond Oil 500ml", sku: "CP-ALM-500", qty: 1, price: 690 },
  { id: 2, title: "Organic Cotton Tee — Beige",    sku: "OC-TEE-BG",  qty: 2, price: 1290 },
  { id: 3, title: "Bamboo Toothbrush — 4pk",       sku: "BAM-TB-4",   qty: 1, price: 240 },
  { id: 4, title: "Soy Candle — Vetiver",          sku: "SC-VET-200", qty: 1, price: 850 },
  { id: 5, title: "Ceramic Mug — Olive",           sku: "CM-OLV-300", qty: 2, price: 450 },
];

function orderStatusToBadge(status) {
  if (status === "delivered" || status === "shipped" || status === "processing" || status === "new") {
    return ORDER_STATUS_PILLS.delivered.label === "Delivered" && status === "delivered"
      ? { ...ORDER_STATUS_PILLS.delivered, label: "Paid" }
      : ORDER_STATUS_PILLS[status];
  }
  if (status === "abandoned") return { ...ORDER_STATUS_PILLS.abandoned, label: "Pending" };
  if (status === "refunded")  return { ...ORDER_STATUS_PILLS.refunded,  label: "Refunded" };
  if (status === "cancelled") return { ...ORDER_STATUS_PILLS.cancelled, label: "Cancelled" };
  return ORDER_STATUS_PILLS.new;
}

export default function OrderDetailPage({ order, onBack }) {
  const items = MOCK_ITEMS;
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.qty * it.price, 0), [items]);
  const discount = Math.round(subtotal * 0.05);
  const tax      = Math.round((subtotal - discount) * 0.18);
  const shipping = 80;
  const total    = subtotal - discount + tax + shipping;

  const pill = orderStatusToBadge(order.status);

  const timeline = [
    { id: "placed",    icon: Package,      label: "Order placed",      when: formatDate(order.date) + " · 09:24 AM", done: true },
    { id: "confirmed", icon: CheckCircle2, label: "Confirmed",         when: formatDate(order.date) + " · 09:31 AM", done: true },
    { id: "shipped",   icon: Truck,        label: "Shipped",           when: formatDate(order.date) + " · 06:12 PM", done: order.status !== "new" && order.status !== "abandoned" && order.status !== "cancelled" },
    { id: "out",       icon: Truck,        label: "Out for delivery",  when: "—", done: order.status === "delivered" },
    { id: "delivered", icon: Home,         label: "Delivered",         when: order.status === "delivered" ? "—" : "—", done: order.status === "delivered" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-line bg-white text-ink-body hover:bg-surface-subtle"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-semibold text-ink-heading">Order {order.id}</h1>
              <span className={["inline-flex h-6 items-center gap-1.5 rounded-pill px-2.5 text-[11px] font-semibold", pill.bg, pill.text].join(" ")}>
                <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
                {pill.label}
              </span>
            </div>
            <p className="text-[13px] font-medium text-ink-muted">
              Placed on {formatDate(order.date)} · {order.channel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert("Print (mock)")}
            className="inline-flex h-10 items-center gap-2 rounded-button border border-line bg-white px-4 text-[13px] font-semibold text-ink-body hover:bg-surface-subtle"
          >
            <Printer size={14} />
            Print
          </button>
          <button
            type="button"
            onClick={() => alert("Refund issued (mock)")}
            className="inline-flex h-10 items-center gap-2 rounded-button border border-line bg-white px-4 text-[13px] font-semibold text-ink-body hover:bg-surface-subtle"
          >
            <RotateCcw size={14} />
            Refund
          </button>
          <button
            type="button"
            aria-label="More actions"
            className="inline-flex h-10 w-10 items-center justify-center rounded-button border border-line bg-white text-ink-body hover:bg-surface-subtle"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-5">
        {/* Left column */}
        <div className="col-span-2 flex flex-col gap-5">
          <Card title="Items" subtitle={`${items.length} products`}>
            <div className="overflow-hidden rounded-md border border-line bg-white">
              <table className="w-full text-[13px]">
                <thead className="bg-surface-subtle">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
                    <Th>Product</Th>
                    <Th align="right">Qty</Th>
                    <Th align="right">Unit price</Th>
                    <Th align="right">Line total</Th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-t border-line">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-50 text-[18px]">
                            📦
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-ink-heading">{it.title}</span>
                            <span className="font-mono text-[11px] text-ink-muted">{it.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-ink-body">{it.qty}</td>
                      <td className="px-4 py-3 text-right text-ink-body">{formatCurrency(it.price)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-ink-heading">
                        {formatCurrency(it.qty * it.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Totals">
            <div className="flex flex-col gap-2 rounded-md border border-line bg-white p-5 text-[13px]">
              <TotalRow label="Subtotal" value={formatCurrency(subtotal)} />
              <TotalRow label="Discount (5%)" value={`− ${formatCurrency(discount)}`} tone="muted" />
              <TotalRow label="Tax (18% GST)" value={formatCurrency(tax)} />
              <TotalRow label="Shipping" value={formatCurrency(shipping)} />
              <div className="my-1 border-t border-line" />
              <TotalRow label="Total" value={formatCurrency(total)} bold />
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <Card title="Customer">
            <div className="flex flex-col gap-3 rounded-md border border-line bg-white p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-[14px] font-semibold text-brand-700">
                  {order.customer.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[13px] font-semibold text-ink-heading">{order.customer}</span>
                  <span className="text-[11px] text-ink-muted">Returning customer · 4 orders</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-[12px] text-ink-body">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-ink-subtle" />
                  {order.customer.toLowerCase().replace(/\s+/g, ".")}@example.com
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-ink-subtle" />
                  +91 98 4421 0083
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert("View customer (mock)")}
                className="inline-flex items-center gap-1 self-start text-[12px] font-semibold text-brand-emerald hover:underline"
              >
                View customer
                <ExternalLink size={11} />
              </button>
            </div>
          </Card>

          <Card title="Shipping address">
            <div className="flex items-start gap-2 rounded-md border border-line bg-white p-4 text-[12px] text-ink-body">
              <MapPin size={14} className="mt-0.5 shrink-0 text-ink-subtle" />
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-ink-heading">{order.customer}</span>
                <span>402, Skyline Residency,</span>
                <span>Sector 21, Powai</span>
                <span>Mumbai, MH 400076, India</span>
              </div>
            </div>
          </Card>

          <Card title="Payment">
            <div className="flex items-center gap-3 rounded-md border border-line bg-white p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface-subtle">
                <CreditCard size={16} className="text-ink-body" />
              </span>
              <div className="flex flex-col gap-0.5 text-[12px]">
                <span className="font-semibold text-ink-heading">Razorpay · Card</span>
                <span className="text-ink-muted">Visa ending in 4421</span>
              </div>
            </div>
          </Card>

          <Card title="Timeline">
            <ol className="flex flex-col gap-1 rounded-md border border-line bg-white p-4">
              {timeline.map((evt, idx) => {
                const Icon = evt.done ? evt.icon : Circle;
                return (
                  <li key={evt.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={[
                          "flex h-7 w-7 items-center justify-center rounded-full border",
                          evt.done
                            ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                            : "border-line bg-surface-subtle text-ink-subtle",
                        ].join(" ")}
                      >
                        <Icon size={12} />
                      </span>
                      {idx < timeline.length - 1 && (
                        <span className={["h-6 w-px", evt.done ? "bg-brand-emerald/40" : "bg-line"].join(" ")} />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5 pb-3">
                      <span className={["text-[12px] font-semibold", evt.done ? "text-ink-heading" : "text-ink-muted"].join(" ")}>
                        {evt.label}
                      </span>
                      <span className="text-[11px] text-ink-muted">{evt.when}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-subtle">{title}</h2>
        {subtitle && <span className="text-[11px] font-medium text-ink-muted">{subtitle}</span>}
      </div>
      {children}
    </section>
  );
}

function TotalRow({ label, value, bold, tone }) {
  return (
    <div className="flex items-center justify-between">
      <span className={["text-[12px] font-medium", tone === "muted" ? "text-ink-muted" : "text-ink-body"].join(" ")}>
        {label}
      </span>
      <span className={[bold ? "text-[15px] font-semibold text-ink-heading" : "text-[13px] text-ink-heading"].join(" ")}>
        {value}
      </span>
    </div>
  );
}

function Th({ children, align }) {
  return (
    <th className={["px-4 py-3", align === "right" ? "text-right" : "text-left"].join(" ")}>
      {children}
    </th>
  );
}
