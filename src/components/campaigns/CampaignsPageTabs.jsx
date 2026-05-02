import TabBar from "../inbox/TabBar.jsx";

const TABS = [
  { id: "campaigns", label: "Campaigns" },
  { id: "templates", label: "Templates Library" },
];

export default function CampaignsPageTabs({ active, onChange }) {
  return <TabBar tabs={TABS} active={active} onChange={onChange} />;
}
