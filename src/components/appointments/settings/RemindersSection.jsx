import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Switch from "../../Switch.jsx";
import { SettingsHeader } from "./SettingsTab.jsx";

const TEMPLATE_OPTIONS = [
  { id: "reminder-24h", name: "24h Reminder",   body: "Hi {{name}}, a reminder that you have an appointment with us tomorrow at {{time}}." },
  { id: "reminder-1h",  name: "1h Reminder",    body: "Hi {{name}}, your appointment with WeNext starts in 1 hour. See you soon!" },
  { id: "reminder-15m", name: "Final Reminder", body: "Your meeting starts in 15 minutes. Click {{join_link}} to join." },
];

const DEFAULT_RULES = [
  { id: "r1", value: 24, unit: "hours",   templateId: "reminder-24h", enabled: true },
  { id: "r2", value: 1,  unit: "hours",   templateId: "reminder-1h",  enabled: true },
  { id: "r3", value: 15, unit: "minutes", templateId: "reminder-15m", enabled: false },
];

export default function RemindersSection() {
  const [master, setMaster] = useState(true);
  const [rules, setRules] = useState(DEFAULT_RULES);

  const updateRule = (id, patch) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const removeRule = (id) =>
    setRules((rs) => rs.filter((r) => r.id !== id));

  const addRule = () =>
    setRules((rs) => [
      ...rs,
      {
        id: `r-${Date.now()}`,
        value: 30,
        unit: "minutes",
        templateId: TEMPLATE_OPTIONS[0].id,
        enabled: true,
      },
    ]);

  return (
    <div className="flex flex-col gap-5">
      <SettingsHeader
        title="Automate WhatsApp reminders"
        description="Send reminder messages before appointments so customers stay on time."
      />

      <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-canvas p-4">
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-ink-heading">Send WhatsApp reminders</span>
          <span className="text-[12px] font-medium text-ink-muted">
            Master switch for all reminder rules below.
          </span>
        </div>
        <Switch checked={master} onChange={setMaster} />
      </div>

      {master && (
        <>
          <div className="flex flex-col gap-3">
            {rules.map((rule) => (
              <RuleRow
                key={rule.id}
                rule={rule}
                onChange={(patch) => updateRule(rule.id, patch)}
                onRemove={() => removeRule(rule.id)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addRule}
            className="inline-flex h-9 w-fit items-center gap-2 rounded-button border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            <Plus size={14} strokeWidth={2} />
            Add reminder rule
          </button>
        </>
      )}
    </div>
  );
}

function RuleRow({ rule, onChange, onRemove }) {
  const tpl = TEMPLATE_OPTIONS.find((t) => t.id === rule.templateId) ?? TEMPLATE_OPTIONS[0];
  return (
    <article className="flex flex-col gap-3 rounded-md border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-medium text-ink-muted">Send</span>
          <input
            type="number"
            value={rule.value}
            onChange={(e) => onChange({ value: Number(e.target.value) })}
            className="h-8 w-[80px] rounded-sm border border-line bg-white px-2 text-[13px] font-medium text-ink-heading"
          />
          <select
            value={rule.unit}
            onChange={(e) => onChange({ unit: e.target.value })}
            className="h-8 rounded-sm border border-line bg-white px-2 text-[13px] font-medium text-ink-heading"
          >
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
            <option value="days">days</option>
          </select>
          <span className="text-[12px] font-medium text-ink-muted">before, using template</span>
          <select
            value={rule.templateId}
            onChange={(e) => onChange({ templateId: e.target.value })}
            className="h-8 rounded-sm border border-line bg-white px-2 text-[13px] font-medium text-ink-heading"
          >
            {TEMPLATE_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={rule.enabled} onChange={(v) => onChange({ enabled: v })} />
          <button
            type="button"
            aria-label="Delete rule"
            onClick={onRemove}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-danger hover:bg-danger-bg"
          >
            <Trash2 size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <p className="rounded-xs bg-canvas p-3 text-[12px] font-medium leading-relaxed text-ink-body">
        {tpl.body}
      </p>
    </article>
  );
}

