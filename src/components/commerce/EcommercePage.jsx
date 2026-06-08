import { useEffect, useState } from "react";
import PageTabs from "../ui/PageTabs.jsx";
import OverviewPage from "./OverviewPage.jsx";
import CatalogPage from "./CatalogPage.jsx";
import OrdersPage from "./OrdersPage.jsx";
import BillingPage from "./BillingPage.jsx";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "catalog",  label: "Catalog" },
  { id: "orders",   label: "Orders" },
  { id: "billing",  label: "Billing" },
];

function readTabFromURL() {
  if (typeof window === "undefined") return "overview";
  const param = new URLSearchParams(window.location.search).get("tab");
  return TABS.some((t) => t.id === param) ? param : "overview";
}

function writeTabToURL(tab) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (tab && tab !== "overview") url.searchParams.set("tab", tab);
  else url.searchParams.delete("tab");
  if (tab !== "orders") url.searchParams.delete("status");
  window.history.replaceState(null, "", url.toString());
}

export default function EcommercePage({ onNavigate }) {
  const [tab, setTab] = useState(() => readTabFromURL());

  useEffect(() => {
    writeTabToURL(tab);
  }, [tab]);

  useEffect(() => {
    const onPop = () => setTab(readTabFromURL());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <div className="flex h-full flex-col gap-5">
      <PageTabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="flex flex-1 flex-col">
        {tab === "overview" && <OverviewPage onNavigate={(id, params) => {
          if (id === "commerce-orders") setTab("orders");
          else if (id === "commerce-catalog") setTab("catalog");
          else if (id === "commerce-billing") setTab("billing");
          else onNavigate?.(id, params);
        }} />}
        {tab === "catalog"  && <CatalogPage />}
        {tab === "orders"   && <OrdersPage onNavigate={onNavigate} />}
        {tab === "billing"  && <BillingPage />}
      </div>
    </div>
  );
}
