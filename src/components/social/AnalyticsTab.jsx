import { useMemo, useState } from "react";
import { Heart, MessageCircle, Send, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { InstagramLogo, LinkedinLogo } from "../BrandLogos.jsx";
import { FacebookLogo } from "./SocialLogos.jsx";
import Sparkline from "../ads/Sparkline.jsx";
import { ANALYTICS, POSTS, findPlatform, formatCount } from "./data.js";

const LOGO_BY_ID = { linkedin: LinkedinLogo, facebook: FacebookLogo, instagram: InstagramLogo };

const PLATFORM_STRIP = {
  linkedin: "rgba(10,102,194,0.6)",
  facebook: "rgba(24,119,242,0.6)",
  instagram: "linear-gradient(180deg,#FDF497 0%,#D6249F 50%,#285AEB 100%)",
};

const PLATFORM_LINE = {
  linkedin: "#0A66C2",
  facebook: "#1877F2",
  instagram: "#D6249F",
};

const RANGES = [
  { id: "7d",  label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

const METRICS = [
  { id: "reach",      label: "Reach" },
  { id: "engagement", label: "Engagement" },
  { id: "followers",  label: "Followers" },
  { id: "posts",      label: "Posts published" },
];

export default function AnalyticsTab({ accounts }) {
  const [range, setRange] = useState("30d");
  return (
    <div className="flex flex-col gap-10">
      <HeroRow range={range} onRangeChange={setRange} />
      <ChannelBreakdown accounts={accounts} />
      <PerformanceOverTime accounts={accounts} />
      <TopPosts />
      <AudienceInsights />
      <AISuggestions />
    </div>
  );
}

/* ──────────── Hero ──────────── */

function HeroRow({ range, onRangeChange }) {
  const t = ANALYTICS.totals;
  const d = ANALYTICS.deltas;
  const sp = ANALYTICS.spark;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-ink-heading">How you're doing this period</h2>
        <select value={range} onChange={(e) => onRangeChange(e.target.value)} className="h-9 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body">
          {RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <HeroTile label="Total Reach"     value={formatCount(t.reach)}       delta={d.reach}        spark={sp.reach}     />
        <HeroTile label="Total Engagement" value={formatCount(t.engagement)} delta={d.engagement}   spark={sp.engagement} />
        <HeroTile label="New Followers"   value={t.newFollowers.toString()}  delta={d.newFollowers} spark={sp.newFollowers} />
        <HeroTile label="Posts Published" value={t.postsPublished.toString()} delta={d.postsPublished} spark={sp.postsPublished} />
      </div>
    </section>
  );
}

function HeroTile({ label, value, delta, spark }) {
  return (
    <article className="flex h-32 items-stretch justify-between gap-3 rounded-md border border-line bg-white p-5">
      <div className="flex flex-col justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</span>
        <span className="text-[28px] font-semibold leading-none text-ink-heading">{value}</span>
        {delta && (
          <span className={["inline-flex items-center gap-1 text-[12px] font-medium", delta.dir === "up" ? "text-success" : "text-danger"].join(" ")}>
            {delta.dir === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta.value} vs last week
          </span>
        )}
      </div>
      <div className="flex items-end">
        <Sparkline data={spark} width={80} height={40} />
      </div>
    </article>
  );
}

/* ──────────── Channel breakdown ──────────── */

function ChannelBreakdown({ accounts }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[14px] font-semibold text-ink-heading">How each channel is performing</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(LOGO_BY_ID).map((id) => (
          <ChannelCard key={id} id={id} accounts={accounts} />
        ))}
      </div>
    </section>
  );
}

function ChannelCard({ id, accounts }) {
  const Logo = LOGO_BY_ID[id];
  const platform = findPlatform(id);
  const acct = accounts[id];
  const data = ANALYTICS.perChannel[id];
  const bestPost = data.bestPostId ? POSTS.find((p) => p.id === data.bestPostId) : null;
  const stripStyle = id === "instagram"
    ? { background: PLATFORM_STRIP.instagram }
    : { backgroundColor: PLATFORM_STRIP[id] };

  if (!acct?.connected) {
    return (
      <article className="relative overflow-hidden rounded-md border border-dashed border-line bg-canvas p-5">
        <span aria-hidden className="absolute left-0 top-0 h-full w-1" style={stripStyle} />
        <div className="flex items-center gap-2">
          <Logo size={20} />
          <span className="text-[13px] font-semibold text-ink-heading">{platform.name}</span>
        </div>
        <p className="mt-3 text-[12px] font-medium text-ink-muted">⊘ Not connected</p>
        <button type="button" className="mt-3 inline-flex h-9 items-center rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle">
          Connect →
        </button>
      </article>
    );
  }

  return (
    <article className="relative overflow-hidden rounded-md border border-line bg-white p-5">
      <span aria-hidden className="absolute left-0 top-0 h-full w-1" style={stripStyle} />
      <header className="flex items-center gap-2">
        <Logo size={20} />
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-ink-heading">{platform.name}</span>
          <span className="text-[11px] font-medium text-ink-muted">{data.account}</span>
        </div>
      </header>
      <div className="mt-3 flex flex-col gap-2 text-[12px]">
        <Row label="Reach"     value={formatCount(data.reach)}      delta={data.deltas?.reach} />
        <Row label="Engagement" value={formatCount(data.engagement)} delta={data.deltas?.engagement} />
        <Row label="Posts published" value={data.posts.toString()} />
        <Row label="Followers" value={data.followers.toLocaleString()} delta={data.deltas?.followers} />
      </div>
      {bestPost && (
        <div className="mt-3 border-t border-line pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">Best post</span>
          <button type="button" className="flex w-full items-center justify-between gap-2 pt-1 text-left">
            <span className="line-clamp-1 text-[12px] font-medium text-ink-body">"{bestPost.caption}"</span>
            <span className="text-[12px] font-semibold text-brand-emerald">→</span>
          </button>
        </div>
      )}
    </article>
  );
}

function Row({ label, value, delta }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="flex items-center gap-2 font-semibold text-ink-heading">
        {value}
        {delta && <span className="text-[10px] font-medium text-success">↑ {delta}</span>}
      </span>
    </div>
  );
}

/* ──────────── Performance over time ──────────── */

function PerformanceOverTime({ accounts }) {
  const [metric, setMetric] = useState("reach");
  const [hidden, setHidden] = useState(new Set());

  const visible = Object.keys(LOGO_BY_ID).filter((id) => !hidden.has(id));
  const series = visible.map((id) => ({ id, data: ANALYTICS.series[id], connected: accounts[id]?.connected }));

  const toggle = (id) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-ink-heading">Performance over time</h2>
        <select value={metric} onChange={(e) => setMetric(e.target.value)} className="h-9 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body">
          {METRICS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
      </header>
      <MultiLineChart series={series} />
      <div className="flex items-center gap-3">
        {Object.keys(LOGO_BY_ID).map((id) => {
          const on = !hidden.has(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={[
                "inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium transition-colors",
                on ? "border-line bg-white text-ink-body" : "border-line bg-surface-subtle text-ink-muted line-through",
              ].join(" ")}
            >
              <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: PLATFORM_LINE[id] }} />
              {findPlatform(id)?.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MultiLineChart({ series }) {
  const all = series.flatMap((s) => s.data);
  const max = Math.max(...all, 1);
  const width = 760;
  const height = 320;
  const padding = { top: 16, right: 16, bottom: 28, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const len = series[0]?.data?.length ?? 0;
  const stepX = len > 1 ? innerW / (len - 1) : 0;

  const linePath = (data) => data.map((v, i) => `${i === 0 ? "M" : "L"}${(padding.left + i * stepX).toFixed(1)},${(padding.top + innerH - (v / max) * innerH).toFixed(1)}`).join(" ");
  const grid = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full" aria-label="performance over time">
      {grid.map((p, i) => {
        const y = padding.top + p * innerH;
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={padding.left + innerW} y2={y} stroke="#F3F4F6" strokeWidth="1" />
            <text x={padding.left - 8} y={y + 3} textAnchor="end" fill="#9CA3AF" style={{ fontSize: 10 }}>{Math.round(max - p * max)}</text>
          </g>
        );
      })}
      {series.map((s) => (
        <path key={s.id} d={linePath(s.data)} fill="none" stroke={PLATFORM_LINE[s.id]} strokeWidth="1.75" strokeDasharray={s.id === "facebook" ? "4,3" : undefined} opacity={s.connected ? 1 : 0.2} />
      ))}
      {Array.from({ length: len }).map((_, i) => i % 2 === 0 && (
        <text key={i} x={padding.left + i * stepX} y={height - 8} textAnchor="middle" fill="#9CA3AF" style={{ fontSize: 10 }}>
          Day {i + 1}
        </text>
      ))}
    </svg>
  );
}

/* ──────────── Top posts ──────────── */

function TopPosts() {
  const top = useMemo(() => POSTS.filter((p) => p.status === "published").sort((a, b) => totalEngagement(b) - totalEngagement(a)).slice(0, 7), []);
  return (
    <section className="flex flex-col gap-2">
      <header className="flex flex-col gap-0.5">
        <h2 className="text-[14px] font-semibold text-ink-heading">Your best posts this period</h2>
        <span className="text-[12px] font-medium text-ink-muted">Sorted by total engagement</span>
      </header>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {top.map((p) => <TopPostCard key={p.id} post={p} />)}
      </div>
    </section>
  );
}

function TopPostCard({ post }) {
  const Logo = LOGO_BY_ID[post.channels[0]];
  const date = new Date(post.publishedAt).toLocaleString("en-US", { month: "short", day: "numeric" });
  const e = post.engagement ?? {};
  return (
    <article className="flex w-[240px] shrink-0 flex-col rounded-md border border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <span className="flex aspect-square items-center justify-center rounded-t-md bg-surface-muted text-[56px]">
        {post.media?.thumb ?? "📝"}
      </span>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
          {Logo && <Logo size={12} />}
          <span>{date}</span>
        </div>
        <p className="line-clamp-2 text-[12px] leading-snug text-ink-body">{post.caption}</p>
        <div className="flex items-center justify-between border-t border-line pt-2 text-[11px] font-medium text-ink-muted">
          <span className="inline-flex items-center gap-1"><Heart size={11} /> {e.likes ?? 0}</span>
          <span className="inline-flex items-center gap-1"><MessageCircle size={11} /> {e.comments ?? 0}</span>
          <span className="inline-flex items-center gap-1"><Send size={11} /> {e.shares ?? 0}</span>
        </div>
        <span className="text-[11px] font-semibold text-ink-heading">{formatCount(e.reach ?? 0)} reach</span>
      </div>
    </article>
  );
}

function totalEngagement(p) {
  const e = p.engagement ?? {};
  return (e.likes ?? 0) + (e.comments ?? 0) + (e.shares ?? 0);
}

/* ──────────── Audience insights ──────────── */

function AudienceInsights() {
  const a = ANALYTICS.audience;
  return (
    <section className="grid grid-cols-2 gap-5">
      <article className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
        <header className="flex flex-col gap-0.5">
          <h3 className="text-[14px] font-semibold text-ink-heading">Who's engaging</h3>
          <p className="text-[12px] font-medium text-ink-muted">{a.headline}</p>
        </header>
        <div className="grid grid-cols-[140px_1fr] items-center gap-5">
          <Donut female={a.gender.female} male={a.gender.male} />
          <div className="flex flex-col gap-1.5 text-[12px]">
            {a.ageBuckets.map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="w-12 text-ink-muted">{b.label}</span>
                <div className="flex-1 overflow-hidden rounded-pill bg-surface-muted">
                  <span className="block h-2 rounded-pill bg-brand-emerald" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="w-8 text-right font-semibold text-ink-heading">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-line pt-3 text-[11px] font-medium text-ink-muted">
          <span>Top cities:</span>
          {a.cities.map((c) => (
            <span key={c.label} className="inline-flex items-center gap-1 rounded-pill bg-surface-muted px-2 py-0.5">
              {c.label} <span className="text-ink-subtle">{c.count}</span>
            </span>
          ))}
        </div>
      </article>

      <article className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
        <header className="flex flex-col gap-0.5">
          <h3 className="text-[14px] font-semibold text-ink-heading">When they're most active</h3>
          <p className="text-[12px] font-medium text-ink-muted">Brighter cells = higher engagement.</p>
        </header>
        <Heatmap data={ANALYTICS.heatmap} />
        <p className="rounded-sm bg-brand-50/40 p-2 text-[11px] font-medium text-ink-body">
          💡 Your audience is most active on {ANALYTICS.heatmapBest}. Schedule posts for this window.
        </p>
      </article>
    </section>
  );
}

function Donut({ female, male }) {
  const r = 48;
  const c = 2 * Math.PI * r;
  const femaleLen = (female / 100) * c;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-label="gender breakdown">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#F3F4F6" strokeWidth="14" />
      <circle cx="60" cy="60" r={r} fill="none" stroke="#1EB677" strokeWidth="14" strokeDasharray={`${femaleLen} ${c - femaleLen}`} transform="rotate(-90 60 60)" />
      <text x="60" y="55" textAnchor="middle" fill="#222" style={{ fontSize: 14, fontWeight: 600 }}>{female}%</text>
      <text x="60" y="72" textAnchor="middle" fill="#6A6A6A" style={{ fontSize: 9, fontWeight: 500 }}>women</text>
    </svg>
  );
}

function Heatmap({ data }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="grid grid-cols-[20px_repeat(24,1fr)] gap-[2px] text-[9px] font-medium text-ink-subtle">
      <span />
      {Array.from({ length: 24 }).map((_, h) => (
        <span key={h} className="text-center">{h % 6 === 0 ? h : ""}</span>
      ))}
      {data.flatMap((row, i) => [
        <span key={`d${i}`} className="text-right pr-1">{days[i]}</span>,
        ...row.map((v, h) => (
          <span
            key={`${i}-${h}`}
            className="aspect-square rounded-[2px]"
            style={{ backgroundColor: heatColor(v) }}
            title={`${days[i]} ${h}:00 — intensity ${v}`}
          />
        )),
      ])}
    </div>
  );
}

function heatColor(v) {
  // 0 → very pale, 10 → deep brand emerald
  const max = 10;
  const t = Math.min(v / max, 1);
  const start = [240, 250, 245];
  const end   = [30, 182, 119];
  const r = Math.round(start[0] + (end[0] - start[0]) * t);
  const g = Math.round(start[1] + (end[1] - start[1]) * t);
  const b = Math.round(start[2] + (end[2] - start[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/* ──────────── AI suggestions ──────────── */

function AISuggestions() {
  return (
    <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
      <header className="flex items-center gap-2">
        <Sparkles size={16} className="text-brand-emerald" />
        <h3 className="text-[14px] font-semibold text-ink-heading">Suggestions to grow</h3>
      </header>
      <div className="flex flex-col gap-2">
        {ANALYTICS.suggestions.map((s) => (
          <article key={s.id} className="flex items-start justify-between gap-3 rounded-md border-l-4 border-brand-emerald bg-brand-50/30 p-3">
            <p className="flex-1 text-[12px] leading-relaxed text-ink-body">{s.body}</p>
            <button type="button" className="inline-flex h-9 shrink-0 items-center rounded-button bg-brand-emerald px-3 text-[12px] font-semibold text-white">
              {s.apply}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
