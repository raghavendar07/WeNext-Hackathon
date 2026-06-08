import { useState, useRef, useEffect } from "react";
import {
  MessagesSquare,
  Send,
  Bot,
  User,
  Sparkles,
  Paperclip,
  Smile,
  Search,
  Settings,
  Phone,
  Video,
  MoreHorizontal,
  CheckCheck,
  Clock,
  Zap,
  ChevronRight,
} from "lucide-react";

const INITIAL_CONVERSATIONS = [
  {
    id: "c_1",
    name: "Anika Verma",
    initials: "AV",
    accent: "emerald",
    channel: "WhatsApp",
    status: "live",
    handledBy: "ai",
    agent: "Sales Qualifier",
    unread: 2,
    lastMessage: "Sounds great — what's the price for the pro plan?",
    lastAt: "2m",
    messages: [
      { id: 1, from: "user", text: "Hi! I saw your ad on Instagram. Tell me more about your product?", at: "10:32 AM" },
      { id: 2, from: "ai", text: "Hey Anika! 👋 Happy to help. We're an all-in-one platform for WhatsApp Business — campaigns, AI agents, CRM, and commerce. What problem are you trying to solve?", at: "10:32 AM" },
      { id: 3, from: "user", text: "Mainly want to automate replies to leads from my catalog.", at: "10:35 AM" },
      { id: 4, from: "ai", text: "Got it. Our AI Agents can auto-qualify leads, answer FAQs, and even book demos. Most customers see 70%+ resolution without human handoff.", at: "10:35 AM" },
      { id: 5, from: "user", text: "Sounds great — what's the price for the pro plan?", at: "10:37 AM" },
    ],
  },
  {
    id: "c_2",
    name: "Rajesh Patel",
    initials: "RP",
    accent: "blue",
    channel: "Instagram",
    status: "live",
    handledBy: "human",
    agent: "You",
    unread: 0,
    lastMessage: "Thanks! I'll wait for the demo link.",
    lastAt: "8m",
    messages: [
      { id: 1, from: "user", text: "Can we schedule a demo this week?", at: "10:18 AM" },
      { id: 2, from: "human", text: "Absolutely! Sharing the calendar link now.", at: "10:25 AM" },
      { id: 3, from: "user", text: "Thanks! I'll wait for the demo link.", at: "10:28 AM" },
    ],
  },
  {
    id: "c_3",
    name: "Sara Lee",
    initials: "SL",
    accent: "rose",
    channel: "WhatsApp",
    status: "waiting",
    handledBy: "ai",
    agent: "Customer Support",
    unread: 1,
    lastMessage: "My order #4521 still hasn't arrived.",
    lastAt: "14m",
    messages: [
      { id: 1, from: "user", text: "My order #4521 still hasn't arrived.", at: "10:14 AM" },
    ],
  },
  {
    id: "c_4",
    name: "Mohit Kumar",
    initials: "MK",
    accent: "amber",
    channel: "Web",
    status: "resolved",
    handledBy: "ai",
    agent: "FAQ Bot",
    unread: 0,
    lastMessage: "Perfect, thanks for the help!",
    lastAt: "32m",
    messages: [
      { id: 1, from: "user", text: "What payment methods do you accept?", at: "9:55 AM" },
      { id: 2, from: "ai", text: "We accept all major cards, UPI, net banking, and wallets.", at: "9:55 AM" },
      { id: 3, from: "user", text: "Perfect, thanks for the help!", at: "9:56 AM" },
    ],
  },
  {
    id: "c_5",
    name: "Priya Singh",
    initials: "PS",
    accent: "violet",
    channel: "WhatsApp",
    status: "live",
    handledBy: "ai",
    agent: "Appointment Booker",
    unread: 0,
    lastMessage: "Friday at 3pm works for me.",
    lastAt: "45m",
    messages: [
      { id: 1, from: "user", text: "I'd like to book an appointment.", at: "9:40 AM" },
      { id: 2, from: "ai", text: "Sure! I have Fri 3pm, Mon 11am, and Tue 4pm open. Which works?", at: "9:40 AM" },
      { id: 3, from: "user", text: "Friday at 3pm works for me.", at: "9:42 AM" },
    ],
  },
];

const ACCENT = {
  emerald: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
  rose: "bg-rose-100 text-rose-700",
};

const STATUS = {
  live: { dot: "bg-emerald-500", text: "text-emerald-700", label: "Live" },
  waiting: { dot: "bg-amber-500", text: "text-amber-700", label: "Waiting" },
  resolved: { dot: "bg-zinc-400", text: "text-zinc-500", label: "Resolved" },
};

export default function LiveChatPage() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState(INITIAL_CONVERSATIONS[0].id);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [showAiSuggestions, setShowAiSuggestions] = useState(true);
  const scrollRef = useRef(null);

  const active = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeId, active?.messages.length]);

  const filtered = conversations.filter((c) => {
    const matchF = filter === "all" || c.status === filter || (filter === "ai" && c.handledBy === "ai") || (filter === "human" && c.handledBy === "human");
    const matchQ = !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.lastMessage.toLowerCase().includes(query.toLowerCase());
    return matchF && matchQ;
  });

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: Date.now(), from: "human", text, at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) },
              ],
              lastMessage: text,
              lastAt: "now",
              handledBy: "human",
              unread: 0,
            }
          : c
      )
    );
    setDraft("");
  };

  const takeOver = () => {
    setConversations((prev) => prev.map((c) => (c.id === activeId ? { ...c, handledBy: "human", agent: "You" } : c)));
    alert(`Took over from AI. ${active.name} is now your conversation.`);
  };

  const handBackToAI = () => {
    setConversations((prev) => prev.map((c) => (c.id === activeId ? { ...c, handledBy: "ai", agent: "Customer Support" } : c)));
    alert("Handed back to AI agent.");
  };

  const aiSuggestions = active?.handledBy === "human"
    ? [
        "Sure, let me check that for you.",
        "Could you share your order number?",
        "I'll connect you with our specialist.",
      ]
    : [];

  return (
    <div className="-m-2 flex h-[calc(100vh-96px)] overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white">
      {/* List */}
      <aside className="flex w-[340px] shrink-0 flex-col border-r border-[#E5E7EB]">
        <div className="border-b border-[#E5E7EB] p-3.5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessagesSquare size={18} className="text-[#0F172A]" />
              <h2 className="text-[15px] font-semibold text-[#0F172A]">Live Chat</h2>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {conversations.filter((c) => c.status === "live").length} live
            </div>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="h-8 w-full rounded-[8px] border border-[#E5E7EB] bg-white pl-8 pr-3 text-[12px] outline-none focus:border-[#0F172A]"
            />
          </div>
          <div className="mt-2 flex gap-1">
            {[
              ["all", "All"],
              ["ai", "AI"],
              ["human", "Human"],
              ["waiting", "Waiting"],
            ].map(([k, l]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={[
                  "rounded-[6px] px-2 py-1 text-[11px] font-semibold",
                  filter === k ? "bg-[#111827] text-white" : "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3F4F6]",
                ].join(" ")}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((c) => {
            const s = STATUS[c.status];
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={[
                  "flex w-full items-start gap-3 border-b border-[#F1F5F9] p-3 text-left hover:bg-[#F9FAFB]",
                  activeId === c.id ? "bg-[#F0FDF4]/40" : "",
                ].join(" ")}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${ACCENT[c.accent]}`}>
                  {c.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[13px] font-semibold text-[#0F172A]">{c.name}</span>
                    <span className="text-[10px] text-[#9CA3AF]">{c.lastAt}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${s.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF]">• {c.channel}</span>
                    {c.handledBy === "ai" && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-violet-600">
                        <Bot size={10} /> AI
                      </span>
                    )}
                  </div>
                  <div className="mt-1 line-clamp-1 text-[12px] text-[#6A6A6A]">{c.lastMessage}</div>
                </div>
                {c.unread > 0 && (
                  <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-emerald px-1.5 text-[10px] font-semibold text-white">
                    {c.unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Conversation */}
      {active ? (
        <main className="flex flex-1 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold ${ACCENT[active.accent]}`}>
                {active.initials}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[#0F172A]">{active.name}</div>
                <div className="text-[11px] text-[#6A6A6A]">{active.channel} • Handled by {active.handledBy === "ai" ? `🤖 ${active.agent}` : `👤 ${active.agent}`}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {active.handledBy === "ai" ? (
                <button onClick={takeOver} className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#111827] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#1F2937]">
                  <User size={13} /> Take over
                </button>
              ) : (
                <button onClick={handBackToAI} className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E5E7EB] px-3 py-1.5 text-[12px] font-semibold text-[#374151] hover:bg-[#F9FAFB]">
                  <Bot size={13} /> Hand to AI
                </button>
              )}
              <button onClick={() => alert("Call mock")} className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"><Phone size={16} /></button>
              <button onClick={() => alert("Video mock")} className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"><Video size={16} /></button>
              <button onClick={() => alert("Settings mock")} className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"><Settings size={16} /></button>
              <button onClick={() => alert("More mock")} className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"><MoreHorizontal size={16} /></button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#FAFAF9] p-5">
            {active.messages.map((m) => (
              <Bubble key={m.id} msg={m} />
            ))}
          </div>

          {/* AI Suggestions */}
          {showAiSuggestions && aiSuggestions.length > 0 && (
            <div className="border-t border-[#E5E7EB] bg-violet-50/30 px-5 py-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700">
                  <Sparkles size={11} /> AI suggested replies
                </span>
                <button onClick={() => setShowAiSuggestions(false)} className="text-[11px] text-[#6A6A6A] hover:underline">Dismiss</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {aiSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-violet-200 bg-white px-3 py-1 text-[12px] font-medium text-violet-700 hover:bg-violet-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Composer */}
          <div className="border-t border-[#E5E7EB] bg-white p-3">
            <div className="flex items-end gap-2 rounded-[10px] border border-[#E5E7EB] bg-white p-2.5">
              <button onClick={() => alert("Attach mock")} className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"><Paperclip size={16} /></button>
              <button onClick={() => alert("Emoji mock")} className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"><Smile size={16} /></button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(draft);
                  }
                }}
                rows={1}
                placeholder={active.handledBy === "ai" ? "Take over to send a manual reply..." : "Type a message..."}
                disabled={active.handledBy === "ai"}
                className="min-h-[24px] flex-1 resize-none border-none bg-transparent text-[13px] outline-none disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(draft)}
                disabled={active.handledBy === "ai" || !draft.trim()}
                className="inline-flex items-center gap-1 rounded-[8px] bg-brand-emerald px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-50"
              >
                <Send size={13} /> Send
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#9CA3AF]">
              <span>Press Enter to send · Shift+Enter for newline</span>
              <button onClick={() => alert("Quick replies mock")} className="inline-flex items-center gap-1 hover:text-[#374151]">
                <Zap size={10} /> Quick replies
              </button>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex flex-1 items-center justify-center text-[13px] text-[#6A6A6A]">Select a conversation</div>
      )}

      {/* Right panel - contact info */}
      {active && (
        <aside className="hidden w-[280px] shrink-0 border-l border-[#E5E7EB] p-4 lg:block">
          <div className="text-center">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[18px] font-semibold ${ACCENT[active.accent]}`}>
              {active.initials}
            </div>
            <div className="mt-2 text-[14px] font-semibold text-[#0F172A]">{active.name}</div>
            <div className="text-[11px] text-[#6A6A6A]">{active.channel} contact</div>
          </div>
          <div className="mt-5 space-y-3 text-[12px]">
            <InfoRow label="Status" value={STATUS[active.status].label} />
            <InfoRow label="Handled by" value={active.handledBy === "ai" ? `AI: ${active.agent}` : active.agent} />
            <InfoRow label="First contact" value="Today, 9:32 AM" />
            <InfoRow label="Tags" value="Prospect, Enterprise" />
          </div>
          <div className="mt-5 border-t border-[#F1F5F9] pt-4">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Quick actions</div>
            <ActionRow icon={CheckCheck} label="Mark resolved" onClick={() => alert("Marked resolved")} />
            <ActionRow icon={Clock} label="Snooze" onClick={() => alert("Snoozed for 1 hour")} />
            <ActionRow icon={User} label="Assign to teammate" onClick={() => alert("Assign — mock")} />
          </div>
        </aside>
      )}
    </div>
  );
}

function Bubble({ msg }) {
  const isUser = msg.from === "user";
  const isAi = msg.from === "ai";
  const bubble = isUser
    ? "bg-white border border-[#E5E7EB] text-[#111827]"
    : isAi
    ? "bg-violet-600 text-white"
    : "bg-emerald-600 text-white";

  return (
    <div className={["flex", isUser ? "justify-start" : "justify-end"].join(" ")}>
      <div className={`max-w-[70%] rounded-[12px] px-3.5 py-2 text-[13px] leading-relaxed ${bubble}`}>
        {!isUser && (
          <div className="mb-0.5 flex items-center gap-1 text-[10px] opacity-80">
            {isAi ? <Bot size={10} /> : <User size={10} />}
            {isAi ? "AI agent" : "You"}
          </div>
        )}
        <div>{msg.text}</div>
        <div className={["mt-1 text-[10px]", isUser ? "text-[#9CA3AF]" : "opacity-70"].join(" ")}>{msg.at}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between">
      <span className="text-[#6A6A6A]">{label}</span>
      <span className="text-right font-medium text-[#0F172A]">{value}</span>
    </div>
  );
}

function ActionRow({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-[6px] px-2 py-2 text-[12px] font-medium text-[#374151] hover:bg-[#F9FAFB]">
      <span className="inline-flex items-center gap-2">
        <Icon size={13} />
        {label}
      </span>
      <ChevronRight size={12} className="text-[#9CA3AF]" />
    </button>
  );
}
