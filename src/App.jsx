import { useState } from "react";
import OnboardingPage from "./components/OnboardingPage.jsx";
import MainLayout from "./components/MainLayout.jsx";
import PageHeader from "./components/PageHeader.jsx";
import Filters from "./components/Filters.jsx";
import EmptyState from "./components/EmptyState.jsx";
import ChatPage from "./components/ChatPage.jsx";
import CampaignsPage from "./components/campaigns/CampaignsPage.jsx";

export default function App() {
  const [onboarded, setOnboarded] = useState(true);

  if (!onboarded) {
    return <OnboardingPage onComplete={() => setOnboarded(true)} />;
  }

  return <Home />;
}

function Home() {
  const [active, setActive] = useState("campaigns");
  const [view, setView] = useState("grid");
  const [chip, setChip] = useState("All");
  const [query, setQuery] = useState("");

  const isChat = active === "whatsapp";
  const isCampaigns = active === "campaigns";

  return (
    <MainLayout active={active} onActiveChange={setActive} flush={isChat}>
      {isChat ? (
        <ChatPage />
      ) : isCampaigns ? (
        <CampaignsPage />
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
