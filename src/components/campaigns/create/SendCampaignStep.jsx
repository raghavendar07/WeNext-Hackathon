import { useMemo, useState } from "react";
import {
  Bell,
  HelpCircle,
  Lock,
  Megaphone,
  UploadCloud,
  Users,
} from "lucide-react";
import Switch from "../../Switch.jsx";
import { TAGS, STAGES } from "../../crm/data.js";

const AUDIENCE_METHODS = [
  { id: "tags",   title: "Tags",         description: "Send to contacts with specific tags",  Icon: Users },
  { id: "stages", title: "Lead Stages",  description: "Target contacts in selected stages",   Icon: Bell },
  { id: "all",    title: "All Contacts", description: "Reach everyone in your contacts list", Icon: Megaphone },
];

const FIELD_OPTIONS = [
  { id: "name",   label: "Name" },
  { id: "phone",  label: "Phone" },
  { id: "email",  label: "Email" },
  { id: "city",   label: "City" },
  { id: "custom", label: "Custom field…" },
];

const initialState = {
  campaignName: "",
  campaignDescription: "",
  variableMap: {},
  audienceMethod: "tags",
  audienceTags: [],
  audienceStages: [],
  retryFailed: true,
};

export function useSendCampaignState() {
  return useState(initialState);
}

export function recipientCountFor(state) {
  if (state.audienceMethod === "all") return 1840;
  if (state.audienceMethod === "tags") {
    return TAGS
      .filter((t) => state.audienceTags.includes(t.id))
      .reduce((sum, t) => sum + t.count, 0);
  }
  if (state.audienceMethod === "stages") {
    return state.audienceStages.length * 38;
  }
  return 0;
}

export default function SendCampaignStep({
  state,
  onChange,
  detectedVars = [],
  lockedTemplate = null,
}) {
  const update = (patch) => onChange({ ...state, ...patch });

  return (
    <div className="flex flex-col gap-6">
      {lockedTemplate && <LockedTemplateSummary template={lockedTemplate} />}

      <Block heading="Campaign details">
        <FieldLabel label="Campaign Name" required>
          <input
            type="text"
            value={state.campaignName}
            onChange={(e) => update({ campaignName: e.target.value })}
            placeholder="e.g. Diwali 2026 — VIP segment"
            className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none focus-visible:shadow-focus"
          />
        </FieldLabel>
        <FieldLabel label="Description" hint="Optional">
          <textarea
            value={state.campaignDescription}
            onChange={(e) => update({ campaignDescription: e.target.value })}
            placeholder="What is this campaign for?"
            className="min-h-[80px] w-full resize-y rounded-sm border border-line bg-white px-3 py-2 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none focus-visible:shadow-focus"
          />
        </FieldLabel>
      </Block>

      {detectedVars.length > 0 && (
        <Block
          heading="Variable mapping"
          subtitle="Map each variable in your template to a contact field."
        >
          <div className="flex flex-col gap-3">
            {detectedVars.map((v) => {
              const mapping = state.variableMap[v] ?? { field: "name", fallback: "" };
              const setMapping = (patch) =>
                update({
                  variableMap: { ...state.variableMap, [v]: { ...mapping, ...patch } },
                });
              return (
                <div key={v} className="grid grid-cols-[120px_1fr_1fr] items-center gap-3">
                  <span className="rounded-xs bg-brand-50 px-2 py-1 text-center text-[12px] font-semibold text-brand-emerald">
                    {`{{${v}}}`}
                  </span>
                  <select
                    value={mapping.field}
                    onChange={(e) => setMapping({ field: e.target.value })}
                    className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading focus:outline-none focus-visible:shadow-focus"
                  >
                    {FIELD_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={mapping.fallback}
                    onChange={(e) => setMapping({ fallback: e.target.value })}
                    placeholder="If field is empty, use…"
                    className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none focus-visible:shadow-focus"
                  />
                </div>
              );
            })}
          </div>
        </Block>
      )}

      <AudienceBlock state={state} update={update} />

      <Block heading="Delivery options">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-ink-heading">Retry failed recipients</span>
            <span className="text-[12px] font-medium text-ink-muted">
              Automatically retry delivery once if WhatsApp returns an error.
            </span>
          </div>
          <Switch
            checked={state.retryFailed}
            onChange={(v) => update({ retryFailed: v })}
            ariaLabel="Retry failed recipients"
          />
        </div>
      </Block>
    </div>
  );
}

function LockedTemplateSummary({ template }) {
  return (
    <section className="flex items-start gap-3 rounded-md border border-line bg-canvas p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-surface-muted text-ink-muted">
        <Lock size={14} strokeWidth={1.75} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13px] font-semibold text-ink-heading">
            {template.name}
          </span>
          <span className="rounded-pill bg-surface-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-muted">
            Locked
          </span>
        </div>
        <span className="text-[11px] font-medium text-ink-muted">
          Template content is locked. To edit, back out and use Manual mode.
        </span>
      </div>
    </section>
  );
}

function AudienceBlock({ state, update }) {
  const toggleTag = (id) => {
    const next = state.audienceTags.includes(id)
      ? state.audienceTags.filter((x) => x !== id)
      : [...state.audienceTags, id];
    update({ audienceTags: next });
  };

  const toggleStage = (id) => {
    const next = state.audienceStages.includes(id)
      ? state.audienceStages.filter((x) => x !== id)
      : [...state.audienceStages, id];
    update({ audienceStages: next });
  };

  return (
    <Block
      heading="Audience"
      action={
        <button
          type="button"
          onClick={() => alert('Sample.csv downloaded (mock)')}
          className="text-[12px] font-semibold text-brand-emerald hover:underline"
        >
          Download Sample File
        </button>
      }
    >
      <div className="grid grid-cols-3 gap-3">
        {AUDIENCE_METHODS.map((m) => {
          const isActive = state.audienceMethod === m.id;
          const Icon = m.Icon;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => update({ audienceMethod: m.id })}
              className={[
                "flex flex-col items-start gap-2 rounded-md border p-3 text-left transition-colors",
                isActive
                  ? "border-brand-emerald bg-brand-50"
                  : "border-line bg-white hover:bg-surface-subtle",
              ].join(" ")}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={[
                    "inline-flex h-8 w-8 items-center justify-center rounded-xs",
                    isActive ? "bg-brand-emerald text-white" : "bg-surface-muted text-ink-muted",
                  ].join(" ")}
                >
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <span
                  aria-hidden
                  className={[
                    "inline-flex h-4 w-4 items-center justify-center rounded-full border",
                    isActive ? "border-brand-emerald bg-brand-emerald" : "border-line bg-white",
                  ].join(" ")}
                >
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <span className="text-[13px] font-semibold text-ink-heading">{m.title}</span>
              <span className="text-[11px] font-medium text-ink-muted">{m.description}</span>
            </button>
          );
        })}
      </div>

      {state.audienceMethod === "tags" && (
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-ink-heading">Select tags</span>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => {
              const isActive = state.audienceTags.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTag(t.id)}
                  className={[
                    "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[12px] font-medium transition-colors",
                    isActive
                      ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                      : "border-line bg-white text-ink-muted hover:bg-surface-subtle",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                  {t.name}
                  <span className="text-[11px] text-ink-subtle">{t.count.toLocaleString()}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {state.audienceMethod === "stages" && (
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-ink-heading">Select stages</span>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((s) => {
              const isActive = state.audienceStages.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleStage(s.id)}
                  className={[
                    "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[12px] font-medium transition-colors",
                    isActive
                      ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                      : "border-line bg-white text-ink-muted hover:bg-surface-subtle",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Dropzone
        compact
        accepted="XLSX, XLS, or CSV up to 10 MB"
        title="Upload new contacts"
        description="Optional — append fresh recipients for this campaign."
      />
    </Block>
  );
}

export function Block({ heading, subtitle, action, children }) {
  return (
    <section className="flex flex-col gap-4 rounded-md border border-line bg-white p-5">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[15px] font-semibold text-ink-heading">{heading}</h3>
          {subtitle && (
            <p className="text-[12px] font-medium text-ink-muted">{subtitle}</p>
          )}
        </div>
        {action}
      </header>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

export function FieldLabel({ label, required, hint, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1 text-[12px] font-semibold text-ink-heading">
        {label}
        {required && <span className="text-danger">*</span>}
        {hint && (
          <span className="group relative inline-flex items-center">
            <HelpCircle size={12} className="text-ink-subtle" strokeWidth={1.75} />
            <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-xs bg-ink-heading px-2 py-1 text-[11px] font-medium text-white group-hover:block">
              {hint}
            </span>
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

function Dropzone({ accepted, compact, title, description }) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-line bg-canvas px-4 text-center",
        compact ? "py-6" : "py-8",
      ].join(" ")}
    >
      <UploadCloud size={20} className="text-ink-muted" strokeWidth={1.5} />
      <span className="text-[13px] font-semibold text-ink-heading">
        {title ?? "Drag & drop your file here, or click to browse"}
      </span>
      <span className="text-[11px] font-medium text-ink-muted">
        {description ?? `Accepted: ${accepted}`}
      </span>
    </div>
  );
}
