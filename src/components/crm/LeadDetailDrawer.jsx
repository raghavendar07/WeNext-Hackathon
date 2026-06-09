import { useState } from "react";
import { Mail, MessageSquare, Phone, Tag, User, X } from "lucide-react";
import Avatar from "../inbox/Avatar.jsx";
import IntentBadge from "./IntentBadge.jsx";
import SourceBadge from "./SourceBadge.jsx";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "notes",    label: "Notes" },
];

const MOCK_ACTIVITY = [
  { id: "a1", at: "2h ago",  text: "Replied to outreach message" },
  { id: "a2", at: "1d ago",  text: "Viewed pricing page (3 min)" },
  { id: "a3", at: "3d ago",  text: "Added to 'Hot Lead' tag" },
  { id: "a4", at: "1w ago",  text: "Imported from Instagram DMs" },
];

export default function LeadDetailDrawer({ lead, onClose }) {
  const [tab, setTab] = useState("overview");
  const [note, setNote] = useState("");

  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close drawer"
        onClick={onClose}
        className="flex-1 bg-black/40"
      />
      <aside className="flex h-full w-[480px] flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar name={lead.name} palette={lead.palette} size={44} />
            <div className="flex flex-col">
              <h2 className="text-[16px] font-semibold text-ink-heading">{lead.name}</h2>
              <span className="text-[12px] font-medium text-ink-muted">{lead.phone}</span>
              <div className="mt-1 flex items-center gap-2">
                <SourceBadge source={lead.source} />
                <IntentBadge intent={lead.intent} />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1.5 text-ink-muted hover:bg-surface-subtle"
          >
            <X size={16} />
          </button>
        </header>

        <nav className="flex items-center gap-1 border-b border-line px-3 pt-2">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={[
                  "h-9 rounded-t-sm px-3 text-[12px] font-semibold transition-colors",
                  active
                    ? "border-b-2 border-brand-500 text-ink-heading"
                    : "border-b-2 border-transparent text-ink-muted hover:text-ink-heading",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
              <section className="flex flex-col gap-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                  Contact details
                </h3>
                <Row icon={User} label="Owner" value="Unassigned" />
                <Row icon={Phone} label="Phone" value={lead.phone} />
                <Row icon={Mail} label="Email" value={`${lead.name.split(" ")[0].toLowerCase()}@example.com`} />
                <Row icon={MessageSquare} label="Last activity" value={lead.lastActivity} />
              </section>

              {lead.tags?.length > 0 && (
                <section className="flex flex-col gap-2">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Tags</h3>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {lead.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-xs border border-line bg-canvas px-2 py-0.5 text-[11px] font-medium text-ink-muted"
                      >
                        <Tag size={10} strokeWidth={1.75} />
                        {t}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section className="flex flex-col gap-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                  Suggested action
                </h3>
                <button
                  type="button"
                  onClick={() => alert(`${lead.action} for ${lead.name} (mock)`)}
                  className="inline-flex h-9 items-center justify-center rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
                >
                  {lead.action}
                </button>
              </section>
            </div>
          )}

          {tab === "activity" && (
            <ul className="flex flex-col gap-3">
              {MOCK_ACTIVITY.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-ink-heading">{a.text}</span>
                    <span className="text-[11px] font-medium text-ink-muted">{a.at}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {tab === "notes" && (
            <div className="flex flex-col gap-2">
              <textarea
                rows={6}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a note..."
                className="w-full resize-none rounded-sm border border-line bg-white p-3 text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  alert(`Saved note for ${lead.name} (mock)`);
                  setNote("");
                }}
                className="inline-flex h-9 items-center justify-center self-end rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
              >
                Save note
              </button>
            </div>
          )}
        </div>
      </aside>
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
