import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  Copy,
  FlaskConical,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Sparkles,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import Sparkline from "../ads/Sparkline.jsx";
import { statusOf } from "./data.js";

const MOCK_ERROR_LOG = [
  { id: "e1", timestamp: "2026-06-09 14:32:11", reason: "WhatsApp template rejected by Meta" },
  { id: "e2", timestamp: "2026-06-09 11:08:44", reason: "Contact unsubscribed mid-flow" },
  { id: "e3", timestamp: "2026-06-08 22:14:09", reason: "Webhook timeout after 30s" },
  { id: "e4", timestamp: "2026-06-08 17:51:33", reason: "Invalid phone number format" },
  { id: "e5", timestamp: "2026-06-08 09:02:50", reason: "Rate limit exceeded on WhatsApp API" },
  { id: "e6", timestamp: "2026-06-07 20:46:18", reason: "Template variable {{name}} missing" },
];

function DropdownMenu({ open, onClose, anchor = "right", items }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className={`absolute ${anchor === "right" ? "right-0" : "left-0"} top-full mt-1 z-20 w-44 rounded-[8px] border border-[#E5E7EB] bg-white p-1 shadow-lg`}>
        {items.map((it, i) => it === "divider" ? (
          <div key={i} className="my-1 h-px bg-[#F3F4F6]" />
        ) : (
          <button
            key={i}
            type="button"
            onClick={(e) => { e.stopPropagation(); it.onClick?.(); onClose(); }}
            className={`flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-[12px] font-medium ${it.danger ? "text-red-600 hover:bg-red-50" : "text-[#374151] hover:bg-[#F3F4F6]"}`}
          >
            {it.icon}{it.label}
          </button>
        ))}
      </div>
    </>
  );
}

const TABS = [
  { id: "performance", label: "Performance" },
  { id: "activity",    label: "Recent Activity" },
  { id: "errors",      label: "Errors" },
  { id: "settings",    label: "Settings" },
];

export default function AutomationDetailPage({ automation: a, onBack, onEdit }) {
  const [tab, setTab] = useState("performance");
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [errorLogOpen, setErrorLogOpen] = useState(false);
  const pill = statusOf(a);

  const headerMenuItems = [
    { label: "Edit",      icon: <Pencil size={12} />,        onClick: () => onEdit?.() },
    { label: "Duplicate", icon: <Copy size={12} />,          onClick: () => {} },
    { label: "Test",      icon: <FlaskConical size={12} />,  onClick: () => {} },
    "divider",
    { label: "Delete",    icon: <Trash2 size={12} />,        danger: true, onClick: () => {} },
  ];

  return (
    <div className="flex flex-col gap-10">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} aria-label="Back" className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white text-ink-body hover:bg-surface-subtle">
            <ChevronLeft size={16} />
          </button>
          <span className="text-[24px]">{a.icon}</span>
          <h1 className="text-[20px] font-semibold text-ink-heading">{a.name}</h1>
          <span className={["inline-flex h-7 items-center gap-1.5 rounded-pill px-2.5 text-[11px] font-semibold", pill.bg, pill.text].join(" ")}>
            <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
            {pill.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              aria-label="More"
              onClick={() => setHeaderMenuOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white text-ink-muted hover:bg-surface-subtle"
            >
              <MoreHorizontal size={14} />
            </button>
            <DropdownMenu
              open={headerMenuOpen}
              onClose={() => setHeaderMenuOpen(false)}
              anchor="right"
              items={headerMenuItems}
            />
          </div>
          <button type="button" onClick={onEdit} className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90">
            <Pencil size={12} /> Edit Flow
          </button>
        </div>
      </header>

      <Hero a={a} />
      <StatRow a={a} onViewErrorLog={() => setErrorLogOpen(true)} />

      <div className="flex flex-col gap-6">
        <Tabs tab={tab} onChange={setTab} />
        {tab === "performance" && <PerformanceTab a={a} />}
        {tab === "activity"    && <ActivityTab a={a} />}
        {tab === "errors"      && <ErrorsTab a={a} />}
        {tab === "settings"    && <SettingsTabBody a={a} />}
      </div>

      {errorLogOpen && <ErrorLogModal onClose={() => setErrorLogOpen(false)} />}
    </div>
  );
}

function ErrorLogModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-[14px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3.5">
          <h2 className="text-[15px] font-semibold text-[#0F172A]">Error log</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[420px] overflow-y-auto px-5 py-5">
          <ul className="flex flex-col gap-2">
            {MOCK_ERROR_LOG.map((row) => (
              <li
                key={row.id}
                className="flex items-start justify-between gap-3 rounded-[8px] border border-[#E5E7EB] bg-white p-3"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#6A7282]">
                    <AlertTriangle size={11} className="text-red-500" />
                    {row.timestamp}
                  </span>
                  <span className="text-[12px] font-semibold text-[#0F172A]">{row.reason}</span>
                </div>
                <button
                  type="button"
                  className="inline-flex h-7 shrink-0 items-center gap-1 rounded-[6px] border border-[#E5E7EB] bg-white px-2.5 text-[11px] font-medium text-[#374151] hover:bg-[#F3F4F6]"
                >
                  <RefreshCw size={11} /> Retry
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Hero + stats (unchanged) ──────────── */

function Hero({ a }) {
  return (
    <section className="flex items-center justify-center text-center">
      <div className="flex flex-col gap-1.5">
        <span className="text-[36px] font-semibold leading-none text-ink-heading">
          {a.completed.toLocaleString()} contacts have completed this flow
        </span>
        <span className="text-[14px] font-medium text-ink-muted">
          {a.successRate}% success rate · {a.inProgress} currently in progress
        </span>
      </div>
    </section>
  );
}

function StatRow({ a, onViewErrorLog }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Stat label="Runs (this month)"      value={a.runsThisMonth.toLocaleString()} sparkData={a.series} />
      <Stat label="Currently in flow"      value={a.inProgress.toLocaleString()} />
      <Stat label="Completed (this month)" value={a.completed.toLocaleString()} />
      <Stat label="Errors"                 value={a.errors.toString()} sub={a.errors > 0 ? "View error log →" : "No errors"} subColor={a.errors > 0 ? "text-danger" : "text-ink-muted"} subOnClick={a.errors > 0 ? onViewErrorLog : undefined} />
    </div>
  );
}

function Stat({ label, value, sub, subColor, sparkData, subOnClick }) {
  return (
    <article className="flex flex-col gap-1.5 rounded-md border border-line bg-white p-5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-[24px] font-semibold leading-none text-ink-heading">{value}</span>
        {sparkData && sparkData.length > 0 && <Sparkline data={sparkData} width={70} height={32} />}
      </div>
      {sub && (subOnClick ? (
        <button type="button" onClick={subOnClick} className={["text-left text-[11px] font-medium hover:underline", subColor ?? "text-ink-muted"].join(" ")}>{sub}</button>
      ) : (
        <span className={["text-[11px] font-medium", subColor ?? "text-ink-muted"].join(" ")}>{sub}</span>
      ))}
    </article>
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
            key={t.id} type="button" onClick={() => onChange(t.id)}
            className={["-mb-px border-b-2 px-4 py-3 text-[13px] font-semibold transition-colors", active ? "border-brand-emerald text-brand-emerald" : "border-transparent text-ink-muted hover:text-ink-heading"].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ──────────── Performance tab ──────────── */

function PerformanceTab({ a }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-5">
        <ConversionFunnel a={a} />
        <TriggerVolumeCard a={a} />
      </div>
      <AIInsights a={a} />
    </div>
  );
}

function ConversionFunnel({ a }) {
  const flow = a.flow ?? [];
  const initial = flow[0]?.count ?? a.runsThisMonth ?? 1;
  return (
    <article className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
      <header className="flex flex-col gap-0.5">
        <h3 className="text-[14px] font-semibold text-ink-heading">Conversion funnel</h3>
        <p className="text-[12px] font-medium text-ink-muted">How many contacts make it through each step.</p>
      </header>
      {flow.length === 0 ? (
        <p className="text-[12px] font-medium text-ink-muted">No flow data yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {flow.map((step, i) => {
            if (step.kind === "branch" && step.branches) {
              return (
                <li key={step.id} className="flex flex-col gap-1.5">
                  <FunnelRow label={step.title} count={step.branches.reduce((s, b) => s + b.count, 0)} initial={initial} />
                  <div className="flex flex-col gap-1 pl-4">
                    {step.branches.map((b) => (
                      <FunnelRow key={b.label} label={`• ${b.label}`} count={b.count} initial={initial} compact />
                    ))}
                  </div>
                </li>
              );
            }
            const prev = flow[i - 1];
            const prevCount = prev?.kind === "branch" ? prev.branches?.[0]?.count ?? prev.count : prev?.count ?? initial;
            const dropOff = prev && prevCount > 0 ? Math.round(((prevCount - (step.count ?? 0)) / prevCount) * 100) : 0;
            const warn = i > 0 && dropOff > 10;
            return (
              <li key={step.id}>
                <FunnelRow label={step.title} count={step.count ?? 0} initial={initial} warn={warn} />
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}

function FunnelRow({ label, count, initial, warn, compact }) {
  const pct = initial > 0 ? Math.round((count / initial) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className={["w-[180px] truncate", compact ? "text-[11px] font-medium text-ink-muted" : "text-[12px] font-medium text-ink-heading"].join(" ")}>{label}</span>
      <div className="flex-1 overflow-hidden rounded-pill bg-surface-muted">
        <span
          className={["block h-2 rounded-pill", warn ? "bg-warning" : "bg-brand-emerald"].join(" ")}
          style={{ width: `${Math.max(2, pct)}%` }}
        />
      </div>
      <span className="w-20 text-right text-[11px] font-medium text-ink-body">{count.toLocaleString()} <span className="text-ink-muted">({pct}%)</span></span>
    </div>
  );
}

function TriggerVolumeCard({ a }) {
  const [range, setRange] = useState("30d");
  const data = a.series ?? [];
  return (
    <article className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[14px] font-semibold text-ink-heading">Trigger volume</h3>
          <p className="text-[12px] font-medium text-ink-muted">How often this automation runs.</p>
        </div>
        <div className="inline-flex h-8 rounded-md border border-line bg-white p-0.5">
          {["7d", "30d", "90d"].map((r) => (
            <button
              key={r} type="button" onClick={() => setRange(r)}
              className={["h-7 rounded-sm px-2.5 text-[11px] font-medium", range === r ? "bg-brand-50 text-brand-emerald" : "text-ink-muted"].join(" ")}
            >
              {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "90 days"}
            </button>
          ))}
        </div>
      </header>
      <div className="flex h-[160px] items-end">
        {data.length > 0 ? (
          <Sparkline data={data} width={520} height={150} />
        ) : (
          <p className="text-[12px] font-medium text-ink-muted">No trigger data yet.</p>
        )}
      </div>
    </article>
  );
}

function AIInsights({ a }) {
  const insights = a.insights ?? [];
  const enoughData = (a.runsThisMonth ?? 0) >= 50;
  if (!enoughData) {
    return (
      <article className="flex flex-col items-center gap-2 rounded-md border border-dashed border-line bg-canvas px-6 py-8 text-center">
        <Sparkles size={18} className="text-ink-subtle" />
        <p className="text-[12px] font-medium text-ink-muted">Run more to unlock insights — at least 50 runs needed.</p>
      </article>
    );
  }
  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center gap-2">
        <Sparkles size={16} className="text-brand-emerald" />
        <h3 className="text-[14px] font-semibold text-ink-heading">Insights from your data</h3>
      </header>
      <div className="grid grid-cols-3 gap-3">
        {insights.map((s, i) => (
          <article key={i} className="flex flex-col gap-2 rounded-md border-l-4 border-brand-emerald bg-brand-50/30 p-4">
            <p className="text-[12px] leading-relaxed text-ink-body">{s}</p>
            <div className="mt-auto">
              <button type="button" className="inline-flex h-8 items-center rounded-button bg-brand-emerald px-3 text-[11px] font-semibold text-white">
                {i === 0 ? "✓ Acknowledged" : i === 1 ? "Apply" : "View pattern"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ──────────── Recent Activity tab ──────────── */

const SAMPLE_RUNS = [
  { id: "r1", name: "Priya Sharma",   email: "priya@example.com",  phone: "+91 98765 43210", state: "in_progress", currentStep: 4, totalSteps: 7, currentLabel: "Send WhatsApp: Follow-up", started: "2 hours ago",   lastAction: "30 minutes ago" },
  { id: "r2", name: "Rahul Verma",    email: "rahul@flexlabs.com", phone: "+91 98765 12345", state: "completed",   currentStep: 7, totalSteps: 7, currentLabel: "Goal: Engaged",            started: "5 hours ago",  duration: "4h 32m" },
  { id: "r3", name: "Aisha Khan",     email: "aisha@northstar.io", phone: "+91 98213 11102", state: "errored",     currentStep: 3, totalSteps: 7, currentLabel: "Send WhatsApp: Welcome",   started: "yesterday",    error: "WhatsApp template rejected" },
  { id: "r4", name: "Karthik Rao",    email: "k@orbital.app",      phone: "+91 90215 76543", state: "completed",   currentStep: 7, totalSteps: 7, currentLabel: "Goal: Engaged",            started: "yesterday",    duration: "5h 12m" },
  { id: "r5", name: "Manoj Pillai",   email: "manoj@arclight.co",  phone: "+91 98330 12233", state: "in_progress", currentStep: 2, totalSteps: 7, currentLabel: "Wait 5 minutes",           started: "1 hour ago",   lastAction: "1 hour ago" },
];

function ActivityTab({ a }) {
  const [filter, setFilter] = useState("all");
  const items = SAMPLE_RUNS.filter((r) => filter === "all" || r.state === filter);
  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-[15px] font-semibold text-ink-heading">Recent runs</h2>
        <p className="text-[12px] font-medium text-ink-muted">Contacts who entered this automation.</p>
      </header>
      <div className="flex items-center gap-1.5">
        {[
          { id: "all",         label: "All" },
          { id: "in_progress", label: "In progress" },
          { id: "completed",   label: "Completed" },
          { id: "errored",     label: "Errored" },
        ].map((f) => {
          const active = filter === f.id;
          return (
            <button key={f.id} type="button" onClick={() => setFilter(f.id)}
              className={["inline-flex h-9 items-center rounded-full border px-4 text-[12px] font-medium transition-colors", active ? "border-brand-emerald bg-brand-50 text-brand-emerald" : "border-line bg-white text-ink-muted hover:bg-surface-subtle"].join(" ")}>
              {f.label}
            </button>
          );
        })}
      </div>
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-line bg-canvas px-6 py-8 text-center text-[12px] font-medium text-ink-muted">No runs match this filter.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((r) => <RunCard key={r.id} run={r} />)}
        </ul>
      )}
      <button type="button" className="inline-flex h-9 self-center rounded-button border border-line bg-white px-4 text-[12px] font-medium text-ink-body hover:bg-surface-subtle">
        Load more
      </button>
    </div>
  );
}

function RunCard({ run }) {
  return (
    <article className="flex items-start gap-3 rounded-md border border-line bg-white p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[12px] font-semibold text-brand-emerald">
        {run.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-ink-heading">{run.name}</span>
            <span className="text-[11px] font-medium text-ink-muted">{run.email} · {run.phone}</span>
          </div>
          <span className="text-[11px] font-medium text-ink-muted">
            {run.state === "completed" ? `Completed ${run.started} in ${run.duration}` :
             run.state === "errored"   ? `Failed ${run.started}` :
             `Started ${run.started}`}
          </span>
        </div>
        <ProgressDots current={run.currentStep} total={run.totalSteps} state={run.state} />
        <div className="flex items-center justify-between gap-3 text-[11px] font-medium text-ink-muted">
          <span>
            {run.state === "completed" ? "All steps completed" :
             run.state === "errored"   ? `Failed at step ${run.currentStep}: ${run.error}` :
             `Currently at step ${run.currentStep}: ${run.currentLabel}`}
          </span>
          {run.state === "errored" ? (
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex h-7 items-center gap-1 rounded-button border border-line bg-white px-3 text-[11px] font-medium text-ink-body hover:bg-surface-subtle">
                <RefreshCw size={11} /> Retry
              </button>
              <button type="button" className="text-[11px] font-semibold text-brand-emerald hover:underline">View error</button>
            </div>
          ) : (
            <button type="button" className="text-[11px] font-semibold text-brand-emerald hover:underline">View flow →</button>
          )}
        </div>
      </div>
    </article>
  );
}

function ProgressDots({ current, total, state }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const completed = idx < current || (state === "completed");
        const isCurrent = idx === current && state !== "completed";
        const errored = state === "errored" && idx === current;
        const cls =
          errored   ? "h-2 w-2 rounded-full bg-danger" :
          isCurrent ? "h-2.5 w-2.5 rounded-full bg-brand-emerald" :
          completed ? "h-2 w-2 rounded-full bg-brand-emerald" :
          "h-2 w-2 rounded-full border border-line bg-white";
        return <span key={i} aria-hidden className={cls} />;
      })}
    </div>
  );
}

/* ──────────── Errors tab ──────────── */

function ErrorsTab({ a }) {
  if ((a.errors ?? 0) === 0) {
    return (
      <section className="flex flex-col items-center gap-2 rounded-md border border-dashed border-line bg-canvas px-6 py-12 text-center">
        <h2 className="text-[14px] font-semibold text-ink-heading">No errors</h2>
        <p className="text-[12px] font-medium text-ink-muted">This automation is running smoothly.</p>
      </section>
    );
  }
  const groups = [
    {
      reason: a.errorReason ?? "WhatsApp template rejected by Meta",
      affected: Math.max(1, Math.round(a.errors / 2)),
      contacts: SAMPLE_RUNS.filter((r) => r.state === "errored").slice(0, 3),
      fix: "Update your template and resubmit for approval.",
      fixLabel: "Edit template →",
    },
    {
      reason: "Contact unsubscribed mid-flow",
      affected: a.errors - Math.max(1, Math.round(a.errors / 2)),
      contacts: [],
      fix: "Honor opt-outs by adding an unsubscribe step earlier in the flow.",
      fixLabel: "Edit flow →",
    },
  ].filter((g) => g.affected > 0);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-[15px] font-semibold text-ink-heading">Errors</h2>
        <p className="text-[12px] font-medium text-ink-muted">Runs that failed and why.</p>
      </header>
      {groups.map((g) => (
        <article key={g.reason} className="flex flex-col gap-3 rounded-md border-l-4 border-danger bg-danger-bg/30 p-4">
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-danger" />
              <span className="text-[13px] font-semibold text-ink-heading">{g.reason}</span>
              <span className="text-[11px] font-medium text-ink-muted">{g.affected} affected</span>
            </div>
            <button type="button" className="inline-flex h-8 items-center rounded-button border border-line bg-white px-3 text-[11px] font-medium text-ink-body hover:bg-surface-subtle">
              Retry all
            </button>
          </header>
          {g.contacts.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {g.contacts.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 rounded-sm border border-line bg-white px-3 py-2 text-[12px]">
                  <span className="text-ink-heading">{c.name}<span className="ml-2 text-ink-muted">· failed at step {c.currentStep} · {c.started}</span></span>
                  <button type="button" className="inline-flex h-7 items-center gap-1 rounded-button border border-line bg-white px-2.5 text-[11px] font-medium text-ink-body hover:bg-surface-subtle">
                    <RefreshCw size={11} /> Retry
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between gap-3 border-t border-line pt-3 text-[12px] text-ink-muted">
            <span>Common fix: {g.fix}</span>
            <button type="button" className="text-[11px] font-semibold text-brand-emerald hover:underline">{g.fixLabel}</button>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ──────────── Settings tab ──────────── */

function SettingsTabBody({ a }) {
  return (
    <div className="flex flex-col gap-5">
      <SettingsSection heading="General">
        <Row label="Automation name"><input type="text" defaultValue={a.name} className="h-9 w-full rounded-sm border border-line bg-white px-3 text-[13px]" /></Row>
        <Row label="Description"><textarea defaultValue={a.description} className="min-h-[60px] w-full resize-y rounded-sm border border-line bg-white px-3 py-2 text-[13px]" /></Row>
        <Row label="Folder">
          <select className="h-9 w-full rounded-sm border border-line bg-white px-3 text-[13px]">
            <option>None</option><option>Lead nurture</option><option>Sales</option><option>Customer service</option>
          </select>
        </Row>
        <Row label="Tags">
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex h-6 items-center rounded-pill bg-brand-50 px-2 text-[11px] font-semibold text-brand-emerald">Engaged</span>
            <span className="inline-flex h-6 items-center rounded-pill bg-surface-muted px-2 text-[11px] font-semibold text-ink-muted">+ Add tag</span>
          </div>
        </Row>
      </SettingsSection>

      <SettingsSection heading="Notifications">
        <Row label="Alert me when error rate exceeds">
          <div className="flex items-center gap-2">
            <input type="number" defaultValue={5} className="h-9 w-20 rounded-sm border border-line bg-white px-3 text-[13px]" />
            <span className="text-[12px] text-ink-muted">%</span>
          </div>
        </Row>
        <Row label="Notify on first run"><span className="text-[12px] text-ink-muted">Toggle</span></Row>
        <Row label="Daily summary email"><span className="text-[12px] text-ink-muted">Toggle</span></Row>
      </SettingsSection>

      <SettingsSection heading="Permissions">
        <Row label="Who can edit">
          <select className="h-9 rounded-sm border border-line bg-white px-3 text-[13px]">
            <option>Just me</option><option>Team admins</option><option>All team members</option>
          </select>
        </Row>
        <Row label="Who can pause">
          <select className="h-9 rounded-sm border border-line bg-white px-3 text-[13px]">
            <option>Just me</option><option>Team admins</option><option>All team members</option>
          </select>
        </Row>
      </SettingsSection>

      <DangerZone />
    </div>
  );
}

function SettingsSection({ heading, children }) {
  return (
    <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
      <h3 className="text-[14px] font-semibold text-ink-heading">{heading}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="w-48 shrink-0 pt-1.5 text-[12px] font-semibold text-ink-heading">{label}</span>
      <div className="flex flex-1 items-center">{children}</div>
    </div>
  );
}

function DangerZone() {
  return (
    <section className="flex flex-col gap-3 rounded-md border border-danger-border bg-danger-bg/30 p-5">
      <header className="flex flex-col gap-0.5">
        <h3 className="text-[14px] font-semibold text-danger">Danger zone</h3>
        <p className="text-[12px] font-medium text-ink-muted">Irreversible actions on this automation.</p>
      </header>
      <div className="flex flex-col gap-2">
        <DangerRow title="Pause automation" body="Soft pause — current contacts continue running.">
          <button type="button" className="inline-flex h-9 items-center rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle">
            Pause
          </button>
        </DangerRow>
        <DangerRow title="Stop automation" body="Hard stop — all contacts removed from this flow.">
          <button type="button" className="inline-flex h-9 items-center rounded-button border border-warning bg-white px-3 text-[12px] font-semibold text-warning hover:bg-warning-bg/40">
            Stop
          </button>
        </DangerRow>
        <DangerRow title="Delete automation" body="Permanently delete this automation and its history.">
          <button type="button" className="inline-flex h-9 items-center rounded-button bg-danger px-3 text-[12px] font-semibold text-white hover:opacity-90">
            Delete
          </button>
        </DangerRow>
      </div>
    </section>
  );
}

function DangerRow({ title, body, children }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-sm border border-line bg-white p-3">
      <div className="flex flex-col">
        <span className="text-[13px] font-semibold text-ink-heading">{title}</span>
        <span className="text-[11px] font-medium text-ink-muted">{body}</span>
      </div>
      {children}
    </div>
  );
}
