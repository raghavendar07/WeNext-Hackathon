import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Check,
  Copy,
  FileText,
  Image as ImageIcon,
  Inbox,
  Search,
  Video,
} from "lucide-react";
import SendCampaignStep, { recipientCountFor } from "./SendCampaignStep.jsx";
import {
  META_TEMPLATES,
  categoryBadgeFor,
  deriveTemplateInfo,
  formatRelative,
  formatCreatedDate,
  languageLabel,
  readableBody,
} from "./templateLibraryData.js";

const STEPS = [
  { id: 1, label: "Choose Template" },
  { id: 2, label: "Send Campaign" },
];

const CATEGORY_FILTERS = [
  { id: "all",            label: "All" },
  { id: "MARKETING",      label: "Marketing" },
  { id: "UTILITY",        label: "Utility" },
  { id: "AUTHENTICATION", label: "Authentication" },
];

const initialSendState = {
  campaignName: "",
  campaignDescription: "",
  variableMap: {},
  audienceMethod: "tags",
  audienceTags: [],
  audienceStages: [],
  retryFailed: true,
};

export default function LibraryComposeStep({ onSend, onCreateNew }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);
  const [sendState, setSendState] = useState(initialSendState);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const detectedVars = useMemo(() => {
    if (!selected) return [];
    return deriveTemplateInfo(selected).variables;
  }, [selected]);

  const showToast = (text) => {
    setToast(text);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="flex h-full flex-col bg-canvas">
      <Stepper step={step} onJump={(t) => t <= step && setStep(t)} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {step === 1 ? (
          <LibraryBrowser
            selected={selected}
            onSelect={setSelected}
            onUseTemplate={() => selected && setStep(2)}
            onCopy={(t) => {
              navigator.clipboard?.writeText(t).catch(() => {});
              showToast("Template copied");
            }}
            onCreateNew={onCreateNew}
          />
        ) : (
          <div className="mx-auto max-w-[720px] px-8 py-6">
            <SendCampaignStep
              state={sendState}
              onChange={setSendState}
              detectedVars={detectedVars}
              lockedTemplate={selected}
            />
          </div>
        )}
      </div>

      {step === 2 && (
        <ActionBar
          onPrev={() => setStep(1)}
          onSend={() => setConfirmOpen(true)}
        />
      )}

      {confirmOpen && (
        <ConfirmSendModal
          template={selected}
          state={sendState}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            onSend?.();
          }}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

/* ──────────── Stepper ──────────── */

function Stepper({ step, onJump }) {
  return (
    <div className="flex items-center gap-3 border-b border-line bg-white px-8 py-4">
      {STEPS.map((s, i) => {
        const isActive = s.id === step;
        const isComplete = s.id < step;
        const isInactive = !isActive && !isComplete;
        return (
          <div key={s.id} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onJump(s.id)}
              disabled={isInactive}
              className={[
                "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[12px] font-semibold transition-colors",
                isActive
                  ? "border-brand-emerald bg-brand-emerald text-white"
                  : isComplete
                    ? "border-brand-emerald bg-white text-brand-emerald hover:bg-brand-50"
                    : "border-line bg-white text-ink-muted",
              ].join(" ")}
            >
              {isComplete ? (
                <Check size={14} strokeWidth={2.25} />
              ) : (
                <span
                  className={[
                    "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold",
                    isActive ? "bg-white/20 text-white" : "bg-surface-muted text-ink-muted",
                  ].join(" ")}
                >
                  {s.id}
                </span>
              )}
              <span>{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <span aria-hidden className="h-px w-8 bg-line" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────── Library browser ──────────── */

function LibraryBrowser({ selected, onSelect, onUseTemplate, onCopy, onCreateNew }) {
  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState({ loading: true, error: null, data: [] });

  // Simulated Meta Graph fetch (cached client-side for 5 min in production).
  useEffect(() => {
    let cancelled = false;
    setStatus({ loading: true, error: null, data: [] });
    const t = setTimeout(() => {
      if (cancelled) return;
      const approved = META_TEMPLATES.filter((t) => t.status === "APPROVED");
      setStatus({ loading: false, error: null, data: approved });
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  // Debounce search 300ms.
  useEffect(() => {
    const t = setTimeout(() => setQuery(rawQuery.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [rawQuery]);

  const filtersActive = rawQuery.trim().length > 0 || category !== "all";
  const resetFilters = () => {
    setRawQuery("");
    setCategory("all");
  };

  const filtered = useMemo(() => {
    let out = status.data;
    if (category !== "all") out = out.filter((t) => t.category === category);
    if (query) out = out.filter((t) => t.name.toLowerCase().includes(query));
    return out.slice().sort((a, b) => (b.created_time ?? "").localeCompare(a.created_time ?? ""));
  }, [status.data, query, category]);

  const isAccountEmpty = !status.loading && !status.error && status.data.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-[1186px] gap-5 px-5 py-5">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <SearchInput value={rawQuery} onChange={setRawQuery} />
        <CategoryRow category={category} onChange={setCategory} />
        <LeftZoneContent
          status={status}
          isAccountEmpty={isAccountEmpty}
          filtered={filtered}
          filtersActive={filtersActive}
          onReset={resetFilters}
          onCreateNew={onCreateNew}
          onRetry={() => setStatus({ loading: true, error: null, data: [] })}
          selected={selected}
          onSelect={onSelect}
          onCopy={onCopy}
        />
      </div>

      <RightRail template={selected} onUseTemplate={onUseTemplate} />
    </div>
  );
}

function SearchInput({ value, onChange }) {
  return (
    <label className="flex h-10 w-full items-center gap-2 rounded-lg border border-line bg-white px-3">
      <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search templates by name…"
        className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
      />
    </label>
  );
}

function CategoryRow({ category, onChange }) {
  return (
    <div className="flex items-center gap-3">
      {CATEGORY_FILTERS.map((f) => {
        const isActive = f.id === category;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={[
              "inline-flex h-9 items-center rounded-full border px-4 text-[12px] font-medium transition-colors",
              isActive
                ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                : "border-line bg-white text-ink-muted hover:bg-surface-subtle",
            ].join(" ")}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

function LeftZoneContent({
  status,
  isAccountEmpty,
  filtered,
  filtersActive,
  onReset,
  onCreateNew,
  onRetry,
  selected,
  onSelect,
  onCopy,
}) {
  if (status.loading) return <SkeletonGrid />;
  if (status.error) return <ErrorState message={status.error} onRetry={onRetry} />;
  if (isAccountEmpty) return <EmptyAccountState onCreateNew={onCreateNew} />;
  if (filtered.length === 0) return <EmptyResults filtersActive={filtersActive} onReset={onReset} />;

  return (
    <div className="grid grid-cols-2 gap-5">
      {filtered.map((tpl) => (
        <TemplateCard
          key={tpl.id}
          template={tpl}
          selected={selected?.id === tpl.id}
          onClick={() => onSelect(tpl)}
          onCopy={() => onCopy(deriveTemplateInfo(tpl).body.text || "")}
        />
      ))}
    </div>
  );
}

/* ──────────── Card ──────────── */

function TemplateCard({ template, selected, onClick, onCopy }) {
  const info = deriveTemplateInfo(template);
  const badge = categoryBadgeFor(template.category);
  const hasImageHeader = info.header && info.header.format !== "TEXT";
  const lastUsedLabel = template.last_used_at
    ? `Last used: ${formatRelative(template.last_used_at)}`
    : `Created: ${formatCreatedDate(template.created_time)}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className={[
        "relative flex h-[166px] cursor-pointer flex-col rounded-xl border bg-white p-5 transition-all focus:outline-none focus-visible:shadow-focus",
        selected
          ? "border-brand-emerald shadow-[0_0_0_4px_rgba(30,182,119,0.15)]"
          : "border-line hover:border-line-strong",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className={[
              "inline-flex h-[22px] items-center rounded-md px-2.5 text-[11px] font-semibold",
              badge.classes,
            ].join(" ")}
          >
            {badge.label}
          </span>
          {hasImageHeader && (
            <span className="inline-flex h-[22px] items-center gap-1.5 rounded-md bg-surface-subtle px-2.5 text-[11px] font-medium text-ink-muted">
              <HeaderTypeIcon format={info.header.format} />
              Contains {headerWord(info.header.format)}
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label="Copy template body"
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-subtle hover:bg-surface-subtle hover:text-ink-heading"
        >
          <Copy size={14} strokeWidth={1.75} />
        </button>
      </div>

      <div className="mt-3.5 flex min-h-0 flex-1 flex-col gap-1">
        <span className="text-[12px] font-medium text-ink-muted">{lastUsedLabel}</span>
        <p
          className="text-[13px] leading-relaxed text-ink-body"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <CardBodyText text={info.body.text || ""} />
        </p>
      </div>
    </div>
  );
}

function CardBodyText({ text }) {
  const PARTS = readableBody(text).split(/(\[[^\]]+\])/g);
  return (
    <>
      {PARTS.map((part, i) =>
        part.startsWith("[") && part.endsWith("]") ? (
          <span
            key={i}
            className="rounded-sm bg-warning-bg px-1 font-semibold text-warning"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function HeaderTypeIcon({ format }) {
  const Icon = format === "VIDEO" ? Video : format === "DOCUMENT" ? FileText : ImageIcon;
  return <Icon size={12} strokeWidth={1.75} className="text-ink-muted" />;
}

function headerWord(format) {
  if (format === "VIDEO") return "Video";
  if (format === "DOCUMENT") return "Document";
  return "Image";
}

/* ──────────── Right rail (sticky phone preview + CTA) ──────────── */

function RightRail({ template, onUseTemplate }) {
  return (
    <aside className="sticky top-5 flex h-fit w-[360px] shrink-0 flex-col gap-4 rounded-2xl border border-line bg-gradient-to-b from-surface-subtle to-white p-5">
      <PhoneFrame template={template} />
      <RightRailDetails template={template} />
      <button
        type="button"
        onClick={onUseTemplate}
        disabled={!template}
        className={[
          "inline-flex h-11 w-full items-center justify-center rounded-button text-[13px] font-semibold text-white transition-opacity",
          template ? "bg-cta-gradient hover:opacity-90" : "bg-cta-gradient opacity-40 cursor-not-allowed",
        ].join(" ")}
      >
        Use This Template
      </button>
    </aside>
  );
}

function PhoneFrame({ template }) {
  const info = template ? deriveTemplateInfo(template) : null;
  const title = template
    ? categoryBadgeFor(template.category).label
    : "WhatsApp Business";

  return (
    <div className="flex flex-col rounded-[28px] border border-line bg-white p-2 shadow-chip">
      <div className="flex h-9 items-center justify-between rounded-t-[20px] bg-[#075E54] px-3 text-white">
        <ArrowLeft size={14} strokeWidth={2} />
        <span className="text-[12px] font-semibold">{title}</span>
        <span className="relative inline-flex h-4 w-4 items-center justify-center">
          <Bell size={12} strokeWidth={2} />
          {template && (
            <span aria-hidden className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-danger" />
          )}
        </span>
      </div>
      <div
        className="flex min-h-[300px] flex-col items-stretch justify-start rounded-b-[20px] bg-[#E5DDD5]/70 p-3"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      >
        {!template ? (
          <div className="m-auto max-w-[200px] text-center text-[12px] font-medium text-ink-muted">
            Click a template to preview it here
          </div>
        ) : (
          <ChatBubble template={template} info={info} />
        )}
      </div>
    </div>
  );
}

function ChatBubble({ template, info }) {
  return (
    <div className="flex w-full max-w-[300px] flex-col rounded-xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      {info.header && info.header.format !== "TEXT" && (
        <ChatBubbleMedia format={info.header.format} />
      )}
      <div className="flex flex-col gap-1.5 px-3 pb-2 pt-2.5">
        {info.header?.format === "TEXT" && (
          <span className="text-[12px] font-semibold text-ink-heading">
            <PreviewBodyText text={info.header.text} />
          </span>
        )}
        {info.body.text && (
          <p className="text-[12px] leading-snug text-ink-body">
            <PreviewBodyText text={info.body.text} />
          </p>
        )}
        {info.footer && (
          <span className="text-[10px] font-medium text-ink-muted">
            {info.footer.text}
          </span>
        )}
        <div className="flex items-center justify-end gap-1 pt-0.5">
          <span className="text-[10px] font-medium text-ink-muted">11:14 AM</span>
          <DoubleCheck />
        </div>
      </div>
      {info.buttons.length > 0 && (
        <div className="flex flex-col">
          {info.buttons.map((b, i) => (
            <span
              key={i}
              className="border-t border-line py-2 text-center text-[12px] font-medium text-[#0066FF]"
            >
              {b.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatBubbleMedia({ format }) {
  const Icon = format === "VIDEO" ? Video : format === "DOCUMENT" ? FileText : ImageIcon;
  const tone =
    format === "VIDEO" ? "bg-info-bg text-info" :
    format === "DOCUMENT" ? "bg-warning-bg text-warning" :
    "bg-brand-50 text-brand-emerald";
  return (
    <span className={["flex h-[150px] items-center justify-center rounded-t-xl", tone].join(" ")}>
      <Icon size={36} strokeWidth={1.5} />
    </span>
  );
}

function DoubleCheck() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
      <path d="M1 5.5L4 8.5L9.5 1.5" stroke="#1877F2" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5.5L8 8.5L13 1.5" stroke="#1877F2" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PreviewBodyText({ text }) {
  const PARTS = readableBody(text).split(/(\[[^\]]+\])/g);
  return (
    <>
      {PARTS.map((part, i) =>
        part.startsWith("[") && part.endsWith("]") ? (
          <span
            key={i}
            className="rounded-sm bg-warning-bg px-1 font-semibold text-warning"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function RightRailDetails({ template }) {
  if (!template) {
    return (
      <p className="text-center text-[11px] font-medium text-ink-muted">
        Select a template to see its details and continue.
      </p>
    );
  }
  const info = deriveTemplateInfo(template);
  return (
    <dl className="flex flex-col gap-1.5 text-[12px]">
      <DetailLine
        label={`Variables (${info.variables.length})`}
        value={
          info.variables.length === 0 ? (
            <span className="text-ink-muted">None</span>
          ) : (
            <span className="flex flex-wrap justify-end gap-1">
              {info.variables.map((v) => (
                <span
                  key={v}
                  className="rounded-xs bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-emerald"
                >
                  {`{{${v}}}`}
                </span>
              ))}
            </span>
          )
        }
      />
      <DetailLine label="Buttons" value={`${info.buttons.length}`} />
      <DetailLine label="Language" value={languageLabel(template.language)} />
      <DetailLine
        label="Status"
        value={
          <span className="inline-flex items-center gap-1.5 text-success">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />
            Approved
          </span>
        }
      />
    </dl>
  );
}

function DetailLine({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="font-medium text-ink-muted">{label}</span>
      <span className="text-right font-semibold text-ink-heading">{value}</span>
    </div>
  );
}

/* ──────────── States ──────────── */

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex h-[166px] flex-col gap-3 rounded-xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="h-[22px] w-20 rounded-md bg-surface-muted" />
            <span className="h-5 w-5 rounded-xs bg-surface-muted" />
          </div>
          <span className="h-3 w-1/3 rounded-xs bg-surface-muted" />
          <div className="flex flex-col gap-1">
            <span className="h-3 w-full rounded-xs bg-surface-muted" />
            <span className="h-3 w-11/12 rounded-xs bg-surface-muted" />
            <span className="h-3 w-9/12 rounded-xs bg-surface-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyAccountState({ onCreateNew }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line bg-canvas px-6 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
        <Inbox size={26} strokeWidth={1.5} />
      </span>
      <h3 className="text-[16px] font-semibold text-ink-heading">No templates available</h3>
      <p className="max-w-[420px] text-[13px] font-medium text-ink-muted">
        Templates need Meta approval before they can be used. Create one to get started.
      </p>
      <button
        type="button"
        onClick={onCreateNew}
        className="mt-2 inline-flex h-10 items-center rounded-button bg-cta-gradient px-5 text-[13px] font-medium text-white"
      >
        Create New Template
      </button>
    </div>
  );
}

function EmptyResults({ filtersActive, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line bg-canvas px-6 py-16 text-center">
      <h3 className="text-[14px] font-semibold text-ink-heading">No templates match your search</h3>
      {filtersActive && (
        <button
          type="button"
          onClick={onReset}
          className="text-[12px] font-semibold text-brand-emerald hover:underline"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-danger-border bg-danger-bg p-4">
      <AlertCircle size={18} className="mt-0.5 text-danger" strokeWidth={1.75} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[13px] font-semibold text-ink-heading">
          Couldn't load templates
        </span>
        <span className="text-[12px] font-medium text-ink-muted">
          {message || "Check your WhatsApp Business connection."}
        </span>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex h-9 items-center rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
      >
        Retry
      </button>
    </div>
  );
}

/* ──────────── Step 2 action bar + send confirmation + toast ──────────── */

function ActionBar({ onPrev, onSend }) {
  return (
    <footer className="flex items-center justify-between border-t border-line bg-white px-6 py-4">
      <button
        type="button"
        className="inline-flex h-10 items-center gap-2 rounded-button px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
      >
        Save Draft
      </button>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onSend}
          className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-medium text-white hover:opacity-90"
        >
          Send Campaign
        </button>
      </div>
    </footer>
  );
}

function ConfirmSendModal({ template, state, onCancel, onConfirm }) {
  const recipientCount = useMemo(() => recipientCountFor(state), [state]);
  const cost = (recipientCount * 0.0085).toFixed(2);
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] rounded-md border border-line bg-white p-6 shadow-card"
      >
        <h3 className="text-[16px] font-semibold text-ink-heading">Send this campaign?</h3>
        <p className="mt-1 text-[13px] font-medium text-ink-muted">
          Review the details before sending.
        </p>
        <dl className="mt-4 flex flex-col gap-2 rounded-sm border border-line bg-canvas p-3">
          <ConfirmRow label="Template" value={template?.name ?? "—"} />
          <ConfirmRow label="Campaign" value={state.campaignName || "Untitled campaign"} />
          <ConfirmRow label="Recipients" value={recipientCount.toLocaleString()} />
          <ConfirmRow label="Estimated cost" value={`$${cost}`} />
        </dl>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-10 items-center rounded-button bg-cta-gradient px-5 text-[13px] font-medium text-white"
          >
            Confirm send
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="font-medium text-ink-muted">{label}</span>
      <span className="font-semibold text-ink-heading">{value}</span>
    </div>
  );
}

function Toast({ message }) {
  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-md bg-ink-heading px-4 py-2 text-[12px] font-medium text-white shadow-card"
    >
      {message}
    </div>
  );
}
