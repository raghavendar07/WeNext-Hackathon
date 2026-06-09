import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Send,
  Sparkles,
  Tag,
  Trophy,
  User,
} from "lucide-react";
import Avatar from "../inbox/Avatar.jsx";
import IntentBadge from "./IntentBadge.jsx";
import SourceBadge from "./SourceBadge.jsx";
import { STAGES } from "./data.js";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "notes",    label: "Notes" },
  { id: "files",    label: "Files" },
];

const MOCK_ACTIVITY = [
  { id: "ev1", at: "Today, 11:02 AM", text: "Meeting booked for tomorrow 3 PM (30 min)",   dot: "bg-brand-emerald" },
  { id: "ev2", at: "Today, 9:18 AM",  text: "Outbound call logged — 4 min, voicemail",     dot: "bg-info"          },
  { id: "ev3", at: "Yesterday",       text: "Proposal email sent",                         dot: "bg-warning"       },
  { id: "ev4", at: "2 days ago",      text: "Replied to outreach message",                 dot: "bg-success"       },
  { id: "ev5", at: "1 week ago",      text: "Form submitted on /pricing",                  dot: "bg-ink-muted"     },
];

const MOCK_NOTES = [
  { id: "n1", author: "Rahul V.",   at: "Today",        body: "Mentioned a 6-week timeline. Wants to bring in their head of growth before signing." },
  { id: "n2", author: "Aisha K.",   at: "Yesterday",    body: "Budget is approved for the Pro plan. Decision-maker confirmed on call." },
  { id: "n3", author: "Karthik R.", at: "3 days ago",   body: "Prefers WhatsApp over email for follow-ups. Avoid generic templates." },
];

const MOCK_FILES = [
  { id: "f1", name: "Pricing-Proposal-v3.pdf", size: "284 KB", icon: FileText,  type: "PDF" },
  { id: "f2", name: "Product-Roadmap-Q3.pdf",  size: "612 KB", icon: FileText,  type: "PDF" },
  { id: "f3", name: "Brand-Logos.zip-preview.png", size: "1.2 MB", icon: ImageIcon, type: "Image" },
];

export default function LeadDetailPage({ lead, onBack }) {
  const [tab, setTab] = useState("overview");
  const [note, setNote] = useState("");
  const [toast, setToast] = useState(null);

  if (!lead) return null;

  const stage = STAGES.find((s) => s.id === lead.stage);
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
            aria-label="Back to leads"
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <ArrowLeft size={14} />
            Leads
          </button>
          <div className="flex items-center gap-3">
            <Avatar name={lead.name} palette={lead.palette} size={44} />
            <div className="flex flex-col">
              <span className="text-[18px] font-semibold text-ink-heading">{lead.name}</span>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 items-center rounded-pill bg-canvas px-2 text-[11px] font-semibold text-ink-body">
                  {stage?.label ?? "—"}
                </span>
                <IntentBadge intent={lead.intent} />
                <SourceBadge source={lead.source} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fireToast("Reply window opened (mock)")}
            className="inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
          >
            <MessageCircle size={14} strokeWidth={2} />
            Reply now
          </button>
          <button
            type="button"
            onClick={() => fireToast("Proposal draft created (mock)")}
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <Send size={14} strokeWidth={1.75} />
            Send proposal
          </button>
          <button
            type="button"
            onClick={() => fireToast("Marked as Won (mock)")}
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-success hover:bg-success-bg"
          >
            <Trophy size={14} strokeWidth={1.75} />
            Mark as won
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

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-5">
          <Tabs tab={tab} onChange={setTab} />

          {tab === "overview" && <OverviewTab lead={lead} />}
          {tab === "activity" && <ActivityTab />}
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
          {tab === "files" && <FilesTab onDownload={(name) => fireToast(`Downloading ${name} (mock)`)} />}
        </div>

        <aside className="flex flex-col gap-5">
          <NextBestActionCard
            title={lead.action ?? "Reply now"}
            onAct={(t) => fireToast(`${t} (mock)`)}
          />
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

/* ──────────── Overview ──────────── */
function OverviewTab({ lead }) {
  const score = scoreFor(lead);
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
        <h3 className="text-[14px] font-semibold text-ink-heading">Contact details</h3>
        <div className="flex flex-col gap-2">
          <Row icon={Phone}  label="Phone"   value={lead.phone} />
          <Row icon={Mail}   label="Email"   value={`${lead.name.split(" ")[0].toLowerCase()}@example.com`} />
          <Row icon={MapPin} label="Region"  value="Mumbai, IN" />
          <Row icon={User}   label="Source"  value={cap(lead.source)} />
          <Row icon={Tag}    label="Tags"    value={(lead.tags ?? []).join(" · ") || "—"} />
        </div>
      </section>

      <div className="grid grid-cols-3 gap-4">
        <KV label="Lead score" value={`${score} / 100`} hint={scoreLabel(score)} tone="brand" />
        <KV label="Deal value" value="$8,400"           hint="Annual contract" />
        <KV label="Owner"      value="Aisha K."         hint="Account manager" />
      </div>

      <section className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
        <h3 className="text-[14px] font-semibold text-ink-heading">Last activity</h3>
        <p className="text-[13px] leading-relaxed text-ink-body">{lead.lastActivity}</p>
      </section>
    </div>
  );
}

function KV({ label, value, hint, tone }) {
  const valueTone = tone === "brand" ? "text-brand-emerald" : "text-ink-heading";
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-line bg-white p-5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</span>
      <span className={["text-[20px] font-semibold leading-none", valueTone].join(" ")}>{value}</span>
      {hint && <span className="text-[11px] font-medium text-ink-muted">{hint}</span>}
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

/* ──────────── Activity ──────────── */
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

/* ──────────── Notes ──────────── */
function NotesTab({ note, onNoteChange, onSave }) {
  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-2 rounded-xl border border-line bg-white p-5">
        <h3 className="text-[14px] font-semibold text-ink-heading">Add a note</h3>
        <textarea
          rows={4}
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Write a note about this lead..."
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

/* ──────────── Files ──────────── */
function FilesTab({ onDownload }) {
  return (
    <section className="flex flex-col gap-2">
      {MOCK_FILES.map((f) => {
        const Icon = f.icon;
        return (
          <article key={f.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-4 hover:bg-surface-subtle">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-emerald">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-ink-heading">{f.name}</span>
                <span className="text-[11px] font-medium text-ink-muted">{f.type} · {f.size}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDownload(f.name)}
              aria-label={`Download ${f.name}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white text-ink-body hover:bg-surface-subtle"
            >
              <Download size={14} strokeWidth={1.75} />
            </button>
          </article>
        );
      })}
    </section>
  );
}

/* ──────────── Right rail ──────────── */
function NextBestActionCard({ title, onAct }) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
      <header className="flex items-center gap-2">
        <Sparkles size={16} className="text-brand-emerald" />
        <h3 className="text-[13px] font-semibold text-ink-heading">Next best action</h3>
      </header>
      <div className="flex flex-col gap-2 rounded-md border-l-4 border-brand-emerald bg-brand-50/30 p-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-brand-emerald" />
          <span className="text-[13px] font-semibold text-ink-heading">{title}</span>
        </div>
        <p className="text-[12px] leading-relaxed text-ink-body">
          Based on their recent activity and intent score, reaching out within the next 4 hours has the
          highest probability of moving this lead forward.
        </p>
      </div>
      <button
        type="button"
        onClick={() => onAct(title)}
        className="inline-flex h-9 items-center justify-center rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
      >
        Do it now
      </button>
      <ul className="flex flex-col gap-1 border-t border-line pt-3">
        <li className="flex items-center justify-between text-[12px]">
          <span className="font-medium text-ink-muted">Win probability</span>
          <span className="font-semibold text-ink-heading">62%</span>
        </li>
        <li className="flex items-center justify-between text-[12px]">
          <span className="font-medium text-ink-muted">Best channel</span>
          <span className="font-semibold text-ink-heading">WhatsApp</span>
        </li>
        <li className="flex items-center justify-between text-[12px]">
          <span className="font-medium text-ink-muted">Best time</span>
          <span className="font-semibold text-ink-heading">Today, 2–4 PM</span>
        </li>
      </ul>
    </section>
  );
}

/* ──────────── helpers ──────────── */
function scoreFor(lead) {
  if (lead.intent === "hot") return 88;
  if (lead.intent === "warm") return 64;
  return 32;
}
function scoreLabel(s) {
  if (s >= 80) return "Hot — act today";
  if (s >= 50) return "Warm — nurture";
  return "Cold — keep on list";
}
function cap(s = "") {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
