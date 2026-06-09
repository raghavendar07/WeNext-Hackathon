import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  MoreHorizontal,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { ChannelLogo, ChannelStack } from "./AdLogos.jsx";
import AdPreview from "./AdPreview.jsx";
import Sparkline from "./Sparkline.jsx";
import { STATUS_PILLS, findChannel, findGoal, formatCount, formatCurrency } from "./data.js";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "channels", label: "Channels" },
  { id: "audience", label: "Audience" },
];

const METRIC_OPTIONS = [
  { id: "results", label: "Results" },
  { id: "spent", label: "Spent" },
  { id: "reach", label: "Reach" },
  { id: "clicks", label: "Clicks" },
  { id: "cpr", label: "Cost per result" },
];

export default function AdDetailPage({ ad, onBack }) {
  const [tab, setTab] = useState("overview");
  const [toast, setToast] = useState(null);
  const [editCreativeOpen, setEditCreativeOpen] = useState(false);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2000); return () => clearTimeout(t); } }, [toast]);
  const pill = STATUS_PILLS[ad.status];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white text-ink-body hover:bg-surface-subtle"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex flex-col">
            <span className="text-[18px] font-semibold text-ink-heading">{ad.name}</span>
            <div className="flex items-center gap-2">
              <span className={["inline-flex h-5 items-center gap-1 rounded-pill px-2 text-[11px] font-semibold", pill.bg, pill.text].join(" ")}>
                <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
                {pill.label}
              </span>
              <ChannelStack ids={ad.channels} size={12} />
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-label="More actions"
          className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white text-ink-muted hover:bg-surface-subtle"
        >
          <MoreHorizontal size={16} />
        </button>
      </header>

      <Hero ad={ad} />
      <StatRow ad={ad} />

      <Tabs tab={tab} onChange={setTab} />

      {tab === "overview" && <OverviewTab ad={ad} onToast={setToast} onEditCreative={() => setEditCreativeOpen(true)} />}
      {tab === "channels" && <ChannelsTab ad={ad} onToast={setToast} />}
      {tab === "audience" && <AudienceTab ad={ad} onToast={setToast} />}

      {editCreativeOpen && (
        <EditCreativeModal
          ad={ad}
          onCancel={() => setEditCreativeOpen(false)}
          onSave={() => { setEditCreativeOpen(false); setToast("Creative saved"); }}
        />
      )}
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-[8px] bg-[#111827] px-3 py-2 text-[12px] font-semibold text-white shadow-lg">{toast}</div>
      )}
    </div>
  );
}

function EditCreativeModal({ ad, onCancel, onSave }) {
  const [headline, setHeadline] = useState(ad.creative?.headline ?? "");
  const [description, setDescription] = useState(ad.creative?.description ?? "");
  return (
    <div role="dialog" aria-modal="true" onClick={onCancel} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div onClick={(e) => e.stopPropagation()} className="flex w-full max-w-[480px] flex-col gap-4 rounded-md border border-line bg-white p-6 shadow-card">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-[16px] font-semibold text-ink-heading">Edit creative</h3>
            <p className="text-[12px] font-medium text-ink-muted">Update headline, description, and media for this ad.</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close" className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted">
            <X size={16} />
          </button>
        </header>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Catchy one-liner"
              className="h-10 rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people why they should click"
              className="min-h-[90px] resize-y rounded-sm border border-line bg-white px-3 py-2 text-[13px] text-ink-heading"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">Media</label>
            <div className="flex h-[120px] items-center justify-center rounded-md border border-dashed border-line bg-canvas text-[12px] font-medium text-ink-muted">
              {ad.creative?.thumb ? <span className="text-[40px]">{ad.creative.thumb}</span> : "Drop image / video"}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-line pt-3">
          <button type="button" onClick={onCancel} className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[13px] font-medium text-ink-body hover:bg-surface-subtle">Cancel</button>
          <button type="button" onClick={onSave} className="inline-flex h-10 items-center rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Hero ──────────── */

function Hero({ ad }) {
  const goal = findGoal(ad.goalId);
  const sparkData = ad.spendSeries?.length ? ad.spendSeries.map((s, i) => (ad.series[i] ? s / ad.series[i] : 0)) : [];
  return (
    <section className="flex items-center justify-between gap-6 rounded-xl border border-line bg-white px-6 py-8">
      <div className="flex flex-col gap-1">
        <span className="text-[44px] font-semibold leading-none text-ink-heading">
          {ad.costPerResult > 0 ? `${formatCurrency(ad.costPerResult)} per ${ad.resultLabel.replace(/s$/, "")}` : `— per ${ad.resultLabel.replace(/s$/, "")}`}
        </span>
        <span className="text-[13px] font-medium text-ink-muted">
          {ad.results} {ad.resultLabel} from {formatCurrency(ad.spent)} spent · Goal: {goal?.label}
        </span>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">Cost per result over time</span>
        <Sparkline data={sparkData} width={280} height={80} />
        <span className="text-[10px] font-medium text-ink-subtle">Last 8 days</span>
      </div>
    </section>
  );
}

/* ──────────── Stat row ──────────── */

function StatRow({ ad }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard label="Spent" value={formatCurrency(ad.spent)} sub={ad.dailySpend > 0 ? `${formatCurrency(ad.dailySpend)} today` : "Paused"} />
      <StatCard label="People reached" value={formatCount(ad.reach)} delta={{ dir: "up", value: "+8%", period: "vs last 7 days" }} />
      <StatCard label="Clicks" value={ad.clicks.toLocaleString()} sub={`${(ad.impressions ? (ad.clicks / ad.impressions * 100).toFixed(1) : 0)}% click rate`} />
    </div>
  );
}

function StatCard({ label, value, sub, delta }) {
  return (
    <div className="flex h-24 flex-col justify-between rounded-xl border border-line bg-white p-5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</span>
      <span className="text-[24px] font-semibold leading-none text-ink-heading">{value}</span>
      {delta && (
        <span className={["inline-flex items-center gap-1 text-[12px] font-medium", delta.dir === "up" ? "text-success" : "text-danger"].join(" ")}>
          {delta.dir === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta.value} {delta.period}
        </span>
      )}
      {sub && !delta && <span className="text-[12px] font-medium text-ink-muted">{sub}</span>}
    </div>
  );
}

/* ──────────── Tabs ──────────── */

function Tabs({ tab, onChange }) {
  return (
    <div className="flex gap-1 border-b border-line">
      {TABS.map((t) => {
        const active = t.id === tab;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={[
              "-mb-px border-b-2 px-4 py-3 text-[13px] font-semibold transition-colors",
              active
                ? "border-brand-emerald text-brand-emerald"
                : "border-transparent text-ink-muted hover:text-ink-heading",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ──────────── Overview tab ──────────── */

function OverviewTab({ ad, onToast, onEditCreative }) {
  const [metric, setMetric] = useState("results");
  const [range, setRange] = useState("7d");
  const data = useMemo(() => seriesFor(ad, metric), [ad, metric]);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-xl border border-line bg-white p-6">
        <div className="flex items-center justify-between">
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="h-9 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-heading"
          >
            {METRIC_OPTIONS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
          <div className="inline-flex h-9 rounded-md border border-line bg-white p-0.5">
            {["7d", "30d", "all"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={[
                  "h-8 rounded-sm px-3 text-[12px] font-medium",
                  range === r ? "bg-brand-50 text-brand-emerald" : "text-ink-muted",
                ].join(" ")}
              >
                {r === "7d" ? "7d" : r === "30d" ? "30d" : "All time"}
              </button>
            ))}
          </div>
        </div>
        <LineChart data={data} height={320} />
      </section>

      <div className="grid grid-cols-[1.5fr_1fr] gap-5">
        <SuggestionsPanel ad={ad} onToast={onToast} />
        <CreativeBreakdown ad={ad} onEditCreative={onEditCreative} />
      </div>
    </div>
  );
}

function SuggestionsPanel({ ad, onToast }) {
  const [applied, setApplied] = useState(new Set());
  if (!ad.suggestions?.length) {
    return (
      <section className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-canvas py-10 text-center">
        <Sparkles size={20} className="text-ink-subtle" />
        <p className="text-[12px] font-medium text-ink-muted">No suggestions yet — gather more data first.</p>
      </section>
    );
  }
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
      <header className="flex items-center gap-2">
        <Sparkles size={16} className="text-brand-emerald" />
        <h3 className="text-[14px] font-semibold text-ink-heading">Suggestions to improve</h3>
      </header>
      <div className="flex flex-col gap-2">
        {ad.suggestions.map((s) => {
          const isApplied = applied.has(s.id);
          return (
            <article key={s.id} className="flex items-start justify-between gap-3 rounded-md border-l-4 border-brand-emerald bg-brand-50/30 p-3">
              <div className="flex flex-1 flex-col gap-1">
                <p className={["text-[12px] leading-relaxed", isApplied ? "text-ink-muted line-through" : "text-ink-body"].join(" ")}>{s.body}</p>
                {s.why && !isApplied && (
                  <span className="group relative inline-flex w-fit items-center text-[11px] font-semibold text-brand-emerald hover:underline">
                    Why?
                    <span className="pointer-events-none invisible absolute left-0 top-full z-10 mt-1 w-[280px] rounded-md bg-ink-heading p-2 text-[11px] font-medium leading-snug text-white opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                      {s.why}
                    </span>
                  </span>
                )}
              </div>
              <button
                type="button"
                disabled={isApplied}
                onClick={() => {
                  setApplied((prev) => new Set(prev).add(s.id));
                  onToast?.("Applied");
                }}
                className={["inline-flex h-9 shrink-0 items-center rounded-button px-3 text-[12px] font-semibold text-white", isApplied ? "bg-ink-subtle cursor-not-allowed" : "bg-brand-emerald"].join(" ")}
              >
                {isApplied ? "Applied" : s.apply}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CreativeBreakdown({ ad, onEditCreative }) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
      <header className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-ink-heading">Creative</h3>
        <button
          type="button"
          onClick={onEditCreative}
          className="text-[12px] font-semibold text-brand-emerald hover:underline"
        >
          Edit creative →
        </button>
      </header>
      <div className="flex flex-col gap-4">
        {ad.channels.map((id) => {
          const perf = ad.perChannel?.[id];
          const total = ad.results || 1;
          const pct = perf ? Math.round((perf.results / total) * 100) : 0;
          return (
            <div key={id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ChannelLogo id={id} size={14} />
                <span className="text-[12px] font-semibold text-ink-heading">
                  {findChannel(id)?.label}
                  <span className="text-ink-muted"> · {perf ? `${perf.results} ${ad.resultLabel} (${pct}% of total)` : "no data"}</span>
                </span>
              </div>
              <div className="flex justify-center">
                <div className="w-[220px]">
                  <AdPreview channel={id} business="WeNext Retail" creative={ad.creative} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ──────────── Channels tab ──────────── */

function ChannelsTab({ ad, onToast }) {
  const channelsRunning = ad.channels.filter((id) => ad.perChannel?.[id]);
  const best = useMemo(() => {
    if (!channelsRunning.length) return null;
    return channelsRunning.reduce((b, id) => {
      const cur = ad.perChannel[id];
      if (!b || cur.costPerResult < ad.perChannel[b].costPerResult) return id;
      return b;
    }, null);
  }, [ad, channelsRunning]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        {channelsRunning.map((id) => {
          const c = findChannel(id);
          const p = ad.perChannel[id];
          return (
            <article key={id} className="flex flex-col gap-2 rounded-xl border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChannelLogo id={id} size={20} />
                  <span className="text-[13px] font-semibold text-ink-heading">{c.label}</span>
                </div>
                {id === best && (
                  <span className="inline-flex items-center gap-1 rounded-pill bg-success-bg px-2 py-0.5 text-[10px] font-semibold text-success">
                    🟢 Best performer
                  </span>
                )}
              </div>
              <span className="text-[24px] font-semibold text-ink-heading">{formatCurrency(p.costPerResult)} / {ad.resultLabel.replace(/s$/, "")}</span>
              <span className="text-[11px] font-medium text-ink-muted">
                {p.results} {ad.resultLabel} · {formatCurrency(p.spent)}
              </span>
            </article>
          );
        })}
      </div>

      <section className="flex flex-col gap-3 rounded-xl border border-line bg-white p-6">
        <h3 className="text-[14px] font-semibold text-ink-heading">Cost per result over time</h3>
        <LineChart data={ad.series} height={240} />
      </section>

      <section className="flex flex-col gap-3 rounded-xl border-l-4 border-info bg-info-bg/40 p-4">
        <h3 className="text-[14px] font-semibold text-ink-heading">Reallocate budget</h3>
        <p className="text-[12px] leading-relaxed text-ink-body">
          {best ? `${findChannel(best)?.label} is performing best. Move budget from underperformers to ${findChannel(best)?.label}?` : "Not enough data yet."}
        </p>
        {best && (
          <button
            type="button"
            onClick={() => onToast?.("Budget rebalanced")}
            className="inline-flex h-9 w-fit items-center rounded-button bg-cta-gradient px-4 text-[12px] font-semibold text-white"
          >
            Apply suggested split
          </button>
        )}
      </section>
    </div>
  );
}

/* ──────────── Audience tab ──────────── */

function AudienceTab({ ad, onToast }) {
  const a = ad.audience;
  if (!a) return <p className="text-[13px] text-ink-muted">No audience data yet.</p>;
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <Card heading="Demographics" sub="Most leads: women 25–34">
          <div className="flex flex-col gap-2">
            {a.demographics.ageBuckets.map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="w-12 text-[11px] font-medium text-ink-muted">{b.label}</span>
                <div className="flex-1 overflow-hidden rounded-pill bg-surface-muted">
                  <span className="block h-2 rounded-pill bg-brand-emerald" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="w-8 text-right text-[11px] font-semibold text-ink-heading">{b.pct}%</span>
              </div>
            ))}
            <div className="mt-2 flex items-center gap-3 border-t border-line pt-2 text-[11px] text-ink-muted">
              <span>Women {a.demographics.female}%</span>
              <span>Men {a.demographics.male}%</span>
            </div>
          </div>
        </Card>

        <Card heading="Top cities" sub="Where your leads come from">
          <div className="flex flex-col gap-2">
            {a.cities.map((c) => (
              <div key={c.label} className="flex items-center gap-2">
                <span className="w-20 text-[12px] font-medium text-ink-heading">{c.label}</span>
                <div className="flex-1 overflow-hidden rounded-pill bg-surface-muted">
                  <span className="block h-2 rounded-pill bg-info" style={{ width: `${(c.count / a.cities[0].count) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-[11px] font-semibold text-ink-heading">{c.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card heading="Top interests" sub="Categories driving results">
          <div className="flex flex-col gap-2">
            {a.interests.map((i) => (
              <div key={i.label} className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-ink-heading">{i.label}</span>
                <span className="rounded-pill bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-emerald">{i.lift} more likely</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <section className="flex items-start gap-4 rounded-xl border-l-4 border-brand-emerald bg-brand-50/30 p-4">
        <Sparkles size={18} className="mt-0.5 text-brand-emerald" />
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="text-[13px] font-semibold text-ink-heading">Suggested audience expansion</h3>
          <p className="text-[12px] leading-relaxed text-ink-body">
            Based on this data, expand targeting to include {a.interests[0].label} and women 25–34 in {a.cities[0].label}. This could increase your leads by ~30%.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToast?.("Applied")}
          className="inline-flex h-9 items-center rounded-button bg-brand-emerald px-3 text-[12px] font-semibold text-white"
        >
          Apply
        </button>
      </section>
    </div>
  );
}

function Card({ heading, sub, children }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
      <header className="flex flex-col">
        <h3 className="text-[13px] font-semibold text-ink-heading">{heading}</h3>
        {sub && <p className="text-[11px] font-medium text-ink-muted">{sub}</p>}
      </header>
      {children}
    </article>
  );
}

/* ──────────── LineChart with axes + gridlines ──────────── */

function LineChart({ data = [], height = 320 }) {
  const [hover, setHover] = useState(null);
  if (!data.length) {
    return <div style={{ height }} className="flex items-center justify-center rounded-md bg-surface-subtle text-[12px] font-medium text-ink-muted">No data yet</div>;
  }
  const width = 760;
  const padding = { top: 16, right: 16, bottom: 28, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const max = Math.max(...data);
  const min = Math.min(0, Math.min(...data));
  const range = max - min || 1;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const points = data.map((v, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + innerH - ((v - min) / range) * innerH;
    return [x, y, v];
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${padding.left + innerW},${padding.top + innerH} L${padding.left},${padding.top + innerH} Z`;

  const gridLevels = [0, 0.25, 0.5, 0.75, 1];
  const labelStep = Math.max(1, Math.ceil(data.length / 6));

  return (
    <div className="relative w-full overflow-x-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-label="performance chart">
        {gridLevels.map((p, i) => {
          const y = padding.top + p * innerH;
          const value = Math.round(max - p * range);
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={padding.left + innerW} y2={y} stroke="#F3F4F6" strokeWidth="1" />
              <text x={padding.left - 8} y={y + 3} textAnchor="end" fill="#9CA3AF" style={{ fontSize: 10, fontWeight: 500 }}>{value}</text>
            </g>
          );
        })}
        <path d={areaPath} fill="rgba(30,182,119,0.10)" />
        <path d={linePath} fill="none" stroke="#1EB677" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
        {points.map(([x, y, v], i) => (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={hover === i ? 4 : 2.5}
              fill="#1EB677"
              stroke="white"
              strokeWidth="1.5"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            />
            {i % labelStep === 0 && (
              <text x={x} y={height - 8} textAnchor="middle" fill="#9CA3AF" style={{ fontSize: 10, fontWeight: 500 }}>
                Day {i + 1}
              </text>
            )}
          </g>
        ))}
        {hover !== null && (
          <g>
            <line
              x1={points[hover][0]} y1={padding.top}
              x2={points[hover][0]} y2={padding.top + innerH}
              stroke="#1EB677" strokeWidth="1" strokeDasharray="3,3"
            />
            <rect
              x={Math.min(points[hover][0] - 36, width - 80)}
              y={Math.max(points[hover][1] - 32, 4)}
              width="72" height="24" rx="4" fill="#101828"
            />
            <text
              x={Math.min(points[hover][0] - 36, width - 80) + 36}
              y={Math.max(points[hover][1] - 32, 4) + 16}
              textAnchor="middle" fill="white"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              {points[hover][2]}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

/* ──────────── helpers ──────────── */

function seriesFor(ad, metric) {
  if (metric === "results") return ad.series ?? [];
  if (metric === "spent") return ad.spendSeries ?? [];
  if (metric === "cpr") {
    return (ad.spendSeries ?? []).map((s, i) => (ad.series?.[i] ? Math.round(s / ad.series[i]) : 0));
  }
  if (metric === "reach") return (ad.series ?? []).map((v) => v * 280);
  if (metric === "clicks") return (ad.series ?? []).map((v) => v * 8);
  return [];
}
