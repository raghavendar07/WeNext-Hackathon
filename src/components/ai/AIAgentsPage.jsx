import { useState } from "react";
import {
  Bot,
  Plus,
  Search,
  MoreHorizontal,
  Sparkles,
  Zap,
  MessageSquare,
  Users,
  ArrowUpRight,
  Settings,
  Play,
  Pause,
  Copy,
  Trash2,
  X,
  CheckCircle2,
  Activity,
} from "lucide-react";

const INITIAL_AGENTS = [
  {
    id: "ag_1",
    name: "Sales Qualifier",
    description: "Qualifies inbound leads, books demos with sales team.",
    status: "active",
    channel: "WhatsApp + Web",
    model: "GPT-4o",
    conversations: 1248,
    resolved: 892,
    leadsBooked: 134,
    accent: "emerald",
    icon: Sparkles,
  },
  {
    id: "ag_2",
    name: "Customer Support",
    description: "Answers product questions, escalates billing issues.",
    status: "active",
    channel: "All channels",
    model: "Claude Sonnet 4.5",
    conversations: 3421,
    resolved: 3018,
    leadsBooked: 0,
    accent: "blue",
    icon: MessageSquare,
  },
  {
    id: "ag_3",
    name: "Order Tracker",
    description: "Looks up orders, processes returns, refund flows.",
    status: "active",
    channel: "WhatsApp",
    model: "GPT-4o-mini",
    conversations: 762,
    resolved: 689,
    leadsBooked: 0,
    accent: "amber",
    icon: Zap,
  },
  {
    id: "ag_4",
    name: "Onboarding Bot",
    description: "Walks new customers through setup, captures preferences.",
    status: "draft",
    channel: "Web widget",
    model: "GPT-4o",
    conversations: 0,
    resolved: 0,
    leadsBooked: 0,
    accent: "violet",
    icon: Users,
  },
  {
    id: "ag_5",
    name: "Appointment Booker",
    description: "Finds free slots in your calendar, confirms bookings.",
    status: "paused",
    channel: "WhatsApp + Instagram",
    model: "GPT-4o",
    conversations: 412,
    resolved: 380,
    leadsBooked: 87,
    accent: "rose",
    icon: Bot,
  },
];

const ACCENT = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", ring: "ring-emerald-100" },
  blue:    { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500",    ring: "ring-blue-100" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   ring: "ring-amber-100" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  dot: "bg-violet-500",  ring: "ring-violet-100" },
  rose:    { bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500",    ring: "ring-rose-100" },
};

const STATUS_PILL = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Active" },
  draft:  { bg: "bg-zinc-100",   text: "text-zinc-600",    dot: "bg-zinc-400",    label: "Draft" },
  paused: { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   label: "Paused" },
};

export default function AIAgentsPage() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = agents.filter((a) => {
    const matchQ = !query || a.name.toLowerCase().includes(query.toLowerCase());
    const matchF = filter === "all" || a.status === filter;
    return matchQ && matchF;
  });

  const totals = {
    active: agents.filter((a) => a.status === "active").length,
    conversations: agents.reduce((sum, a) => sum + a.conversations, 0),
    resolved: agents.reduce((sum, a) => sum + a.resolved, 0),
    leads: agents.reduce((sum, a) => sum + a.leadsBooked, 0),
  };

  const toggleStatus = (id) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a
      )
    );
  };

  const duplicateAgent = (id) => {
    const src = agents.find((a) => a.id === id);
    if (!src) return;
    setAgents((prev) => [
      ...prev,
      { ...src, id: `ag_${Date.now()}`, name: `${src.name} (copy)`, status: "draft", conversations: 0, resolved: 0, leadsBooked: 0 },
    ]);
  };

  const deleteAgent = (id) => {
    if (!confirm("Delete agent? This cannot be undone.")) return;
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  const addAgent = (draft) => {
    setAgents((prev) => [
      ...prev,
      {
        id: `ag_${Date.now()}`,
        ...draft,
        status: "draft",
        conversations: 0,
        resolved: 0,
        leadsBooked: 0,
      },
    ]);
    setShowCreate(false);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-50 text-brand-emerald">
              <Bot size={18} strokeWidth={1.75} />
            </div>
            <h1 className="text-[22px] font-semibold leading-tight text-[#0F172A]">AI Agents</h1>
          </div>
          <p className="mt-1 text-[13px] text-[#6A6A6A]">
            Build, deploy, and monitor autonomous AI agents across all your channels.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#111827] px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#1F2937]"
        >
          <Plus size={16} strokeWidth={2} /> New agent
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3">
        <Metric icon={Activity} label="Active agents" value={totals.active} accent="emerald" />
        <Metric icon={MessageSquare} label="Conversations" value={totals.conversations.toLocaleString()} accent="blue" />
        <Metric icon={CheckCircle2} label="Auto-resolved" value={totals.resolved.toLocaleString()} accent="violet" />
        <Metric icon={ArrowUpRight} label="Leads booked" value={totals.leads.toLocaleString()} accent="amber" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents..."
            className="h-9 w-full rounded-[8px] border border-[#E5E7EB] bg-white pl-9 pr-3 text-[13px] outline-none focus:border-[#0F172A]"
          />
        </div>
        <FilterTab active={filter === "all"} onClick={() => setFilter("all")} count={agents.length}>All</FilterTab>
        <FilterTab active={filter === "active"} onClick={() => setFilter("active")} count={totals.active}>Active</FilterTab>
        <FilterTab active={filter === "paused"} onClick={() => setFilter("paused")} count={agents.filter((a) => a.status === "paused").length}>Paused</FilterTab>
        <FilterTab active={filter === "draft"} onClick={() => setFilter("draft")} count={agents.filter((a) => a.status === "draft").length}>Drafts</FilterTab>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((a) => (
          <AgentCard
            key={a.id}
            agent={a}
            onOpen={() => setSelected(a)}
            onToggle={() => toggleStatus(a.id)}
            onDuplicate={() => duplicateAgent(a.id)}
            onDelete={() => deleteAgent(a.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 rounded-[12px] border border-dashed border-[#E5E7EB] bg-white p-10 text-center">
            <Bot size={32} className="mx-auto text-[#9CA3AF]" />
            <div className="mt-2 text-[14px] font-semibold text-[#374151]">No agents match</div>
            <div className="text-[13px] text-[#6A6A6A]">Adjust filters or create a new agent.</div>
          </div>
        )}
      </div>

      {/* Templates */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[14px] font-semibold text-[#111827]">Start from a template</div>
            <div className="text-[12px] text-[#6A6A6A]">Pre-built agents you can customize in minutes.</div>
          </div>
          <button onClick={() => alert("Browse templates — mock")} className="text-[12px] font-semibold text-brand-emerald hover:underline">
            Browse all →
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[
            { name: "Lead qualifier", desc: "BANT framework, books demos.", icon: Sparkles, accent: "emerald" },
            { name: "Cart recovery", desc: "Re-engages abandoned carts.", icon: Zap, accent: "amber" },
            { name: "FAQ Bot", desc: "Answers from your knowledge base.", icon: MessageSquare, accent: "blue" },
          ].map((t) => (
            <button
              key={t.name}
              onClick={() => setShowCreate({ template: t.name })}
              className="flex flex-col items-start gap-2 rounded-[10px] border border-[#E5E7EB] bg-white p-3 text-left hover:border-[#0F172A]/30 hover:shadow-sm"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-[8px] ${ACCENT[t.accent].bg} ${ACCENT[t.accent].text}`}>
                <t.icon size={16} strokeWidth={1.75} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[#111827]">{t.name}</div>
                <div className="text-[12px] text-[#6A6A6A]">{t.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <CreateAgentModal
          initialName={showCreate.template || ""}
          onClose={() => setShowCreate(false)}
          onCreate={addAgent}
        />
      )}

      {/* Detail drawer */}
      {selected && <AgentDetailDrawer agent={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function Metric({ icon: Icon, label, value, accent }) {
  const a = ACCENT[accent];
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-3.5">
      <div className="flex items-center justify-between">
        <div className={`flex h-7 w-7 items-center justify-center rounded-[8px] ${a.bg} ${a.text}`}>
          <Icon size={14} strokeWidth={2} />
        </div>
      </div>
      <div className="mt-2 text-[20px] font-semibold leading-none text-[#0F172A]">{value}</div>
      <div className="mt-1 text-[12px] text-[#6A6A6A]">{label}</div>
    </div>
  );
}

function FilterTab({ active, onClick, count, children }) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-[12px] font-semibold",
        active ? "bg-[#111827] text-white" : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]",
      ].join(" ")}
    >
      {children}
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-white/15" : "bg-[#F3F4F6]"}`}>{count}</span>
    </button>
  );
}

function AgentCard({ agent, onOpen, onToggle, onDuplicate, onDelete }) {
  const [menu, setMenu] = useState(false);
  const a = ACCENT[agent.accent];
  const s = STATUS_PILL[agent.status];
  const Icon = agent.icon;
  const resolutionRate = agent.conversations
    ? Math.round((agent.resolved / agent.conversations) * 100)
    : 0;

  return (
    <div
      onClick={onOpen}
      className="group relative cursor-pointer rounded-[12px] border border-[#E5E7EB] bg-white p-4 hover:border-[#0F172A]/30 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${a.bg} ${a.text} ring-1 ${a.ring}`}>
            <Icon size={18} strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-[#0F172A]">{agent.name}</div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 rounded-full ${s.bg} ${s.text} px-1.5 py-0.5 text-[10px] font-semibold`}>
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </span>
              <span className="text-[11px] text-[#6A6A6A]">{agent.channel}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenu((v) => !v); }}
            className="rounded p-1 text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#374151]"
          >
            <MoreHorizontal size={16} />
          </button>
          {menu && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenu(false); }} />
              <div className="absolute right-0 top-7 z-20 w-44 rounded-[8px] border border-[#E5E7EB] bg-white p-1 shadow-lg">
                <MenuItem icon={agent.status === "active" ? Pause : Play} label={agent.status === "active" ? "Pause" : "Activate"} onClick={(e) => { e.stopPropagation(); onToggle(); setMenu(false); }} />
                <MenuItem icon={Copy} label="Duplicate" onClick={(e) => { e.stopPropagation(); onDuplicate(); setMenu(false); }} />
                <MenuItem icon={Settings} label="Settings" onClick={(e) => { e.stopPropagation(); alert("Settings — mock"); setMenu(false); }} />
                <div className="my-1 h-px bg-[#F3F4F6]" />
                <MenuItem icon={Trash2} label="Delete" danger onClick={(e) => { e.stopPropagation(); onDelete(); setMenu(false); }} />
              </div>
            </>
          )}
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-[#475569]">{agent.description}</p>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#F1F5F9] pt-3">
        <Stat label="Conversations" value={agent.conversations.toLocaleString()} />
        <Stat label="Resolution" value={`${resolutionRate}%`} />
        <Stat label="Leads" value={agent.leadsBooked.toLocaleString()} />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-[#6A6A6A]">
        <span>Model: <span className="font-semibold text-[#374151]">{agent.model}</span></span>
        <span className="inline-flex items-center gap-1 font-semibold text-brand-emerald opacity-0 group-hover:opacity-100">
          Open <ArrowUpRight size={12} />
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-[14px] font-semibold text-[#0F172A]">{value}</div>
      <div className="text-[11px] text-[#6A6A6A]">{label}</div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-[12px] font-medium",
        danger ? "text-red-600 hover:bg-red-50" : "text-[#374151] hover:bg-[#F3F4F6]",
      ].join(" ")}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

function CreateAgentModal({ initialName, onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: initialName,
    description: "",
    channel: "WhatsApp",
    model: "GPT-4o",
    icon: Sparkles,
    accent: "emerald",
    prompt: "",
  });
  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const canNext = step === 1 ? form.name.trim() : step === 2 ? true : form.prompt.trim();

  const handleSubmit = () => {
    if (!form.name.trim()) return alert("Name required");
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-[14px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3.5">
          <div>
            <div className="text-[15px] font-semibold text-[#0F172A]">Create AI agent</div>
            <div className="text-[12px] text-[#6A6A6A]">Step {step} of 3</div>
          </div>
          <button onClick={onClose} className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"><X size={16} /></button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 px-5 pt-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`h-1 flex-1 rounded ${n <= step ? "bg-[#111827]" : "bg-[#E5E7EB]"}`} />
          ))}
        </div>

        <div className="px-5 py-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Agent name</Label>
                <input
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="e.g. Customer Support Bot"
                  className="mt-1 h-10 w-full rounded-[8px] border border-[#E5E7EB] px-3 text-[14px] outline-none focus:border-[#0F172A]"
                  autoFocus
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={form.description}
                  onChange={(e) => update({ description: e.target.value })}
                  rows={3}
                  placeholder="What does this agent do?"
                  className="mt-1 w-full rounded-[8px] border border-[#E5E7EB] p-3 text-[13px] outline-none focus:border-[#0F172A]"
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="mt-1.5 flex gap-2">
                  {Object.keys(ACCENT).map((k) => (
                    <button
                      key={k}
                      onClick={() => update({ accent: k })}
                      className={`h-7 w-7 rounded-full ring-2 ring-offset-2 ${ACCENT[k].dot} ${form.accent === k ? "ring-[#0F172A]" : "ring-transparent"}`}
                      aria-label={k}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Channel</Label>
                <select
                  value={form.channel}
                  onChange={(e) => update({ channel: e.target.value })}
                  className="mt-1 h-10 w-full rounded-[8px] border border-[#E5E7EB] px-3 text-[14px] outline-none focus:border-[#0F172A]"
                >
                  <option>WhatsApp</option>
                  <option>Instagram</option>
                  <option>Web widget</option>
                  <option>WhatsApp + Web</option>
                  <option>All channels</option>
                </select>
              </div>
              <div>
                <Label>Model</Label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {["GPT-4o", "GPT-4o-mini", "Claude Sonnet 4.5", "Claude Haiku"].map((m) => (
                    <button
                      key={m}
                      onClick={() => update({ model: m })}
                      className={[
                        "flex items-center gap-2 rounded-[8px] border p-2.5 text-left text-[13px] font-semibold",
                        form.model === m ? "border-[#111827] bg-[#F9FAFB]" : "border-[#E5E7EB] hover:bg-[#F9FAFB]",
                      ].join(" ")}
                    >
                      <Sparkles size={14} className="text-violet-500" />
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>System prompt</Label>
                <textarea
                  value={form.prompt}
                  onChange={(e) => update({ prompt: e.target.value })}
                  rows={8}
                  placeholder="You are a helpful assistant for [company]. Your job is to..."
                  className="mt-1 w-full rounded-[8px] border border-[#E5E7EB] p-3 font-mono text-[12px] outline-none focus:border-[#0F172A]"
                />
              </div>
              <div className="rounded-[8px] bg-[#F9FAFB] p-3 text-[12px] text-[#475569]">
                💡 Tip: Be specific about tone, escalation rules, and which questions to refuse.
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#E5E7EB] px-5 py-3.5">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            className="rounded-[8px] px-3 py-1.5 text-[13px] font-semibold text-[#6B7280] hover:bg-[#F3F4F6]"
          >
            {step > 1 ? "Back" : "Cancel"}
          </button>
          {step < 3 ? (
            <button
              disabled={!canNext}
              onClick={() => setStep(step + 1)}
              className="rounded-[8px] bg-[#111827] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              disabled={!canNext}
              onClick={handleSubmit}
              className="rounded-[8px] bg-brand-emerald px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
            >
              Create agent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AgentDetailDrawer({ agent, onClose }) {
  const a = ACCENT[agent.accent];
  const s = STATUS_PILL[agent.status];
  const Icon = agent.icon;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="h-full w-[480px] overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5E7EB] bg-white px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${a.bg} ${a.text}`}>
              <Icon size={18} strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-[#0F172A]">{agent.name}</div>
              <span className={`inline-flex items-center gap-1 rounded-full ${s.bg} ${s.text} px-1.5 py-0.5 text-[10px] font-semibold`}>
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"><X size={16} /></button>
        </div>

        <div className="space-y-5 p-5">
          <Section title="Overview">
            <p className="text-[13px] leading-relaxed text-[#475569]">{agent.description}</p>
          </Section>

          <Section title="Stats (last 30 days)">
            <div className="grid grid-cols-3 gap-3">
              <DetailStat label="Conversations" value={agent.conversations.toLocaleString()} />
              <DetailStat label="Resolved" value={agent.resolved.toLocaleString()} />
              <DetailStat label="Leads booked" value={agent.leadsBooked.toLocaleString()} />
            </div>
          </Section>

          <Section title="Configuration">
            <Row k="Model" v={agent.model} />
            <Row k="Channel" v={agent.channel} />
            <Row k="Max turns" v="20" />
            <Row k="Handoff" v="Auto-escalate to human after 3 failed attempts" />
          </Section>

          <Section title="Recent activity">
            <div className="space-y-2">
              {[
                { who: "Anika V.", what: "Asked about return policy", ago: "2m" },
                { who: "Raj P.", what: "Booked a demo for Friday", ago: "12m" },
                { who: "Sara L.", what: "Escalated to support team", ago: "1h" },
              ].map((e, i) => (
                <div key={i} className="flex items-start justify-between rounded-[8px] bg-[#F9FAFB] p-2.5">
                  <div>
                    <div className="text-[13px] font-semibold text-[#0F172A]">{e.who}</div>
                    <div className="text-[12px] text-[#6A6A6A]">{e.what}</div>
                  </div>
                  <span className="text-[11px] text-[#9CA3AF]">{e.ago}</span>
                </div>
              ))}
            </div>
          </Section>

          <div className="flex gap-2">
            <button onClick={() => alert("Edit agent — mock")} className="flex-1 rounded-[8px] bg-[#111827] py-2 text-[13px] font-semibold text-white hover:bg-[#1F2937]">
              Edit configuration
            </button>
            <button onClick={() => alert("Test in playground — mock")} className="flex-1 rounded-[8px] border border-[#E5E7EB] py-2 text-[13px] font-semibold text-[#374151] hover:bg-[#F9FAFB]">
              Test in playground
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">{title}</div>
      {children}
    </div>
  );
}

function DetailStat({ label, value }) {
  return (
    <div className="rounded-[8px] border border-[#E5E7EB] p-3">
      <div className="text-[18px] font-semibold text-[#0F172A]">{value}</div>
      <div className="text-[11px] text-[#6A6A6A]">{label}</div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-start justify-between border-b border-[#F1F5F9] py-2 text-[13px] last:border-0">
      <span className="text-[#6A6A6A]">{k}</span>
      <span className="max-w-[60%] text-right font-medium text-[#0F172A]">{v}</span>
    </div>
  );
}

function Label({ children }) {
  return <label className="text-[12px] font-semibold text-[#374151]">{children}</label>;
}
