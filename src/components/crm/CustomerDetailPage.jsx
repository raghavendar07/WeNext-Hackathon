import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Send,
  Sparkles,
  Tag,
  User,
  Zap,
} from "lucide-react";
import Avatar from "../inbox/Avatar.jsx";

const TABS = [
  { id: "overview",      label: "Overview" },
  { id: "orders",        label: "Orders" },
  { id: "conversations", label: "Conversations" },
  { id: "notes",         label: "Notes" },
  { id: "activity",      label: "Activity" },
];

const LIFECYCLE = {
  champion: { label: "Champion", bg: "bg-success-bg", text: "text-success" },
  active:   { label: "Active",   bg: "bg-info-bg",    text: "text-info" },
  new:      { label: "New",      bg: "bg-brand-50",   text: "text-brand-emerald" },
  "at-risk": { label: "At Risk", bg: "bg-danger-bg",  text: "text-danger" },
};

const MOCK_ORDERS = [
  { id: "#ORD-10481", date: "Jun 2, 2026",  items: "Linen shirt × 2, Slim jeans × 1", total: 248,  status: "Delivered"  },
  { id: "#ORD-10402", date: "May 18, 2026", items: "Cashmere scarf × 1",              total: 129,  status: "Delivered"  },
  { id: "#ORD-10310", date: "Apr 27, 2026", items: "Wool coat × 1, Leather belt × 1", total: 612,  status: "Delivered"  },
  { id: "#ORD-10221", date: "Apr 04, 2026", items: "Sneakers × 1",                    total: 184,  status: "Refunded"   },
  { id: "#ORD-10119", date: "Mar 12, 2026", items: "Hoodie × 2, Cap × 1",             total: 156,  status: "Delivered"  },
];

const MOCK_CONVERSATIONS = [
  { id: "c1", channel: "WhatsApp",  snippet: "Thanks! The coat fit perfectly.",         at: "2 days ago" },
  { id: "c2", channel: "Instagram", snippet: "Do you have this scarf in navy?",         at: "1 week ago" },
  { id: "c3", channel: "Email",     snippet: "Re: Your order has shipped",              at: "2 weeks ago" },
  { id: "c4", channel: "WhatsApp",  snippet: "Loved the recommendations from Aisha.",   at: "1 month ago" },
];

const MOCK_NOTES = [
  { id: "n1", author: "Aisha K.",   at: "Jun 1, 2026",  body: "Prefers linen and cotton. Allergic to wool blends — keep this flagged." },
  { id: "n2", author: "Rahul V.",   at: "May 19, 2026", body: "Asked about the loyalty tier upgrade. Eligible for Gold at next purchase." },
  { id: "n3", author: "Priya M.",   at: "Apr 28, 2026", body: "Returned the sneakers — sizing ran small. Reorder a half size up next time." },
];

const MOCK_ACTIVITY = [
  { id: "ev1", at: "Today, 9:14 AM",   text: "Last login from iOS app",          dot: "bg-info"          },
  { id: "ev2", at: "Jun 2, 2026",      text: "Order #ORD-10481 placed ($248)",   dot: "bg-success"       },
  { id: "ev3", at: "May 24, 2026",     text: "Tag added: 'VIP'",                 dot: "bg-brand-emerald" },
  { id: "ev4", at: "May 02, 2026",     text: "Support ticket #4419 resolved",    dot: "bg-warning"       },
  { id: "ev5", at: "Mar 12, 2026",     text: "First order placed ($156)",        dot: "bg-success"       },
  { id: "ev6", at: "Feb 28, 2026",     text: "Account created via Website",      dot: "bg-ink-muted"     },
];

const SUGGESTED_ACTIONS = [
  { id: "s1", title: "Send 'Welcome to Gold' upgrade message",       sub: "Customer is one purchase away from upgrading." },
  { id: "s2", title: "Recommend matching linen pants",               sub: "Frequently bought together with last order." },
  { id: "s3", title: "Schedule a 30-day check-in",                   sub: "Champions respond well to personal outreach." },
];

export default function CustomerDetailPage({ customer, onBack }) {
  const [tab, setTab] = useState("overview");
  const [note, setNote] = useState("");
  const [toast, setToast] = useState(null);

  if (!customer) return null;

  const life = LIFECYCLE[customer.lifecycle] ?? LIFECYCLE.active;
  const totalOrders = MOCK_ORDERS.length;
  const lastOrder = MOCK_ORDERS[0]?.date ?? "—";

  const fireToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to customers"
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <ArrowLeft size={14} />
            Customers
          </button>
          <div className="flex items-center gap-3">
            <Avatar name={customer.name} palette={customer.palette} size={44} />
            <div className="flex flex-col">
              <span className="text-[18px] font-semibold text-ink-heading">{customer.name}</span>
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "inline-flex h-5 items-center rounded-pill px-2 text-[11px] font-semibold",
                    life.bg,
                    life.text,
                  ].join(" ")}
                >
                  {life.label}
                </span>
                <span className="inline-flex h-5 items-center rounded-pill bg-brand-50 px-2 text-[11px] font-semibold text-brand-emerald">
                  Gold tier
                </span>
                <span className="text-[12px] font-medium text-ink-muted">· Customer since Feb 2026</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fireToast("WhatsApp opened (mock)")}
            className="inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
          >
            <MessageCircle size={14} strokeWidth={2} />
            Send WhatsApp
          </button>
          <button
            type="button"
            onClick={() => fireToast("Email composer opened (mock)")}
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <Mail size={14} strokeWidth={1.75} />
            Send Email
          </button>
          <button
            type="button"
            aria-label="More actions"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white text-ink-muted hover:bg-surface-subtle"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <Metric label="Lifetime value" value={`$${customer.ltv.toLocaleString()}`} sub="+12% vs last quarter" tone="success" />
        <Metric label="Total orders"   value={totalOrders}                          sub="Across 4 months" />
        <Metric label="Last order"     value={lastOrder}                            sub={`$${MOCK_ORDERS[0].total} · ${MOCK_ORDERS[0].status}`} />
        <Metric label="NPS"            value="9"                                    sub="Promoter" tone="brand" />
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-5">
          <Tabs tab={tab} onChange={setTab} />

          {tab === "overview" && <OverviewTab customer={customer} />}
          {tab === "orders" && <OrdersTab />}
          {tab === "conversations" && <ConversationsTab />}
          {tab === "notes" && (
            <NotesTab
              note={note}
              onNoteChange={setNote}
              onSave={() => {
                fireToast("Note saved (mock)");
                setNote("");
              }}
            />
          )}
          {tab === "activity" && <ActivityTab />}
        </div>

        <aside className="flex flex-col gap-5">
          <ScoreCard score={87} />
          <SuggestedActionsCard onAction={(t) => fireToast(`${t} (mock)`)} />
        </aside>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-[8px] bg-[#111827] px-3 py-2 text-[12px] font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ──────────── Metric tile ──────────── */
function Metric({ label, value, sub, tone }) {
  const subTone =
    tone === "success" ? "text-success" :
    tone === "brand"   ? "text-brand-emerald" :
    "text-ink-muted";
  return (
    <div className="flex h-24 flex-col justify-between rounded-xl border border-line bg-white p-5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</span>
      <span className="text-[22px] font-semibold leading-none text-ink-heading">{value}</span>
      {sub && <span className={["text-[12px] font-medium", subTone].join(" ")}>{sub}</span>}
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

/* ──────────── Tabs: Overview ──────────── */
function OverviewTab({ customer }) {
  const firstName = customer.name.split(" ")[0];
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
        <h3 className="text-[14px] font-semibold text-ink-heading">Contact details</h3>
        <div className="flex flex-col gap-2">
          <Row icon={Mail}   label="Email"   value={customer.email} />
          <Row icon={Phone}  label="Phone"   value={`+91 9${Math.abs(hashCode(customer.id)) % 1_000_000_00}`.slice(0, 14)} />
          <Row icon={MapPin} label="Address" value="14 Linking Road, Bandra West, Mumbai 400050" />
          <Row icon={User}   label="Source"  value="Website signup" />
          <Row icon={Tag}    label="Tags"    value="VIP · Returning · Loyalty Gold" />
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
        <h3 className="text-[14px] font-semibold text-ink-heading">About</h3>
        <p className="text-[13px] leading-relaxed text-ink-body">
          {firstName} is one of our top recurring buyers in the metro region. Prefers minimalist staples
          and seasonal capsule drops. Engages most strongly with WhatsApp broadcasts that include a single
          product photo and a short stylist note. Birthday is in late September — used for an annual
          early-access invite.
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
        <h3 className="text-[14px] font-semibold text-ink-heading">Assigned owner</h3>
        <div className="flex items-center gap-3">
          <Avatar name="Aisha K." palette="pink" size={36} />
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-ink-heading">Aisha K.</span>
            <span className="text-[11px] font-medium text-ink-muted">Account manager · Mumbai</span>
          </div>
          <button
            type="button"
            className="ml-auto inline-flex h-8 items-center rounded-sm border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Reassign
          </button>
        </div>
      </section>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-sm border border-line bg-canvas px-3 py-2">
      <Icon size={14} className="text-ink-muted" strokeWidth={1.75} />
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-ink-muted">{label}</span>
        <span className="truncate text-[12px] font-semibold text-ink-heading">{value}</span>
      </div>
    </div>
  );
}

/* ──────────── Tabs: Orders ──────────── */
function OrdersTab() {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="border-b border-line bg-canvas text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            <Th>Order</Th>
            <Th>Date</Th>
            <Th>Items</Th>
            <Th>Total</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {MOCK_ORDERS.map((o) => {
            const tone =
              o.status === "Delivered" ? { bg: "bg-success-bg", text: "text-success" } :
              o.status === "Refunded"  ? { bg: "bg-danger-bg",  text: "text-danger" } :
                                         { bg: "bg-info-bg",    text: "text-info" };
            return (
              <tr key={o.id} className="border-b border-line last:border-0 hover:bg-surface-subtle">
                <Td><span className="text-[13px] font-semibold text-ink-heading">{o.id}</span></Td>
                <Td><span className="text-[12px] font-medium text-ink-body">{o.date}</span></Td>
                <Td><span className="text-[12px] font-medium text-ink-body">{o.items}</span></Td>
                <Td><span className="text-[13px] font-semibold text-ink-heading">${o.total}</span></Td>
                <Td>
                  <span className={["inline-flex items-center rounded-pill px-2 py-0.5 text-[10px] font-semibold", tone.bg, tone.text].join(" ")}>
                    {o.status}
                  </span>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

/* ──────────── Tabs: Conversations ──────────── */
function ConversationsTab() {
  return (
    <section className="flex flex-col gap-2">
      {MOCK_CONVERSATIONS.map((c) => (
        <article key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-4 hover:bg-surface-subtle">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-5 items-center rounded-pill bg-brand-50 px-2 text-[10px] font-semibold text-brand-emerald">
                {c.channel}
              </span>
              <span className="text-[11px] font-medium text-ink-muted">{c.at}</span>
            </div>
            <p className="truncate text-[13px] font-medium text-ink-heading">{c.snippet}</p>
          </div>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Open
          </button>
        </article>
      ))}
    </section>
  );
}

/* ──────────── Tabs: Notes ──────────── */
function NotesTab({ note, onNoteChange, onSave }) {
  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-2 rounded-xl border border-line bg-white p-5">
        <h3 className="text-[14px] font-semibold text-ink-heading">Add a note</h3>
        <textarea
          rows={4}
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Write a note about this customer..."
          className="w-full resize-none rounded-sm border border-line bg-white p-3 text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-9 items-center justify-center self-end rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
        >
          Save note
        </button>
      </section>

      <section className="flex flex-col gap-2">
        {MOCK_NOTES.map((n) => (
          <article key={n.id} className="flex flex-col gap-2 rounded-xl border border-line bg-white p-4">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name={n.author} size={24} />
                <span className="text-[12px] font-semibold text-ink-heading">{n.author}</span>
              </div>
              <span className="text-[11px] font-medium text-ink-muted">{n.at}</span>
            </header>
            <p className="text-[13px] leading-relaxed text-ink-body">{n.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

/* ──────────── Tabs: Activity ──────────── */
function ActivityTab() {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <ul className="flex flex-col gap-4">
        {MOCK_ACTIVITY.map((e, i) => (
          <li key={e.id} className="relative flex gap-3 pl-2">
            <div className="flex flex-col items-center">
              <span className={["h-2.5 w-2.5 shrink-0 rounded-full", e.dot].join(" ")} />
              {i < MOCK_ACTIVITY.length - 1 && (
                <span className="mt-1 h-full w-px flex-1 bg-line" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 pb-3">
              <span className="text-[13px] font-medium text-ink-heading">{e.text}</span>
              <span className="text-[11px] font-medium text-ink-muted">{e.at}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ──────────── Right rail ──────────── */
function ScoreCard({ score }) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-xl border border-line bg-white p-5">
      <h3 className="self-start text-[13px] font-semibold text-ink-heading">Customer Score</h3>
      <div
        className="relative flex h-32 w-32 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(#1EB677 ${score * 3.6}deg, #E5E7EB ${score * 3.6}deg)`,
        }}
      >
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
          <span className="text-[22px] font-semibold text-ink-heading leading-none">{score}</span>
          <span className="text-[10px] font-medium text-ink-muted">/ 100</span>
        </div>
      </div>
      <p className="text-center text-[12px] font-medium text-ink-muted">
        Strong loyalty signals — keep them engaged.
      </p>
    </section>
  );
}

function SuggestedActionsCard({ onAction }) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
      <header className="flex items-center gap-2">
        <Sparkles size={16} className="text-brand-emerald" />
        <h3 className="text-[13px] font-semibold text-ink-heading">Suggested actions</h3>
      </header>
      <ul className="flex flex-col gap-2">
        {SUGGESTED_ACTIONS.map((s) => (
          <li key={s.id} className="flex items-start gap-2 rounded-md border-l-4 border-brand-emerald bg-brand-50/30 p-3">
            <Zap size={14} className="mt-0.5 text-brand-emerald" strokeWidth={1.75} />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[12px] font-semibold text-ink-heading">{s.title}</span>
              <span className="text-[11px] font-medium text-ink-muted">{s.sub}</span>
            </div>
            <button
              type="button"
              onClick={() => onAction(s.title)}
              aria-label="Apply suggestion"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-brand-emerald hover:bg-brand-50"
            >
              <Send size={12} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Th({ children }) {
  return <th className="px-4 py-2.5">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 align-middle">{children}</td>;
}

function hashCode(s = "") {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}
