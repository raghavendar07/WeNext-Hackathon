import { useState } from "react";
import AutomationsListPage from "./AutomationsListPage.jsx";
import AutomationBuilder from "./AutomationBuilder.jsx";
import AutomationDetailPage from "./AutomationDetailPage.jsx";
import ChannelPickerModal from "./ChannelPickerModal.jsx";
import { AUTOMATIONS, findAutomationById, findExampleById } from "./data.js";

export default function AutomationsPage() {
  const [route, setRoute] = useState({ name: "list" });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingExampleId, setPendingExampleId] = useState(null);

  if (route.name === "builder") {
    return (
      <AutomationBuilder
        presetExampleId={route.presetExampleId}
        presetAutomation={route.presetAutomation}
        presetChannel={route.presetChannel ?? route.presetAutomation?.channel ?? "whatsapp"}
        onCancel={() => setRoute({ name: "list" })}
        onSaveDraft={() => setRoute({ name: "list" })}
        onActivate={() => setRoute({ name: "list" })}
      />
    );
  }

  if (route.name === "detail") {
    const a = findAutomationById(route.id);
    if (!a) return null;
    return (
      <AutomationDetailPage
        automation={a}
        onBack={() => setRoute({ name: "list" })}
        onEdit={() => setRoute({ name: "builder", presetAutomation: a, presetChannel: a.channel ?? "whatsapp" })}
      />
    );
  }

  const handlePickChannel = (channel) => {
    setPickerOpen(false);
    if (pendingExampleId) {
      const ex = findExampleById(pendingExampleId);
      setRoute({ name: "builder", presetExampleId: pendingExampleId, presetChannel: ex?.channel ?? channel });
      setPendingExampleId(null);
    } else {
      setRoute({ name: "builder", presetChannel: channel });
    }
  };

  return (
    <>
      <AutomationsListPage
        automations={AUTOMATIONS}
        onCreate={() => { setPendingExampleId(null); setPickerOpen(true); }}
        onUseExample={(id) => {
          const ex = findExampleById(id);
          if (ex?.channel) {
            // example pre-locks channel — skip picker
            setRoute({ name: "builder", presetExampleId: id, presetChannel: ex.channel });
          } else {
            setPendingExampleId(id);
            setPickerOpen(true);
          }
        }}
        onOpen={(id) => setRoute({ name: "detail", id })}
        onEdit={(a) => setRoute({ name: "builder", presetAutomation: a, presetChannel: a.channel ?? "whatsapp" })}
      />
      {pickerOpen && (
        <ChannelPickerModal
          onPick={handlePickChannel}
          onCancel={() => { setPickerOpen(false); setPendingExampleId(null); }}
        />
      )}
    </>
  );
}
