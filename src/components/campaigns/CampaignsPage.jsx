import { useMemo, useState } from "react";
import { Mail, MessageSquare, Send, Share2, Sparkles } from "lucide-react";
import CampaignsPageTabs from "./CampaignsPageTabs.jsx";
import CampaignsHeaderBar from "./CampaignsHeaderBar.jsx";
import CampaignsFilterRow from "./CampaignsFilterRow.jsx";
import CampaignKpiRow from "./CampaignKpiRow.jsx";
import CampaignCard from "./CampaignCard.jsx";
import TemplatesPage from "../templates/TemplatesPage.jsx";
import CreateCampaignDrawer from "./create/CreateCampaignDrawer.jsx";

const STATUS_OPTIONS = [
  { id: "all", label: "All Campaigns" },
  { id: "running", label: "Running" },
  { id: "paused", label: "Paused" },
  { id: "drafts", label: "Drafts" },
  { id: "completed", label: "Completed" },
];

const STATUS_TO_VALUE = {
  all: null,
  running: "running",
  paused: "paused",
  drafts: "draft",
  completed: "completed",
};

const TAB_TO_STATUS = {
  all: null,
  active: "running",
  inprogress: "running",
  scheduled: "draft",
  completed: "completed",
  draft: "draft",
};

const CAMPAIGNS = [
  {
    id: "c1",
    title: "Grow Your Reach with Email",
    description:
      "Weekly newsletter sequence introducing new arrivals and product collections to subscribers.",
    category: "email",
    type: "web",
    icon: Mail,
    tags: ["Newsletter", "Acquisition"],
    channels: 3,
    queued: 124,
    status: "running",
    kpis: { delivered: 12480, opened: 8240, clicked: 3120, converted: 540 },
  },
  {
    id: "c2",
    title: "WhatsApp Order Updates",
    description:
      "Automated order confirmation, shipping, and delivery messages for transactional flows.",
    category: "whatsapp",
    type: "mobile",
    icon: Send,
    tags: ["Transactional", "Automated"],
    channels: 2,
    queued: 38,
    status: "running",
    kpis: { delivered: 5320, opened: 4980, clicked: 1820, converted: 312 },
  },
  {
    id: "c3",
    title: "Spring Promo SMS Blast",
    description:
      "One-off SMS to high-intent segment with a 20% discount code for the spring collection.",
    category: "sms",
    type: "mobile",
    icon: MessageSquare,
    tags: ["Promo", "One-off"],
    channels: 1,
    queued: 0,
    status: "paused",
    kpis: { delivered: 8200, opened: 6480, clicked: 1240, converted: 198 },
  },
  {
    id: "c4",
    title: "Instagram Re-engagement",
    description:
      "Story replies and DM sequence for subscribers who haven't engaged in the last 30 days.",
    category: "social",
    type: "presentation",
    icon: Share2,
    tags: ["Re-engagement"],
    channels: 1,
    queued: 64,
    status: "draft",
    kpis: { delivered: 0, opened: 0, clicked: 0, converted: 0 },
  },
  {
    id: "c5",
    title: "Push Notifications — App",
    description:
      "Daily evening push to active app users highlighting recommended products based on browsing.",
    category: "push",
    type: "live",
    icon: Sparkles,
    tags: ["Daily", "Personalized"],
    channels: 1,
    queued: 12,
    status: "completed",
    kpis: { delivered: 15400, opened: 9820, clicked: 4120, converted: 712 },
  },
];

export default function CampaignsPage() {
  const [pageTab, setPageTab] = useState("campaigns");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    const statusValue = STATUS_TO_VALUE[status];
    const q = query.trim().toLowerCase();
    const tabStatus = TAB_TO_STATUS[type];
    return CAMPAIGNS.filter((c) => {
      if (statusValue && c.status !== statusValue) return false;
      if (tabStatus && c.status !== tabStatus) return false;
      if (q && !c.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [status, type, query]);

  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, c) => ({
          delivered: acc.delivered + c.kpis.delivered,
          opened: acc.opened + c.kpis.opened,
          clicked: acc.clicked + c.kpis.clicked,
          converted: acc.converted + c.kpis.converted,
        }),
        { delivered: 0, opened: 0, clicked: 0, converted: 0 },
      ),
    [filtered],
  );

  const kpiCards = useMemo(() => {
    const rate = (num, den) => (den > 0 ? Math.round((num / den) * 1000) / 10 : 0);
    return [
      {
        id: "delivered",
        title: "Total Delivered",
        value: totals.delivered,
        delta: { value: 2, direction: "up", period: "from last quarter" },
      },
      {
        id: "opened",
        title: "Open Rate",
        value: rate(totals.opened, totals.delivered),
        suffix: "%",
        delta: { value: 15, direction: "up", period: "from last quarter" },
      },
      {
        id: "clicked",
        title: "Click Rate",
        value: rate(totals.clicked, totals.opened),
        suffix: "%",
        delta: { value: 5, direction: "up", period: "from last quarter" },
      },
      {
        id: "converted",
        title: "Conversion Rate",
        value: rate(totals.converted, totals.clicked),
        suffix: "%",
        delta: { value: 2, direction: "up", period: "from last quarter" },
      },
    ];
  }, [totals]);

  const filtersActive =
    status !== "all" || type !== "all" || query.trim().length > 0;
  const contextLabel = filtersActive
    ? `Showing ${filtered.length} of ${CAMPAIGNS.length} campaigns`
    : null;

  return (
    <div className="flex h-full flex-col">
      {/* Layer 1 — Page tabs */}
      <CampaignsPageTabs active={pageTab} onChange={setPageTab} />

      {pageTab === "templates" ? (
        <TemplatesPage />
      ) : (
        <>
          {/* Layer 2 — Header */}
          <CampaignsHeaderBar
            status={status}
            statusOptions={STATUS_OPTIONS}
            onStatusChange={setStatus}
            onNew={() => setCreateOpen(true)}
          />

          {/* Layer 3 — KPI cards */}
          <CampaignKpiRow kpis={kpiCards} contextLabel={contextLabel} />

          {/* Layer 4 — Filter row */}
          <CampaignsFilterRow
            type={type}
            onTypeChange={setType}
            query={query}
            onQueryChange={setQuery}
          />

          {/* Campaign list */}
          <div className="flex-1 pt-5">
            {filtered.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <h3 className="text-[14px] font-semibold text-ink-heading">
                  No campaigns match your filters
                </h3>
                <p className="text-[12px] font-medium text-ink-muted">
                  Try a different status, type, or search term.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <CreateCampaignDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
