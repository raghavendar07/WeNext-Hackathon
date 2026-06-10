import { useState } from "react";
import PageTabs from "../ui/PageTabs.jsx";
import FlowsListPage from "./FlowsListPage.jsx";
import FlowBuilder from "./FlowBuilder.jsx";
import FormDataPage from "./FormDataPage.jsx";
import { COMPONENT_CATALOG } from "./mock-data.js";
import { TextCursorInput as FormInput } from "lucide-react";

// Top-level WhatsApp Flows page.
//
// Routes between three views:
//   - list      -> FlowsListPage (flows grid + filters)
//   - builder   -> FlowBuilder   (full-screen editor)
//   - data      -> FormDataPage  (submissions table)
//
// Tabs:
//   - Flows
//   - Submissions
//   - Library  (component catalog reference)
export default function FlowsPage() {
  const [tab, setTab] = useState("flows");
  const [route, setRoute] = useState({ name: "list" });

  // Fullscreen builder bypasses the page chrome entirely.
  if (route.name === "builder") {
    return (
      <FlowBuilder
        flow={route.flow}
        onBack={() => setRoute({ name: "list" })}
      />
    );
  }

  const TABS = [
    { id: "flows",       label: "Flows" },
    { id: "submissions", label: "Submissions" },
    { id: "library",     label: "Library" },
  ];

  return (
    <div className="flex h-full flex-col gap-5">
      <PageTabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "flows" && (
        <FlowsListPage
          onOpenFlow={(flow) => setRoute({ name: "builder", flow })}
          onCreateFlow={() => setRoute({ name: "builder", flow: null })}
        />
      )}
      {tab === "submissions" && <FormDataPage />}
      {tab === "library" && <LibraryView />}
    </div>
  );
}

function LibraryView() {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1 py-4">
        <h1 className="text-[22px] font-semibold text-ink-heading">
          Component Library
        </h1>
        <p className="text-[13px] font-medium text-ink-muted">
          All blocks available in the WhatsApp Flow builder
        </p>
      </header>

      <div className="flex flex-col gap-5">
        {COMPONENT_CATALOG.map((group) => (
          <section key={group.id} className="flex flex-col gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              {group.label}
            </span>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((it) => (
                <div
                  key={it.type}
                  className="flex items-start gap-3 rounded-[12px] border border-[#E5E7EB] bg-white p-4"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-brand-50 text-brand-600">
                    <FormInput size={16} strokeWidth={1.75} />
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[13px] font-semibold text-ink-heading">
                      {it.label}
                    </span>
                    <span className="text-[11px] font-medium text-ink-muted">
                      {it.description}
                    </span>
                    <span className="mt-1 inline-flex w-fit items-center rounded-xs border border-line bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                      {it.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
