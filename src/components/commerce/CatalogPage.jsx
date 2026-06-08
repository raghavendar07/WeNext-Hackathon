import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MoreHorizontal,
  ChevronDown,
  X,
  Star,
  RefreshCw,
  Activity,
  AlertTriangle,
  Settings as SettingsIcon,
  Plug,
  Plus,
  ArrowDown,
  ArrowUp,
  ArrowLeftRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PauseCircle,
  Wrench,
  ChevronLeft,
} from "lucide-react";
import {
  PRODUCTS,
  PLATFORMS,
  PLATFORM_CONNECTIONS,
  PLATFORM_PRODUCT_COUNTS,
  SYNC_EVENTS,
  formatCurrency,
} from "./data.js";
import { PLATFORM_META, PlatformLogo } from "./platformLogos.jsx";

const STATUS_FILTERS = [
  { id: "all",          label: "All" },
  { id: "active",       label: "Active" },
  { id: "draft",        label: "Draft" },
  { id: "out_of_stock", label: "Out of stock" },
];

const STATUS_PILLS = {
  active:       { bg: "bg-brand-50", text: "text-brand-700", dot: "bg-brand-500", label: "Active" },
  draft:        { bg: "bg-gray-100", text: "text-gray-600",  dot: "bg-gray-400",  label: "Draft" },
  out_of_stock: { bg: "bg-red-50",   text: "text-red-700",   dot: "bg-red-500",   label: "Out of stock" },
};

const PLATFORM_FILTERS = [
  { id: "all",         label: "All Platforms",  count: PLATFORM_PRODUCT_COUNTS.all },
  { id: "shopify",     label: "Shopify",        count: PLATFORM_PRODUCT_COUNTS.shopify },
  { id: "woocommerce", label: "WooCommerce",    count: PLATFORM_PRODUCT_COUNTS.woocommerce },
  { id: "petpooja",    label: "PetPooja",       count: PLATFORM_PRODUCT_COUNTS.petpooja },
  { id: "wenext",      label: "WeNext only",    count: PLATFORM_PRODUCT_COUNTS.wenext },
];

export default function CatalogPage() {
  const [status, setStatus] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("table");
  const [openProduct, setOpenProduct] = useState(null);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [showSyncPanel, setShowSyncPanel] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const anyConnected = Object.values(PLATFORM_CONNECTIONS).some((c) => c.status === "connected" || c.status === "warning");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (platform !== "all") {
        if (platform === "wenext") {
          const externals = ["shopify", "woocommerce", "petpooja"];
          const hasExternal = externals.some((id) => p.platforms?.[id]?.enabled);
          if (hasExternal) return false;
        } else if (!p.platforms?.[platform]?.enabled) {
          return false;
        }
      }
      if (query && !p.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
  }, [status, platform, query]);

  const subtitle = platform === "all"
    ? "Manage products, pricing, and stock"
    : platform === "wenext"
      ? `Showing ${filtered.length} product${filtered.length === 1 ? "" : "s"} created in WeNext`
      : `Showing ${filtered.length} product${filtered.length === 1 ? "" : "s"} from ${PLATFORM_META[platform].label}`;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-ink-heading">Catalog</h1>
          <p className="text-[13px] font-medium text-ink-muted">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {platform !== "all" && platform !== "wenext" && (
            <button
              type="button"
              onClick={() => alert(`Sync now — ${PLATFORM_META[platform]?.label} (mock)`)}
              className="inline-flex h-10 items-center gap-2 rounded-button border border-line bg-white px-4 text-[13px] font-semibold text-ink-body hover:bg-surface-subtle"
            >
              <RefreshCw size={14} />
              Sync now
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowSyncPanel(true)}
            aria-label="Sync activity"
            title="Sync activity"
            className="inline-flex h-10 w-10 items-center justify-center rounded-button border border-line bg-white text-ink-body hover:bg-surface-subtle"
          >
            <Activity size={16} />
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            <Plus size={14} />
            Add Product
          </button>
        </div>
      </header>

      {!anyConnected && (
        <NoIntegrationsBanner onConnect={() => setShowConnectionsModal(true)} />
      )}

      <ConnectionStatusBar onManage={() => setShowConnectionsModal(true)} />

      <PlatformFilterRow active={platform} onChange={setPlatform} />

      <div className="flex flex-wrap items-center gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search products…" />
        <div className="flex items-center gap-1.5">
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
        <button
          type="button"
          onClick={() => alert('Category filter — mock')}
          className="inline-flex h-9 items-center gap-2 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
        >
          All categories
          <ChevronDown size={12} className="text-ink-muted" />
        </button>
        <div className="ml-auto inline-flex h-9 rounded-md border border-line bg-white p-0.5">
          <ViewBtn active={view === "table"} onClick={() => setView("table")} label="Table view">Table</ViewBtn>
          <ViewBtn active={view === "grid"}  onClick={() => setView("grid")}  label="Grid view">Grid</ViewBtn>
        </div>
      </div>

      {filtered.length === 0 ? (
        <PlatformEmptyState platform={platform} onManage={() => setShowConnectionsModal(true)} />
      ) : view === "table" ? (
        <ProductTable products={filtered} onOpen={setOpenProduct} />
      ) : (
        <ProductGrid products={filtered} onOpen={setOpenProduct} />
      )}

      {openProduct && (
        <ProductDetailDrawer
          product={openProduct}
          onClose={() => setOpenProduct(null)}
        />
      )}
      {showConnectionsModal && (
        <ManageConnectionsModal onClose={() => setShowConnectionsModal(false)} />
      )}
      {showSyncPanel && (
        <SyncActivityPanel onClose={() => setShowSyncPanel(false)} />
      )}
      {showCreateModal && (
        <CreateProductModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

/* ───── Connection status bar ───── */

function ConnectionStatusBar({ onManage }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-line bg-white px-4 py-3">
      <span className="text-[12px] font-semibold uppercase tracking-wide text-ink-subtle">Connected</span>
      <div className="flex flex-wrap items-center gap-2">
        {Object.values(PLATFORM_CONNECTIONS).map((c) => (
          <ConnectionChip key={c.id} connection={c} />
        ))}
      </div>
      <button
        type="button"
        onClick={onManage}
        className="ml-auto text-[12px] font-semibold text-brand-emerald hover:underline"
      >
        Manage connections →
      </button>
    </div>
  );
}

function ConnectionChip({ connection }) {
  const dot = {
    connected:    "bg-success",
    warning:      "bg-warning",
    disconnected: "bg-danger",
    not_connected: "bg-gray-300",
  }[connection.status] ?? "bg-gray-300";
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-pill border border-line bg-surface-subtle px-2.5 text-[12px] font-medium text-ink-body">
      <PlatformLogo id={connection.id} size={14} />
      <span>{connection.label}</span>
      <span aria-hidden className={["h-1.5 w-1.5 rounded-full", dot].join(" ")} />
    </span>
  );
}

/* ───── Platform filter pill row ───── */

function PlatformFilterRow({ active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PLATFORM_FILTERS.map((f) => {
        const isActive = active === f.id;
        const meta = PLATFORM_META[f.id];
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={[
              "inline-flex h-9 items-center gap-2 rounded-pill border px-4 text-[12px] font-medium transition-colors",
              isActive
                ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                : "border-line bg-white text-ink-muted hover:bg-surface-subtle",
            ].join(" ")}
          >
            {meta && <PlatformLogo id={f.id} size={14} />}
            <span>{f.label}</span>
            <span
              className={[
                "inline-flex h-4 min-w-[20px] items-center justify-center rounded-pill px-1 text-[10px] font-semibold",
                isActive ? "bg-white text-brand-emerald" : "bg-surface-muted text-ink-muted",
              ].join(" ")}
            >
              {f.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ───── Product table ───── */

function ProductTable({ products, onOpen }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <table className="w-full text-[13px]">
        <thead className="bg-surface-subtle">
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
            <Th>Product</Th>
            <Th>SKU</Th>
            <Th>Category</Th>
            <Th>Platforms</Th>
            <Th align="right">Price</Th>
            <Th align="right">Stock</Th>
            <Th>Status</Th>
            <Th align="right" />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const pill = STATUS_PILLS[p.status];
            return (
              <tr
                key={p.id}
                onClick={() => onOpen(p)}
                className="cursor-pointer border-t border-line transition-colors hover:bg-surface-subtle"
              >
                <td className="px-4 py-3 font-semibold text-ink-heading">{p.name}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-ink-muted">{p.sku}</td>
                <td className="px-4 py-3 text-ink-body">{p.category}</td>
                <td className="px-4 py-3">
                  <PlatformBadges product={p} />
                </td>
                <td className="px-4 py-3 text-right font-medium text-ink-heading">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3 text-right font-medium text-ink-heading">
                  {p.stock === 0 ? <span className="text-danger">Out</span> : p.stock}
                </td>
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
    </div>
  );
}

/* ───── Product grid ───── */

function ProductGrid({ products, onOpen }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((p) => {
        const pill = STATUS_PILLS[p.status];
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onOpen(p)}
            className="flex flex-col gap-3 rounded-md border border-line bg-white p-4 text-left transition-colors hover:border-line-strong"
          >
            <div className="relative flex aspect-[4/3] w-full items-center justify-center rounded-md bg-brand-50 text-[36px]">
              📦
              <div className="absolute right-2 top-2">
                <PlatformBadges product={p} variant="grid" />
              </div>
            </div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[13px] font-semibold text-ink-heading">{p.name}</span>
                <span className="text-[11px] font-medium text-ink-muted">{p.sku}</span>
              </div>
              <span className={["inline-flex h-5 items-center gap-1 rounded-pill px-1.5 text-[10px] font-semibold", pill.bg, pill.text].join(" ")}>
                <span aria-hidden className={["h-1 w-1 rounded-full", pill.dot].join(" ")} />
                {pill.label}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-2 text-[12px]">
              <span className="text-ink-muted">{p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}</span>
              <span className="font-semibold text-ink-heading">{formatCurrency(p.price)}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ───── Platform badges ───── */

function PlatformBadges({ product, variant = "table" }) {
  const enabled = PLATFORMS.filter((id) => product.platforms?.[id]?.enabled);
  if (enabled.length === 0) return <span className="text-[12px] text-ink-subtle">—</span>;
  return (
    <div className="flex items-center gap-1.5">
      {enabled.map((id) => {
        const platform = product.platforms[id];
        const isPrimary = product.sourceOfTruth === id;
        return (
          <PlatformBadge
            key={id}
            id={id}
            syncStatus={platform.syncStatus}
            primary={isPrimary}
            variant={variant}
            tooltip={`Synced to ${PLATFORM_META[id].label} · Last sync: ${platform.lastSync}`}
          />
        );
      })}
    </div>
  );
}

function PlatformBadge({ id, syncStatus, primary, tooltip }) {
  return (
    <span
      title={tooltip}
      className="relative inline-flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white"
    >
      <PlatformLogo id={id} size={14} />
      {primary && (
        <span
          aria-hidden
          title="Source of truth"
          className="absolute -left-1 -top-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-brand-emerald text-white"
        >
          <Star size={8} fill="white" strokeWidth={0} />
        </span>
      )}
      <SyncStatusDot status={syncStatus} />
    </span>
  );
}

function SyncStatusDot({ status }) {
  const cls = {
    in_sync: "bg-success",
    syncing: "bg-warning animate-pulse",
    error:   "bg-danger",
    paused:  "bg-gray-300",
  }[status] ?? "bg-gray-300";
  return (
    <span
      aria-hidden
      className={["absolute -right-0.5 -top-0.5 inline-block h-2 w-2 rounded-full ring-2 ring-white", cls].join(" ")}
    />
  );
}

/* ───── Empty states ───── */

function NoIntegrationsBanner({ onConnect }) {
  return (
    <aside className="flex items-center justify-between gap-3 rounded-md border border-line bg-amber-50/40 p-4">
      <p className="text-[13px] text-ink-body">
        Connect Shopify, WooCommerce, or PetPooja to sync products automatically.
      </p>
      <button
        type="button"
        onClick={onConnect}
        className="inline-flex h-9 items-center rounded-button bg-cta-gradient px-4 text-[12px] font-semibold text-white hover:opacity-90"
      >
        Connect now
      </button>
    </aside>
  );
}

function PlatformEmptyState({ platform, onManage }) {
  if (platform === "all" || platform === "wenext") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-line bg-canvas px-6 py-12 text-center">
        <h3 className="text-[14px] font-semibold text-ink-heading">No products match</h3>
        <p className="text-[12px] text-ink-muted">Try adjusting your filters.</p>
      </div>
    );
  }
  const meta = PLATFORM_META[platform];
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-line bg-canvas px-6 py-12 text-center">
      <PlatformLogo id={platform} size={32} />
      <h3 className="text-[15px] font-semibold text-ink-heading">No products from {meta.label} yet</h3>
      <p className="max-w-[420px] text-[12px] text-ink-muted">
        Products synced from {meta.label} will appear here. Make sure your {meta.label} catalog has items configured.
      </p>
      <button
        type="button"
        onClick={onManage}
        className="text-[12px] font-semibold text-brand-emerald hover:underline"
      >
        Manage {meta.label} connection →
      </button>
    </div>
  );
}

/* ───── Manage connections modal ───── */

function ManageConnectionsModal({ onClose }) {
  return (
    <ModalShell onClose={onClose} title="Manage commerce integrations" subtitle="Sync products and orders with your e-commerce platforms" maxWidth="max-w-[640px]">
      <div className="flex flex-col gap-3">
        {Object.values(PLATFORM_CONNECTIONS).map((c) => (
          <ConnectionCard key={c.id} connection={c} />
        ))}
      </div>
    </ModalShell>
  );
}

function ConnectionCard({ connection }) {
  const isConnected = connection.status === "connected" || connection.status === "warning";
  const StatusIcon = connection.status === "connected" ? CheckCircle2 : connection.status === "warning" ? AlertCircle : XCircle;
  const statusColor = connection.status === "connected" ? "text-success" : connection.status === "warning" ? "text-warning" : "text-danger";
  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface-subtle">
          <PlatformLogo id={connection.id} size={22} />
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="text-[14px] font-semibold text-ink-heading">{connection.label}</h3>
          <p className="text-[12px] text-ink-muted">{connection.description}</p>
        </div>
      </div>

      {isConnected ? (
        <>
          <div className="flex flex-col gap-1 rounded-md bg-surface-subtle px-3 py-2">
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-ink-body">
              <StatusIcon size={12} className={statusColor} />
              Connected as {connection.accountName}
              {connection.statusReason && (
                <span className="ml-2 text-warning">· {connection.statusReason}</span>
              )}
            </div>
            <div className="text-[11px] text-ink-muted">
              Last sync: {connection.lastSync} · {connection.productCount} products · {connection.orderCount} orders
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => alert(`Sync Now — ${connection.label} (mock)`)} className="inline-flex h-9 items-center gap-1.5 rounded-button bg-cta-gradient px-4 text-[12px] font-semibold text-white hover:opacity-90">
              <RefreshCw size={12} />
              Sync Now
            </button>
            <button type="button" onClick={() => alert(`Settings — ${connection.label} (mock)`)} className="inline-flex h-9 items-center gap-1.5 rounded-button border border-line bg-white px-4 text-[12px] font-semibold text-ink-body hover:bg-surface-subtle">
              <SettingsIcon size={12} />
              Settings
            </button>
            <button type="button" onClick={() => alert(`Disconnect — ${connection.label} (mock)`)} className="inline-flex h-9 items-center rounded-button px-3 text-[12px] font-semibold text-danger hover:bg-red-50">
              Disconnect
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-muted">
            <XCircle size={12} />
            Not connected
          </span>
          <button type="button" onClick={() => alert(`Connect ${connection.label} (mock)`)} className="inline-flex h-9 items-center gap-1.5 rounded-button bg-cta-gradient px-4 text-[12px] font-semibold text-white hover:opacity-90">
            <Plug size={12} />
            Connect →
          </button>
        </div>
      )}
    </div>
  );
}

/* ───── Sync activity panel ───── */

function SyncActivityPanel({ onClose }) {
  return (
    <SlideOverShell onClose={onClose} title="Sync activity" subtitle="Recent sync events across platforms">
      <div className="flex flex-col">
        {SYNC_EVENTS.map((e) => (
          <SyncEventRow key={e.id} event={e} />
        ))}
      </div>
    </SlideOverShell>
  );
}

function SyncEventRow({ event }) {
  const DirIcon = event.direction === "in" ? ArrowDown : event.direction === "out" ? ArrowUp : ArrowLeftRight;
  const isError = event.summary.toLowerCase().includes("fail") || event.summary.toLowerCase().includes("error");
  return (
    <div className="flex gap-3 border-b border-line px-5 py-4">
      <span className={[
        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line",
        isError ? "bg-red-50 text-danger" : "bg-surface-subtle text-ink-body",
      ].join(" ")}>
        <DirIcon size={14} />
      </span>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <PlatformLogo id={event.platform} size={14} />
          <span className="text-[12px] font-semibold text-ink-heading">{PLATFORM_META[event.platform]?.label}</span>
          <span className="text-[11px] text-ink-muted">· {event.timestamp}</span>
        </div>
        <p className={["text-[13px]", isError ? "text-danger" : "text-ink-body"].join(" ")}>
          {event.summary}
        </p>
        {event.action && (
          <button
            type="button"
            onClick={() => alert(`${event.action.label} (mock)`)}
            className="self-start text-[12px] font-semibold text-brand-emerald hover:underline"
          >
            {event.action.label} →
          </button>
        )}
      </div>
    </div>
  );
}

/* ───── Product detail drawer ───── */

function ProductDetailDrawer({ product, onClose }) {
  const conflict = product.conflict;
  return (
    <SlideOverShell
      onClose={onClose}
      title={product.name}
      subtitle={`${product.sku} · ${product.category}`}
      width="max-w-[560px]"
      back
    >
      {conflict && <ConflictBanner product={product} conflict={conflict} />}

      <div className="flex flex-col gap-2 px-5 pb-3 pt-5">
        <div className="grid grid-cols-3 gap-3">
          <DetailTile label="Price" value={formatCurrency(product.price)} />
          <DetailTile label="Stock" value={product.stock === 0 ? "Out" : product.stock} />
          <DetailTile label="Status" value={STATUS_PILLS[product.status]?.label} />
        </div>
      </div>

      <section className="flex flex-col gap-2 border-t border-line px-5 py-4">
        <h3 className="text-[13px] font-semibold text-ink-heading">Sync to platforms</h3>
        <p className="text-[12px] text-ink-muted">Choose where this product is published</p>
      </section>

      <div className="flex flex-col">
        {PLATFORMS.filter((id) => id !== "wenext").map((id) => (
          <PlatformRow
            key={id}
            id={id}
            platform={product.platforms?.[id]}
            isPrimary={product.sourceOfTruth === id}
          />
        ))}
        <PlatformRow
          id="wenext"
          platform={product.platforms?.wenext ?? { enabled: true, lastSync: "—", syncStatus: "in_sync" }}
          isPrimary={product.sourceOfTruth === "wenext"}
          nativeOnly
        />
      </div>
    </SlideOverShell>
  );
}

function ConflictBanner({ product, conflict }) {
  return (
    <aside className="m-5 flex items-start gap-3 rounded-md border border-warning/40 bg-amber-50/60 p-4">
      <AlertTriangle size={18} className="mt-0.5 text-warning" />
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-semibold text-ink-heading">
            This product has different data across platforms.
          </p>
          <ul className="flex flex-col gap-0.5 text-[12px] text-ink-body">
            {Object.entries(conflict.values).map(([platformId, value]) => (
              <li key={platformId}>
                {PLATFORM_META[platformId]?.label} {conflict.field}: <strong>{conflict.field === "price" ? formatCurrency(value) : value}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Object.keys(conflict.values).map((platformId) => (
            <button
              key={platformId}
              type="button"
              onClick={() => alert(`Use ${PLATFORM_META[platformId]?.label} version everywhere (mock)`)}
              className="inline-flex h-8 items-center rounded-button border border-line bg-white px-3 text-[11px] font-semibold text-ink-body hover:bg-surface-subtle"
            >
              Use {PLATFORM_META[platformId]?.label} version everywhere
            </button>
          ))}
          <button type="button" onClick={() => alert('Resolve manually (mock)')} className="inline-flex h-8 items-center rounded-button border border-line bg-white px-3 text-[11px] font-semibold text-ink-body hover:bg-surface-subtle">
            Resolve manually
          </button>
        </div>
      </div>
    </aside>
  );
}

function PlatformRow({ id, platform, isPrimary, nativeOnly }) {
  const meta = PLATFORM_META[id];
  const enabled = platform?.enabled ?? false;
  const hasError = platform?.syncStatus === "error";
  return (
    <div className="flex items-center gap-3 border-t border-line px-5 py-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-surface-subtle">
        <PlatformLogo id={id} size={20} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-ink-heading">{meta?.label}</span>
          {isPrimary && (
            <span className="inline-flex h-5 items-center gap-1 rounded-pill bg-brand-50 px-2 text-[10px] font-semibold text-brand-700">
              <Star size={10} fill="currentColor" strokeWidth={0} />
              Primary
            </span>
          )}
          {!isPrimary && enabled && !nativeOnly && (
            <button type="button" onClick={() => alert(`Set ${meta?.label} as primary (mock)`)} className="text-[11px] font-semibold text-brand-emerald hover:underline">
              Set as primary
            </button>
          )}
        </div>
        <PlatformRowStatus platform={platform} enabled={enabled} nativeOnly={nativeOnly} />
      </div>
      {hasError && (
        <button type="button" onClick={() => alert(`Fix sync error — ${meta?.label} (mock)`)} className="inline-flex h-8 items-center gap-1 rounded-button border border-warning/50 bg-amber-50 px-3 text-[11px] font-semibold text-warning hover:bg-amber-100">
          <Wrench size={12} />
          Fix
        </button>
      )}
      <Toggle on={enabled} disabled={nativeOnly} platformLabel={meta?.label} />
    </div>
  );
}

function PlatformRowStatus({ platform, enabled, nativeOnly }) {
  if (nativeOnly) return <span className="text-[11px] text-ink-muted">Always — internal catalog</span>;
  if (!enabled) return <span className="text-[11px] text-ink-muted">Not published</span>;
  if (platform.syncStatus === "error") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-danger">
        <AlertCircle size={11} />
        Sync error{platform.errorReason ? `: ${platform.errorReason}` : ""}
      </span>
    );
  }
  if (platform.syncStatus === "syncing") {
    return <span className="text-[11px] text-warning">Syncing now…</span>;
  }
  if (platform.syncStatus === "paused") {
    return <span className="text-[11px] text-ink-muted">Sync paused</span>;
  }
  return (
    <span className="text-[11px] text-ink-muted">
      Last synced: {platform.lastSync}
      {platform.externalId && platform.externalId !== "—" && ` · ID: ${platform.externalId}`}
    </span>
  );
}

function Toggle({ on, disabled, platformLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => alert(`${on ? "Disable" : "Enable"} sync${platformLabel ? ` — ${platformLabel}` : ""} (mock)`)}
      className={[
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors",
        on ? "bg-brand-emerald" : "bg-gray-200",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "absolute inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-[18px]" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}

/* ───── Create product modal ───── */

function CreateProductModal({ onClose }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [publishTo, setPublishTo] = useState({ shopify: false, woocommerce: false, petpooja: false });
  const [sourceOfTruth, setSourceOfTruth] = useState("wenext");

  const togglePublish = (id) => setPublishTo((p) => ({ ...p, [id]: !p[id] }));

  const sourceOptions = ["wenext", ...Object.keys(publishTo).filter((id) => publishTo[id])];

  return (
    <ModalShell onClose={onClose} title="Add product" subtitle="Create a new product in your catalog" maxWidth="max-w-[560px]">
      <div className="flex flex-col gap-4">
        <Field label="Product name">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cold Pressed Almond Oil 500ml"
            className="h-10 w-full rounded-md border border-line bg-white px-3 text-[13px] focus:outline-none focus-visible:shadow-focus"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="SKU">
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="CP-ALM-500"
              className="h-10 w-full rounded-md border border-line bg-white px-3 text-[13px] focus:outline-none focus-visible:shadow-focus"
            />
          </Field>
          <Field label="Price (₹)">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="690"
              className="h-10 w-full rounded-md border border-line bg-white px-3 text-[13px] focus:outline-none focus-visible:shadow-focus"
            />
          </Field>
        </div>

        <div className="flex flex-col gap-2 rounded-md border border-line bg-surface-subtle p-4">
          <h4 className="text-[13px] font-semibold text-ink-heading">Where to publish this product?</h4>
          <CheckRow
            label="WeNext (always — internal catalog)"
            checked
            disabled
            logo={<PlatformLogo id="wenext" size={16} />}
          />
          <CheckRow
            label="Shopify"
            checked={publishTo.shopify}
            onChange={() => togglePublish("shopify")}
            logo={<PlatformLogo id="shopify" size={16} />}
          />
          <CheckRow
            label="WooCommerce"
            checked={publishTo.woocommerce}
            onChange={() => togglePublish("woocommerce")}
            logo={<PlatformLogo id="woocommerce" size={16} />}
          />
          <CheckRow
            label="PetPooja"
            checked={publishTo.petpooja}
            onChange={() => togglePublish("petpooja")}
            logo={<PlatformLogo id="petpooja" size={16} />}
          />
          <div className="mt-1 flex items-center gap-2">
            <label className="text-[12px] font-medium text-ink-body">Source of truth:</label>
            <div className="relative inline-flex h-9 items-center">
              <select
                value={sourceOfTruth}
                onChange={(e) => setSourceOfTruth(e.target.value)}
                className="h-9 appearance-none rounded-button border border-line bg-white pl-3 pr-8 text-[12px] font-medium text-ink-body focus:outline-none focus-visible:shadow-focus"
              >
                {sourceOptions.map((id) => (
                  <option key={id} value={id}>{PLATFORM_META[id]?.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2 text-ink-muted" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[13px] font-semibold text-ink-body hover:bg-surface-subtle">
            Cancel
          </button>
          <button type="button" onClick={(e) => { e.preventDefault(); alert('Product created (mock)'); onClose(); }} className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90">
            Create product
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function CheckRow({ label, checked, disabled, onChange, logo }) {
  return (
    <label className={[
      "flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-[12px]",
      disabled ? "opacity-70" : "cursor-pointer hover:bg-surface-subtle",
    ].join(" ")}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="h-4 w-4 accent-brand-emerald"
      />
      {logo}
      <span className="font-medium text-ink-body">{label}</span>
    </label>
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

/* ───── Generic shells ───── */

function ModalShell({ onClose, title, subtitle, maxWidth = "max-w-[640px]", children }) {
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

function SlideOverShell({ onClose, title, subtitle, width = "max-w-[480px]", back, children }) {
  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className={["flex h-full w-full flex-col overflow-hidden bg-white shadow-modal", width].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="flex min-w-0 items-start gap-2">
            {back && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Back"
                className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <div className="flex min-w-0 flex-col gap-0.5">
              <h2 className="truncate text-[16px] font-semibold text-ink-heading">{title}</h2>
              {subtitle && <p className="truncate text-[12px] text-ink-muted">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
          >
            <X size={14} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ───── Misc ───── */

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

function ViewBtn({ active, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        "inline-flex h-8 items-center px-3 text-[12px] font-medium rounded-sm",
        active ? "bg-brand-50 text-brand-emerald" : "text-ink-muted hover:bg-surface-subtle",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function DetailTile({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-line bg-white p-3">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</span>
      <span className="text-[14px] font-semibold text-ink-heading">{value}</span>
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
