import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Send,
  User,
  Settings,
  Zap,
  BookOpen,
  Shield,
  ArrowUpRight,
  PlayCircle,
  Plus,
  X,
  ChevronRight,
} from "lucide-react";
import { WhatsappLogo } from "../BrandLogos.jsx";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "prompt", label: "Prompt & Persona" },
  { id: "knowledge", label: "Knowledge base" },
  { id: "tools", label: "Tools & Actions" },
  { id: "handoff", label: "Handoff rules" },
  { id: "test", label: "Test playground" },
];

const SEED_PROMPT = `You are Nia, the WhatsApp assistant for Acme Coffee Co.
Your job:
1. Answer customer questions about products, orders, and pricing.
2. Qualify new leads using BANT (Budget, Authority, Need, Timeline).
3. Book demos by checking calendar and confirming time.
4. Escalate to a human agent for refunds > ₹2000 or sensitive complaints.

Tone: friendly, concise, lightly playful. Use emojis sparingly.
Never make up product info — if unsure, say "Let me connect you with a teammate".`;

const INITIAL_KB = [
  { id: 1, title: "Product catalog.pdf", size: "2.4 MB", trained: true },
  { id: 2, title: "Refund policy.md", size: "12 KB", trained: true },
  { id: 3, title: "FAQ — Shipping & Returns.docx", size: "84 KB", trained: true },
  { id: 4, title: "https://acmecoffee.com/help", size: "Web URL", trained: false },
];

const INITIAL_TOOLS = [
  { id: "t1", name: "Check order status", description: "Look up order by ID and return shipping status.", enabled: true },
  { id: "t2", name: "Book demo", description: "Find next available slot in your calendar and confirm.", enabled: true },
  { id: "t3", name: "Issue refund", description: "Process refund up to ₹2000 without human approval.", enabled: false },
  { id: "t4", name: "Send product catalog", description: "Send PDF or interactive list of products.", enabled: true },
  { id: "t5", name: "Collect lead info", description: "Save name, email, company, intent to CRM.", enabled: true },
];

export default function WhatsAppAIAgentPage() {
  const [tab, setTab] = useState("overview");
  const [enabled, setEnabled] = useState(true);
  const [prompt, setPrompt] = useState(SEED_PROMPT);
  const [persona, setPersona] = useState({ name: "Nia", tone: "Friendly", language: "English" });
  const [kb, setKb] = useState(INITIAL_KB);
  const [tools, setTools] = useState(INITIAL_TOOLS);
  const [handoff, setHandoff] = useState({
    keywords: "refund, complaint, manager, lawsuit",
    failureLimit: 3,
    sensitiveTopics: true,
    afterHours: false,
  });
  const [testMessages, setTestMessages] = useState([
    { id: 1, from: "ai", text: "Hi 👋 I'm Nia from Acme Coffee. How can I help today?" },
  ]);
  const [testDraft, setTestDraft] = useState("");

  const sendTest = () => {
    if (!testDraft.trim()) return;
    const userMsg = { id: Date.now(), from: "user", text: testDraft };
    setTestMessages((m) => [...m, userMsg]);
    setTestDraft("");
    setTimeout(() => {
      setTestMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "ai",
          text: "Thanks for the question! In production I'd answer using the knowledge base + tools. (This is a mock response.)",
        },
      ]);
    }, 600);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#25D366]/10">
            <WhatsappLogo size={26} />
          </div>
          <div>
            <h1 className="flex items-center gap-2 text-[22px] font-semibold leading-tight text-[#0F172A]">
              WhatsApp AI Agent
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                <Sparkles size={10} /> Beta
              </span>
            </h1>
            <p className="mt-1 text-[13px] text-[#6A6A6A]">
              A dedicated AI agent that talks to customers on WhatsApp 24/7, using your business context.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${enabled ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${enabled ? "bg-emerald-500" : "bg-zinc-400"}`} />
            {enabled ? "Connected & active" : "Disabled"}
          </span>
          <button
            onClick={() => setEnabled((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold ${enabled ? "border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
          >
            {enabled ? "Disable agent" : "Enable agent"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatTile icon={MessageSquare} label="Messages handled" value="3,892" sub="↑ 18% vs last week" accent="emerald" />
        <StatTile icon={CheckCircle2} label="Auto-resolution" value="86%" sub="2,450 resolved" accent="blue" />
        <StatTile icon={ArrowUpRight} label="Leads captured" value="142" sub="32 became customers" accent="amber" />
        <StatTile icon={Zap} label="Avg response" value="1.4s" sub="P95: 3.2s" accent="violet" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E5E7EB]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              "border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors",
              tab === t.id ? "border-[#111827] text-[#0F172A]" : "border-transparent text-[#6B7280] hover:text-[#374151]",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {tab === "overview" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <Card title="What your AI does" icon={Bot}>
              <ul className="space-y-2 text-[13px] text-[#475569]">
                {[
                  "Answers product, pricing, and shipping questions instantly",
                  "Qualifies leads using BANT framework, sends to CRM",
                  "Books demos by checking your calendar in real-time",
                  "Tracks orders and processes simple refunds (under ₹2000)",
                  "Escalates to humans when needed — never makes promises it can't keep",
                ].map((line) => (
                  <li key={line} className="flex gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Recent conversations" icon={MessageSquare}>
              <div className="space-y-2">
                {[
                  { user: "Anika V.", text: "Asked about pro pricing → sent catalog + booked demo", at: "2m" },
                  { user: "Mohit K.", text: "Order #4521 status → confirmed shipped, ETA tomorrow", at: "12m" },
                  { user: "Sara L.", text: "Refund query → escalated to support team", at: "1h" },
                  { user: "Raj P.", text: "FAQ on returns → resolved with policy excerpt", at: "2h" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start justify-between rounded-[8px] bg-[#F9FAFB] p-2.5">
                    <div>
                      <div className="text-[13px] font-semibold text-[#0F172A]">{c.user}</div>
                      <div className="text-[12px] text-[#6A6A6A]">{c.text}</div>
                    </div>
                    <span className="text-[11px] text-[#9CA3AF]">{c.at}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Connected" icon={WhatsappLogo}>
              <Row k="WABA ID" v="123456789012345" />
              <Row k="Phone number" v="+91 98765 43210" />
              <Row k="Display name" v="Acme Coffee Co." />
              <Row k="Verified" v="✓ Green tick" />
            </Card>
            <Card title="Model" icon={Sparkles}>
              <Row k="Engine" v="Claude Sonnet 4.5" />
              <Row k="Temperature" v="0.6" />
              <Row k="Max tokens" v="1024" />
              <button onClick={() => setTab("prompt")} className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-[8px] border border-[#E5E7EB] py-2 text-[12px] font-semibold hover:bg-[#F9FAFB]">
                <Settings size={12} /> Adjust model
              </button>
            </Card>
          </div>
        </div>
      )}

      {tab === "prompt" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <Card title="System prompt" icon={Bot}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={14}
                className="w-full rounded-[8px] border border-[#E5E7EB] p-3 font-mono text-[12px] leading-relaxed outline-none focus:border-[#0F172A]"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-[#6A6A6A]">
                <span>{prompt.length} characters · ~{Math.ceil(prompt.length / 4)} tokens</span>
                <button onClick={() => alert("Prompt saved (mock)")} className="rounded-[6px] bg-[#111827] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#1F2937]">
                  Save changes
                </button>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Persona" icon={User}>
              <Field label="Name" value={persona.name} onChange={(v) => setPersona({ ...persona, name: v })} />
              <Field label="Tone" value={persona.tone} onChange={(v) => setPersona({ ...persona, tone: v })} options={["Friendly", "Formal", "Playful", "Concise"]} />
              <Field label="Language" value={persona.language} onChange={(v) => setPersona({ ...persona, language: v })} options={["English", "Hindi", "Hinglish", "Spanish"]} />
            </Card>
            <Card title="Quick templates" icon={BookOpen}>
              <div className="space-y-2">
                {[
                  { name: "Customer support", desc: "Answer FAQs, handle returns." },
                  { name: "Sales qualifier", desc: "BANT framework, demos." },
                  { name: "Order tracker", desc: "Shipping + refunds." },
                ].map((tpl) => (
                  <button
                    key={tpl.name}
                    onClick={() => { setPrompt(`Template: ${tpl.name}\n\nYou are an AI agent. Your purpose: ${tpl.desc}\n\nTone: friendly.`); alert(`Loaded "${tpl.name}" template`); }}
                    className="flex w-full items-center justify-between rounded-[8px] border border-[#E5E7EB] p-2.5 text-left hover:bg-[#F9FAFB]"
                  >
                    <div>
                      <div className="text-[12px] font-semibold text-[#0F172A]">{tpl.name}</div>
                      <div className="text-[11px] text-[#6A6A6A]">{tpl.desc}</div>
                    </div>
                    <ChevronRight size={14} className="text-[#9CA3AF]" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "knowledge" && (
        <KnowledgeBase kb={kb} setKb={setKb} />
      )}

      {tab === "tools" && (
        <ToolsPanel tools={tools} setTools={setTools} />
      )}

      {tab === "handoff" && (
        <Card title="Human handoff rules" icon={Shield}>
          <div className="space-y-4">
            <div>
              <Label>Escalation keywords (comma-separated)</Label>
              <input
                value={handoff.keywords}
                onChange={(e) => setHandoff({ ...handoff, keywords: e.target.value })}
                className="mt-1 h-10 w-full rounded-[8px] border border-[#E5E7EB] px-3 text-[13px] outline-none focus:border-[#0F172A]"
              />
              <p className="mt-1 text-[11px] text-[#6A6A6A]">If user message contains any of these, route to human agent.</p>
            </div>
            <div>
              <Label>Escalate after N failed attempts</Label>
              <input
                type="number"
                value={handoff.failureLimit}
                onChange={(e) => setHandoff({ ...handoff, failureLimit: Number(e.target.value) })}
                className="mt-1 h-10 w-24 rounded-[8px] border border-[#E5E7EB] px-3 text-[13px] outline-none focus:border-[#0F172A]"
              />
            </div>
            <Toggle
              checked={handoff.sensitiveTopics}
              onChange={(v) => setHandoff({ ...handoff, sensitiveTopics: v })}
              label="Auto-detect sensitive topics (complaints, refunds, legal)"
            />
            <Toggle
              checked={handoff.afterHours}
              onChange={(v) => setHandoff({ ...handoff, afterHours: v })}
              label="Send 'human unavailable' message after business hours"
            />
            <button onClick={() => alert("Handoff rules saved (mock)")} className="rounded-[8px] bg-[#111827] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1F2937]">
              Save rules
            </button>
          </div>
        </Card>
      )}

      {tab === "test" && (
        <div className="grid grid-cols-3 gap-4">
          <Card title="Playground" icon={PlayCircle}>
            <div className="space-y-4">
              <div className="h-[400px] space-y-2 overflow-y-auto rounded-[10px] bg-[#FAFAF9] p-3">
                {testMessages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-[10px] px-3 py-2 text-[13px] ${m.from === "user" ? "bg-emerald-600 text-white" : "bg-white border border-[#E5E7EB] text-[#111827]"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] p-2">
                <input
                  value={testDraft}
                  onChange={(e) => setTestDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendTest()}
                  placeholder="Test your agent..."
                  className="flex-1 border-none bg-transparent text-[13px] outline-none"
                />
                <button onClick={sendTest} className="inline-flex items-center gap-1 rounded-[6px] bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-700">
                  <Send size={12} /> Send
                </button>
              </div>
            </div>
          </Card>

          <div className="col-span-1 space-y-4">
            <Card title="Test scenarios" icon={Sparkles}>
              <div className="space-y-2">
                {[
                  "What's the price for the pro plan?",
                  "I want to track my order #4521",
                  "Can I book a demo for Friday?",
                  "Refund my last order",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setTestDraft(s); setTimeout(sendTest, 50); }}
                    className="flex w-full items-center justify-between rounded-[8px] border border-[#E5E7EB] p-2 text-left text-[12px] hover:bg-[#F9FAFB]"
                  >
                    <span className="truncate">{s}</span>
                    <ChevronRight size={12} className="shrink-0 text-[#9CA3AF]" />
                  </button>
                ))}
              </div>
            </Card>
            <Card title="Tips" icon={BookOpen}>
              <ul className="space-y-1.5 text-[11px] text-[#6A6A6A]">
                <li>• Test edge cases: refund, complaint, ambiguous queries</li>
                <li>• Verify escalation keywords trigger handoff</li>
                <li>• Check tone matches your persona setting</li>
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function StatTile({ icon: Icon, label, value, sub, accent }) {
  const colors = {
    emerald: "text-emerald-700 bg-emerald-50",
    blue: "text-blue-700 bg-blue-50",
    amber: "text-amber-700 bg-amber-50",
    violet: "text-violet-700 bg-violet-50",
  }[accent];
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-3.5">
      <div className={`inline-flex h-7 w-7 items-center justify-center rounded-[8px] ${colors}`}>
        <Icon size={14} strokeWidth={2} />
      </div>
      <div className="mt-2 text-[20px] font-semibold text-[#0F172A]">{value}</div>
      <div className="text-[12px] text-[#6A6A6A]">{label}</div>
      {sub && <div className="mt-0.5 text-[11px] font-medium text-emerald-600">{sub}</div>}
    </div>
  );
}

function Card({ title, icon: Icon, children }) {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[#0F172A]">
        {typeof Icon === "function" ? <Icon size={14} /> : null}
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-start justify-between border-b border-[#F1F5F9] py-2 text-[12px] last:border-0">
      <span className="text-[#6A6A6A]">{k}</span>
      <span className="text-right font-medium text-[#0F172A]">{v}</span>
    </div>
  );
}

function Field({ label, value, onChange, options }) {
  return (
    <div className="py-1.5">
      <Label>{label}</Label>
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 h-9 w-full rounded-[8px] border border-[#E5E7EB] px-2 text-[12px] outline-none focus:border-[#0F172A]"
        >
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 h-9 w-full rounded-[8px] border border-[#E5E7EB] px-2 text-[12px] outline-none focus:border-[#0F172A]"
        />
      )}
    </div>
  );
}

function Label({ children }) {
  return <label className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">{children}</label>;
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-[8px] border border-[#E5E7EB] p-3">
      <span className="text-[13px] text-[#374151]">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={["relative h-5 w-9 shrink-0 rounded-full transition", checked ? "bg-emerald-500" : "bg-zinc-300"].join(" ")}
      >
        <span className={["absolute top-0.5 h-4 w-4 rounded-full bg-white transition", checked ? "left-4" : "left-0.5"].join(" ")} />
      </button>
    </label>
  );
}

function KnowledgeBase({ kb, setKb }) {
  const addItem = () => {
    const title = prompt("Add file or URL:");
    if (!title) return;
    setKb([...kb, { id: Date.now(), title, size: title.startsWith("http") ? "Web URL" : "—", trained: false }]);
  };

  const remove = (id) => setKb(kb.filter((k) => k.id !== id));
  const retrain = (id) => {
    setKb(kb.map((k) => (k.id === id ? { ...k, trained: true } : k)));
    alert("Training started (mock). Will be available in ~2 min.");
  };

  return (
    <Card title="Knowledge base" icon={BookOpen}>
      <p className="mb-3 text-[12px] text-[#6A6A6A]">Upload docs, URLs, or paste text. Your AI agent will use them to answer customer questions.</p>
      <div className="space-y-2">
        {kb.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-[8px] border border-[#E5E7EB] p-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-blue-50 text-blue-600">
                <BookOpen size={14} />
              </div>
              <div>
                <div className="text-[12px] font-semibold text-[#0F172A]">{item.title}</div>
                <div className="text-[11px] text-[#6A6A6A]">{item.size}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.trained ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 size={10} /> Trained
                </span>
              ) : (
                <button onClick={() => retrain(item.id)} className="rounded-[6px] bg-[#111827] px-2 py-1 text-[10px] font-semibold text-white hover:bg-[#1F2937]">
                  Train now
                </button>
              )}
              <button onClick={() => remove(item.id)} className="rounded p-1 text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-red-600">
                <X size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={addItem} className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-[8px] border border-dashed border-[#E5E7EB] py-2.5 text-[12px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB]">
        <Plus size={13} /> Add file or URL
      </button>
    </Card>
  );
}

function ToolsPanel({ tools, setTools }) {
  const toggle = (id) => setTools(tools.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
  return (
    <Card title="Tools & Actions" icon={Zap}>
      <p className="mb-3 text-[12px] text-[#6A6A6A]">Pick what your AI can do besides chatting. Disabled tools won't be called.</p>
      <div className="space-y-2">
        {tools.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-[8px] border border-[#E5E7EB] p-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${t.enabled ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-400"}`}>
                <Zap size={15} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[#0F172A]">{t.name}</div>
                <div className="text-[11px] text-[#6A6A6A]">{t.description}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggle(t.id)}
              className={["relative h-5 w-9 shrink-0 rounded-full transition", t.enabled ? "bg-emerald-500" : "bg-zinc-300"].join(" ")}
            >
              <span className={["absolute top-0.5 h-4 w-4 rounded-full bg-white transition", t.enabled ? "left-4" : "left-0.5"].join(" ")} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
