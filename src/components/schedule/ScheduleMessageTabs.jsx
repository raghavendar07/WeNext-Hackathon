import TabBar from "../inbox/TabBar.jsx";

const TABS = [
  { id: "new", label: "Schedule New Message" },
  { id: "list", label: "Scheduled Messages" },
];

export default function ScheduleMessageTabs({ active, onChange }) {
  return <TabBar tabs={TABS} active={active} onChange={onChange} />;
}
