import { useState } from "react";
import PageTabs from "../ui/PageTabs.jsx";
import LeadBoardPage from "./LeadBoardPage.jsx";
import LeadsTablePage from "./LeadsTablePage.jsx";
import CustomersPage from "./CustomersPage.jsx";
import TagsPage from "./TagsPage.jsx";
import CustomerDetailPage from "./CustomerDetailPage.jsx";
import LeadDetailPage from "./LeadDetailPage.jsx";
import { CUSTOMERS, LEADS } from "./data.js";

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
  const [viewing, setViewing] = useState(null);

  if (viewing?.kind === "customer") {
    const customer = CUSTOMERS.find((c) => c.id === viewing.id);
    return (
      <div className="flex h-full flex-col gap-5">
        <CustomerDetailPage customer={customer} onBack={() => setViewing(null)} />
      </div>
    );
  }
  if (viewing?.kind === "lead") {
    const lead = LEADS.find((l) => l.id === viewing.id);
    return (
      <div className="flex h-full flex-col gap-5">
        <LeadDetailPage lead={lead} onBack={() => setViewing(null)} />
      </div>
    );
  }

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
        {tab === "lead-board" && (
          <LeadBoardPage onOpenLead={(lead) => setViewing({ kind: "lead", id: lead.id })} />
        )}
        {tab === "leads" && (
          <LeadsTablePage onOpenLead={(lead) => setViewing({ kind: "lead", id: lead.id })} />
        )}
        {tab === "customers" && (
          <CustomersPage onOpenCustomer={(c) => setViewing({ kind: "customer", id: c.id })} />
        )}
        {tab === "tags" && <TagsPage />}
      </div>
    </div>
  );
}
