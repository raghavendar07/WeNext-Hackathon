import { useState } from "react";
import { Plus } from "lucide-react";
import { InstagramLogo, LinkedinLogo } from "../BrandLogos.jsx";
import { FacebookLogo } from "./SocialLogos.jsx";
import { INITIAL_ACCOUNTS, PLATFORMS } from "./data.js";
import ConnectModal from "./ConnectModal.jsx";
import QueueTab from "./QueueTab.jsx";
import CalendarTab from "./CalendarTab.jsx";
import PostsTab from "./PostsTab.jsx";
import AnalyticsTab from "./AnalyticsTab.jsx";
import DraftsTab from "./DraftsTab.jsx";
import CreatePostFlow from "./CreatePostFlow.jsx";
import PostDetailPage from "./PostDetailPage.jsx";

const LOGO_BY_ID = { linkedin: LinkedinLogo, facebook: FacebookLogo, instagram: InstagramLogo };

const TABS = [
  { id: "analytics", label: "Analytics" },
  { id: "calendar",  label: "Calendar" },
  { id: "queue",     label: "Queue" },
  { id: "drafts",    label: "Drafts" },
  { id: "posts",     label: "Posts" },
];

export default function SocialMediaPostsPage() {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [tab, setTab] = useState("analytics");
  const [connectOpen, setConnectOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [toast, setToast] = useState(null);

  const toggleAccount = (id) => {
    setAccounts((prev) => {
      const cur = prev[id] ?? { connected: false };
      if (cur.connected) {
        return { ...prev, [id]: { connected: false, name: null, handle: null } };
      }
      const defaults = {
        linkedin: { name: "WeNext Retail",      handle: "wenext-retail" },
        facebook: { name: "WeNext Retail Page", handle: "wenextretail" },
        instagram:{ name: "wenext.retail",      handle: "wenext.retail" },
      };
      return { ...prev, [id]: { connected: true, ...defaults[id] } };
    });
  };

  const showToast = (text) => {
    setToast(text);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2400);
  };

  if (viewing) {
    return <PostDetailPage post={viewing} onBack={() => setViewing(null)} />;
  }

  if (creating) {
    return (
      <CreatePostFlow
        accounts={accounts}
        onCancel={() => setCreating(false)}
        onPublish={(result) => {
          setCreating(false);
          if (result.kind === "now") {
            const names = result.channels.map((id) => PLATFORMS.find((p) => p.id === id)?.name).join(", ");
            showToast(`Post published to ${names}`);
          } else {
            showToast("Post scheduled — we'll publish automatically");
          }
        }}
      />
    );
  }

  const disconnectedNeedsAttention = Object.entries(accounts).filter(([, v]) => !v.connected).length > 0;

  return (
    <div className="flex flex-col gap-4">
      <Header
        accounts={accounts}
        onOpenConnect={() => setConnectOpen(true)}
        onCreate={() => setCreating(true)}
      />

      <TabStrip tab={tab} onChange={setTab} />

      {disconnectedNeedsAttention && tab !== "analytics" && (
        <ReconnectBanner accounts={accounts} onOpenConnect={() => setConnectOpen(true)} />
      )}

      {tab === "analytics" && <AnalyticsTab accounts={accounts} />}
      {tab === "calendar"  && <CalendarTab onOpen={setViewing} />}
      {tab === "queue"     && <QueueTab     accounts={accounts} onCreate={() => setCreating(true)} onOpen={setViewing} />}
      {tab === "drafts"    && <DraftsTab onCreate={() => setCreating(true)} onOpen={setViewing} />}
      {tab === "posts"     && <PostsTab onOpen={setViewing} />}

      {connectOpen && (
        <ConnectModal
          accounts={accounts}
          onToggle={toggleAccount}
          onClose={() => setConnectOpen(false)}
        />
      )}

      {toast && (
        <div role="status" className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-ink-heading px-4 py-2 text-[12px] font-medium text-white shadow-card">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ──────────── Header ──────────── */

function Header({ accounts, onOpenConnect, onCreate }) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-semibold text-ink-heading">Social Posts</h1>
        <p className="text-[13px] font-medium text-ink-muted">
          Plan, publish, and track posts across LinkedIn, Facebook, and Instagram.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <ConnectionStatusPill accounts={accounts} onClick={onOpenConnect} />
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90"
        >
          <Plus size={14} strokeWidth={2} />
          Create Post
        </button>
      </div>
    </header>
  );
}

function ConnectionStatusPill({ accounts, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
    >
      {PLATFORMS.map((p) => {
        const Logo = LOGO_BY_ID[p.id];
        const isConnected = !!accounts[p.id]?.connected;
        return (
          <span key={p.id} className="inline-flex items-center gap-1">
            <Logo size={14} />
            <span aria-hidden className={["h-1.5 w-1.5 rounded-full", isConnected ? "bg-success" : "bg-ink-subtle"].join(" ")} />
          </span>
        );
      })}
      <span className="ml-1 text-[11px] font-semibold text-brand-emerald">Manage</span>
    </button>
  );
}

/* ──────────── Tab strip ──────────── */

function TabStrip({ tab, onChange }) {
  return (
    <div className="flex w-full items-center border-b border-line">
      {TABS.map((t) => {
        const isActive = t.id === tab;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={[
              "-mb-px flex items-end gap-2 border-b-2 px-[15px] pb-[10px] pt-2 text-[12px] font-semibold transition-colors duration-150 ease-out",
              isActive ? "border-brand-emerald text-brand-emerald" : "border-transparent text-ink-muted hover:text-ink-heading",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ──────────── Reconnect banner ──────────── */

function ReconnectBanner({ accounts, onOpenConnect }) {
  const missing = Object.entries(accounts).filter(([, v]) => !v.connected).map(([id]) => PLATFORMS.find((p) => p.id === id)?.name).filter(Boolean);
  return (
    <aside className="flex items-center justify-between gap-3 rounded-md border-l-4 border-warning bg-warning-bg/40 p-3">
      <span className="text-[12px] font-medium text-ink-body">
        {missing.join(", ")} {missing.length === 1 ? "isn't" : "aren't"} connected. Posts to {missing.length === 1 ? "it" : "them"} will fail until you reconnect.
      </span>
      <button type="button" onClick={onOpenConnect} className="inline-flex h-8 items-center rounded-button border border-line bg-white px-3 text-[11px] font-semibold text-ink-body hover:bg-surface-subtle">
        Manage connections
      </button>
    </aside>
  );
}
