import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  AlertCircle,
  Receipt,
  CreditCard,
} from "lucide-react";
import {
  ORDERS,
  PAYMENTS,
  INVOICES,
  PRODUCTS,
  ORDER_STATUS_PILLS,
  formatCurrency,
  formatDate,
  abandonedSummary,
  billingMetrics,
} from "./data.js";

export default function OverviewPage({ onNavigate }) {
  const billing = useMemo(() => billingMetrics(PAYMENTS, INVOICES), []);
  const abandoned = useMemo(() => abandonedSummary(ORDERS), []);
  const recentOrders = ORDERS.slice(0, 5);
  const lowStock = PRODUCTS.filter((p) => p.stock <= 12).slice(0, 4);

  const newOrders = ORDERS.filter((o) => o.status === "new").length;
  const processing = ORDERS.filter((o) => o.status === "processing").length;
  const totalRevenue = PAYMENTS
    .filter((p) => p.status === "successful")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-ink-heading">Commerce</h1>
          <p className="text-[13px] font-medium text-ink-muted">
            Track orders, products, and revenue at a glance
          </p>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <MetricTile
          icon={ShoppingBag}
          label="New orders"
          value={newOrders}
          sub={`${processing} in processing`}
        />
        <MetricTile
          icon={CreditCard}
          label="Revenue this month"
          value={formatCurrency(billing.received)}
          delta={{ dir: "up", value: "+18%", period: "vs last month" }}
        />
        <MetricTile
          icon={AlertCircle}
          label="Abandoned carts"
          value={abandoned.count}
          sub={`${formatCurrency(abandoned.totalValue)} potential`}
          tone={abandoned.count > 0 ? "warn" : "default"}
          onClick={() => onNavigate?.("commerce-orders", { tab: "abandoned" })}
        />
        <MetricTile
          icon={Receipt}
          label="Overdue invoices"
          value={formatCurrency(billing.overdue)}
          tone={billing.overdue > 0 ? "danger" : "default"}
          onClick={() => onNavigate?.("commerce-billing", { tab: "invoices" })}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader
            title="Recent orders"
            action={{ label: "View all orders", onClick: () => onNavigate?.("commerce-orders") }}
          />
          <table className="w-full text-[13px]">
            <thead className="bg-surface-subtle">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th align="right">Total</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => {
                const pill = ORDER_STATUS_PILLS[o.status];
                return (
                  <tr key={o.id} className="border-t border-line">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-ink-heading">{o.id}</span>
                        <span className="text-[11px] text-ink-muted">{formatDate(o.date)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-body">{o.customer}</td>
                    <td className="px-4 py-3 text-right font-medium text-ink-heading">
                      {formatCurrency(o.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill pill={pill} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card>
          <CardHeader
            title="Top revenue"
            action={{ label: "Catalog", onClick: () => onNavigate?.("commerce-catalog") }}
          />
          <div className="px-5 py-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-semibold text-ink-heading">
                {formatCurrency(totalRevenue)}
              </span>
              <span className="text-[12px] font-medium text-success">+12%</span>
            </div>
            <p className="text-[12px] text-ink-muted">All-time successful payments</p>
          </div>
          <div className="border-t border-line px-5 py-4">
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-ink-subtle">
              Low stock
            </h3>
            <ul className="flex flex-col gap-2">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 text-[12px]">
                  <span className="truncate text-ink-body">{p.name}</span>
                  <span className={p.stock === 0 ? "font-semibold text-danger" : "font-semibold text-amber-600"}>
                    {p.stock === 0 ? "Out" : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricTile({ icon: Icon, label, value, sub, delta, tone = "default", onClick }) {
  const toneClass = {
    default: "border-line",
    warn:    "border-amber-200 bg-amber-50/40",
    danger:  "border-red-200 bg-red-50/40",
  }[tone];
  const Wrap = onClick ? "button" : "div";
  return (
    <Wrap
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={[
        "flex flex-col gap-1.5 rounded-md border bg-white p-5 text-left",
        toneClass,
        onClick ? "transition-colors hover:border-line-strong" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-xs bg-brand-50 text-brand-emerald">
          <Icon size={14} strokeWidth={1.75} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
          {label}
        </span>
      </div>
      <span className="text-[28px] font-semibold leading-none text-ink-heading">{value}</span>
      {delta && (
        <span className={["inline-flex items-center gap-1 text-[12px] font-medium", delta.dir === "up" ? "text-success" : "text-danger"].join(" ")}>
          {delta.dir === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta.value} {delta.period}
        </span>
      )}
      {sub && !delta && (
        <span className="text-[12px] font-medium text-ink-muted">{sub}</span>
      )}
    </Wrap>
  );
}

function Card({ children, className = "" }) {
  return (
    <section className={["overflow-hidden rounded-md border border-line bg-white", className].join(" ")}>
      {children}
    </section>
  );
}

function CardHeader({ title, action }) {
  return (
    <header className="flex items-center justify-between border-b border-line px-5 py-4">
      <h2 className="text-[14px] font-semibold text-ink-heading">{title}</h2>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="text-[12px] font-semibold text-brand-emerald hover:underline"
        >
          {action.label} →
        </button>
      )}
    </header>
  );
}

function Th({ children, align }) {
  return (
    <th className={["px-4 py-3", align === "right" ? "text-right" : "text-left"].join(" ")}>
      {children}
    </th>
  );
}

function StatusPill({ pill }) {
  return (
    <span className={["inline-flex h-6 items-center gap-1.5 rounded-pill px-2.5 text-[11px] font-semibold", pill.bg, pill.text].join(" ")}>
      <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
      {pill.label}
    </span>
  );
}
