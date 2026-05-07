import { useState } from "react";
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

const CRM_TAB_IDS = ["lead-board", "leads", "customers", "tags"];

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

  const isChat = active === "whatsapp";
  const isCampaigns = active === "campaigns";
  const isCRM = CRM_TAB_IDS.includes(active);
  const isAppointments = active === "appointments";
  const isAds = active === "ads";
  const isSocial = active === "social-media-posts";
  const isAutomations = active === "automations";

  return (
    <MainLayout active={active} onActiveChange={setActive} flush={isChat}>
      {isChat ? (
        <ChatPage />
      ) : isCampaigns ? (
        <CampaignsPage />
      ) : isCRM ? (
        <CRMPage tab={active} onTabChange={setActive} />
      ) : isAppointments ? (
        <AppointmentsPage />
      ) : isAds ? (
        <AdsPage />
      ) : isSocial ? (
        <SocialMediaPostsPage />
      ) : isAutomations ? (
        <AutomationsPage />
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
