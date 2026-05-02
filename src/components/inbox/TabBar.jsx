import Tab from "./Tab.jsx";

export default function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex w-full items-center border-b border-line">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          label={tab.label}
          count={tab.count}
          active={tab.id === active}
          onClick={() => onChange?.(tab.id)}
        />
      ))}
    </div>
  );
}
