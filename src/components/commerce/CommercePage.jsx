import OverviewPage from "./OverviewPage.jsx";
import CatalogPage from "./CatalogPage.jsx";
import OrdersPage from "./OrdersPage.jsx";
import BillingPage from "./BillingPage.jsx";

export default function CommercePage({ tab, onTabChange }) {
  if (tab === "commerce-catalog") return <CatalogPage />;
  if (tab === "commerce-orders") return <OrdersPage onNavigate={onTabChange} />;
  if (tab === "commerce-billing") return <BillingPage />;
  return <OverviewPage onNavigate={onTabChange} />;
}
