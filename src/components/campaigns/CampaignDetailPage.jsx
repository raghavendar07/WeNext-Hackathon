import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Copy,
  Edit3,
  Instagram,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Send,
  Share2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import StatusPill from "./StatusPill.jsx";

const TAB_DEFS = [
  { id: "overview", label: "Overview" },
  { id: "performance", label: "Performance" },
  { id: "audience", label: "Audience" },
  { id: "message", label: "Message" },
  { id: "logs", label: "Logs" },
];

const CHANNEL_CHIP = {
  whatsapp: { label: "WhatsApp", bg: "bg-channel-whatsappBg", text: "text-channel-whatsappText", Icon: MessageCircle },
  sms: { label: "SMS", bg: "bg-channel-facebookBg", text: "text-channel-facebookText", Icon: MessageSquare },
  social: { label: "Instagram", bg: "bg-channel-instagramBg", text: "text-channel-instagramText", Icon: Instagram },
  email: { label: "Email", bg: "bg-warning-bg", text: "text-warning", Icon: Mail },
  push: { label: "Push", bg: "bg-info-bg", text: "text-info", Icon: Sparkles },
};

const KPI_DELTAS = {
  sent: { direction: "up", value: 8 },
  delivered: { direction: "up", value: 4 },
  opened: { direction: "up", value: 12 },
  clicked: { direction: "down", value: 3 },
};

const AUDIENCE_ROWS = [
  { segment: "VIP Customers", count: 3240, pct: 24.2 },
  { segment: "New Subscribers", count: 4120, pct: 30.8 },
  { segment: "Cart Abandoners", count: 1880, pct: 14.1 },
  { segment: "Re-engagement", count: 2540, pct: 19.0 },
  { segment: "Lookalike Audience", count: 1600, pct: 11.9 },
];

const FILTER_CHIPS = ["Country: IN", "Country: US", "Segment: VIP", "Tag: Newsletter", "Tag: Promo"];

const INSIGHTS = [
  "Open rate is 18% higher on Tuesday — try shifting next send to mid-week.",
  "Cart Abandoners segment converts 2.4x better than the overall list.",
  "Adding emoji to subject line lifted CTR by 11% in similar campaigns.",
];

const LOG_ROWS = [
  { ts: "2026-06-09 09:12:04", phone: "+91 98xxx 41209", status: "delivered" },
  { ts: "2026-06-09 09:12:03", phone: "+91 98xxx 88234", status: "delivered" },
  { ts: "2026-06-09 09:12:02", phone: "+91 98xxx 55501", status: "opened" },
  { ts: "2026-06-09 09:12:01", phone: "+91 98xxx 76112", status: "clicked" },
  { ts: "2026-06-09 09:12:00", phone: "+91 98xxx 33098", status: "failed" },
  { ts: "2026-06-09 09:11:59", phone: "+91 98xxx 21984", status: "delivered" },
];

const LOG_STATUS_TINT = {
  delivered: "bg-success-bg text-success border-success-border",
  opened: "bg-info-bg text-info border-info-border",
  clicked: "bg-channel-whatsappBg text-channel-whatsappText border-line",
  failed: "bg-danger-bg text-danger border-danger-border",
};

export default function CampaignDetailPage({ campaign, onBack }) {
  const [tab, setTab] = useState("overview");

  const channel = CHANNEL_CHIP[campaign.category] ?? CHANNEL_CHIP.email;
  const ChannelIcon = channel.Icon;

  const kpis = useMemo(() => {
    const delivered = campaign.kpis?.delivered ?? 0;
    const opened = campaign.kpis?.opened ?? 0;
    const clicked = campaign.kpis?.clicked ?? 0;
    const sent = Math.round(delivered * 1.05);
    return [
      { id: "sent", title: "Sent", value: sent, delta: KPI_DELTAS.sent },
      { id: "delivered", title: "Delivered", value: delivered, delta: KPI_DELTAS.delivered },
      { id: "opened", title: "Opened", value: opened, delta: KPI_DELTAS.opened },
      { id: "clicked", title: "Clicked", value: clicked, delta: KPI_DELTAS.clicked },
    ];
  }, [campaign]);

  return (
    <div className="flex h-full flex-col gap-5 pb-10">
      {/* Breadcrumb */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-ink-muted hover:text-ink-heading"
      >
        <ArrowLeft size={14} strokeWidth={1.75} />
        Campaigns
      </button>

      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-semibold leading-tight text-ink-heading">{campaign.title}</h1>
              <StatusPill status={campaign.status} />
              <span
                className={[
                  "inline-flex items-center gap-1.5 rounded-pill px-2 py-1 text-[11px] font-semibold",
                  channel.bg,
                  channel.text,
                ].join(" ")}
              >
                <ChannelIcon size={12} strokeWidth={1.75} />
                {channel.label}
              </span>
            </div>
            <p className="max-w-2xl text-[13px] text-ink-muted">{campaign.description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <HeaderBtn icon={<Edit3 size={14} />}>Edit</HeaderBtn>
            <HeaderBtn icon={<Copy size={14} />}>Duplicate</HeaderBtn>
            <HeaderBtn icon={<Pause size={14} />}>Pause</HeaderBtn>
            <HeaderBtn icon={<MoreHorizontal size={14} />} square aria-label="More actions" />
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <KpiTile key={k.id} title={k.title} value={k.value} delta={k.delta} />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E5E7EB]">
        {TAB_DEFS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={[
                "relative px-3 py-2 text-[13px] font-semibold transition-colors",
                active ? "text-ink-heading" : "text-ink-muted hover:text-ink-heading",
              ].join(" ")}
            >
              {t.label}
              {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-emerald-500" />}
            </button>
          );
        })}
      </div>

      {/* Body — content + insights rail */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {tab === "overview" && <OverviewPanel campaign={campaign} />}
          {tab === "performance" && <PerformancePanel kpis={kpis} />}
          {tab === "audience" && <AudiencePanel />}
          {tab === "message" && <MessagePanel campaign={campaign} />}
          {tab === "logs" && <LogsPanel />}
        </div>
        <InsightsRail />
      </div>
    </div>
  );
}

function HeaderBtn({ children, icon, square, ...rest }) {
  return (
    <button
      type="button"
      {...rest}
      className={[
        "inline-flex items-center gap-1.5 rounded-[8px] border border-[#E5E7EB] bg-white text-[13px] font-semibold text-ink-heading hover:bg-[#F9FAFB]",
        square ? "h-8 w-8 justify-center" : "h-8 px-3",
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  );
}

function KpiTile({ title, value, delta }) {
  const Trend = delta.direction === "down" ? TrendingDown : TrendingUp;
  const trendTone = delta.direction === "down" ? "text-danger bg-danger-bg" : "text-success bg-success-bg";
  return (
    <div className="flex flex-col gap-3 rounded-[12px] border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <span className="text-[13px] font-medium text-ink-muted">{title}</span>
      <span className="text-[28px] font-bold leading-none text-ink-heading">{value.toLocaleString()}</span>
      <div className="flex items-center gap-2">
        <span className={["inline-flex h-5 w-5 items-center justify-center rounded-xs", trendTone].join(" ")}>
          <Trend size={12} strokeWidth={2} />
        </span>
        <span className="text-[12px] font-medium text-ink-muted">
          {delta.direction === "down" ? "-" : "+"}
          {delta.value}% vs last campaign
        </span>
      </div>
    </div>
  );
}

function PanelCard({ title, children, action }) {
  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <header className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-[14px] font-semibold text-ink-heading">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

function OverviewPanel({ campaign }) {
  const audienceSize = AUDIENCE_ROWS.reduce((s, r) => s + r.count, 0);
  const rows = [
    { label: "Summary", value: campaign.description },
    { label: "Send date", value: "Jun 9, 2026 09:12 IST" },
    { label: "Schedule", value: "One-time send" },
    { label: "Owner", value: "Raghavendar P." },
    { label: "Audience size", value: audienceSize.toLocaleString() + " contacts" },
    { label: "Total cost", value: "$" + (audienceSize * 0.012).toFixed(2) },
  ];
  return (
    <PanelCard title="Overview">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-1">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{r.label}</dt>
            <dd className="text-[13px] font-medium text-ink-heading">{r.value}</dd>
          </div>
        ))}
      </dl>
    </PanelCard>
  );
}

function PerformancePanel({ kpis }) {
  // mock sparkline data points
  const points = [12, 18, 14, 22, 30, 28, 36, 42, 38, 46, 52, 58];
  const W = 560;
  const H = 140;
  const PAD = 8;
  const max = Math.max(...points);
  const stepX = (W - PAD * 2) / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = PAD + i * stepX;
      const y = H - PAD - (p / max) * (H - PAD * 2);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPath = `${path} L ${PAD + (points.length - 1) * stepX} ${H - PAD} L ${PAD} ${H - PAD} Z`;

  const funnel = [
    { label: "Sent", value: kpis[0].value, color: "bg-emerald-500" },
    { label: "Delivered", value: kpis[1].value, color: "bg-emerald-500/85" },
    { label: "Opened", value: kpis[2].value, color: "bg-emerald-500/70" },
    { label: "Clicked", value: kpis[3].value, color: "bg-emerald-500/55" },
    { label: "Converted", value: Math.round(kpis[3].value * 0.18), color: "bg-emerald-500/40" },
  ];
  const top = funnel[0].value || 1;

  return (
    <div className="flex flex-col gap-5">
      <PanelCard title="Engagement over time">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-[160px] w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1={PAD} x2={W - PAD} y1={H * g} y2={H * g} stroke="#F3F4F6" strokeWidth="1" />
            ))}
            <path d={areaPath} fill="url(#spark)" />
            <path d={path} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => {
              const x = PAD + i * stepX;
              const y = H - PAD - (p / max) * (H - PAD * 2);
              return <circle key={i} cx={x} cy={y} r="2.5" fill="#10B981" />;
            })}
          </svg>
        </div>
      </PanelCard>

      <PanelCard title="Conversion funnel">
        <div className="flex flex-col gap-3">
          {funnel.map((f) => {
            const pct = Math.max(4, Math.round((f.value / top) * 100));
            return (
              <div key={f.label} className="flex items-center gap-3">
                <span className="w-24 text-[12px] font-semibold text-ink-heading">{f.label}</span>
                <div className="relative h-7 flex-1 overflow-hidden rounded-[8px] bg-[#F3F4F6]">
                  <div
                    className={["h-full rounded-[8px]", f.color].join(" ")}
                    style={{ width: pct + "%" }}
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center text-[12px] font-semibold text-white">
                    {f.value.toLocaleString()}
                  </span>
                </div>
                <span className="w-12 text-right text-[12px] font-medium text-ink-muted">{pct}%</span>
              </div>
            );
          })}
        </div>
      </PanelCard>
    </div>
  );
}

function AudiencePanel() {
  const total = AUDIENCE_ROWS.reduce((s, r) => s + r.count, 0);
  return (
    <div className="flex flex-col gap-5">
      <PanelCard
        title="Audience filters"
        action={
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-muted">
            <Users size={14} strokeWidth={1.75} />
            {total.toLocaleString()} contacts
          </span>
        }
      >
        <div className="flex flex-wrap gap-2">
          {FILTER_CHIPS.map((c) => (
            <span
              key={c}
              className="inline-flex items-center rounded-pill border border-[#E5E7EB] bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink-muted"
            >
              {c}
            </span>
          ))}
        </div>
      </PanelCard>

      <PanelCard title="Segment breakdown">
        <div className="overflow-hidden rounded-[8px] border border-[#E5E7EB]">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#F9FAFB] text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-3 py-2">Segment</th>
                <th className="px-3 py-2">Count</th>
                <th className="px-3 py-2">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {AUDIENCE_ROWS.map((r) => (
                <tr key={r.segment} className="text-ink-heading">
                  <td className="px-3 py-2 font-medium">{r.segment}</td>
                  <td className="px-3 py-2">{r.count.toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-[#F3F4F6]">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: r.pct + "%" }} />
                      </div>
                      <span className="text-[12px] font-medium text-ink-muted">{r.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}

function MessagePanel({ campaign }) {
  const body =
    campaign.description ||
    "Hey {{first_name}}, your order #{{order_id}} is on its way! Track it here: {{tracking_url}}";
  const fields = [
    { key: "first_name", sample: "Aarav" },
    { key: "order_id", sample: "ORD-21841" },
    { key: "tracking_url", sample: "wnxt.in/t/21841" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PanelCard title="Message preview">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {/* Phone frame */}
          <div className="relative h-[420px] w-[230px] shrink-0 rounded-[28px] border-[6px] border-[#111827] bg-[#0B1220] p-2 shadow-xl">
            <div className="absolute left-1/2 top-1.5 h-3 w-16 -translate-x-1/2 rounded-full bg-[#111827]" />
            <div className="flex h-full w-full flex-col gap-2 overflow-hidden rounded-[20px] bg-[#ECE5DD] p-2 pt-6">
              <div className="self-start rounded-[14px] rounded-tl-[4px] bg-white px-3 py-2 text-[12px] text-[#111827] shadow-sm">
                {body}
              </div>
              <div className="mt-auto self-end rounded-[14px] rounded-br-[4px] bg-[#DCF8C6] px-3 py-2 text-[12px] text-[#111827] shadow-sm">
                Thanks! 👍
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="flex-1">
            <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-muted">Template fields</h3>
            <div className="overflow-hidden rounded-[8px] border border-[#E5E7EB]">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#F9FAFB] text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                  <tr>
                    <th className="px-3 py-2">Variable</th>
                    <th className="px-3 py-2">Sample value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {fields.map((f) => (
                    <tr key={f.key} className="text-ink-heading">
                      <td className="px-3 py-2 font-mono text-[12px] text-emerald-600">{`{{${f.key}}}`}</td>
                      <td className="px-3 py-2 font-medium">{f.sample}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PanelCard>

      <PanelCard title="A/B variants">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <VariantCard label="Variant A" winner copy={body} ctr="3.2%" />
          <VariantCard
            label="Variant B"
            copy={"Quick update {{first_name}} — your package ships today. Track: {{tracking_url}}"}
            ctr="2.8%"
          />
        </div>
      </PanelCard>
    </div>
  );
}

function VariantCard({ label, copy, ctr, winner }) {
  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
        {winner && (
          <span className="inline-flex items-center rounded-pill bg-success-bg px-2 py-0.5 text-[10px] font-semibold text-success">
            Winner
          </span>
        )}
      </div>
      <p className="text-[13px] text-ink-heading">{copy}</p>
      <div className="mt-1 flex items-center gap-2 text-[12px] font-medium text-ink-muted">
        <span>CTR</span>
        <span className="font-semibold text-ink-heading">{ctr}</span>
      </div>
    </div>
  );
}

function LogsPanel() {
  return (
    <PanelCard title="Recent send events">
      <div className="overflow-hidden rounded-[8px] border border-[#E5E7EB]">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-[#F9FAFB] text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-3 py-2">Timestamp</th>
              <th className="px-3 py-2">Recipient</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {LOG_ROWS.map((r) => (
              <tr key={r.ts + r.phone} className="text-ink-heading">
                <td className="px-3 py-2 font-mono text-[12px] text-ink-muted">{r.ts}</td>
                <td className="px-3 py-2 font-medium">{r.phone}</td>
                <td className="px-3 py-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-pill border px-2 py-0.5 text-[11px] font-semibold capitalize",
                      LOG_STATUS_TINT[r.status] ?? "border-line bg-canvas text-ink-muted",
                    ].join(" ")}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelCard>
  );
}

function InsightsRail() {
  return (
    <aside className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-fit">
      <header className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-emerald-50">
          <Sparkles size={14} className="text-emerald-600" strokeWidth={1.75} />
        </span>
        <h2 className="text-[14px] font-semibold text-ink-heading">Insights</h2>
      </header>
      <ul className="flex flex-col gap-3">
        {INSIGHTS.map((t, i) => (
          <li key={i} className="flex items-start gap-2">
            <Sparkles size={12} className="mt-1 text-emerald-500" strokeWidth={2} />
            <p className="text-[13px] leading-relaxed text-ink-heading">{t}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
