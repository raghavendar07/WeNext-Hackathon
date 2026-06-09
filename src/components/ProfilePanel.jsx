import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Activity,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Check,
  ChevronDown,
  Megaphone,
  Bot,
  Users,
  CreditCard,
  Bell,
  Plug,
} from "lucide-react";
import Modal from "./ui/Modal.jsx";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try the platform with limited features.",
    features: [
      "1 channel",
      "500 messages / month",
      "Basic templates",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For growing teams that want more.",
    featured: true,
    features: [
      "All channels",
      "25,000 messages / month",
      "AI Agents (beta)",
      "Email support",
      "Basic analytics",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "$99",
    period: "per month",
    description: "Advanced features for scale.",
    features: [
      "Unlimited channels",
      "200,000 messages / month",
      "Advanced AI Agents",
      "Priority support",
      "Custom analytics & reports",
      "SSO & audit logs",
    ],
  },
];

const ACTIVITY_ITEMS = [
  {
    id: "a1",
    title: "You sent campaign Spring Promo",
    subtext: "Delivered to 12,432 contacts across WhatsApp.",
    time: "Today, 10:14 AM",
    icon: Megaphone,
  },
  {
    id: "a2",
    title: "AI agent resolved a support thread",
    subtext: "Resolved ticket #2381 for Aarav Mehta in 38 seconds.",
    time: "Today, 9:02 AM",
    icon: Bot,
  },
  {
    id: "a3",
    title: "You added 24 new customers",
    subtext: "Imported via CSV upload to CRM.",
    time: "Yesterday, 4:21 PM",
    icon: Users,
  },
  {
    id: "a4",
    title: "You created an automation",
    subtext: "Welcome flow for new Instagram followers.",
    time: "Yesterday, 11:48 AM",
    icon: Activity,
  },
  {
    id: "a5",
    title: "Billing updated",
    subtext: "Switched payment method to Visa ••4242.",
    time: "Mon, 2:10 PM",
    icon: CreditCard,
  },
];

const SETTINGS_TABS = [
  { id: "general", label: "General", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "billing", label: "Billing", icon: CreditCard },
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

export default function ProfilePanel({
  open,
  onClose,
  triggerRef,
  user = {
    name: "Raghav S",
    email: "design@photonxtech.com",
    initials: "RS",
    plan: "Pro plan",
  },
}) {
  const panelRef = useRef(null);
  const [modal, setModal] = useState(null); // 'upgrade' | 'activity' | 'settings' | 'help' | 'logout'

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e) {
      if (panelRef.current?.contains(e.target)) return;
      if (triggerRef?.current?.contains(e.target)) return;
      onClose?.();
    }

    function handleKey(e) {
      if (e.key === "Escape") {
        onClose?.();
        triggerRef?.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, triggerRef]);

  const openModal = (name) => {
    onClose?.();
    setModal(name);
  };

  return (
    <>
      <div
        ref={panelRef}
        id="profile-panel"
        role="menu"
        aria-hidden={!open}
        className={[
          "absolute bottom-full left-0 right-0 z-30 mb-2",
          "rounded-[12px] border border-[#DADADA] bg-white p-[12px]",
          "origin-bottom transform-gpu transition duration-200 ease-out",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-1 opacity-0",
        ].join(" ")}
      >
        {/* Top: identity */}
        <div className="flex items-center gap-2.5 px-[10px] py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[12px] font-semibold text-brand-emerald">
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-[#111827]">
              {user.name}
            </div>
            <div className="truncate text-[11px] text-[#6B7280]">
              {user.email}
            </div>
            <div className="truncate text-[11px] text-[#6B7280]">
              {user.plan}
            </div>
          </div>
        </div>

        <div className="my-2 h-px bg-[#DADADA]" />

        <div className="flex flex-col gap-0.5">
          <Item
            icon={Sparkles}
            label="Upgrade plan"
            onClick={() => openModal("upgrade")}
          />
          <Item
            icon={Activity}
            label="Activity"
            onClick={() => openModal("activity")}
          />
          <Item
            icon={Settings}
            label="Settings"
            onClick={() => openModal("settings")}
          />
        </div>

        <div className="my-2 h-px bg-[#DADADA]" />

        <div className="flex flex-col gap-0.5">
          <Item
            icon={HelpCircle}
            label="Help"
            onClick={() => openModal("help")}
          />
          <Item
            icon={LogOut}
            label="Log out"
            onClick={() => openModal("logout")}
          />
        </div>
      </div>

      {modal === "upgrade" && (
        <UpgradeModal onClose={() => setModal(null)} />
      )}
      {modal === "activity" && (
        <ActivityDrawer onClose={() => setModal(null)} />
      )}
      {modal === "settings" && (
        <SettingsModal onClose={() => setModal(null)} />
      )}
      {modal === "help" && <HelpModal onClose={() => setModal(null)} />}
      {modal === "logout" && (
        <LogoutModal onClose={() => setModal(null)} />
      )}
    </>
  );
}

function Item({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={[
        "flex min-h-[36px] w-full items-center gap-2.5 rounded-[8px] px-[10px] py-[8px] text-left",
        "transition-colors duration-150 ease-out hover:bg-[#F3F4F6]",
        "focus:outline-none focus-visible:bg-[#F3F4F6] focus-visible:shadow-focus",
      ].join(" ")}
    >
      {Icon && (
        <Icon
          size={16}
          strokeWidth={1.75}
          className="text-[#5E6373]"
          aria-hidden="true"
        />
      )}
      <span className="flex-1 text-[13px] font-medium text-[#5E6373]">
        {label}
      </span>
    </button>
  );
}

function UpgradeModal({ onClose }) {
  return (
    <Modal
      title="Upgrade your plan"
      onClose={onClose}
      size="lg"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 items-center rounded-lg border border-[#E5E7EB] bg-white px-3 text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6]"
        >
          Close
        </button>
      }
    >
      <p className="mb-4 text-[12.5px] text-[#6B7280]">
        Pick the plan that fits your team. Switch or cancel anytime.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={[
              "flex flex-col gap-3 rounded-[12px] border bg-white p-4",
              p.featured
                ? "border-brand-500 shadow-[0_0_0_2px_rgba(79,70,229,0.12)]"
                : "border-[#E5E7EB]",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[14px] font-semibold text-[#111827]">
                  {p.name}
                </div>
                <div className="text-[11px] text-[#6B7280]">{p.description}</div>
              </div>
              {p.featured && (
                <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                  Popular
                </span>
              )}
            </div>
            <div>
              <span className="text-[20px] font-semibold text-[#111827]">
                {p.price}
              </span>
              <span className="ml-1 text-[11px] text-[#6B7280]">{p.period}</span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {p.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-1.5 text-[12px] text-[#374151]"
                >
                  <Check
                    size={13}
                    strokeWidth={2.5}
                    className="mt-0.5 shrink-0 text-[#1EB677]"
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => alert(`Choose ${p.name} — mock`)}
              className={[
                "mt-auto inline-flex h-9 items-center justify-center rounded-lg px-3 text-[13px] font-semibold",
                p.featured
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F3F4F6]",
              ].join(" ")}
            >
              Choose {p.name}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function ActivityDrawer({ onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Activity"
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-[400px] flex-col bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Activity size={16} strokeWidth={1.75} className="text-[#5E6373]" />
            <h2 className="text-[15px] font-semibold text-[#0F172A]">
              Recent activity
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="flex flex-col gap-3">
            {ACTIVITY_ITEMS.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-[10px] border border-[#F3F4F6] bg-white p-3"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#5E6373]">
                  <item.icon size={14} strokeWidth={1.75} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[13px] font-medium text-[#111827]">
                    {item.title}
                  </span>
                  <span className="text-[12px] text-[#6B7280]">
                    {item.subtext}
                  </span>
                  <span className="mt-1 text-[11px] text-[#9CA3AF]">
                    {item.time}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-end border-t border-[#E5E7EB] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-3 text-[13px] font-semibold text-white hover:bg-brand-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ onClose }) {
  const [tab, setTab] = useState("general");
  return (
    <Modal
      title="Settings"
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-lg border border-[#E5E7EB] bg-white px-3 text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => alert("Settings saved — mock")}
            className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-3 text-[13px] font-semibold text-white hover:bg-brand-700"
          >
            Save changes
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4 md:flex-row">
        <nav className="flex shrink-0 flex-row gap-1 md:w-[180px] md:flex-col">
          {SETTINGS_TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={[
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-[#374151] hover:bg-[#F3F4F6]",
                ].join(" ")}
              >
                <Icon size={14} strokeWidth={1.75} />
                <span className="flex-1">{t.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="min-h-[200px] flex-1 rounded-lg border border-[#E5E7EB] bg-[#FAFAFB] p-4">
          {tab === "general" && (
            <div className="flex flex-col gap-2">
              <h3 className="text-[13px] font-semibold text-[#111827]">
                General
              </h3>
              <p className="text-[12.5px] text-[#6B7280]">
                Workspace name, language, timezone, and default landing page.
                Manage your team members and roles here.
              </p>
            </div>
          )}
          {tab === "notifications" && (
            <div className="flex flex-col gap-2">
              <h3 className="text-[13px] font-semibold text-[#111827]">
                Notifications
              </h3>
              <p className="text-[12.5px] text-[#6B7280]">
                Choose which events trigger an email, in-app, or mobile push.
                Set quiet hours and per-channel preferences.
              </p>
            </div>
          )}
          {tab === "integrations" && (
            <div className="flex flex-col gap-2">
              <h3 className="text-[13px] font-semibold text-[#111827]">
                Integrations
              </h3>
              <p className="text-[12.5px] text-[#6B7280]">
                Connect Shopify, Stripe, Zapier, and other tools. Manage API
                keys and webhooks for incoming events.
              </p>
            </div>
          )}
          {tab === "billing" && (
            <div className="flex flex-col gap-2">
              <h3 className="text-[13px] font-semibold text-[#111827]">
                Billing
              </h3>
              <p className="text-[12.5px] text-[#6B7280]">
                View your current plan, payment method, invoices, and usage. To
                change plans, use Upgrade plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
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
            Most workspaces are set up in under 10 minutes.
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
      </div>
    </Modal>
  );
}

function LogoutModal({ onClose }) {
  return (
    <Modal
      title="Log out?"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-lg border border-[#E5E7EB] bg-white px-3 text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              alert("Logged out — mock");
              onClose?.();
            }}
            className="inline-flex h-9 items-center rounded-lg bg-[#DC2626] px-3 text-[13px] font-semibold text-white hover:bg-[#B91C1C]"
          >
            Log out
          </button>
        </>
      }
    >
      <p className="text-[13px] text-[#374151]">
        Are you sure you want to log out? You'll need to sign in again to access
        your workspace.
      </p>
    </Modal>
  );
}
