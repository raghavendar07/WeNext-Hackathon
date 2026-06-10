import { useMemo, useState } from "react";
import {
  Plug,
  Search,
  Check,
  X,
  ChevronRight,
  Settings,
  RefreshCw,
  Filter,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Connected",
  "E-commerce",
  "Payments",
  "CRM",
  "Productivity",
  "Social",
  "Analytics",
  "Industry",
  "Custom",
];

const INTEGRATIONS = [
  // E-commerce
  { id: "shopify",      name: "Shopify",         category: "E-commerce",   tagline: "Sync products, orders, and customers from your Shopify store.",  status: "connected",   logo: "S", color: "emerald" },
  { id: "woocommerce",  name: "WooCommerce",     category: "E-commerce",   tagline: "Pull WooCommerce catalog and order data into WeNext.",            status: "available",   logo: "W", color: "violet"  },
  { id: "magento",      name: "Magento",         category: "E-commerce",   tagline: "Connect Adobe Commerce for product and order sync.",              status: "available",   logo: "M", color: "amber"   },
  { id: "bigcommerce",  name: "BigCommerce",     category: "E-commerce",   tagline: "Multi-channel sync for BigCommerce stores.",                      status: "available",   logo: "B", color: "blue"    },
  { id: "squarespace",  name: "Squarespace",     category: "E-commerce",   tagline: "Bring Squarespace Commerce orders into the inbox.",               status: "coming",      logo: "Sq",color: "zinc"    },
  { id: "wix",          name: "Wix",             category: "E-commerce",   tagline: "Wix Stores integration for catalog + checkout.",                  status: "available",   logo: "W", color: "blue"    },
  { id: "opencart",     name: "OpenCart",        category: "E-commerce",   tagline: "OpenCart product and order pipeline.",                            status: "coming",      logo: "O", color: "sky"     },

  // Payments
  { id: "razorpay",     name: "Razorpay",        category: "Payments",     tagline: "Accept UPI, cards, and netbanking via Razorpay.",                 status: "connected",   logo: "R", color: "blue"    },
  { id: "cashfree",     name: "Cashfree",        category: "Payments",     tagline: "Payouts and collections through Cashfree.",                       status: "available",   logo: "C", color: "emerald" },
  { id: "payu",         name: "PayU",            category: "Payments",     tagline: "PayU payment gateway for India and global.",                      status: "available",   logo: "P", color: "lime"    },
  { id: "stripe",       name: "Stripe",          category: "Payments",     tagline: "Global card processing and recurring billing.",                   status: "available",   logo: "St",color: "violet"  },
  { id: "paypal",       name: "PayPal",          category: "Payments",     tagline: "Accept PayPal across 200+ countries.",                            status: "available",   logo: "Pp",color: "sky"     },
  { id: "wa-payments",  name: "WhatsApp Payments",category:"Payments",     tagline: "Native in-chat payments via Meta WhatsApp Pay.",                  status: "coming",      logo: "Wp",color: "emerald" },

  // CRM
  { id: "hubspot",      name: "HubSpot",         category: "CRM",          tagline: "Two-way contact and deal sync with HubSpot CRM.",                 status: "available",   logo: "H", color: "amber"   },
  { id: "salesforce",   name: "Salesforce",      category: "CRM",          tagline: "Enterprise Salesforce sync for leads, contacts, and opps.",       status: "available",   logo: "Sf",color: "blue"    },
  { id: "zoho",         name: "Zoho",            category: "CRM",          tagline: "Sync conversations to Zoho CRM and Desk.",                        status: "available",   logo: "Z", color: "rose"    },
  { id: "pipedrive",    name: "Pipedrive",       category: "CRM",          tagline: "Pipeline-first CRM sync with Pipedrive.",                         status: "available",   logo: "P", color: "zinc"    },
  { id: "freshsales",   name: "Freshsales",      category: "CRM",          tagline: "Freshworks CRM contact and deal sync.",                           status: "available",   logo: "F", color: "lime"    },

  // Productivity
  { id: "gsheets",      name: "Google Sheets",   category: "Productivity", tagline: "Export campaign and lead data to live spreadsheets.",             status: "connected",   logo: "Gs",color: "emerald" },
  { id: "notion",       name: "Notion",          category: "Productivity", tagline: "Push contact notes and reports into Notion databases.",           status: "available",   logo: "N", color: "zinc"    },
  { id: "airtable",     name: "Airtable",        category: "Productivity", tagline: "Sync any object into Airtable bases.",                            status: "available",   logo: "A", color: "amber"   },
  { id: "zapier",       name: "Zapier",          category: "Productivity", tagline: "Trigger Zaps from any WeNext event.",                             status: "available",   logo: "Z", color: "amber"   },
  { id: "make",         name: "Make (Integromat)",category:"Productivity", tagline: "Visual automations with Make scenarios.",                         status: "available",   logo: "Mk",color: "violet"  },
  { id: "slack",        name: "Slack",           category: "Productivity", tagline: "Get alerts and team handoffs into Slack channels.",               status: "available",   logo: "Sl",color: "violet"  },
  { id: "msteams",      name: "Microsoft Teams", category: "Productivity", tagline: "Route conversations and alerts into Teams.",                      status: "available",   logo: "T", color: "blue"    },

  // Social
  { id: "instagram",    name: "Instagram",       category: "Social",       tagline: "Reply to Instagram DMs and comments from inbox.",                 status: "connected",   logo: "Ig",color: "rose"    },
  { id: "facebook",     name: "Facebook",        category: "Social",       tagline: "Messenger and Page comment replies in one inbox.",                status: "connected",   logo: "Fb",color: "blue"    },
  { id: "linkedin",     name: "LinkedIn",        category: "Social",       tagline: "Page messaging and lead-gen forms.",                              status: "available",   logo: "Li",color: "sky"     },
  { id: "tiktok",       name: "TikTok",          category: "Social",       tagline: "TikTok Shop and DM integration.",                                 status: "coming",      logo: "Tk",color: "zinc"    },
  { id: "youtube",      name: "YouTube",         category: "Social",       tagline: "Reply to comments and pull channel analytics.",                   status: "coming",      logo: "Yt",color: "rose"    },

  // Analytics
  { id: "ga",           name: "Google Analytics",category: "Analytics",    tagline: "Ship campaign events to GA4 properties.",                         status: "available",   logo: "Ga",color: "amber"   },
  { id: "mixpanel",     name: "Mixpanel",        category: "Analytics",    tagline: "Send user and event data to Mixpanel.",                           status: "available",   logo: "Mx",color: "violet"  },
  { id: "amplitude",    name: "Amplitude",       category: "Analytics",    tagline: "Behavioural analytics with Amplitude.",                           status: "available",   logo: "Am",color: "sky"     },
  { id: "segment",      name: "Segment",         category: "Analytics",    tagline: "Forward all WeNext events through Segment CDP.",                  status: "available",   logo: "Sg",color: "emerald" },

  // Industry
  { id: "petpooja",     name: "PetPooja",        category: "Industry",     tagline: "Restaurant POS sync — menu, orders, KOTs.",                       status: "connected",   logo: "Pp",color: "amber"   },
  { id: "calendly",     name: "Calendly",        category: "Industry",     tagline: "Embed Calendly booking links into chats.",                        status: "available",   logo: "Cy",color: "blue"    },
  { id: "calcom",       name: "Cal.com",         category: "Industry",     tagline: "Open-source scheduling, embedded into journeys.",                 status: "available",   logo: "Cc",color: "zinc"    },
  { id: "uberdirect",   name: "Uber Direct",     category: "Industry",     tagline: "On-demand last-mile delivery for orders placed in chat.",         status: "coming",      logo: "Ud",color: "zinc"    },

  // Custom
  { id: "custom-api",   name: "Custom API",      category: "Custom",       tagline: "Build your own integration on the WeNext REST API.",              status: "available",   logo: "{}", color: "emerald" },
  { id: "webhooks",     name: "Webhooks",        category: "Custom",       tagline: "Receive outgoing event webhooks for any object.",                 status: "available",   logo: "Wh", color: "violet"  },
  { id: "custom-crm",   name: "Custom CRM",      category: "Custom",       tagline: "Bring any in-house CRM via mapped fields.",                       status: "available",   logo: "Cc", color: "sky"     },
];

const COLOR = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-100" },
  blue:    { bg: "bg-blue-50",    text: "text-blue-700",    ring: "ring-blue-100"    },
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-100"   },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  ring: "ring-violet-100"  },
  rose:    { bg: "bg-rose-50",    text: "text-rose-700",    ring: "ring-rose-100"    },
  sky:     { bg: "bg-sky-50",     text: "text-sky-700",     ring: "ring-sky-100"     },
  lime:    { bg: "bg-lime-50",    text: "text-lime-700",    ring: "ring-lime-100"    },
  zinc:    { bg: "bg-zinc-100",   text: "text-zinc-700",    ring: "ring-zinc-200"    },
};

const STATUS_PILL = {
  connected: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Connected" },
  available: { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500",    label: "Available" },
  coming:    { bg: "bg-zinc-100",   text: "text-zinc-600",    dot: "bg-zinc-400",    label: "Coming soon" },
};

const CATEGORY_PILL = "bg-[#F3F4F6] text-[#475569]";

export default function IntegrationsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [items, setItems] = useState(INTEGRATIONS);
  const [drawer, setDrawer] = useState(null);
  const [modal, setModal] = useState(null);

  const counts = useMemo(() => {
    const c = { All: items.length, Connected: items.filter((i) => i.status === "connected").length };
    for (const cat of CATEGORIES) {
      if (cat === "All" || cat === "Connected") continue;
      c[cat] = items.filter((i) => i.category === cat).length;
    }
    return c;
  }, [items]);

  const filtered = items.filter((i) => {
    const matchQ = !query || i.name.toLowerCase().includes(query.toLowerCase()) || i.tagline.toLowerCase().includes(query.toLowerCase());
    const matchT = tab === "All" || (tab === "Connected" ? i.status === "connected" : i.category === tab);
    return matchQ && matchT;
  });

  const handleConnect = (id) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: "connected" } : i)));
    setModal(null);
    setTimeout(() => alert("Integration connected successfully (mock)."), 50);
  };

  const handleDisconnect = (id) => {
    if (!confirm("Disconnect this integration? Existing data will remain.")) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: "available" } : i)));
    setDrawer(null);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 py-2">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-50 text-brand-emerald">
              <Plug size={18} strokeWidth={1.75} />
            </div>
            <h1 className="text-[22px] font-semibold leading-tight text-[#0F172A]">Integrations</h1>
          </div>
          <p className="mt-1 text-[13px] text-[#6A6A6A]">
            Connect WeNext with your favourite tools.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search integrations..."
              className="h-9 w-72 rounded-[8px] border border-[#E5E7EB] bg-white pl-9 pr-3 text-[13px] outline-none focus:border-[#0F172A]"
            />
          </div>
          <button
            type="button"
            onClick={() => alert("Filters — mock")}
            className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#E5E7EB] bg-white px-3 text-[12px] font-semibold text-[#374151] hover:bg-[#F9FAFB]"
          >
            <Filter size={14} strokeWidth={1.75} /> Filter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setTab(cat)}
            className={[
              "inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-[12px] font-semibold",
              tab === cat
                ? "bg-[#111827] text-white"
                : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F9FAFB]",
            ].join(" ")}
          >
            {cat}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tab === cat ? "bg-white/15" : "bg-[#F3F4F6]"}`}>
              {counts[cat] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3">
        {filtered.map((i) => (
          <IntegrationCard
            key={i.id}
            item={i}
            onManage={() => setDrawer(i)}
            onConnect={() => setModal(i)}
            onDisconnect={() => handleDisconnect(i.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-4 rounded-[12px] border border-dashed border-[#E5E7EB] bg-white p-10 text-center">
            <Plug size={32} className="mx-auto text-[#9CA3AF]" />
            <div className="mt-2 text-[14px] font-semibold text-[#374151]">No integrations match</div>
            <div className="text-[13px] text-[#6A6A6A]">Try a different search or category.</div>
          </div>
        )}
      </div>

      {/* Drawer */}
      {drawer && (
        <IntegrationDrawer
          item={drawer}
          onClose={() => setDrawer(null)}
          onDisconnect={() => handleDisconnect(drawer.id)}
        />
      )}

      {/* Connect modal */}
      {modal && (
        <ConnectModal
          item={modal}
          onClose={() => setModal(null)}
          onConnect={() => handleConnect(modal.id)}
        />
      )}
    </div>
  );
}

function IntegrationCard({ item, onManage, onConnect, onDisconnect }) {
  const c = COLOR[item.color] || COLOR.zinc;
  const s = STATUS_PILL[item.status];
  const isConnected = item.status === "connected";
  const isComing = item.status === "coming";

  return (
    <div className="group flex h-full flex-col justify-between rounded-[12px] border border-[#E5E7EB] bg-white p-4 hover:border-[#0F172A]/30 hover:shadow-sm">
      <div>
        <div className="flex items-start justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${c.bg} ${c.text} text-[13px] font-bold ring-1 ${c.ring}`}>
            {item.logo}
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full ${s.bg} ${s.text} px-1.5 py-0.5 text-[10px] font-semibold`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>
        <div className="mt-3 text-[14px] font-semibold text-[#0F172A]">{item.name}</div>
        <p className="mt-1 text-[12px] leading-relaxed text-[#6A6A6A] line-clamp-2">{item.tagline}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`inline-flex rounded-full ${CATEGORY_PILL} px-2 py-0.5 text-[10px] font-semibold`}>
          {item.category}
        </span>
        {isConnected ? (
          <button
            onClick={onManage}
            className="inline-flex items-center gap-1 rounded-[8px] border border-[#E5E7EB] px-2.5 py-1.5 text-[12px] font-semibold text-[#374151] hover:bg-[#F9FAFB]"
          >
            Manage <ChevronRight size={12} />
          </button>
        ) : isComing ? (
          <button
            disabled
            className="inline-flex items-center gap-1 rounded-[8px] bg-[#F3F4F6] px-2.5 py-1.5 text-[12px] font-semibold text-[#9CA3AF]"
          >
            <Clock size={12} /> Soon
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="inline-flex items-center gap-1 rounded-[8px] bg-brand-emerald px-2.5 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-600"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}

function IntegrationDrawer({ item, onClose, onDisconnect }) {
  const c = COLOR[item.color] || COLOR.zinc;
  const s = STATUS_PILL[item.status];
  const [showKey, setShowKey] = useState(false);
  const fakeKey = "MOCK_KEY_" + item.id + "_demo_xxxx_xxxx_xxxx_1234";
  const masked = "MOCK_KEY_" + "•".repeat(20) + "1234";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="h-full w-[480px] overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5E7EB] bg-white px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${c.bg} ${c.text} text-[13px] font-bold ring-1 ${c.ring}`}>
              {item.logo}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-[#0F172A]">{item.name}</div>
              <span className={`inline-flex items-center gap-1 rounded-full ${s.bg} ${s.text} px-1.5 py-0.5 text-[10px] font-semibold`}>
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <Section title="About">
            <p className="text-[13px] leading-relaxed text-[#475569]">{item.tagline}</p>
            <button
              onClick={() => alert("Open docs — mock")}
              className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-emerald hover:underline"
            >
              View documentation <ExternalLink size={11} />
            </button>
          </Section>

          <Section title="Sync status">
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="Records synced" value="12,438" />
              <StatBox label="Last sync" value="2 min ago" />
              <StatBox label="Errors (24h)" value="0" />
              <StatBox label="Health" value="Healthy" />
            </div>
          </Section>

          <Section title="API credentials">
            <div className="rounded-[8px] border border-[#E5E7EB] bg-[#FAFAFB] p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">API Key</div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <code className="truncate font-mono text-[12px] text-[#0F172A]">
                  {showKey ? fakeKey : masked}
                </code>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowKey((v) => !v)}
                    className="rounded p-1 text-[#6A6A6A] hover:bg-[#F3F4F6]"
                    title={showKey ? "Hide" : "Show"}
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => alert("Copied to clipboard (mock)")}
                    className="rounded p-1 text-[#6A6A6A] hover:bg-[#F3F4F6]"
                    title="Copy"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
            <Row k="Webhook URL" v="https://api.wenext.io/hooks/in/9f3a2c" />
            <Row k="Connected by" v="raghavendar@photonxtech.com" />
            <Row k="Last sync" v="Today at 09:42 AM" />
          </Section>

          <Section title="Permissions">
            <div className="space-y-1.5">
              {["Read products", "Read orders", "Write customer notes", "Trigger webhooks"].map((p) => (
                <div key={p} className="flex items-center gap-2 text-[12px] text-[#374151]">
                  <CheckCircle2 size={13} className="text-emerald-600" /> {p}
                </div>
              ))}
            </div>
          </Section>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => alert("Test connection succeeded (mock).")}
              className="inline-flex items-center justify-center gap-1.5 rounded-[8px] border border-[#E5E7EB] py-2 text-[13px] font-semibold text-[#374151] hover:bg-[#F9FAFB]"
            >
              <Check size={14} /> Test connection
            </button>
            <button
              onClick={() => alert("Sync started (mock).")}
              className="inline-flex items-center justify-center gap-1.5 rounded-[8px] border border-[#E5E7EB] py-2 text-[13px] font-semibold text-[#374151] hover:bg-[#F9FAFB]"
            >
              <RefreshCw size={14} /> Sync now
            </button>
            <button
              onClick={() => alert("Open settings — mock")}
              className="inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-[#111827] py-2 text-[13px] font-semibold text-white hover:bg-[#1F2937]"
            >
              <Settings size={14} /> Settings
            </button>
            <button
              onClick={onDisconnect}
              className="inline-flex items-center justify-center gap-1.5 rounded-[8px] border border-red-200 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50"
            >
              <X size={14} /> Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectModal({ item, onClose, onConnect }) {
  const c = COLOR[item.color] || COLOR.zinc;
  const [apiKey, setApiKey] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const canConnect = apiKey.trim().length > 4 && storeUrl.trim().length > 4;

  const urlLabel = item.category === "E-commerce"
    ? "Store URL"
    : item.category === "Custom"
    ? "Webhook URL"
    : "Account URL";
  const urlPlaceholder = item.category === "E-commerce"
    ? "https://your-store.myshopify.com"
    : item.category === "Custom"
    ? "https://hooks.example.com/wenext"
    : "https://account.example.com";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-[14px] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${c.bg} ${c.text} text-[12px] font-bold ring-1 ${c.ring}`}>
              {item.logo}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-[#0F172A]">Connect {item.name}</div>
              <div className="text-[12px] text-[#6A6A6A]">{item.category}</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <p className="text-[13px] leading-relaxed text-[#475569]">{item.tagline}</p>

          <div>
            <label className="text-[12px] font-semibold text-[#374151]">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your API key"
              className="mt-1 h-10 w-full rounded-[8px] border border-[#E5E7EB] px-3 font-mono text-[13px] outline-none focus:border-[#0F172A]"
              autoFocus
            />
            <div className="mt-1 text-[11px] text-[#9CA3AF]">
              Find this in your {item.name} dashboard under API settings.
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#374151]">{urlLabel}</label>
            <input
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              placeholder={urlPlaceholder}
              className="mt-1 h-10 w-full rounded-[8px] border border-[#E5E7EB] px-3 text-[13px] outline-none focus:border-[#0F172A]"
            />
          </div>

          <div className="rounded-[8px] border border-[#E0F2FE] bg-[#F0F9FF] p-3 text-[12px] text-[#075985]">
            We store credentials encrypted at rest. You can disconnect any time.
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#E5E7EB] px-5 py-3.5">
          <button
            onClick={onClose}
            className="rounded-[8px] px-3 py-1.5 text-[13px] font-semibold text-[#6B7280] hover:bg-[#F3F4F6]"
          >
            Cancel
          </button>
          <button
            disabled={!canConnect}
            onClick={onConnect}
            className="rounded-[8px] bg-brand-emerald px-4 py-2 text-[13px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            Connect
          </button>
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

function StatBox({ label, value }) {
  return (
    <div className="rounded-[8px] border border-[#E5E7EB] p-3">
      <div className="text-[16px] font-semibold text-[#0F172A]">{value}</div>
      <div className="text-[11px] text-[#6A6A6A]">{label}</div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-start justify-between border-b border-[#F1F5F9] py-2 text-[12px] last:border-0">
      <span className="text-[#6A6A6A]">{k}</span>
      <span className="max-w-[65%] truncate text-right font-medium text-[#0F172A]">{v}</span>
    </div>
  );
}
