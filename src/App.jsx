import { useEffect, useState } from "react";
import OnboardingPage from "./components/OnboardingPage.jsx";
import MainLayout from "./components/MainLayout.jsx";
import PageHeader from "./components/PageHeader.jsx";
import Filters from "./components/Filters.jsx";
import EmptyState from "./components/EmptyState.jsx";
import ChatPage from "./components/ChatPage.jsx";
import CampaignsPage from "./components/campaigns/CampaignsPage.jsx";
import CRMPage from "./components/crm/CRMPage.jsx";
import AppointmentsPage from "./components/appointments/AppointmentsPage.jsx";
import AdsPage from "./components/ads/AdsPage.jsx";
import SocialMediaPostsPage from "./components/social/SocialMediaPostsPage.jsx";
import AutomationsPage from "./components/automations/AutomationsPage.jsx";
import EcommercePage from "./components/commerce/EcommercePage.jsx";
import AIAgentsPage from "./components/ai/AIAgentsPage.jsx";
import LiveChatPage from "./components/ai/LiveChatPage.jsx";
import WhatsAppAIAgentPage from "./components/ai/WhatsAppAIAgentPage.jsx";
import FlowsPage from "./components/flows/FlowsPage.jsx";
import TeamManagementPage from "./components/team/TeamManagementPage.jsx";
import IntegrationsPage from "./components/integrations/IntegrationsPage.jsx";

const CRM_TAB_IDS = ["lead-board", "leads", "customers", "tickets", "tags"];

const LEGACY_REDIRECTS = {
  "commerce":                 { id: "ecommerce" },
  "commerce-overview":        { id: "ecommerce" },
  "commerce-catalog":         { id: "ecommerce", params: { tab: "catalog" } },
  "commerce-orders":          { id: "ecommerce", params: { tab: "orders" } },
  "commerce-billing":         { id: "ecommerce", params: { tab: "billing" } },
  "commerce-abandoned-carts": { id: "ecommerce", params: { tab: "orders", status: "abandoned" } },
  "commerce-payments":        { id: "ecommerce", params: { tab: "billing" } },
  "commerce-invoices":        { id: "ecommerce", params: { tab: "billing" } },
};

function clearEcommerceParams() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("tab");
  url.searchParams.delete("status");
  window.history.replaceState(null, "", url.toString());
}

function setURLParams(params) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v == null) url.searchParams.delete(k);
    else url.searchParams.set(k, v);
  }
  window.history.replaceState(null, "", url.toString());
}

export default function App() {
  const [onboarded, setOnboarded] = useState(true);

  if (!onboarded) {
    return <OnboardingPage onComplete={() => setOnboarded(true)} />;
  }

  return <Home />;
}

function Home() {
  const [active, setActive] = useState("appointments");
  const [view, setView] = useState("grid");
  const [chip, setChip] = useState("All");
  const [query, setQuery] = useState("");

  const handleActiveChange = (next, params = {}) => {
    const redirect = LEGACY_REDIRECTS[next];
    if (redirect) {
      clearEcommerceParams();
      if (redirect.params) setURLParams(redirect.params);
      setActive(redirect.id);
      return;
    }

    const isEcommerceNext = next === "ecommerce";
    const isEcommercePrev = active === "ecommerce";
    const hasParams = params && Object.keys(params).length > 0;

    if (!isEcommerceNext && isEcommercePrev) {
      clearEcommerceParams();
    }
    if (isEcommerceNext && !hasParams && !isEcommercePrev) {
      clearEcommerceParams();
    }
    if (hasParams) setURLParams(params);
    setActive(next);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    const map = {
      "/commerce":                 "commerce",
      "/commerce/overview":        "commerce-overview",
      "/commerce/catalog":         "commerce-catalog",
      "/commerce/orders":          "commerce-orders",
      "/commerce/billing":         "commerce-billing",
      "/commerce/abandoned-carts": "commerce-abandoned-carts",
      "/commerce/payments":        "commerce-payments",
      "/commerce/invoices":        "commerce-invoices",
      "/commerce/ecommerce":       "ecommerce",
      "/commerce/data-store":      "data-store",
    };
    const matched = map[path];
    if (matched) handleActiveChange(matched);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isChat = active === "whatsapp";
  const isCampaigns = active === "campaigns";
  const isCRM = CRM_TAB_IDS.includes(active);
  const isAppointments = active === "appointments";
  const isAds = active === "ads";
  const isSocial = active === "social-media-posts";
  const isAutomations = active === "automations";
  const isEcommerce = active === "ecommerce";
  const isAIAgents = active === "ai-agents";
  const isLiveChat = active === "live-chat";
  const isWhatsAppAI = active === "whatsapp-ai-agent";
  const isFlows = active === "flows";
  const isTeam = active === "team-management";
  const isIntegrations = active === "integrations";

  return (
    <MainLayout active={active} onActiveChange={handleActiveChange} flush={isChat}>
      {isChat ? (
        <ChatPage />
      ) : isCampaigns ? (
        <CampaignsPage />
      ) : isCRM ? (
        <CRMPage tab={active} onTabChange={handleActiveChange} />
      ) : isAppointments ? (
        <AppointmentsPage />
      ) : isAds ? (
        <AdsPage />
      ) : isSocial ? (
        <SocialMediaPostsPage />
      ) : isAutomations ? (
        <AutomationsPage />
      ) : isEcommerce ? (
        <EcommercePage onNavigate={handleActiveChange} />
      ) : isAIAgents ? (
        <AIAgentsPage />
      ) : isLiveChat ? (
        <LiveChatPage />
      ) : isWhatsAppAI ? (
        <WhatsAppAIAgentPage />
      ) : isFlows ? (
        <FlowsPage />
      ) : isTeam ? (
        <TeamManagementPage />
      ) : isIntegrations ? (
        <IntegrationsPage />
      ) : (
        <div className="mx-auto flex max-w-6xl flex-col gap-5">
          <PageHeader
            title="Shared with me"
            view={view}
            onChangeView={setView}
          />
          <Filters
            query={query}
            onQueryChange={setQuery}
            active={chip}
            onChipChange={setChip}
          />
          <EmptyState />
        </div>
      )}
    </MainLayout>
  );
}
