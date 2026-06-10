import { useMemo, useState } from "react";
import {
  Ticket,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Clock,
  AlertCircle,
  User,
  X,
  Plus,
  Search,
  Tag,
} from "lucide-react";
import Avatar from "../inbox/Avatar.jsx";
import MetricCard from "./MetricCard.jsx";

const COLUMNS = [
  { id: "open",     label: "Open",                accent: "bg-danger" },
  { id: "progress", label: "In Progress",         accent: "bg-warning" },
  { id: "waiting",  label: "Waiting on Customer", accent: "bg-info" },
  { id: "resolved", label: "Resolved",            accent: "bg-success" },
];

const PRIORITY = {
  low:    { label: "Low",    dot: "bg-zinc-400",  pill: "bg-zinc-100 text-zinc-700" },
  med:    { label: "Med",    dot: "bg-blue-500",  pill: "bg-blue-50 text-blue-700" },
  high:   { label: "High",   dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700" },
  urgent: { label: "Urgent", dot: "bg-red-500",   pill: "bg-red-50 text-red-700" },
};

const CHANNEL = {
  WhatsApp:  { label: "WhatsApp",  cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  Instagram: { label: "Instagram", cls: "bg-pink-50 text-pink-700 border-pink-100" },
  Email:     { label: "Email",     cls: "bg-blue-50 text-blue-700 border-blue-100" },
};

const STATUS_LABEL = {
  open:     "Open",
  progress: "In Progress",
  waiting:  "Waiting on Customer",
  resolved: "Resolved",
};

const ASSIGNEES = ["Unassigned", "Priya Sharma", "Aman Verma", "Rhea Kapoor", "Liam Patel"];

const TICKETS_SEED = [
  // Open
  { id: "T-1042", title: "Order not delivered after 7 days", customer: "Anita Rao",     channel: "WhatsApp",  priority: "urgent", assignee: "Priya Sharma", updated: "12m ago", tags: ["delivery", "vip"],       palette: "coral",  status: "open",     order: "#ORD-9821" },
  { id: "T-1041", title: "Payment failed but amount debited", customer: "Rahul Mehta",  channel: "Email",     priority: "high",   assignee: "Aman Verma",   updated: "38m ago", tags: ["payments", "refund"],     palette: "blue",   status: "open",     order: "#ORD-9818" },
  { id: "T-1039", title: "How do I change my plan?",          customer: "Sneha Iyer",   channel: "Instagram", priority: "low",    assignee: "Unassigned",   updated: "2h ago",  tags: ["billing"],                palette: "pink",   status: "open",     order: "—" },
  { id: "T-1038", title: "Coupon code not applying",          customer: "Vikram Bose",  channel: "WhatsApp",  priority: "med",    assignee: "Rhea Kapoor",  updated: "3h ago",  tags: ["coupon", "checkout"],     palette: "green",  status: "open",     order: "#ORD-9805" },

  // In Progress
  { id: "T-1037", title: "Wrong size delivered, need exchange", customer: "Ishita Banerjee", channel: "WhatsApp", priority: "high",   assignee: "Priya Sharma", updated: "1h ago", tags: ["exchange", "logistics"], palette: "rose",  status: "progress", order: "#ORD-9790" },
  { id: "T-1035", title: "Account locked after login attempts", customer: "Karthik Nair",    channel: "Email",    priority: "urgent", assignee: "Aman Verma",   updated: "2h ago", tags: ["security"],              palette: "blue",  status: "progress", order: "—" },
  { id: "T-1034", title: "GST invoice missing for order",       customer: "Meera Joshi",     channel: "Email",    priority: "med",    assignee: "Liam Patel",   updated: "5h ago", tags: ["invoice", "tax"],        palette: "pink",  status: "progress", order: "#ORD-9712" },

  // Waiting
  { id: "T-1031", title: "Reschedule appointment request", customer: "Arjun Kapoor", channel: "WhatsApp",  priority: "low",  assignee: "Rhea Kapoor", updated: "1d ago", tags: ["appointment"],         palette: "green",  status: "waiting", order: "—" },
  { id: "T-1029", title: "Need product specs PDF",         customer: "Tanvi Shah",   channel: "Instagram", priority: "med",  assignee: "Liam Patel",  updated: "1d ago", tags: ["docs", "presales"],    palette: "coral",  status: "waiting", order: "—" },
  { id: "T-1028", title: "Bulk order quote follow-up",     customer: "Devansh Roy",  channel: "Email",     priority: "high", assignee: "Priya Sharma", updated: "2d ago", tags: ["b2b", "quote"],        palette: "blue",   status: "waiting", order: "—" },

  // Resolved
  { id: "T-1024", title: "Updated shipping address",  customer: "Nidhi Verma",   channel: "WhatsApp", priority: "low", assignee: "Aman Verma",   updated: "3d ago", tags: ["shipping"],         palette: "rose",  status: "resolved", order: "#ORD-9633" },
  { id: "T-1019", title: "Refund processed for return", customer: "Ravi Saxena", channel: "Email",    priority: "med", assignee: "Rhea Kapoor",  updated: "5d ago", tags: ["refund", "returns"], palette: "pink",  status: "resolved", order: "#ORD-9590" },
];

const MOCK_THREAD = [
  { id: "m1", from: "customer", name: "Customer",    at: "Yesterday 4:12 PM", text: "Hi, I placed an order 7 days back but I still haven't received it. The tracking page hasn't updated either." },
  { id: "m2", from: "agent",    name: "Priya Sharma", at: "Yesterday 4:31 PM", text: "Hi Anita, I'm really sorry about the delay. Let me check the carrier status and get back to you shortly." },
  { id: "m3", from: "customer", name: "Customer",    at: "Today 10:02 AM",    text: "Any update? I need this before the weekend please." },
  { id: "m4", from: "agent",    name: "Priya Sharma", at: "Today 10:18 AM",    text: "Carrier confirmed out-for-delivery today. You should receive it before 6 PM. I'll keep monitoring." },
];

const MOCK_ACTIVITY = [
  { id: "e1", at: "Today 10:18 AM",     text: "Priya Sharma replied to customer" },
  { id: "e2", at: "Today 09:50 AM",     text: "Priority changed Low to Urgent" },
  { id: "e3", at: "Yesterday 4:32 PM",  text: "Assigned to Priya Sharma" },
  { id: "e4", at: "Yesterday 4:11 PM",  text: "Tagged as 'delivery', 'vip'" },
  { id: "e5", at: "Yesterday 4:10 PM",  text: "Ticket created from WhatsApp inbound" },
];

const PRIORITY_CHIPS  = ["All", "Low", "Med", "High", "Urgent"];
const CHANNEL_CHIPS   = ["All", "WhatsApp", "Instagram", "Email"];

function priorityKey(label) {
  return label === "Med" ? "med" : label.toLowerCase();
}

export default function TicketsBoardPage() {
  const [tickets, setTickets]         = useState(TICKETS_SEED);
  const [query, setQuery]             = useState("");
  const [priorityChip, setPriorityChip] = useState("All");
  const [channelChip, setChannelChip] = useState("All");
  const [assignee, setAssignee]       = useState("All");
  const [openTicket, setOpenTicket]   = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((t) => {
      if (q && !`${t.id} ${t.title} ${t.customer}`.toLowerCase().includes(q)) return false;
      if (priorityChip !== "All" && t.priority !== priorityKey(priorityChip)) return false;
      if (channelChip  !== "All" && t.channel !== channelChip) return false;
      if (assignee     !== "All" && t.assignee !== assignee) return false;
      return true;
    });
  }, [tickets, query, priorityChip, channelChip, assignee]);

  const counts = useMemo(() => {
    return COLUMNS.reduce((acc, c) => {
      acc[c.id] = tickets.filter((t) => t.status === c.id).length;
      return acc;
    }, {});
  }, [tickets]);

  const moveTicket = (id, dir) => {
    const order = COLUMNS.map((c) => c.id);
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const idx = order.indexOf(t.status);
        const next = Math.min(order.length - 1, Math.max(0, idx + dir));
        return { ...t, status: order[next] };
      })
    );
  };

  const setTicketStatus = (id, status) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    alert(`Status changed to "${STATUS_LABEL[status]}" (mock)`);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-ink-heading">Support Tickets</h1>
          <p className="text-[13px] font-medium text-ink-muted">
            Triage, assign and resolve customer issues across every channel
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert("New ticket flow (mock)")}
          className="inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
        >
          <Plus size={14} strokeWidth={2} />
          New ticket
        </button>
      </header>

      {/* Metrics */}
      <div className="flex items-stretch gap-3">
        <MetricCard value={counts.open      ?? 0} label="Open"                       tone="danger" />
        <MetricCard value={counts.progress  ?? 0} label="In progress"                tone="warning" />
        <MetricCard value={counts.waiting   ?? 0} label="Awaiting customer"          tone="muted" />
        <MetricCard value={counts.resolved  ?? 0} label="Resolved (last 30d)"        tone="brand" />
        <MetricCard value={14}                    label="Avg first response (min)"   tone="muted" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-9 w-[260px] items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-3">
          <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets..."
            className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
        </label>

        <ChipRow label="Priority" chips={PRIORITY_CHIPS} active={priorityChip} onChange={setPriorityChip} />
        <ChipRow label="Channel"  chips={CHANNEL_CHIPS}  active={channelChip}  onChange={setChannelChip}  />

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            Assignee
          </span>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="h-8 rounded-[10px] border border-[#E5E7EB] bg-white px-2 text-[12px] font-medium text-ink-heading focus:border-brand-500 focus:outline-none"
          >
            <option value="All">All</option>
            {ASSIGNEES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban */}
      <div className="-mx-6 flex flex-1 gap-3 overflow-x-auto px-6 pb-2">
        {COLUMNS.map((col) => {
          const colTickets = filtered.filter((t) => t.status === col.id);
          return (
            <section
              key={col.id}
              className="flex h-full w-[300px] shrink-0 flex-col gap-3 rounded-[12px] border border-[#E5E7EB] bg-white p-3"
            >
              <header className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={["h-2 w-2 rounded-full", col.accent].join(" ")} />
                  <h3 className="text-[12px] font-semibold uppercase tracking-wide text-ink-heading">
                    {col.label}
                  </h3>
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-canvas px-1.5 text-[10px] font-semibold text-ink-muted">
                    {colTickets.length}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Column options"
                  onClick={() => alert(`Column "${col.label}" options (mock)`)}
                  className="rounded p-1 text-ink-muted hover:bg-canvas"
                >
                  <MoreHorizontal size={14} strokeWidth={1.75} />
                </button>
              </header>

              <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
                {colTickets.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-[10px] border border-dashed border-[#E5E7EB] py-6 text-[11px] font-medium text-ink-muted">
                    No tickets
                  </div>
                ) : (
                  colTickets.map((t) => (
                    <TicketCard
                      key={t.id}
                      ticket={t}
                      onOpen={() => setOpenTicket(t)}
                      onMoveUp={() => moveTicket(t.id, -1)}
                      onMoveDown={() => moveTicket(t.id, 1)}
                      onSetStatus={(s) => setTicketStatus(t.id, s)}
                    />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>

      {openTicket && (
        <TicketDetailDrawer
          ticket={openTicket}
          onClose={() => setOpenTicket(null)}
          onSetStatus={(s) => {
            setTicketStatus(openTicket.id, s);
            setOpenTicket((cur) => (cur ? { ...cur, status: s } : cur));
          }}
        />
      )}
    </div>
  );
}

function ChipRow({ label, chips, active, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      <div className="flex items-center gap-1 rounded-[10px] border border-[#E5E7EB] bg-white p-1">
        {chips.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              className={[
                "h-6 rounded-[8px] px-2 text-[11px] font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-emerald"
                  : "text-ink-muted hover:bg-canvas",
              ].join(" ")}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TicketCard({ ticket, onOpen, onMoveUp, onMoveDown, onSetStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const p = PRIORITY[ticket.priority];
  const ch = CHANNEL[ticket.channel];

  return (
    <article
      onClick={onOpen}
      className="group relative flex cursor-grab flex-col gap-2 rounded-[12px] border border-[#E5E7EB] bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={["h-2 w-2 shrink-0 rounded-full", p.dot].join(" ")} />
          <span className="text-[11px] font-semibold text-ink-muted">#{ticket.id}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Move up"
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            className="rounded p-1 text-ink-muted opacity-0 transition-opacity hover:bg-canvas hover:text-ink-heading group-hover:opacity-100"
          >
            <ArrowUp size={12} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Move down"
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            className="rounded p-1 text-ink-muted opacity-0 transition-opacity hover:bg-canvas hover:text-ink-heading group-hover:opacity-100"
          >
            <ArrowDown size={12} strokeWidth={1.75} />
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label="Move to"
              onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
              className="rounded p-1 text-ink-muted hover:bg-canvas hover:text-ink-heading"
            >
              <MoreHorizontal size={12} strokeWidth={1.75} />
            </button>
            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-6 z-10 flex w-44 flex-col rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-lg"
              >
                <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                  Move to
                </span>
                {COLUMNS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { setMenuOpen(false); onSetStatus(c.id); }}
                    className={[
                      "flex items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[12px] font-medium hover:bg-canvas",
                      c.id === ticket.status ? "text-brand-emerald" : "text-ink-heading",
                    ].join(" ")}
                  >
                    <span className={["h-1.5 w-1.5 rounded-full", c.accent].join(" ")} />
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <h4 className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink-heading">
        {ticket.title}
      </h4>

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Avatar name={ticket.customer} palette={ticket.palette} size={20} />
          <span className="truncate text-[11px] font-medium text-ink-body">
            {ticket.customer}
          </span>
        </div>
        <span
          className={[
            "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold",
            ch?.cls ?? "bg-canvas text-ink-muted border-[#E5E7EB]",
          ].join(" ")}
        >
          {ticket.channel}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {ticket.tags.slice(0, 2).map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-ink-muted"
          >
            <Tag size={9} strokeWidth={1.75} />
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <span
            title={ticket.assignee}
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-[10px] font-semibold text-brand-emerald"
          >
            {ticket.assignee === "Unassigned" ? "?" : ticket.assignee.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </span>
          <span className="text-[10px] font-medium text-ink-muted">
            {ticket.assignee}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-ink-muted">
          <Clock size={10} strokeWidth={1.75} />
          {ticket.updated}
        </span>
      </div>
    </article>
  );
}

const DRAWER_TABS = [
  { id: "conversation", label: "Conversation" },
  { id: "details",      label: "Details" },
  { id: "activity",     label: "Activity" },
];

function TicketDetailDrawer({ ticket, onClose, onSetStatus }) {
  const [tab, setTab] = useState("conversation");
  const [reply, setReply] = useState("");
  const p  = PRIORITY[ticket.priority];
  const ch = CHANNEL[ticket.channel];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close drawer" onClick={onClose} className="flex-1 bg-black/40" />
      <aside className="flex h-full w-[480px] flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-[#E5E7EB] px-5 py-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Ticket size={14} className="text-ink-muted" strokeWidth={1.75} />
              <span className="text-[13px] font-semibold text-ink-heading">#{ticket.id}</span>
            </div>
            <h2 className="text-[15px] font-semibold leading-snug text-ink-heading">
              {ticket.title}
            </h2>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2 py-0.5 text-[10px] font-semibold text-ink-heading">
                <span className={["h-1.5 w-1.5 rounded-full", COLUMNS.find((c) => c.id === ticket.status)?.accent ?? "bg-zinc-400"].join(" ")} />
                {STATUS_LABEL[ticket.status]}
              </span>
              <span className={["inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", p.pill].join(" ")}>
                <AlertCircle size={10} strokeWidth={1.75} />
                {p.label}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1.5 text-ink-muted hover:bg-canvas"
          >
            <X size={16} />
          </button>
        </header>

        <nav className="flex items-center gap-1 border-b border-[#E5E7EB] px-3 pt-2">
          {DRAWER_TABS.map((t) => {
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

        <div className="flex flex-1 flex-col overflow-hidden">
          {tab === "conversation" && (
            <>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <ul className="flex flex-col gap-3">
                  {MOCK_THREAD.map((m) => {
                    const isAgent = m.from === "agent";
                    return (
                      <li key={m.id} className={["flex", isAgent ? "justify-end" : "justify-start"].join(" ")}>
                        <div className={["flex max-w-[80%] flex-col gap-1", isAgent ? "items-end" : "items-start"].join(" ")}>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-ink-muted">
                            {!isAgent && <User size={10} strokeWidth={1.75} />}
                            <span>{m.name}</span>
                            <span>·</span>
                            <span>{m.at}</span>
                          </div>
                          <div
                            className={[
                              "rounded-[12px] px-3 py-2 text-[12px] font-medium leading-snug",
                              isAgent
                                ? "bg-brand-50 text-ink-heading"
                                : "border border-[#E5E7EB] bg-white text-ink-heading",
                            ].join(" ")}
                          >
                            {m.text}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex flex-col gap-2 border-t border-[#E5E7EB] bg-canvas px-5 py-3">
                <textarea
                  rows={3}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full resize-none rounded-[10px] border border-[#E5E7EB] bg-white p-2.5 text-[12px] font-medium text-ink-heading placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none"
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
                    <MessageSquare size={11} strokeWidth={1.75} />
                    Replying via {ticket.channel}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Reply sent on #${ticket.id} (mock)`);
                      setReply("");
                    }}
                    className="inline-flex h-8 items-center rounded-button bg-cta-gradient px-3 text-[12px] font-medium text-white"
                  >
                    Send reply
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === "details" && (
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="flex flex-col gap-2">
                <DetailRow icon={User}          label="Customer"    value={ticket.customer} />
                <DetailRow icon={MessageSquare} label="Channel"     value={ticket.channel} />
                <DetailRow icon={User}          label="Assignee"    value={ticket.assignee} />
                <DetailRow icon={AlertCircle}   label="Priority"    value={PRIORITY[ticket.priority].label} />
                <DetailRow icon={Clock}         label="Created"     value="Yesterday 4:10 PM" />
                <DetailRow icon={Clock}         label="Last update" value={ticket.updated} />
                <div className="rounded-[10px] border border-[#E5E7EB] bg-canvas px-3 py-2">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ticket.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-ink-muted"
                      >
                        <Tag size={9} strokeWidth={1.75} />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <DetailRow icon={Ticket} label="Order ref" value={ticket.order} />

                <div className="mt-3 flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                    Change status
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COLUMNS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onSetStatus(c.id)}
                        className={[
                          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                          c.id === ticket.status
                            ? "border-brand-500 bg-brand-50 text-brand-emerald"
                            : "border-[#E5E7EB] bg-white text-ink-muted hover:text-ink-heading",
                        ].join(" ")}
                      >
                        <span className={["h-1.5 w-1.5 rounded-full", c.accent].join(" ")} />
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "activity" && (
            <div className="flex-1 overflow-y-auto px-5 py-5">
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
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2">
      <Icon size={14} className="text-ink-muted" strokeWidth={1.75} />
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-ink-muted">{label}</span>
        <span className="truncate text-[12px] font-semibold text-ink-heading">{value}</span>
      </div>
    </div>
  );
}
