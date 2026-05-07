import { useState } from "react";
import AutomationsListPage from "./AutomationsListPage.jsx";
import AutomationBuilder from "./AutomationBuilder.jsx";
import AutomationDetailPage from "./AutomationDetailPage.jsx";
import { AUTOMATIONS, findAutomationById } from "./data.js";

export default function AutomationsPage() {
  const [route, setRoute] = useState({ name: "list" });

  if (route.name === "builder") {
    return (
      <AutomationBuilder
        presetExampleId={route.presetExampleId}
        presetAutomation={route.presetAutomation}
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
        onEdit={() => setRoute({ name: "builder", presetAutomation: a })}
      />
    );
  }

  return (
    <AutomationsListPage
      automations={AUTOMATIONS}
      onCreate={() => setRoute({ name: "builder" })}
      onUseExample={(id) => setRoute({ name: "builder", presetExampleId: id })}
      onOpen={(id) => setRoute({ name: "detail", id })}
    />
  );
}
