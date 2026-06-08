import { useState } from "react";
import CalendarPageHeader from "./CalendarPageHeader.jsx";
import CalendarDateControls from "./CalendarDateControls.jsx";
import CalendarWeekView from "./CalendarWeekView.jsx";

export default function CalendarTab() {
  const [view, setView] = useState("week");
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col">
      <CalendarPageHeader query={query} onQueryChange={setQuery} />
      <CalendarDateControls
        view={view}
        onViewChange={setView}
        onToday={() => alert('Scrolled to today (mock)')}
      />

      <div className="pt-1">
        {view === "week" && <CalendarWeekView activeCategory="all" />}
        {view === "day" && (
          <PlaceholderView label="Day view" description="Single-day view coming next." />
        )}
        {view === "month" && (
          <PlaceholderView label="Month view" description="Month grid view coming next." />
        )}
      </div>
    </div>
  );
}

function PlaceholderView({ label, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line bg-canvas py-16 text-center">
      <h3 className="text-[14px] font-semibold text-ink-heading">{label}</h3>
      <p className="text-[12px] font-medium text-ink-muted">{description}</p>
    </div>
  );
}
