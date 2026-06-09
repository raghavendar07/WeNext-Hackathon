import { useMemo, useState } from "react";
import {
  ChevronLeft,
  Pencil,
  MoreHorizontal,
  AlertTriangle,
  Star,
  Eye,
  ShoppingCart,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import {
  PLATFORMS,
  formatCurrency,
} from "./data.js";
import { PLATFORM_META, PlatformLogo } from "./platformLogos.jsx";

const STATUS_PILLS = {
  active:       { bg: "bg-brand-50", text: "text-brand-700", dot: "bg-brand-500", label: "Active" },
  draft:        { bg: "bg-gray-100", text: "text-gray-600",  dot: "bg-gray-400",  label: "Draft" },
  out_of_stock: { bg: "bg-red-50",   text: "text-red-700",   dot: "bg-red-500",   label: "Out of stock" },
};

const MOCK_VARIANTS = [
  { id: "v1", color: "Beige",       size: "M", sku: "OC-TEE-BG-M",  price: 1290, stock: 22 },
  { id: "v2", color: "Beige",       size: "L", sku: "OC-TEE-BG-L",  price: 1290, stock: 18 },
  { id: "v3", color: "Forest Green", size: "M", sku: "OC-TEE-FG-M", price: 1390, stock: 6 },
];

const MOCK_WAREHOUSES = [
  { id: "w1", name: "Mumbai DC",     code: "BOM-01", stock: 64, lastUpdate: "2 hours ago" },
  { id: "w2", name: "Bengaluru DC",  code: "BLR-02", stock: 28, lastUpdate: "yesterday" },
  { id: "w3", name: "Delhi NCR Hub", code: "DEL-03", stock: 8,  lastUpdate: "3 days ago" },
];

const MOCK_REVIEWS = [
  { id: "r1", author: "Priya M.",   rating: 5, date: "2026-05-02", body: "Lovely fabric and the colour is exactly as shown. Will buy again." },
  { id: "r2", author: "Karan S.",   rating: 4, date: "2026-04-28", body: "Good quality but runs slightly small — order one size up." },
  { id: "r3", author: "Nisha T.",   rating: 5, date: "2026-04-21", body: "Super soft, washed twice and held up great." },
  { id: "r4", author: "Arjun K.",   rating: 3, date: "2026-04-14", body: "Decent for the price, packaging could be better." },
];

const TABS = [
  { id: "overview",  label: "Overview" },
  { id: "variants",  label: "Variants" },
  { id: "inventory", label: "Inventory" },
  { id: "analytics", label: "Analytics" },
  { id: "reviews",   label: "Reviews" },
];

export default function ProductDetailPage({ product, onBack }) {
  const [tab, setTab] = useState("overview");
  const pill = STATUS_PILLS[product.status] ?? STATUS_PILLS.active;
  const lowStock = (product.stock ?? 0) < 10;
  const channels = useMemo(
    () => PLATFORMS.filter((id) => product.platforms?.[id]?.enabled),
    [product]
  );

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
              <h1 className="text-[22px] font-semibold text-ink-heading">{product.name}</h1>
              <span className={["inline-flex h-6 items-center gap-1.5 rounded-pill px-2.5 text-[11px] font-semibold", pill.bg, pill.text].join(" ")}>
                <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
                {pill.label}
              </span>
            </div>
            <p className="text-[13px] font-medium text-ink-muted">
              <span className="font-mono">{product.sku}</span> · {product.category}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert("Edit product (mock)")}
            className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            <Pencil size={14} />
            Edit
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
        {/* Left: gallery + description */}
        <div className="col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={[
                  "flex aspect-square items-center justify-center rounded-md border border-line text-[40px]",
                  i === 0 ? "col-span-3 aspect-[2/1] bg-brand-50" : "bg-surface-subtle",
                ].join(" ")}
              >
                📦
              </div>
            ))}
          </div>
          <Card title="Description">
            <div className="rounded-md border border-line bg-white p-5 text-[13px] leading-relaxed text-ink-body">
              <p>
                {product.name} is a hand-picked staple in our {product.category.toLowerCase()} collection.
                Crafted to last, designed for everyday use, and quality-checked at every step.
                Pairs well with the rest of the line and ships flat-packed in fully recyclable materials.
              </p>
            </div>
          </Card>
        </div>

        {/* Right: specs */}
        <div className="flex flex-col gap-5">
          <Card title="Details">
            <div className="flex flex-col gap-2 rounded-md border border-line bg-white p-4 text-[12px]">
              <InfoRow label="SKU" value={<span className="font-mono">{product.sku}</span>} />
              <InfoRow label="Price" value={formatCurrency(product.price)} bold />
              <InfoRow
                label="Stock"
                value={
                  <span className={["inline-flex items-center gap-1", lowStock ? "text-warning" : "text-ink-heading"].join(" ")}>
                    {product.stock}
                    {lowStock && <AlertTriangle size={11} />}
                  </span>
                }
              />
              {lowStock && (
                <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-amber-50/60 p-2.5 text-[11px] text-warning">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                  Stock running low — consider restocking soon.
                </div>
              )}
              <InfoRow label="Category" value={product.category} />
              <InfoRow label="Tags" value="organic · bestseller · new arrival" />
            </div>
          </Card>

          <Card title="Channels">
            <div className="flex flex-col gap-2 rounded-md border border-line bg-white p-4">
              {channels.length === 0 ? (
                <span className="text-[12px] text-ink-muted">Not listed on any channel.</span>
              ) : (
                channels.map((id) => {
                  const meta = PLATFORM_META[id];
                  const ch = product.platforms[id];
                  const primary = product.sourceOfTruth === id;
                  return (
                    <div key={id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PlatformLogo id={id} size={16} />
                        <span className="text-[12px] font-medium text-ink-body">{meta?.label}</span>
                        {primary && (
                          <span className="inline-flex h-5 items-center gap-1 rounded-pill bg-brand-50 px-2 text-[10px] font-semibold text-brand-700">
                            <Star size={9} fill="currentColor" strokeWidth={0} />
                            Primary
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-ink-muted">{ch?.lastSync ?? "—"}</span>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-4 border-t border-line pt-5">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={[
                  "inline-flex h-9 items-center rounded-pill border px-4 text-[12px] font-medium transition-colors",
                  active
                    ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                    : "border-line bg-white text-ink-muted hover:bg-surface-subtle",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "overview"  && <OverviewTab product={product} />}
        {tab === "variants"  && <VariantsTab />}
        {tab === "inventory" && <InventoryTab />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "reviews"   && <ReviewsTab />}
      </div>
    </div>
  );
}

function OverviewTab({ product }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-2 rounded-md border border-line bg-white p-5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">Pricing</span>
        <span className="text-[20px] font-semibold text-ink-heading">{formatCurrency(product.price)}</span>
        <span className="text-[12px] text-ink-muted">Same price across all enabled channels.</span>
      </div>
      <div className="flex flex-col gap-2 rounded-md border border-line bg-white p-5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">Lifetime sales</span>
        <span className="text-[20px] font-semibold text-ink-heading">312 units</span>
        <span className="text-[12px] text-ink-muted">{formatCurrency(312 * product.price)} gross revenue</span>
      </div>
    </div>
  );
}

function VariantsTab() {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <table className="w-full text-[13px]">
        <thead className="bg-surface-subtle">
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
            <Th>Color</Th>
            <Th>Size</Th>
            <Th>SKU</Th>
            <Th align="right">Price</Th>
            <Th align="right">Stock</Th>
          </tr>
        </thead>
        <tbody>
          {MOCK_VARIANTS.map((v) => (
            <tr key={v.id} className="border-t border-line">
              <td className="px-4 py-3 text-ink-body">{v.color}</td>
              <td className="px-4 py-3 text-ink-body">{v.size}</td>
              <td className="px-4 py-3 font-mono text-[12px] text-ink-muted">{v.sku}</td>
              <td className="px-4 py-3 text-right font-medium text-ink-heading">{formatCurrency(v.price)}</td>
              <td className={["px-4 py-3 text-right font-medium", v.stock < 10 ? "text-warning" : "text-ink-heading"].join(" ")}>
                {v.stock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InventoryTab() {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <table className="w-full text-[13px]">
        <thead className="bg-surface-subtle">
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
            <Th>Warehouse</Th>
            <Th>Code</Th>
            <Th align="right">Stock</Th>
            <Th>Last updated</Th>
          </tr>
        </thead>
        <tbody>
          {MOCK_WAREHOUSES.map((w) => (
            <tr key={w.id} className="border-t border-line">
              <td className="px-4 py-3 font-semibold text-ink-heading">{w.name}</td>
              <td className="px-4 py-3 font-mono text-[12px] text-ink-muted">{w.code}</td>
              <td className={["px-4 py-3 text-right font-medium", w.stock < 10 ? "text-warning" : "text-ink-heading"].join(" ")}>
                {w.stock}
              </td>
              <td className="px-4 py-3 text-ink-muted">{w.lastUpdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AnalyticsTab() {
  const kpis = [
    { id: "views",    label: "Views",        value: "12,480", icon: Eye,           delta: "+8%" },
    { id: "cart",     label: "Add to cart",  value: "1,920",  icon: ShoppingCart,  delta: "+12%" },
    { id: "purch",    label: "Purchases",    value: "312",    icon: CreditCard,    delta: "+5%" },
    { id: "conv",     label: "Conversion",   value: "2.5%",   icon: TrendingUp,    delta: "+0.3pp" },
  ];
  // simple sparkline path
  const points = [10, 14, 12, 18, 22, 19, 24, 28, 26, 32, 30, 36];
  const max = Math.max(...points);
  const w = 600, h = 120, pad = 8;
  const stepX = (w - pad * 2) / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${pad + i * stepX} ${h - pad - (p / max) * (h - pad * 2)}`)
    .join(" ");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.id} className="flex flex-col gap-1.5 rounded-md border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{k.label}</span>
                <Icon size={14} className="text-ink-subtle" />
              </div>
              <span className="text-[22px] font-semibold leading-none text-ink-heading">{k.value}</span>
              <span className="text-[11px] font-medium text-success">{k.delta} vs last 30d</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 rounded-md border border-line bg-white p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-[13px] font-semibold text-ink-heading">Views — last 12 weeks</h3>
          <span className="text-[11px] text-ink-muted">Updated 5 min ago</span>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="h-32 w-full" aria-hidden>
          <defs>
            <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(16,185,129)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${path} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`} fill="url(#spark-fill)" />
          <path d={path} fill="none" stroke="rgb(16,185,129)" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

function ReviewsTab() {
  return (
    <div className="flex flex-col gap-3">
      {MOCK_REVIEWS.map((r) => (
        <div key={r.id} className="flex flex-col gap-2 rounded-md border border-line bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-[12px] font-semibold text-brand-700">
                {r.author.split(" ").map((s) => s[0]).slice(0, 2).join("")}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-ink-heading">{r.author}</span>
                <span className="text-[11px] text-ink-muted">{r.date}</span>
              </div>
            </div>
            <Stars count={r.rating} />
          </div>
          <p className="text-[13px] text-ink-body">{r.body}</p>
        </div>
      ))}
    </div>
  );
}

function Stars({ count }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < count ? "text-amber-500" : "text-gray-300"}
          fill={i < count ? "currentColor" : "none"}
          strokeWidth={i < count ? 0 : 1.5}
        />
      ))}
    </span>
  );
}

function Card({ title, children }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-subtle">{title}</h2>
      {children}
    </section>
  );
}

function InfoRow({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className={bold ? "font-semibold text-ink-heading" : "text-ink-body"}>{value}</span>
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
