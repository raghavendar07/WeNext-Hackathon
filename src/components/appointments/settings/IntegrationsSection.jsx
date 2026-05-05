import { useState } from "react";
import { Calendar } from "lucide-react";
import Switch from "../../Switch.jsx";
import { SettingsHeader } from "./SettingsTab.jsx";

const PROVIDERS = [
  { id: "google",   name: "Google Calendar",    color: "#4285F4" },
  { id: "outlook",  name: "Microsoft Outlook",  color: "#0078D4" },
  { id: "apple",    name: "Apple Calendar",     color: "#A2AAAD" },
  { id: "ical",     name: "iCal Feed",          color: "#1EB677" },
];

export default function IntegrationsSection() {
  const [connected, setConnected] = useState({ google: true });

  return (
    <div className="flex flex-col gap-5">
      <SettingsHeader
        title="Connect your calendars"
        description="Sync availability and push WeNext events to the tools your team already uses."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {PROVIDERS.map((p) => {
          const isConnected = !!connected[p.id];
          return (
            <article
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-md border border-line bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-sm"
                  style={{ backgroundColor: `${p.color}1A`, color: p.color }}
                >
                  <Calendar size={20} strokeWidth={1.75} />
                </span>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-ink-heading">{p.name}</span>
                  <span
                    className={[
                      "inline-flex items-center gap-1 text-[11px] font-medium",
                      isConnected ? "text-success" : "text-ink-muted",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden
                      className={["h-1.5 w-1.5 rounded-full", isConnected ? "bg-success" : "bg-ink-subtle"].join(" ")}
                    />
                    {isConnected ? "Connected" : "Not connected"}
                  </span>
                  {isConnected && (
                    <span className="text-[11px] font-medium text-ink-muted">
                      Last synced 12 min ago
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setConnected((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                }
                className={[
                  "h-9 rounded-button px-3 text-[12px] font-medium",
                  isConnected
                    ? "border border-line bg-white text-ink-body hover:bg-surface-subtle"
                    : "bg-cta-gradient text-white",
                ].join(" ")}
              >
                {isConnected ? "Disconnect" : "Connect"}
              </button>
            </article>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-4">
        <h3 className="text-[14px] font-semibold text-ink-heading">Sync preferences</h3>
        <ToggleRow label="Block out external events on my calendar" defaultChecked />
        <ToggleRow label="Push WeNext appointments to external calendar" defaultChecked />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] font-medium text-ink-body">Default external calendar</span>
          <select className="h-9 w-[260px] rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-heading">
            <option>Google Calendar — Primary</option>
            <option>Outlook — Work</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultChecked }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] font-medium text-ink-body">{label}</span>
      <Switch checked={on} onChange={setOn} ariaLabel={label} />
    </div>
  );
}
