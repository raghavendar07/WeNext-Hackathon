import { useState } from "react";
import { ChevronDown, PanelRightClose, X } from "lucide-react";
import { ACTIONS, LOGIC, TRIGGERS } from "./data.js";

const TYPE_CATALOG = {
  ...Object.fromEntries(TRIGGERS.map((t) => [t.id, t])),
  ...Object.fromEntries(ACTIONS.map((a) => [a.id, a])),
  ...Object.fromEntries(LOGIC.map((l) => [l.id, l])),
};

export default function NodeSettingsRail({ node, onChange, onClose, onRemove }) {
  const def = TYPE_CATALOG[node.type] ?? {};
  const [tab, setTab] = useState("config");

  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-l border-[#EBEEF2] bg-white">
      <header className="flex items-center justify-between gap-2 border-b border-[#EBEEF2] px-5 py-4">
        <div className="inline-flex items-center gap-1 rounded-[6px] bg-transparent">
          <TabPill label="Node Configuration" active={tab === "config"} onClick={() => setTab("config")} />
          <TabPill label="Layers" active={tab === "layers"} onClick={() => setTab("layers")} />
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] text-[#9CA3AF] hover:bg-[#F7F8F8]">
          <PanelRightClose size={14} />
        </button>
      </header>

      <div className="flex flex-col gap-8 overflow-y-auto px-5 py-6">
        {tab === "config" && (
          <>
            <NodeHeader def={def} node={node} />
            {node.kind === "trigger" && <TriggerSections node={node} onChange={onChange} />}
            {node.kind === "action"  && <ActionSections  node={node} onChange={onChange} />}
            {node.kind === "wait"    && <WaitSections    node={node} onChange={onChange} />}
            {node.kind === "branch"  && <BranchSections  node={node} onChange={onChange} />}
            {node.kind === "goal"    && <GoalSections    node={node} onChange={onChange} />}
          </>
        )}
        {tab === "layers" && (
          <p className="text-[13px] font-medium text-[#9CA3AF]">No layers configured for this node.</p>
        )}
      </div>

      {node.kind !== "trigger" && (
        <footer className="border-t border-[#EBEEF2] p-3">
          <button type="button" onClick={onRemove} className="inline-flex h-9 w-full items-center justify-center rounded-[6px] bg-danger-bg px-3 text-[12px] font-semibold text-danger hover:bg-danger-bg/70">
            Delete this step
          </button>
        </footer>
      )}
    </aside>
  );
}

function TabPill({ label, active, onClick }) {
  return (
    <button
      type="button" onClick={onClick}
      className={[
        "inline-flex h-8 items-center rounded-[6px] px-3 text-[13px] font-semibold transition-colors",
        active ? "bg-[#F7F8F8] text-[#101828]" : "text-[#9CA3AF] hover:text-[#101828]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function NodeHeader({ def, node }) {
  return (
    <section className="flex items-center gap-3 rounded-[6px] bg-[#F7F8F8] p-3">
      <span className="text-[20px]">{def.icon}</span>
      <div className="flex flex-col">
        <span className="text-[14px] font-semibold text-[#101828]">{def.label ?? node.type}</span>
        <span className="text-[12px] font-medium text-[#9CA3AF]">{def.hint ?? "Configure this step"}</span>
      </div>
    </section>
  );
}

/* ──────────── Section primitives ──────────── */

function Section({ heading, children }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] font-semibold text-[#101828]">{heading}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] font-medium text-[#45556C]">{label}</span>
      <div className="flex items-center justify-end">{children}</div>
    </div>
  );
}

function Dropdown({ value, options, onChange, width = 160 }) {
  return (
    <div className="relative" style={{ width }}>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full appearance-none rounded-[6px] border border-[#EBEEF2] bg-white pl-3 pr-7 text-[13px] text-[#101828] focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
      <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
    </div>
  );
}

function TextInput({ value, onChange, placeholder, width = 160 }) {
  return (
    <input
      type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="h-8 rounded-[6px] border border-[#EBEEF2] bg-white px-3 text-[13px] text-[#101828] focus:outline-none"
      style={{ width }}
    />
  );
}

function NumericInput({ value, onChange, width = 80 }) {
  return (
    <input
      type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))}
      className="h-8 rounded-[6px] border border-[#EBEEF2] bg-white px-3 text-right text-[13px] text-[#101828] focus:outline-none"
      style={{ width }}
    />
  );
}

function ToggleAsButton({ value, onChange }) {
  const v = value === undefined ? true : value;
  return (
    <button
      type="button" onClick={() => onChange(!v)}
      className="inline-flex h-8 items-center rounded-[6px] border border-[#EBEEF2] bg-[#F7F8F8] px-3 text-[13px] font-medium text-[#101828] hover:bg-white"
    >
      {v ? "Enabled" : "Disabled"}
    </button>
  );
}

function InlineValue({ children }) {
  return <span className="text-[13px] font-medium text-[#101828]">{children}</span>;
}

function HelperText({ children }) {
  return <p className="text-[11px] font-medium text-[#9CA3AF]">{children}</p>;
}

function TextLink({ children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="text-[12px] font-semibold text-brand-emerald hover:underline">
      {children}
    </button>
  );
}

/* ──────────── Trigger sections ──────────── */

function TriggerSections({ node, onChange }) {
  if (node.type === "form_submit") {
    return (
      <>
        <Section heading="Form Selection">
          <Row label="Form">
            <Dropdown value={node.formName ?? ""} onChange={(v) => onChange({ formName: v })} options={[
              { value: "", label: "Select…" },
              { value: "Contact form on homepage", label: "Contact form" },
              { value: "Newsletter signup", label: "Newsletter signup" },
              { value: "Free guide form", label: "Free guide form" },
            ]} />
          </Row>
          <Row label="Run for">
            <Dropdown value={node.newOnly ? "new" : "all"} onChange={(v) => onChange({ newOnly: v === "new" })} options={[
              { value: "new", label: "New submissions only" },
              { value: "all", label: "All submissions" },
            ]} />
          </Row>
        </Section>
        <Section heading="Filters (optional)">
          <Row label="Filter by field">
            <TextLink>+ Add filter</TextLink>
          </Row>
        </Section>
        <Section heading="Trigger Behavior">
          <Row label="Cooldown per contact">
            <Dropdown value={node.cooldown ?? "24h"} onChange={(v) => onChange({ cooldown: v })} options={[
              { value: "0", label: "No cooldown" },
              { value: "24h", label: "24 hours" },
              { value: "7d", label: "7 days" },
            ]} />
          </Row>
          <Row label="Max runs per contact">
            <Dropdown value={node.maxRuns ?? "unlimited"} onChange={(v) => onChange({ maxRuns: v })} options={[
              { value: "unlimited", label: "Unlimited" },
              { value: "1", label: "1" },
              { value: "3", label: "3" },
            ]} />
          </Row>
        </Section>
      </>
    );
  }
  if (node.type === "wa_keyword") {
    return (
      <>
        <Section heading="Keyword">
          <Row label="Keyword to match"><TextInput value={node.keyword ?? ""} onChange={(v) => onChange({ keyword: v })} placeholder="INFO, PRICE" /></Row>
          <Row label="Match type">
            <Dropdown value={node.matchType ?? "exact"} onChange={(v) => onChange({ matchType: v })} options={[
              { value: "exact",    label: "Exact match" },
              { value: "contains", label: "Contains" },
              { value: "starts",   label: "Starts with" },
            ]} />
          </Row>
          <Row label="Case-sensitive"><ToggleAsButton value={node.caseSensitive} onChange={(v) => onChange({ caseSensitive: v })} /></Row>
        </Section>
        <Section heading="Trigger Behavior">
          <Row label="Cooldown per contact">
            <Dropdown value={node.cooldown ?? "1h"} onChange={(v) => onChange({ cooldown: v })} options={[
              { value: "0",  label: "No cooldown" },
              { value: "1h", label: "1 hour" },
              { value: "24h",label: "24 hours" },
            ]} />
          </Row>
        </Section>
      </>
    );
  }
  if (node.type === "date_based") {
    return (
      <>
        <Section heading="Date Source">
          <Row label="Trigger type">
            <Dropdown value={node.dateField ?? "birthday"} onChange={(v) => onChange({ dateField: v })} options={[
              { value: "birthday",    label: "Birthday" },
              { value: "signup_date", label: "Anniversary" },
              { value: "custom",      label: "Custom date field" },
            ]} />
          </Row>
          {node.dateField === "custom" && (
            <Row label="Field name"><TextInput value={node.customField ?? ""} onChange={(v) => onChange({ customField: v })} placeholder="last_purchase_date" /></Row>
          )}
          <Row label="Offset (days)"><NumericInput value={node.offsetDays ?? 0} onChange={(v) => onChange({ offsetDays: v })} /></Row>
        </Section>
        <Section heading="Send Window">
          <Row label="Send time">
            <Dropdown value={node.sendTime ?? "09:00"} onChange={(v) => onChange({ sendTime: v })} options={[
              { value: "09:00", label: "9:00 AM" },
              { value: "12:00", label: "12:00 PM" },
              { value: "18:00", label: "6:00 PM" },
            ]} />
          </Row>
          <Row label="Time zone">
            <Dropdown value={node.tz ?? "contact"} onChange={(v) => onChange({ tz: v })} options={[
              { value: "contact",  label: "Contact's TZ" },
              { value: "business", label: "Business TZ" },
            ]} />
          </Row>
        </Section>
      </>
    );
  }
  if (node.type === "cart_abandoned") {
    return (
      <>
        <Section heading="Abandonment">
          <Row label="Trigger after"><NumericInput value={node.afterMinutes ?? 30} onChange={(v) => onChange({ afterMinutes: v })} /></Row>
          <Row label="Minimum cart value"><TextInput value={node.minValue ?? ""} onChange={(v) => onChange({ minValue: v })} placeholder="500" width={120} /></Row>
        </Section>
        <Section heading="Cancellation">
          <Row label="Reset on purchase"><ToggleAsButton value={node.resetOnPurchase ?? true} onChange={(v) => onChange({ resetOnPurchase: v })} /></Row>
        </Section>
      </>
    );
  }
  if (node.type === "contact_added") {
    return (
      <>
        <Section heading="Source">
          <Row label="Source">
            <Dropdown value={node.source ?? "any"} onChange={(v) => onChange({ source: v })} options={[
              { value: "any",      label: "Any source" },
              { value: "form",     label: "Form" },
              { value: "whatsapp", label: "WhatsApp" },
              { value: "manual",   label: "Manual" },
              { value: "import",   label: "Import" },
            ]} />
          </Row>
          <Row label="Initial tags"><TextInput value={node.initialTags ?? ""} onChange={(v) => onChange({ initialTags: v })} placeholder="VIP, Newsletter" /></Row>
        </Section>
      </>
    );
  }
  if (node.type === "manual") {
    return (
      <>
        <Section heading="Manual Trigger">
          <Row label="Menu label"><TextInput value={node.menuLabel ?? ""} onChange={(v) => onChange({ menuLabel: v })} placeholder="Send welcome message" /></Row>
        </Section>
        <HelperText>Runs when you click "Send" on a contact's page.</HelperText>
      </>
    );
  }
  return null;
}

/* ──────────── Action sections ──────────── */

function ActionSections({ node, onChange }) {
  if (node.type === "send_wa") {
    return (
      <>
        <Section heading="Message Setup">
          <Row label="Message type">
            <Dropdown value={node.messageType ?? "template"} onChange={(v) => onChange({ messageType: v })} options={[
              { value: "template", label: "Use template" },
              { value: "custom",   label: "Custom message" },
            ]} />
          </Row>
          {(node.messageType === "template" || !node.messageType) ? (
            <Row label="Template">
              <Dropdown value={node.template ?? ""} onChange={(v) => onChange({ template: v })} options={[
                { value: "", label: "Select template…" },
                { value: "Welcome — Hi {{first_name}}, thanks for reaching out!", label: "Welcome message" },
                { value: "Cart reminder",  label: "Cart reminder" },
                { value: "Birthday — Happy birthday {{first_name}}!", label: "Birthday" },
              ]} />
            </Row>
          ) : (
            <Row label="Custom body"><TextInput value={node.customBody ?? ""} onChange={(v) => onChange({ customBody: v })} placeholder="Hi {{first_name}}…" /></Row>
          )}
          <Row label="Variables"><InlineValue>3 detected</InlineValue></Row>
        </Section>
        <Section heading="Send Timing">
          <Row label="Send when reached">
            <Dropdown value={node.sendWhen ?? "immediate"} onChange={(v) => onChange({ sendWhen: v })} options={[
              { value: "immediate",      label: "Immediately" },
              { value: "business_hours", label: "Business hours" },
              { value: "time_of_day",    label: "Specific time" },
            ]} />
          </Row>
          <Row label="Respect business hours"><ToggleAsButton value={node.respectHours ?? true} onChange={(v) => onChange({ respectHours: v })} /></Row>
          <Row label="Time zone"><InlineValue>Contact's timezone</InlineValue></Row>
        </Section>
        <Section heading="Failure Handling">
          <Row label="Retry on failure"><ToggleAsButton value={node.retry ?? true} onChange={(v) => onChange({ retry: v })} /></Row>
          <Row label="Max retries">
            <Dropdown value={node.maxRetries ?? "3"} onChange={(v) => onChange({ maxRetries: v })} options={[
              { value: "1", label: "1" }, { value: "3", label: "3" }, { value: "5", label: "5" },
            ]} width={80} />
          </Row>
          <Row label="On final failure">
            <Dropdown value={node.onFailure ?? "mark_error"} onChange={(v) => onChange({ onFailure: v })} options={[
              { value: "mark_error", label: "Mark as error" },
              { value: "skip",       label: "Skip step" },
            ]} />
          </Row>
        </Section>
      </>
    );
  }
  if (node.type === "add_tag" || node.type === "remove_tag") {
    return (
      <Section heading={node.type === "add_tag" ? "Tags to Add" : "Tags to Remove"}>
        <Row label="Tags"><TextInput value={(node.tags ?? []).join(", ")} onChange={(v) => onChange({ tags: v.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="VIP, New lead" /></Row>
        <HelperText>Comma-separated. Add new tags from CRM → Tags.</HelperText>
      </Section>
    );
  }
  if (node.type === "change_stage") {
    return (
      <Section heading="Stage Update">
        <Row label="From stage">
          <Dropdown value={node.fromStage ?? "any"} onChange={(v) => onChange({ fromStage: v })} options={[
            { value: "any", label: "Any stage" },
            { value: "prospects", label: "Prospects" },
            { value: "in-conversation", label: "In conversation" },
            { value: "proposal", label: "Proposal" },
            { value: "qualified", label: "Qualified" },
          ]} />
        </Row>
        <Row label="To stage">
          <Dropdown value={node.toStage ?? ""} onChange={(v) => onChange({ toStage: v })} options={[
            { value: "", label: "Select…" },
            { value: "prospects", label: "Prospects" },
            { value: "in-conversation", label: "In conversation" },
            { value: "proposal", label: "Proposal" },
            { value: "qualified", label: "Qualified" },
            { value: "closed", label: "Closed" },
          ]} />
        </Row>
      </Section>
    );
  }
  if (node.type === "update_field") {
    return (
      <>
        <Section heading="Field Update">
          <Row label="Field">
            <Dropdown value={node.field ?? ""} onChange={(v) => onChange({ field: v })} options={[
              { value: "", label: "Select…" },
              { value: "notes", label: "Notes" },
              { value: "custom_score", label: "Custom score" },
              { value: "last_intent", label: "Last intent" },
            ]} />
          </Row>
          <Row label="Value"><TextInput value={node.value ?? ""} onChange={(v) => onChange({ value: v })} placeholder="value" /></Row>
          <Row label="Append to existing"><ToggleAsButton value={node.append} onChange={(v) => onChange({ append: v })} /></Row>
        </Section>
      </>
    );
  }
  return null;
}

/* ──────────── Wait sections ──────────── */

function WaitSections({ node, onChange }) {
  return (
    <>
      <Section heading="Wait Type">
        <Row label="Wait by">
          <Dropdown value={node.waitType ?? "duration"} onChange={(v) => onChange({ waitType: v })} options={[
            { value: "duration",       label: "Duration" },
            { value: "time_of_day",    label: "Time of day" },
            { value: "business_hours", label: "Business hours" },
          ]} />
        </Row>
        {(node.waitType === "duration" || !node.waitType) && (
          <>
            <Row label="Amount"><NumericInput value={node.value ?? 5} onChange={(v) => onChange({ value: v })} /></Row>
            <Row label="Unit">
              <Dropdown value={node.unit ?? "minutes"} onChange={(v) => onChange({ unit: v })} options={[
                { value: "minutes", label: "Minutes" },
                { value: "hours", label: "Hours" },
                { value: "days", label: "Days" },
                { value: "weeks", label: "Weeks" },
              ]} />
            </Row>
          </>
        )}
        {node.waitType === "time_of_day" && (
          <Row label="Until"><TextInput value={node.untilTime ?? "09:00"} onChange={(v) => onChange({ untilTime: v })} placeholder="09:00" width={100} /></Row>
        )}
      </Section>
      <Section heading="Business Hours">
        <Row label="Pause on weekends"><ToggleAsButton value={node.pauseWeekends ?? true} onChange={(v) => onChange({ pauseWeekends: v })} /></Row>
        <Row label="Pause overnight"><ToggleAsButton value={node.pauseOvernight ?? true} onChange={(v) => onChange({ pauseOvernight: v })} /></Row>
        <Row label="Resume at"><InlineValue>9:00 AM</InlineValue></Row>
      </Section>
    </>
  );
}

/* ──────────── Branch sections ──────────── */

function BranchSections({ node, onChange }) {
  return (
    <>
      <Section heading="Condition">
        <Row label="Condition type">
          <Dropdown value={node.conditionType ?? "property"} onChange={(v) => onChange({ conditionType: v })} options={[
            { value: "property", label: "Property check" },
            { value: "tag",      label: "Has tag" },
            { value: "behavior", label: "Behavior" },
          ]} />
        </Row>
        <Row label="Field">
          <Dropdown value={node.field ?? "tag"} onChange={(v) => onChange({ field: v })} options={[
            { value: "tag",      label: "contact.tag" },
            { value: "stage",    label: "contact.stage" },
            { value: "score",    label: "contact.score" },
          ]} />
        </Row>
        <Row label="Operator">
          <Dropdown value={node.operator ?? "contains"} onChange={(v) => onChange({ operator: v })} options={[
            { value: "equals",   label: "equals" },
            { value: "contains", label: "contains" },
            { value: "gt",       label: "greater than" },
            { value: "lt",       label: "less than" },
          ]} />
        </Row>
        <Row label="Value"><TextInput value={node.value ?? ""} onChange={(v) => onChange({ value: v })} placeholder="VIP" /></Row>
        <Row label=""><TextLink>+ Add condition</TextLink></Row>
      </Section>
      <Section heading="Branch Labels">
        <Row label="True label"><TextInput value={node.yesLabel ?? "Yes"} onChange={(v) => onChange({ yesLabel: v })} width={120} /></Row>
        <Row label="False label"><TextInput value={node.noLabel ?? "No"} onChange={(v) => onChange({ noLabel: v })} width={120} /></Row>
      </Section>
      <HelperText>Plain English: If {node.field ?? "contact.tag"} {node.operator ?? "contains"} "{node.value || "—"}"</HelperText>
    </>
  );
}

/* ──────────── Goal sections ──────────── */

function GoalSections({ node, onChange }) {
  return (
    <>
      <Section heading="Goal">
        <Row label="Goal name"><TextInput value={node.title ?? ""} onChange={(v) => onChange({ title: v })} placeholder="Made a purchase" /></Row>
        <Row label="Track in analytics"><ToggleAsButton value={node.trackInAnalytics ?? true} onChange={(v) => onChange({ trackInAnalytics: v })} /></Row>
      </Section>
      <HelperText>Goals are terminal. Flow ends here for any contact who reaches it.</HelperText>
    </>
  );
}
