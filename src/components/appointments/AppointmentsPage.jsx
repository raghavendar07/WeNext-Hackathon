import { useState } from "react";
import TabBar from "../inbox/TabBar.jsx";
import CalendarTab from "./calendar/CalendarTab.jsx";
import MeetingsTab from "./meetings/MeetingsTab.jsx";
import SettingsTab from "./settings/SettingsTab.jsx";
import AppointmentDetailPage from "./AppointmentDetailPage.jsx";

const TABS = [
  { id: "calendar", label: "Calendar" },
  { id: "meetings", label: "Meetings" },
  { id: "settings", label: "Settings" },
];

export default function AppointmentsPage() {
  const [tab, setTab] = useState("calendar");
  const [viewing, setViewing] = useState(null);

  if (viewing) {
    return (
      <AppointmentDetailPage
        appointment={viewing}
        onBack={() => setViewing(null)}
      />
    );
  }

  return (
    <div className="flex h-full flex-col gap-5">
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab !== "calendar" && (
        <header className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[22px] font-semibold text-ink-heading">Appointments</h1>
            <p className="text-[13px] font-medium text-ink-muted">
              Schedule, manage, and follow up on customer meetings
            </p>
          </div>
        </header>
      )}

      <div className="flex-1">
        {tab === "calendar" && <CalendarTab onOpen={setViewing} />}
        {tab === "meetings" && <MeetingsTab onOpen={setViewing} />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
