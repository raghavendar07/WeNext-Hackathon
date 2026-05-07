import { useEffect, useState } from "react";
import AdsListPage from "./AdsListPage.jsx";
import AdsCreateWizard from "./AdsCreateWizard.jsx";
import AdDetailPage from "./AdDetailPage.jsx";
import { ADS } from "./data.js";

const VALID_CHANNELS = new Set(["meta", "linkedin", "tiktok"]);

function readChannelFromURL() {
  if (typeof window === "undefined") return null;
  const param = new URLSearchParams(window.location.search).get("channel");
  return VALID_CHANNELS.has(param) ? param : null;
}

function writeChannelToURL(channel) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (channel) url.searchParams.set("channel", channel);
  else url.searchParams.delete("channel");
  window.history.replaceState(null, "", url.toString());
}

export default function AdsPage() {
  const [route, setRoute] = useState({ name: "list" });
  const [channel, setChannel] = useState(readChannelFromURL());

  useEffect(() => {
    const onPop = () => setChannel(readChannelFromURL());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const updateChannel = (next) => {
    setChannel(next);
    writeChannelToURL(next);
  };

  if (route.name === "create") {
    const presetChannels = route.presetChannel ? [route.presetChannel] : [];
    return (
      <AdsCreateWizard
        presetGoal={route.presetGoal}
        presetChannels={presetChannels}
        onCancel={() => setRoute({ name: "list" })}
        onLaunch={() => setRoute({ name: "list" })}
      />
    );
  }

  if (route.name === "detail") {
    const ad = ADS.find((a) => a.id === route.id);
    if (!ad) return null;
    return <AdDetailPage ad={ad} onBack={() => setRoute({ name: "list" })} />;
  }

  return (
    <AdsListPage
      ads={ADS}
      channel={channel}
      onChannelChange={updateChannel}
      onCreate={(presetGoal) => setRoute({
        name: "create",
        presetGoal,
        presetChannel: channel,
      })}
      onOpenAd={(id) => setRoute({ name: "detail", id })}
    />
  );
}
