import PageTabs from "../ui/PageTabs.jsx";
import LeadBoardPage from "./LeadBoardPage.jsx";
import LeadsTablePage from "./LeadsTablePage.jsx";
import CustomersPage from "./CustomersPage.jsx";
import TagsPage from "./TagsPage.jsx";

const CRM_TABS = [
  { id: "lead-board", label: "Lead Board" },
  { id: "leads",      label: "Leads" },
  { id: "customers",  label: "Customers" },
  { id: "tags",       label: "Tags" },
];

const TITLES = {
  "lead-board": { title: "Lead Board",     subtitle: "Visualize and move leads through your sales pipeline" },
  leads:        { title: "Leads",          subtitle: "Prioritize and act on inbound leads from every channel" },
  customers:    { title: "Customers",      subtitle: "Identify champions, retain at-risk accounts, grow LTV" },
  tags:         { title: "Tags",           subtitle: "Segment contacts and trigger automations from tags" },
};

export default function CRMPage({ tab = "lead-board", onTabChange }) {
  const meta = TITLES[tab] ?? TITLES["lead-board"];

  return (
    <div className="flex h-full flex-col gap-5">
      <PageTabs tabs={CRM_TABS} active={tab} onChange={onTabChange} />

      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-ink-heading">{meta.title}</h1>
          <p className="text-[13px] font-medium text-ink-muted">{meta.subtitle}</p>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        {tab === "lead-board" && <LeadBoardPage />}
        {tab === "leads" && <LeadsTablePage />}
        {tab === "customers" && <CustomersPage />}
        {tab === "tags" && <TagsPage />}
      </div>
    </div>
  );
}
