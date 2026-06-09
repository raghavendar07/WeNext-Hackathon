import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  FileText,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Trash2,
  Video,
} from "lucide-react";
import { CATEGORIES } from "./categories.js";

const STATUS_PILLS = {
  upcoming:      { label: "Upcoming",    bg: "bg-info-bg",       text: "text-info" },
  "in-progress":{ label: "In progress",  bg: "bg-warning-bg",    text: "text-warning" },
  completed:     { label: "Completed",   bg: "bg-success-bg",    text: "text-success" },
  cancelled:     { label: "Cancelled",   bg: "bg-surface-muted", text: "text-ink-muted" },
  "no-show":     { label: "No-show",     bg: "bg-danger-bg",     text: "text-danger" },
};

const PALETTES = [
  ["#FFE2DC", "#FF6F4F"],
  ["#D6E5FF", "#3B7BFF"],
  ["#D6F4D9", "#1EB677"],
  ["#FFD6E5", "#E84F87"],
  ["#FEE2E2", "#EF4444"],
];
function hashIdx(name) {
  const c = name?.charCodeAt(0) ?? 0;
  return ((c - 65) % PALETTES.length + PALETTES.length) % PALETTES.length;
}
const hashBg = (n) => PALETTES[hashIdx(n)][0];
const hashFg = (n) => PALETTES[hashIdx(n)][1];

export default function AppointmentDetailPage({ appointment, onBack }) {
  const a = appointment ?? {};
  const cfg = CATEGORIES[a.category] ?? CATEGORIES.demo;
  const pill = STATUS_PILLS[a.status] ?? STATUS_PILLS.upcoming;
  const isCompleted = a.status === "completed";

  const customer = a.customer ?? "Aisha Khan";
  const customerEmail = `${customer.split(" ")[0]?.toLowerCase() ?? "customer"}@example.com`;
  const customerPhone = "+91 98765 43210";

  const when = a.when ?? "May 5, 2025";
  const duration = a.duration ?? "60 min";
  const title = a.title ?? "Appointment";
  const location = a.location ?? "Zoom video call";
  const videoLink = a.videoLink ?? "https://zoom.us/j/9342518897";

  const price = a.price ?? "Free";
  const description =
    a.description ??
    "Initial discovery session to understand customer goals, surface blockers and outline next steps for the engagement.";

  const host = a.host ?? { name: "Anita Sharma", role: "Account Manager" };

  const previousNotes = a.previousNotes ?? [
    { author: "Anita", at: "May 02, 2:30 PM", text: "Customer interested in the Pro plan, asked for case studies." },
    { author: "Karthik", at: "Apr 28, 11:00 AM", text: "Sent over the proposal deck. Awaiting feedback." },
  ];

  const relatedAppointments = a.related ?? [
    { id: "r1", title: "Strategy review",    when: "May 12, 10:00 AM", status: "upcoming" },
    { id: "r2", title: "Renewal discussion", when: "Apr 18, 2:00 PM",  status: "completed" },
    { id: "r3", title: "Quarterly check-in", when: "Mar 02, 11:00 AM", status: "completed" },
  ];

  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCopy = () => {
    navigator?.clipboard?.writeText(videoLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit items-center gap-1.5 text-[12px] font-medium text-ink-muted hover:text-ink-heading"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          Appointments
        </button>
        <header className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className={[
                  "inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[10px] font-semibold uppercase",
                  cfg.bg,
                  cfg.text,
                ].join(" ")}
              >
                <span aria-hidden className={["h-1.5 w-1.5 rounded-full", cfg.dot].join(" ")} />
                {cfg.label}
              </span>
              <span
                className={[
                  "inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[10px] font-semibold",
                  pill.bg,
                  pill.text,
                ].join(" ")}
              >
                <span className="h-1 w-1 rounded-full bg-current" aria-hidden />
                {pill.label}
              </span>
            </div>
            <h1 className="truncate text-[22px] font-semibold text-ink-heading" title={title}>
              {title}
            </h1>
            <p className="text-[12px] font-medium text-ink-muted">
              {when} · {duration} · with {customer}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HeaderAction icon={CalendarClock} label="Reschedule" />
            <HeaderAction icon={Trash2} label="Cancel" danger />
            <HeaderAction icon={Bell} label="Send reminder" />
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="More actions"
                className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-line bg-white text-ink-muted hover:bg-surface-subtle"
              >
                <MoreHorizontal size={16} strokeWidth={1.75} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-[180px] rounded-md border border-line bg-white shadow-chip">
                  <MenuRow icon={FileText} label="Print details"    onClick={() => setMenuOpen(false)} />
                  <MenuRow icon={Mail}     label="Email customer"   onClick={() => setMenuOpen(false)} />
                  <MenuRow icon={ClipboardCheck} label="Duplicate"  onClick={() => setMenuOpen(false)} />
                </div>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* Two-column body */}
      <div className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* When + Where */}
          <Card title="When & where">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field icon={CalendarClock} label="Date">{when.split(",")[0]}</Field>
              <Field icon={Clock} label="Time">
                {when.split(",")[1]?.trim() ?? "—"} · {duration}
              </Field>
              <Field icon={MapPin} label="Location">{location}</Field>
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  <Video size={12} strokeWidth={1.75} />
                  Video link
                </span>
                <div className="flex items-center gap-2 rounded-sm border border-line bg-canvas px-2.5 py-1.5">
                  <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-ink-body" title={videoLink}>
                    {videoLink}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex h-7 items-center gap-1 rounded-button border border-line bg-white px-2 text-[11px] font-medium text-ink-body hover:bg-surface-subtle"
                  >
                    {copied ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={1.75} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Service */}
          <Card title="Service">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-semibold text-ink-heading">{title}</span>
                  <span className="text-[12px] font-medium text-ink-muted">{cfg.label} session</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[14px] font-semibold text-ink-heading">{price}</span>
                  <span className="text-[11px] font-medium text-ink-muted">{duration}</span>
                </div>
              </div>
              <p className="text-[13px] leading-relaxed text-ink-body">{description}</p>
            </div>
          </Card>

          {/* Notes */}
          <Card title="Notes">
            <div className="flex flex-col gap-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add a note about this appointment..."
                className="w-full resize-none rounded-sm border border-line bg-white px-3 py-2 text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:border-brand-emerald focus:outline-none"
              />
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-button bg-cta-gradient px-3 text-[12px] font-medium text-white"
                >
                  Save note
                </button>
              </div>
              {previousNotes.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-line pt-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                    Previous notes
                  </span>
                  {previousNotes.map((n, i) => (
                    <div key={i} className="flex flex-col gap-1 rounded-sm border border-line bg-canvas px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] font-semibold text-ink-heading">{n.author}</span>
                        <span className="text-[11px] font-medium text-ink-muted">{n.at}</span>
                      </div>
                      <p className="text-[12px] text-ink-body">{n.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Outcome (Completed only) */}
          {isCompleted && (
            <Card title="Outcome">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                    Visit summary
                  </span>
                  <p className="text-[13px] leading-relaxed text-ink-body">
                    Customer agreed to move forward with the Pro plan. Walked through onboarding timeline and shared the
                    contract for review.
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                    Next action
                  </span>
                  <div className="flex items-center gap-2 rounded-sm border border-line bg-canvas px-3 py-2">
                    <CheckCircle2 size={14} className="text-brand-emerald" strokeWidth={1.75} />
                    <span className="text-[12px] font-medium text-ink-heading">
                      Schedule onboarding kickoff for next week
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Customer */}
          <Card title="Customer">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-[16px] font-semibold"
                  style={{ backgroundColor: hashBg(customer), color: hashFg(customer) }}
                >
                  {customer?.[0]?.toUpperCase() ?? "?"}
                </span>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-ink-heading">{customer}</span>
                  <span className="text-[11px] font-medium text-ink-muted">Customer since Mar 2024</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <ContactRow icon={Mail} value={customerEmail} />
                <ContactRow icon={Phone} value={customerPhone} />
              </div>
              <button
                type="button"
                className="text-left text-[12px] font-semibold text-brand-emerald hover:underline"
              >
                View customer →
              </button>
            </div>
          </Card>

          {/* Staff / host */}
          <Card title="Staff / host">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-semibold"
                style={{ backgroundColor: hashBg(host.name), color: hashFg(host.name) }}
              >
                {host.name?.[0]?.toUpperCase() ?? "?"}
              </span>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-ink-heading">{host.name}</span>
                <span className="text-[11px] font-medium text-ink-muted">{host.role}</span>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card title="Timeline">
            <Timeline status={a.status ?? "upcoming"} />
          </Card>

          {/* Related */}
          <Card title="Other appointments">
            <div className="flex flex-col gap-1.5">
              {relatedAppointments.map((r) => {
                const rp = STATUS_PILLS[r.status] ?? STATUS_PILLS.upcoming;
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-2 rounded-sm border border-line bg-white px-3 py-2"
                  >
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[12px] font-semibold text-ink-heading">{r.title}</span>
                      <span className="text-[11px] font-medium text-ink-muted">{r.when}</span>
                    </div>
                    <span
                      className={[
                        "inline-flex items-center rounded-pill px-2 py-0.5 text-[10px] font-semibold",
                        rp.bg,
                        rp.text,
                      ].join(" ")}
                    >
                      {rp.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Footer action bar */}
      <div className="sticky bottom-0 -mx-1 flex items-center justify-end gap-2 border-t border-line bg-white/95 px-1 py-3 backdrop-blur">
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-button border border-line bg-white px-3 text-[13px] font-medium text-danger hover:bg-danger-bg"
        >
          <Trash2 size={14} strokeWidth={1.75} />
          Cancel meeting
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-button border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
        >
          <CalendarClock size={14} strokeWidth={1.75} />
          Reschedule
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
        >
          <CheckCircle2 size={14} strokeWidth={1.75} />
          Mark complete
        </button>
      </div>
    </div>
  );
}

function HeaderAction({ icon: Icon, label, danger }) {
  return (
    <button
      type="button"
      className={[
        "inline-flex h-9 items-center gap-1.5 rounded-button border px-3 text-[12px] font-medium",
        danger
          ? "border-line bg-white text-danger hover:bg-danger-bg"
          : "border-line bg-white text-ink-body hover:bg-surface-subtle",
      ].join(" ")}
    >
      <Icon size={14} strokeWidth={1.75} className={danger ? "text-danger" : "text-ink-muted"} />
      {label}
    </button>
  );
}

function MenuRow({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium hover:bg-surface-subtle",
        danger ? "text-danger" : "text-ink-body",
      ].join(" ")}
    >
      <Icon size={14} strokeWidth={1.75} className={danger ? "text-danger" : "text-ink-muted"} />
      {label}
    </button>
  );
}

function Card({ title, children }) {
  return (
    <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h3 className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted">{title}</h3>
      <div>{children}</div>
    </section>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        <Icon size={12} strokeWidth={1.75} />
        {label}
      </span>
      <span className="text-[13px] font-medium text-ink-heading">{children}</span>
    </div>
  );
}

function ContactRow({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2 rounded-sm border border-line bg-canvas px-2.5 py-1.5 text-[12px] text-ink-body">
      <Icon size={13} strokeWidth={1.75} className="text-ink-muted" />
      {value}
    </div>
  );
}

function Timeline({ status }) {
  const completedSteps = (() => {
    if (status === "completed") return 5;
    if (status === "in-progress") return 4;
    if (status === "cancelled" || status === "no-show") return 2;
    return 3; // upcoming
  })();

  const steps = [
    { label: "Booked",        icon: CalendarClock },
    { label: "Confirmed",     icon: Check },
    { label: "Reminder sent", icon: Bell },
    { label: "Started",       icon: Video },
    { label: "Ended",         icon: CheckCircle2 },
  ];

  return (
    <ol className="flex flex-col gap-2">
      {steps.map((s, i) => {
        const done = i < completedSteps;
        const current = i === completedSteps - 1;
        const Icon = s.icon;
        return (
          <li key={s.label} className="flex items-center gap-3">
            <span
              className={[
                "inline-flex h-7 w-7 items-center justify-center rounded-full border",
                done
                  ? current
                    ? "border-brand-emerald bg-brand-emerald text-white"
                    : "border-brand-200 bg-brand-50 text-brand-emerald"
                  : "border-line bg-white text-ink-subtle",
              ].join(" ")}
            >
              <Icon size={12} strokeWidth={2} />
            </span>
            <span
              className={[
                "text-[12px] font-medium",
                done ? "text-ink-heading" : "text-ink-muted",
              ].join(" ")}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
