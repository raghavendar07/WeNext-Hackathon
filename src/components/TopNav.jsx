import { useEffect, useRef, useState } from "react";
import {
  Search,
  Sparkles,
  Bell,
  HelpCircle,
  Send,
  ChevronDown,
  User,
  Megaphone,
  ShoppingBag,
  Workflow,
  LogOut,
  CreditCard,
  Settings,
  Building2,
} from "lucide-react";
import Logo from "./Logo.jsx";
import NotificationPanel from "./NotificationPanel.jsx";
import Modal from "./ui/Modal.jsx";

const MOCK_SEARCH_RESULTS = [
  {
    id: "r1",
    type: "Customer",
    title: "Aarav Mehta",
    subtext: "aarav@acme.io · Last seen 2h ago",
    icon: User,
  },
  {
    id: "r2",
    type: "Campaign",
    title: "Spring Promo — WhatsApp",
    subtext: "Sent · 12.4k delivered",
    icon: Megaphone,
  },
  {
    id: "r3",
    type: "Order",
    title: "Order #10245",
    subtext: "₹2,499 · Paid · 3 items",
    icon: ShoppingBag,
  },
  {
    id: "r4",
    type: "Automation",
    title: "Abandoned cart recovery",
    subtext: "Active · 38 entered today",
    icon: Workflow,
  },
];

const AI_CHIPS = [
  "Summarize today's leads",
  "Draft a campaign",
  "Explain my metrics",
];

const FAQS = [
  {
    q: "How to send first campaign?",
    a: "Go to Marketing → Campaigns, click New campaign, pick a channel, build your message, then schedule or send now.",
  },
  {
    q: "How to add WhatsApp?",
    a: "Open Channels → WhatsApp from the sidebar and follow the connection steps for your Business Account.",
  },
  {
    q: "How to invite teammates?",
    a: "Open Profile → Settings → General → Team and click Invite. Members receive an email with a join link.",
  },
  {
    q: "How to upgrade plan?",
    a: "Open Profile → Upgrade plan and choose Pro or Business. Billing is monthly with no setup fees.",
  },
];

export default function TopNav() {
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAskAI, setShowAskAI] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const notificationsTriggerRef = useRef(null);
  const askAiTriggerRef = useRef(null);
  const profileTriggerRef = useRef(null);
  const askAiPanelRef = useRef(null);
  const profilePanelRef = useRef(null);
  const searchPopoverRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close Ask AI panel on outside click / Escape
  useEffect(() => {
    if (!showAskAI) return;
    function handlePointerDown(e) {
      if (askAiPanelRef.current?.contains(e.target)) return;
      if (askAiTriggerRef.current?.contains(e.target)) return;
      setShowAskAI(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setShowAskAI(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showAskAI]);

  // Close Profile panel on outside click / Escape
  useEffect(() => {
    if (!showProfile) return;
    function handlePointerDown(e) {
      if (profilePanelRef.current?.contains(e.target)) return;
      if (profileTriggerRef.current?.contains(e.target)) return;
      setShowProfile(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setShowProfile(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showProfile]);

  // Close Search popover on outside click
  useEffect(() => {
    if (!searchOpen) return;
    function handlePointerDown(e) {
      if (searchPopoverRef.current?.contains(e.target)) return;
      if (searchInputRef.current?.contains(e.target)) return;
      setSearchOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [searchOpen]);

  const queryTrim = query.trim();
  const filteredResults = queryTrim
    ? MOCK_SEARCH_RESULTS.filter(
        (r) =>
          r.title.toLowerCase().includes(queryTrim.toLowerCase()) ||
          r.type.toLowerCase().includes(queryTrim.toLowerCase())
      )
    : [];
  const showSearchPopover = searchOpen && queryTrim.length > 0;

  const handleAskAiToggle = () => {
    setShowNotifications(false);
    setShowProfile(false);
    setShowAskAI((v) => !v);
    setAiResponse("");
  };

  const handleNotificationsToggle = () => {
    setShowAskAI(false);
    setShowProfile(false);
    setShowNotifications((v) => !v);
  };

  const handleProfileToggle = () => {
    setShowAskAI(false);
    setShowNotifications(false);
    setShowProfile((v) => !v);
  };

  const handleSendAi = () => {
    if (!aiText.trim()) return;
    setAiResponse("Working on it… (mock)");
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white px-4"
      role="banner"
    >
      <div className="flex w-[228px] items-center pl-1">
        <Logo className="h-[24px] w-auto" />
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <label ref={searchInputRef} className="relative hidden md:block">
          <Search
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-500"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search…"
            aria-label="Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                alert(`Searching: ${query}`);
              }
              if (e.key === "Escape") {
                setSearchOpen(false);
              }
            }}
            className={[
              "h-9 w-64 rounded-lg bg-[#F9FAFB] pl-8 pr-3 text-[13px] text-ink-900 placeholder:text-ink-500",
              "transition-colors duration-150 ease-out",
              "hover:bg-[#F3F4F6] focus:bg-white",
              "focus:outline-none focus:ring-2 focus:ring-brand-500/30",
            ].join(" ")}
          />

          {showSearchPopover && (
            <div
              ref={searchPopoverRef}
              className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-xl"
            >
              <div className="border-b border-[#E5E7EB] px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                Top results
              </div>
              <div className="flex flex-col py-1">
                {filteredResults.length === 0 && (
                  <div className="px-3 py-3 text-[12px] text-[#6B7280]">
                    No results for "{queryTrim}".
                  </div>
                )}
                {filteredResults.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      alert(`Opening ${r.type}: ${r.title}`);
                      setSearchOpen(false);
                    }}
                    className="flex items-start gap-2.5 px-3 py-2 text-left hover:bg-[#F3F4F6]"
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#F3F4F6] text-[#5E6373]">
                      <r.icon size={14} strokeWidth={1.75} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                          {r.type}
                        </span>
                      </span>
                      <span className="truncate text-[13px] font-medium text-[#111827]">
                        {r.title}
                      </span>
                      <span className="truncate text-[11px] text-[#6B7280]">
                        {r.subtext}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </label>

        <div className="relative">
          <button
            ref={askAiTriggerRef}
            type="button"
            onClick={handleAskAiToggle}
            aria-haspopup="dialog"
            aria-expanded={showAskAI}
            className={[
              "inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-50 px-3 text-[13px] font-medium text-brand-700",
              "transition-colors duration-150 ease-out hover:bg-brand-100",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
            ].join(" ")}
          >
            <Sparkles size={16} strokeWidth={1.75} />
            Ask AI
          </button>

          {showAskAI && (
            <div
              ref={askAiPanelRef}
              role="dialog"
              aria-label="Ask AI"
              className="absolute right-0 top-full z-40 mt-2 w-[360px] rounded-[14px] border border-[#E5E7EB] bg-white shadow-xl"
            >
              <div className="flex items-center gap-2 border-b border-[#E5E7EB] px-4 py-3">
                <Sparkles
                  size={16}
                  strokeWidth={1.75}
                  className="text-brand-700"
                />
                <span className="text-[14px] font-semibold text-[#0F172A]">
                  Ask AI
                </span>
              </div>
              <div className="flex flex-col gap-3 px-4 py-4">
                <textarea
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  placeholder="Ask anything about your workspace…"
                  rows={3}
                  className={[
                    "w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#0F172A] placeholder:text-[#9CA3AF]",
                    "focus:outline-none focus:ring-2 focus:ring-brand-500/30",
                  ].join(" ")}
                />
                <div className="flex flex-wrap gap-1.5">
                  {AI_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setAiText(chip)}
                      className="inline-flex items-center rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[11px] font-medium text-[#5E6373] hover:bg-[#E5E7EB]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                {aiResponse && (
                  <div className="rounded-lg bg-brand-50 px-3 py-2 text-[12px] text-brand-700">
                    {aiResponse}
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSendAi}
                    disabled={!aiText.trim()}
                    className={[
                      "inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-[12px] font-semibold text-white",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      "hover:bg-brand-700",
                    ].join(" ")}
                  >
                    <Send size={12} strokeWidth={2} />
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <IconButton
            innerRef={notificationsTriggerRef}
            label="Notifications"
            onClick={handleNotificationsToggle}
          >
            <Bell size={20} strokeWidth={1.75} className="text-ink-700" />
          </IconButton>
          <NotificationPanel
            open={showNotifications}
            onClose={() => setShowNotifications(false)}
            triggerRef={notificationsTriggerRef}
            anchor="top-right"
          />
        </div>

        <IconButton label="Help" onClick={() => setShowHelp(true)}>
          <HelpCircle size={20} strokeWidth={1.75} className="text-ink-700" />
        </IconButton>

        <div className="relative">
          <button
            ref={profileTriggerRef}
            type="button"
            aria-label="Profile"
            aria-haspopup="menu"
            aria-expanded={showProfile}
            onClick={handleProfileToggle}
            className={[
              "ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-[12px] font-semibold text-brand-700",
              "transition-shadow duration-150 ease-out",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
            ].join(" ")}
          >
            RS
          </button>

          {showProfile && (
            <div
              ref={profilePanelRef}
              role="menu"
              className="absolute right-0 top-full z-40 mt-2 w-[280px] overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-xl"
            >
              <div className="flex items-center gap-2.5 px-4 py-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[13px] font-semibold text-brand-700">
                  RS
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-[#111827]">
                    Raghav S
                  </div>
                  <div className="truncate text-[11px] text-[#6B7280]">
                    design@photonxtech.com
                  </div>
                  <div className="truncate text-[11px] font-medium text-brand-700">
                    Pro plan
                  </div>
                </div>
              </div>
              <div className="h-px bg-[#E5E7EB]" />
              <div className="flex flex-col py-1">
                <ProfileMenuItem
                  icon={Settings}
                  label="Account settings"
                  onClick={() => {
                    alert("Account settings — mock");
                    setShowProfile(false);
                  }}
                />
                <ProfileMenuItem
                  icon={CreditCard}
                  label="Billing"
                  onClick={() => {
                    alert("Billing — mock");
                    setShowProfile(false);
                  }}
                />
                <ProfileMenuItem
                  icon={Building2}
                  label="Switch workspace"
                  onClick={() => {
                    alert("Switch workspace — mock");
                    setShowProfile(false);
                  }}
                />
              </div>
              <div className="h-px bg-[#E5E7EB]" />
              <div className="flex flex-col py-1">
                <ProfileMenuItem
                  icon={LogOut}
                  label="Log out"
                  danger
                  onClick={() => {
                    alert("Log out — mock");
                    setShowProfile(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </header>
  );
}

function IconButton({ label, children, onClick, innerRef }) {
  return (
    <button
      ref={innerRef}
      type="button"
      aria-label={label}
      onClick={onClick}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-lg",
        "transition-colors duration-150 ease-out hover:bg-[#F9FAFB]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ProfileMenuItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={[
        "flex items-center gap-2.5 px-4 py-2 text-left text-[13px] font-medium",
        "transition-colors duration-150 ease-out hover:bg-[#F3F4F6]",
        danger ? "text-[#DC2626]" : "text-[#374151]",
      ].join(" ")}
    >
      <Icon
        size={15}
        strokeWidth={1.75}
        className={danger ? "text-[#DC2626]" : "text-[#5E6373]"}
      />
      <span className="flex-1">{label}</span>
    </button>
  );
}

function HelpModal({ onClose }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <Modal
      title="Help & Support"
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-lg border border-[#E5E7EB] bg-white px-3 text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => alert("Contact support — mock")}
            className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-3 text-[13px] font-semibold text-white hover:bg-brand-700"
          >
            Contact support
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <section>
          <h3 className="mb-2 text-[13px] font-semibold text-[#111827]">
            Getting started
          </h3>
          <p className="text-[12.5px] text-[#6B7280]">
            Connect a channel, build your first campaign, and invite your team.
            Most workspaces are set up in under 10 minutes. Watch the 2-minute
            intro video for a quick overview.
          </p>
        </section>

        <section>
          <h3 className="mb-2 text-[13px] font-semibold text-[#111827]">
            FAQs
          </h3>
          <div className="flex flex-col gap-1.5">
            {FAQS.map((faq, i) => (
              <div
                key={faq.q}
                className="overflow-hidden rounded-lg border border-[#E5E7EB]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-[#F9FAFB]"
                >
                  <span className="text-[13px] font-medium text-[#111827]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className={[
                      "shrink-0 text-[#9CA3AF] transition-transform",
                      openFaq === i ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-[12.5px] text-[#374151]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-brand-50 px-3 py-3">
          <h3 className="mb-1 text-[13px] font-semibold text-[#111827]">
            Still need help?
          </h3>
          <p className="text-[12px] text-[#6B7280]">
            Our team usually replies within 2 hours during business hours.
          </p>
        </section>
      </div>
    </Modal>
  );
}
