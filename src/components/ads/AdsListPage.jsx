import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Copy,
  Filter,
  Globe,
  LayoutGrid,
  Lightbulb,
  MoreHorizontal,
  Pause,
  Pencil,
  Search,
  ShoppingBag,
  Sparkles,
  Table as TableIcon,
  Trash2,
  TrendingDown,
  TrendingUp,
  UserPlus,
  X,
} from "lucide-react";
import {
  ADS,
  CHANNELS,
  STATUS_PILLS,
  aggregateActiveChannels,
  findChannel,
  findGoal,
  formatCount,
  formatCurrency,
} from "./data.js";
import { ChannelLogo, ChannelStack } from "./AdLogos.jsx";

const STATUS_FILTERS = [
  { id: "all",     label: "All" },
  { id: "active",  label: "Active" },
  { id: "paused",  label: "Paused" },
  { id: "review",  label: "In review" },
  { id: "ended",   label: "Ended" },
];

const QUICK_GOAL_TILES = [
  { id: "traffic",  label: "Get more website visitors", Icon: Globe },
  { id: "leads",    label: "Get more leads",            Icon: UserPlus },
  { id: "product",  label: "Promote a product",         Icon: ShoppingBag },
];

export default function AdsListPage({ ads = ADS, channel, onChannelChange, onCreate, onOpenAd }) {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("table");
  const [insightDismissed, setInsightDismissed] = useState(false);
  const [toast, setToast] = useState(null);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2000); return () => clearTimeout(t); } }, [toast]);

  const totalAccountAds = ads.length;

  // Apply channel scope first.
  const scopedAds = useMemo(() => {
    if (!channel) return ads;
    return ads.filter((a) => a.channels.includes(channel));
  }, [ads, channel]);

  const channelLabel = channel ? findChannel(channel)?.label : null;

  const isAccountEmpty = totalAccountAds === 0;
  const isChannelEmpty = !!channel && scopedAds.length === 0;

  if (isAccountEmpty) {
    return <AccountEmptyState onCreate={onCreate} />;
  }

  const metrics = useMemo(() => buildMetrics(scopedAds, channel), [scopedAds, channel]);
  const filtered = useMemo(() => {
    return scopedAds.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (query && !a.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
  }, [scopedAds, status, query]);

  const tabCounts = useMemo(() => buildTabCounts(ads), [ads]);

  return (
    <div className="flex flex-col gap-6">
      <Header
        channel={channel}
        channelLabel={channelLabel}
        onCreate={onCreate}
      />

      <ChannelTabStrip
        active={channel}
        counts={tabCounts}
        onChange={onChannelChange}
      />

      {isChannelEmpty ? (
        <ChannelEmptyState
          channelId={channel}
          onCreate={onCreate}
          onClear={() => onChannelChange?.(null)}
        />
      ) : (
        <>
          {channel && !insightDismissed && (
            <ChannelInsightBanner
              channelId={channel}
              ads={ads}
              onDismiss={() => setInsightDismissed(true)}
            />
          )}

          <MetricsRow metrics={metrics} channel={channel} />

          <Toolbar
            channel={channel}
            status={status}
            onStatusChange={setStatus}
            query={query}
            onQueryChange={setQuery}
            view={view}
            onViewChange={setView}
            onChannelChange={onChannelChange}
            onDateChange={(v) => alert(`Date range: ${v} (mock)`)}
          />

          {filtered.length === 0 ? (
            <NoMatchState onReset={() => { setStatus("all"); setQuery(""); }} />
          ) : view === "table" ? (
            <AdsTable ads={filtered} channel={channel} onOpen={onOpenAd} onToast={setToast} />
          ) : (
            <AdsCardGrid ads={filtered} channel={channel} onOpen={onOpenAd} />
          )}
        </>
      )}

      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-[8px] bg-[#111827] px-3 py-2 text-[12px] font-semibold text-white shadow-lg">{toast}</div>
      )}
    </div>
  );
}

function DropdownMenu({ open, onClose, anchor = "right", items }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className={`absolute ${anchor === "right" ? "right-0" : "left-0"} top-full mt-1 z-20 w-44 rounded-[8px] border border-[#E5E7EB] bg-white p-1 shadow-lg`}>
        {items.map((it, i) => it === "divider" ? (
          <div key={i} className="my-1 h-px bg-[#F3F4F6]" />
        ) : (
          <button key={i} onClick={(e) => { e.stopPropagation(); it.onClick?.(); onClose(); }} className={`flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-[12px] font-medium ${it.danger ? "text-red-600 hover:bg-red-50" : "text-[#374151] hover:bg-[#F3F4F6]"}`}>
            {it.icon}{it.label}
          </button>
        ))}
      </div>
    </>
  );
}

/* ──────────── Header ──────────── */

function Header({ channel, channelLabel, onCreate }) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-semibold text-ink-heading">Ads</h1>
        <p className="text-[13px] font-medium text-ink-muted">
          Create and manage ads across Meta, LinkedIn, and TikTok
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90"
      >
        + Create {channel ? `${channelLabel} ` : ""}Ad
      </button>
    </header>
  );
}

/* ──────────── Channel tab strip ──────────── */

function ChannelTabStrip({ active, counts, onChange }) {
  const tabs = [
    { id: null,        label: "All Ads",  count: counts.all },
    { id: "meta",      label: "Meta",     count: counts.meta },
    { id: "linkedin",  label: "LinkedIn", count: counts.linkedin },
    { id: "tiktok",    label: "TikTok",   count: counts.tiktok },
  ];
  return (
    <div className="relative -mt-2 border-b border-line">
      <div className="flex items-end gap-1 overflow-x-auto pb-px [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => {
          const isActive = (active ?? null) === (t.id ?? null);
          return (
            <button
              key={t.id ?? "all"}
              type="button"
              onClick={() => onChange?.(t.id)}
              className={[
                "-mb-px inline-flex shrink-0 items-end gap-2 border-b-2 px-4 pb-3 pt-2 text-[13px] font-medium transition-colors",
                isActive
                  ? "border-brand-emerald text-ink-heading"
                  : "border-transparent text-ink-muted hover:text-ink-heading",
              ].join(" ")}
            >
              {t.id && <ChannelLogo id={t.id} size={14} />}
              <span>{t.label}</span>
              <span
                className={[
                  "inline-flex h-5 min-w-[22px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                  isActive ? "bg-brand-50 text-brand-emerald" : "bg-surface-muted text-ink-muted",
                ].join(" ")}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>
      <span aria-hidden className="pointer-events-none absolute right-0 top-0 hidden h-full w-12 bg-gradient-to-l from-canvas to-transparent md:hidden" />
    </div>
  );
}

/* ──────────── Channel insight banner ──────────── */

function ChannelInsightBanner({ channelId, ads, onDismiss }) {
  const insight = useMemo(() => buildChannelInsight(channelId, ads), [channelId, ads]);
  if (!insight) return null;
  return (
    <aside className="flex items-start gap-3 rounded-xl border-l-4 border-brand-emerald bg-brand-50/40 p-3">
      <Lightbulb size={16} className="mt-0.5 text-brand-emerald" />
      <p className="flex-1 text-[12px] leading-relaxed text-ink-body">{insight.body}</p>
      <button
        type="button"
        onClick={() => alert("Suggestion details (mock)")}
        className="text-[12px] font-semibold text-brand-emerald hover:underline"
      >
        View suggestion
      </button>
      <button
        type="button"
        aria-label="Dismiss insight"
        onClick={onDismiss}
        className="inline-flex h-6 w-6 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
      >
        <X size={14} />
      </button>
    </aside>
  );
}

/* ──────────── Metrics row ──────────── */

function MetricsRow({ metrics, channel }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricTile
        label="Active ads"
        value={metrics.activeCount}
        sub={channel ? `on ${findChannel(channel)?.label}` : `across ${metrics.channelCount} channel${metrics.channelCount === 1 ? "" : "s"}`}
      />
      <MetricTile
        label="Spent this month"
        value={formatCurrency(metrics.spentMonth)}
        delta={metrics.spendDelta}
      />
      <MetricTile
        label="People reached"
        value={formatCount(metrics.reach)}
        sub="last 30 days"
      />
      <MetricTile
        label="Total results"
        value={metrics.totalResults}
        sub={channel ? `from ${findChannel(channel)?.label}` : "leads, sales, signups"}
      />
    </div>
  );
}

function MetricTile({ label, value, sub, delta }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-white p-5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</span>
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
    </div>
  );
}

/* ──────────── Toolbar ──────────── */

function Toolbar({ channel, status, onStatusChange, query, onQueryChange, view, onViewChange, onChannelChange, onDateChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-10 w-[260px] items-center gap-2 rounded-lg border border-line bg-white px-3">
          <Search size={14} className="text-ink-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search ads…"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
        </label>
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map((f) => {
            const isActive = status === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onStatusChange(f.id)}
                className={[
                  "inline-flex h-9 items-center rounded-full border px-4 text-[12px] font-medium transition-colors",
                  isActive
                    ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                    : "border-line bg-white text-ink-muted hover:bg-surface-subtle",
                ].join(" ")}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        {!channel && <ChannelDropdown onChange={onChannelChange} />}
        <DateRangeDropdown onChange={onDateChange} />
      </div>
      <ViewToggle view={view} onChange={onViewChange} />
    </div>
  );
}

function ChannelDropdown({ count = 0, onChange }) {
  return (
    <button
      type="button"
      onClick={() => {
        const v = prompt("Filter by channel (meta / linkedin / tiktok, blank for all):");
        if (v === null) return;
        const next = v.trim() === "" ? null : v.trim().toLowerCase();
        onChange?.(next);
      }}
      className="inline-flex h-9 items-center gap-2 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
    >
      <Filter size={12} className="text-ink-muted" />
      {count > 0 ? `${count} channel${count === 1 ? "" : "s"}` : "All channels"}
      <ChevronDown size={12} className="text-ink-muted" />
    </button>
  );
}

function DateRangeDropdown({ onChange }) {
  return (
    <button
      type="button"
      onClick={() => {
        const v = prompt("Date range (7d / 30d / 90d):", "30d");
        if (v) onChange?.(v);
      }}
      className="inline-flex h-9 items-center gap-2 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
    >
      Last 30 days
      <ChevronDown size={12} className="text-ink-muted" />
    </button>
  );
}

function ViewToggle({ view, onChange }) {
  return (
    <div className="inline-flex h-9 rounded-md border border-line bg-white p-0.5">
      <ToggleBtn active={view === "card"} onClick={() => onChange("card")} ariaLabel="Card view">
        <LayoutGrid size={14} />
      </ToggleBtn>
      <ToggleBtn active={view === "table"} onClick={() => onChange("table")} ariaLabel="Table view">
        <TableIcon size={14} />
      </ToggleBtn>
    </div>
  );
}

function ToggleBtn({ active, onClick, ariaLabel, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        "inline-flex h-8 w-9 items-center justify-center rounded-sm",
        active ? "bg-brand-50 text-brand-emerald" : "text-ink-muted hover:bg-surface-subtle",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ──────────── Table ──────────── */

function AdsTable({ ads, channel, onOpen, onToast }) {
  const showChannelsCol = !channel;
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <table className="w-full text-[13px]">
        <thead className="bg-surface-subtle">
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
            <Th>Ad</Th>
            {showChannelsCol && <Th>Channels</Th>}
            <Th>Status</Th>
            <Th align="right">Spent</Th>
            <Th align="right">Results</Th>
            <Th align="right">Cost / result</Th>
            <Th align="right" />
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <AdRow key={ad.id} ad={ad} channel={channel} onOpen={onOpen} onToast={onToast} />
          ))}
        </tbody>
      </table>
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

function AdRow({ ad, channel, onOpen, onToast }) {
  const goal = findGoal(ad.goalId);
  const pill = STATUS_PILLS[ad.status];
  const showChannelsCol = !channel;
  const [menuOpen, setMenuOpen] = useState(false);

  // Channel-scoped numbers when on a channel tab.
  const perChannel = channel ? ad.perChannel?.[channel] : null;
  const channelSpend = channel ? (ad.spendByChannel?.[channel] ?? perChannel?.spent ?? 0) : ad.spent;
  const channelResults = channel ? (perChannel?.results ?? 0) : ad.results;
  const channelCpr = channel ? (perChannel?.costPerResult ?? 0) : ad.costPerResult;

  return (
    <tr
      onClick={() => onOpen?.(ad.id)}
      className="cursor-pointer border-t border-line transition-colors hover:bg-surface-subtle"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-[20px]">
            {ad.creative.thumb || "🖼️"}
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-semibold text-ink-heading">{ad.name}</span>
            <span className="truncate text-[11px] font-medium text-ink-muted">Goal: {goal?.label}</span>
          </div>
        </div>
      </td>
      {showChannelsCol && (
        <td className="px-4 py-3">
          <ChannelStack ids={ad.channels} size={14} />
        </td>
      )}
      <td className="px-4 py-3">
        <span className={["inline-flex h-7 min-w-[88px] items-center justify-center gap-1.5 rounded-pill px-3 text-[11px] font-semibold", pill.bg, pill.text].join(" ")}>
          <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
          {pill.label}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-right">
        <div className="flex flex-col items-end">
          <span className="text-[13px] font-medium text-ink-heading">{formatCurrency(channelSpend)}</span>
          {!channel && ad.dailySpend > 0 && (
            <span className="text-[11px] text-ink-muted">/day: {formatCurrency(ad.dailySpend)}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-medium text-ink-heading">
          {channelResults} <span className="text-ink-muted">{ad.resultLabel}</span>
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-[14px] font-semibold text-ink-heading">
          {channelCpr > 0 ? formatCurrency(channelCpr) : "—"}
        </span>
      </td>
      <td className="px-2 py-3 text-right">
        <div className="relative inline-block">
          <button
            type="button"
            aria-label="Row actions"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted"
          >
            <MoreHorizontal size={14} />
          </button>
          <DropdownMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            anchor="right"
            items={[
              { label: "Edit",      icon: <Pencil size={12} />, onClick: () => onToast?.("Opening editor…") },
              { label: "Duplicate", icon: <Copy size={12} />,   onClick: () => onToast?.("Ad duplicated") },
              { label: "Pause",     icon: <Pause size={12} />,  onClick: () => onToast?.("Ad paused") },
              "divider",
              { label: "Delete",    icon: <Trash2 size={12} />, onClick: () => onToast?.("Ad deleted"), danger: true },
            ]}
          />
        </div>
      </td>
    </tr>
  );
}

/* ──────────── Card grid ──────────── */

function AdsCardGrid({ ads, channel, onOpen }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {ads.map((ad) => {
        const goal = findGoal(ad.goalId);
        const pill = STATUS_PILLS[ad.status];
        const perChannel = channel ? ad.perChannel?.[channel] : null;
        const cpr = channel ? perChannel?.costPerResult ?? 0 : ad.costPerResult;
        return (
          <button
            key={ad.id}
            type="button"
            onClick={() => onOpen?.(ad.id)}
            className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 text-left transition-colors hover:border-line-strong"
          >
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md bg-brand-50 text-[48px]">
              {ad.creative.thumb || "🖼️"}
            </div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[13px] font-semibold text-ink-heading">{ad.name}</span>
                <span className="text-[11px] font-medium text-ink-muted">Goal: {goal?.label}</span>
              </div>
              <span className={["inline-flex h-5 items-center gap-1 rounded-pill px-1.5 text-[10px] font-semibold", pill.bg, pill.text].join(" ")}>
                <span aria-hidden className={["h-1 w-1 rounded-full", pill.dot].join(" ")} />
                {pill.label}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-2 text-[12px]">
              {!channel && <ChannelStack ids={ad.channels} size={14} />}
              <span className={["font-semibold text-ink-heading", channel ? "ml-auto" : ""].join(" ")}>
                {cpr > 0 ? `${formatCurrency(cpr)} / ${ad.resultLabel.replace(/s$/, "")}` : "—"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ──────────── Empty + No-match ──────────── */

function AccountEmptyState({ onCreate }) {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center gap-5 py-16 text-center">
      <h1 className="text-[28px] font-semibold leading-tight text-ink-heading">
        Get more customers with ads
      </h1>
      <p className="text-[15px] font-medium text-ink-muted">
        Reach the right people on Facebook, Instagram, LinkedIn, and TikTok.
        We'll guide you through it.
      </p>
      <div className="flex items-center gap-3 text-[12px] font-medium text-ink-muted">
        {CHANNELS.map((c) => <ChannelLogo key={c.id} id={c.id} size={20} />)}
        <span>+ more coming soon</span>
      </div>
      <button
        type="button"
        onClick={() => onCreate?.()}
        className="inline-flex h-12 items-center rounded-button bg-cta-gradient px-8 text-[14px] font-semibold text-white hover:opacity-90"
      >
        Create Your First Ad
      </button>
      <div className="mt-2 grid grid-cols-3 gap-3">
        {QUICK_GOAL_TILES.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onCreate?.(id)}
            className="flex h-[120px] w-[240px] flex-col items-start justify-between rounded-xl border border-line bg-white p-4 text-left transition-colors hover:border-brand-emerald hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-emerald">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <span className="text-[13px] font-semibold text-ink-heading">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChannelEmptyState({ channelId, onCreate, onClear }) {
  const channel = findChannel(channelId);
  const connected = channel?.connected;
  return (
    <div className="mx-auto flex max-w-[480px] flex-col items-center gap-4 py-16 text-center">
      <ChannelLogo id={channelId} size={48} />
      <h2 className="text-[22px] font-semibold leading-tight text-ink-heading">
        No {channel?.label} ads yet
      </h2>
      <p className="text-[14px] font-medium text-ink-muted">
        {connected
          ? `Reach customers on ${channel?.sublabel}. Most retail SMBs see results within their first week.`
          : `Once connected, you can launch your first ad in about 5 minutes.`}
      </p>
      <button
        type="button"
        onClick={() => onCreate?.()}
        className="inline-flex h-11 items-center rounded-button bg-cta-gradient px-6 text-[13px] font-semibold text-white hover:opacity-90"
      >
        {connected ? `+ Create Your First ${channel?.label} Ad` : `Connect ${channel?.label} Account`}
      </button>
      <button
        type="button"
        onClick={onClear}
        className="text-[12px] font-semibold text-brand-emerald hover:underline"
      >
        Or run an ad on multiple channels →
      </button>
    </div>
  );
}

function NoMatchState({ onReset }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-canvas px-6 py-12 text-center">
      <h3 className="text-[14px] font-semibold text-ink-heading">No ads match</h3>
      <button
        type="button"
        onClick={onReset}
        className="text-[12px] font-semibold text-brand-emerald hover:underline"
      >
        Reset filters
      </button>
    </div>
  );
}

/* ──────────── Helpers ──────────── */

function buildMetrics(scopedAds, channel) {
  const active = scopedAds.filter((a) => a.status === "active");
  let spent;
  let reach;
  let results;
  if (channel) {
    spent = scopedAds.reduce((s, a) => s + (a.spendByChannel?.[channel] ?? 0), 0);
    const channelShare = (a) => {
      const total = Object.values(a.spendByChannel ?? {}).reduce((s, v) => s + v, 0);
      const share = total > 0 ? (a.spendByChannel?.[channel] ?? 0) / total : 0;
      return share;
    };
    reach = scopedAds.reduce((s, a) => s + Math.round(a.reach * channelShare(a)), 0);
    results = scopedAds.reduce((s, a) => s + (a.perChannel?.[channel]?.results ?? 0), 0);
  } else {
    spent = scopedAds.reduce((s, a) => s + a.spent, 0);
    reach = scopedAds.reduce((s, a) => s + a.reach, 0);
    results = scopedAds.reduce((s, a) => s + a.results, 0);
  }
  return {
    activeCount: active.length,
    channelCount: aggregateActiveChannels(scopedAds),
    spentMonth: spent,
    spendDelta: { dir: "up", value: "+12%", period: "vs last month" },
    reach,
    totalResults: results,
  };
}

function buildTabCounts(ads) {
  const counts = { all: ads.length, meta: 0, linkedin: 0, tiktok: 0 };
  for (const a of ads) {
    for (const id of a.channels) {
      if (counts[id] !== undefined) counts[id] += 1;
    }
  }
  return counts;
}

function buildChannelInsight(channelId, ads) {
  // Compute best channel by cost-per-result; produce a comparison insight when
  // the active channel is best (or worst) and there's data on 2+ channels.
  const channelCprs = {};
  for (const a of ads) {
    for (const [id, perf] of Object.entries(a.perChannel ?? {})) {
      if (!perf || !perf.costPerResult) continue;
      channelCprs[id] = channelCprs[id] ?? [];
      channelCprs[id].push(perf.costPerResult);
    }
  }
  const avg = (arr) => (arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0);
  const channelsWithData = Object.entries(channelCprs).filter(([, arr]) => arr.length > 0);
  if (channelsWithData.length < 2) return null;
  const ranked = channelsWithData
    .map(([id, arr]) => ({ id, cpr: avg(arr) }))
    .sort((a, b) => a.cpr - b.cpr);
  const best = ranked[0];
  const others = ranked.filter((r) => r.id !== best.id);
  const othersAvg = avg(others.map((r) => r.cpr));
  const pct = othersAvg > 0 ? Math.round(((othersAvg - best.cpr) / othersAvg) * 100) : 0;
  if (best.id === channelId && pct > 0) {
    return {
      body: `Your ${findChannel(channelId)?.label} ads are getting cheaper results (-${pct}%) than your other channels. Consider increasing ${findChannel(channelId)?.label} budget.`,
    };
  }
  return null;
}
