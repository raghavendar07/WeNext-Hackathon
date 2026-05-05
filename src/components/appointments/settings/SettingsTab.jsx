import { useState } from "react";
import { Bell, CalendarDays, Clock } from "lucide-react";
import AvailabilitySection from "./AvailabilitySection.jsx";
import IntegrationsSection from "./IntegrationsSection.jsx";
import RemindersSection from "./RemindersSection.jsx";

const NAV = [
  { id: "availability",  label: "Availability",          Icon: Clock },
  { id: "integrations",  label: "Calendar Integrations", Icon: CalendarDays },
  { id: "reminders",     label: "WhatsApp Reminders",    Icon: Bell },
];

export default function SettingsTab() {
  const [section, setSection] = useState("availability");

  return (
    <div className="flex gap-6">
      <nav className="flex w-[240px] shrink-0 flex-col gap-1">
        {NAV.map((n) => {
          const Icon = n.Icon;
          const isActive = n.id === section;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setSection(n.id)}
              className={[
                "relative flex h-10 items-center gap-2 rounded-xs px-3 py-2 text-left text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-emerald"
                  : "text-ink-body hover:bg-surface-subtle",
              ].join(" ")}
            >
              {isActive && (
                <span aria-hidden className="absolute inset-y-1 left-0 w-[3px] rounded-pill bg-brand-emerald" />
              )}
              <Icon size={14} strokeWidth={1.75} />
              {n.label}
            </button>
          );
        })}
      </nav>

      <section className="min-w-0 flex-1">
        <div className="mx-auto max-w-[720px]">
          {section === "availability" && <AvailabilitySection />}
          {section === "integrations" && <IntegrationsSection />}
          {section === "reminders" && <RemindersSection />}
        </div>
      </section>
    </div>
  );
}

export function SettingsHeader({ eyebrow, title, description }) {
  return (
    <header className="flex flex-col gap-1.5">
      {eyebrow && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
          {eyebrow}
        </span>
      )}
      <h2 className="text-[20px] font-semibold text-ink-heading">{title}</h2>
      <p className="text-[13px] font-medium text-ink-muted">{description}</p>
    </header>
  );
}

export function SectionedCard({ title, description, footer, children }) {
  return (
    <article className="flex flex-col gap-4 rounded-md border border-line bg-white p-5">
      {(title || description) && (
        <header className="flex flex-col gap-1">
          {title && <h3 className="text-[14px] font-semibold text-ink-heading">{title}</h3>}
          {description && <p className="text-[12px] font-medium text-ink-muted">{description}</p>}
        </header>
      )}
      <div className="flex flex-col gap-4">{children}</div>
      {footer && <div className="flex items-center justify-end gap-2 border-t border-line pt-3">{footer}</div>}
    </article>
  );
}
