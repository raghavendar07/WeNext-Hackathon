import { useMemo, useState } from "react";
import {
  Bold,
  Check,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Italic,
  Plus,
  Strikethrough,
  Trash2,
  Type,
  UploadCloud,
  Variable,
  Video,
} from "lucide-react";
import WhatsAppMessagePreview from "./WhatsAppMessagePreview.jsx";
import SendCampaignStep, { recipientCountFor } from "./SendCampaignStep.jsx";

const STEPS = [
  { id: 1, label: "Build Template" },
  { id: 2, label: "Send Campaign" },
];

const CATEGORIES = [
  { id: "marketing",     label: "Marketing",      hint: "Promotions, offers, and announcements." },
  { id: "utility",       label: "Utility",        hint: "Order updates, alerts, account notices." },
  { id: "authentication",label: "Authentication", hint: "OTPs and verification codes." },
];

const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "te", label: "Telugu" },
  { id: "hi", label: "Hindi" },
  { id: "ta", label: "Tamil" },
  { id: "gu", label: "Gujarati" },
  { id: "mr", label: "Marathi" },
  { id: "kn", label: "Kannada" },
  { id: "bn", label: "Bengali" },
  { id: "ml", label: "Malayalam" },
  { id: "pa", label: "Punjabi" },
  { id: "ur", label: "Urdu" },
];

const HEADER_FORMATS = [
  { id: "none",     label: "None",     Icon: null },
  { id: "text",     label: "Text",     Icon: Type },
  { id: "image",    label: "Image",    Icon: ImageIcon },
  { id: "video",    label: "Video",    Icon: Video },
  { id: "document", label: "Document", Icon: FileText },
];

const BUTTON_TYPES = [
  { id: "quick",  label: "Quick Reply" },
  { id: "call",   label: "Call" },
  { id: "url",    label: "URL" },
];

const ACCEPTED = {
  image:    "PNG, JPG up to 5 MB",
  video:    "MP4 up to 16 MB",
  document: "PDF up to 100 MB",
};

const initialFormState = {
  templateName: "",
  category: "marketing",
  layout: "normal",
  language: "en",
  headerFormat: "none",
  headerText: "",
  body: "",
  footer: "",
  buttons: [],
  campaignName: "",
  campaignDescription: "",
  variableMap: {},
  audienceMethod: "tags",
  audienceTags: [],
  audienceStages: [],
  retryFailed: true,
};

export default function ManualComposeStep({ onSend, onCancel }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialFormState);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const detectedVars = useMemo(() => {
    const out = [];
    const re = /\{\{\s*([^}]+?)\s*\}\}/g;
    let m;
    while ((m = re.exec(form.body)) !== null) {
      if (!out.includes(m[1])) out.push(m[1]);
    }
    return out;
  }, [form.body]);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const goTo = (target) => {
    if (target <= step) setStep(target);
  };

  const canProceedFromStep1 =
    form.templateName.trim().length > 0 && form.body.trim().length > 0;

  const previewProps = useMemo(() => buildPreviewProps(form), [form]);

  return (
    <div className="flex h-full flex-col bg-canvas">
      <Stepper step={step} onJump={goTo} />

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 overflow-y-auto px-8 py-6">
          <div className="mx-auto max-w-[720px]">
            {step === 1 ? (
              <StepBuildTemplate form={form} update={update} detectedVars={detectedVars} />
            ) : (
              <SendCampaignStep
                state={form}
                onChange={(next) => setForm(next)}
                detectedVars={detectedVars}
              />
            )}
          </div>
        </div>

        <aside className="flex w-[400px] shrink-0 flex-col border-l border-line bg-white px-6 py-6">
          <h3 className="text-[13px] font-semibold text-ink-heading">Live preview</h3>
          <p className="mb-4 text-[12px] font-medium text-ink-muted">
            Updates as you type
          </p>
          <WhatsAppMessagePreview {...previewProps} />
        </aside>
      </div>

      <ActionBar
        step={step}
        onPrev={() => (step === 1 ? onCancel?.() : setStep(1))}
        onNext={() =>
          step === 1
            ? canProceedFromStep1 && setStep(2)
            : setConfirmOpen(true)
        }
        canNext={step === 1 ? canProceedFromStep1 : true}
      />

      {confirmOpen && (
        <ConfirmSendModal
          form={form}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            onSend?.();
          }}
        />
      )}
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

/* ──────────── Step 1: Build Template ──────────── */

function StepBuildTemplate({ form, update, detectedVars }) {
  return (
    <div className="flex flex-col gap-6">
      <BasicsBlock form={form} update={update} />
      <HeaderBlock form={form} update={update} />
      <BodyBlock form={form} update={update} detectedVars={detectedVars} />
      <FooterButtonsBlock form={form} update={update} />
    </div>
  );
}

function BasicsBlock({ form, update }) {
  return (
    <Block heading="Basics">
      <FieldLabel label="Template Name" required>
        <input
          type="text"
          value={form.templateName}
          onChange={(e) => update({ templateName: e.target.value })}
          placeholder="e.g. diwali_promo_2026"
          className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none focus-visible:shadow-focus"
        />
      </FieldLabel>

      <div className="grid grid-cols-3 gap-4">
        <FieldLabel
          label="Category"
          required
          hint={CATEGORIES.find((c) => c.id === form.category)?.hint}
        >
          <select
            value={form.category}
            onChange={(e) => update({ category: e.target.value })}
            className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading focus:outline-none focus-visible:shadow-focus"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </FieldLabel>

        <FieldLabel label="Layout" required>
          <SegmentedControl
            value={form.layout}
            onChange={(v) => update({ layout: v })}
            options={[
              { id: "normal",   label: "Normal" },
              { id: "carousel", label: "Carousel" },
            ]}
          />
        </FieldLabel>

        <FieldLabel label="Language" required>
          <select
            value={form.language}
            onChange={(e) => update({ language: e.target.value })}
            className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading focus:outline-none focus-visible:shadow-focus"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </FieldLabel>
      </div>
    </Block>
  );
}

function HeaderBlock({ form, update }) {
  const fmt = form.headerFormat;
  return (
    <Block
      heading="Header"
      subtitle="Optional. Add media or text at the top."
    >
      <div className="flex flex-wrap gap-2">
        {HEADER_FORMATS.map((opt) => {
          const isActive = fmt === opt.id;
          const Icon = opt.Icon;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => update({ headerFormat: opt.id })}
              className={[
                "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-[13px] font-medium transition-colors",
                isActive
                  ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                  : "border-line bg-white text-ink-muted hover:bg-surface-subtle",
              ].join(" ")}
            >
              {isActive && <Check size={14} strokeWidth={2.25} />}
              {Icon && !isActive && <Icon size={14} strokeWidth={1.75} />}
              {opt.label}
            </button>
          );
        })}
      </div>

      {fmt === "text" && (
        <FieldLabel label="Header Text" hint="Max 60 characters">
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={form.headerText}
              maxLength={60}
              onChange={(e) => update({ headerText: e.target.value })}
              placeholder="Bold one-liner shown at the top of the message"
              className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none focus-visible:shadow-focus"
            />
            <span className="self-end text-[11px] font-medium text-ink-muted">
              {form.headerText.length}/60
            </span>
          </div>
        </FieldLabel>
      )}

      {(fmt === "image" || fmt === "video" || fmt === "document") && (
        <Dropzone accepted={ACCEPTED[fmt]} />
      )}
    </Block>
  );
}

function BodyBlock({ form, update, detectedVars }) {
  const insertVariable = () => {
    const next = (detectedVars.length || 0) + 1;
    update({ body: `${form.body}{{${next}}}` });
  };

  const wrap = (token) => {
    update({ body: `${form.body}${token}sample${token}` });
  };

  return (
    <Block
      heading="Body"
      subtitle="The main message. Use {{1}}, {{2}} for variables."
    >
      <div className="flex items-center gap-1 rounded-sm border border-line bg-surface-subtle px-2 py-1">
        <ToolbarBtn onClick={() => wrap("*")} ariaLabel="Bold">
          <Bold size={14} strokeWidth={1.75} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => wrap("_")} ariaLabel="Italic">
          <Italic size={14} strokeWidth={1.75} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => wrap("~")} ariaLabel="Strikethrough">
          <Strikethrough size={14} strokeWidth={1.75} />
        </ToolbarBtn>
        <span aria-hidden className="mx-1 h-4 w-px bg-line" />
        <button
          type="button"
          onClick={insertVariable}
          className="inline-flex h-7 items-center gap-1 rounded-xs px-2 text-[12px] font-medium text-brand-emerald hover:bg-brand-50"
        >
          <Variable size={14} strokeWidth={1.75} />
          Insert Variable
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <textarea
          value={form.body}
          maxLength={1024}
          onChange={(e) => update({ body: e.target.value })}
          placeholder="Hi {{1}}, here's a special offer just for you..."
          className="min-h-[120px] w-full resize-y rounded-sm border border-line bg-white px-3 py-2 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none focus-visible:shadow-focus"
        />
        <span className="self-end text-[11px] font-medium text-ink-muted">
          {form.body.length}/1024
        </span>
      </div>
    </Block>
  );
}

function FooterButtonsBlock({ form, update }) {
  const buttons = form.buttons;
  const max = 3;
  const atLimit = buttons.length >= max;

  const addButton = () => {
    if (atLimit) return;
    update({
      buttons: [
        ...buttons,
        { id: `b-${Date.now()}`, type: "quick", label: "", url: "", phone: "" },
      ],
    });
  };

  const updateBtn = (id, patch) => {
    update({
      buttons: buttons.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    });
  };

  const removeBtn = (id) => {
    update({ buttons: buttons.filter((b) => b.id !== id) });
  };

  return (
    <Block heading="Footer & Buttons" subtitle="Optional.">
      <FieldLabel label="Footer text" hint="Max 60 characters">
        <div className="flex flex-col gap-1">
          <input
            type="text"
            value={form.footer}
            maxLength={60}
            onChange={(e) => update({ footer: e.target.value })}
            placeholder="Small print shown below the message"
            className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none focus-visible:shadow-focus"
          />
          <span className="self-end text-[11px] font-medium text-ink-muted">
            {form.footer.length}/60
          </span>
        </div>
      </FieldLabel>

      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-semibold text-ink-heading">Buttons</span>
        {buttons.length === 0 ? (
          <p className="text-[12px] font-medium text-ink-muted">
            No buttons yet. Add up to 3.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {buttons.map((b) => (
              <ButtonRow
                key={b.id}
                button={b}
                onUpdate={(patch) => updateBtn(b.id, patch)}
                onRemove={() => removeBtn(b.id)}
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addButton}
            disabled={atLimit}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-button border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={14} strokeWidth={2} />
            Add Button
          </button>
          {atLimit && (
            <span className="text-[12px] font-medium text-ink-muted">
              Maximum 3 buttons reached
            </span>
          )}
        </div>
      </div>
    </Block>
  );
}

function ButtonRow({ button, onUpdate, onRemove }) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={button.type}
        onChange={(e) => onUpdate({ type: e.target.value })}
        className="h-10 w-[140px] rounded-sm border border-line bg-white px-2 text-[13px] text-ink-heading focus:outline-none focus-visible:shadow-focus"
      >
        {BUTTON_TYPES.map((t) => (
          <option key={t.id} value={t.id}>{t.label}</option>
        ))}
      </select>
      <input
        type="text"
        value={button.label}
        onChange={(e) => onUpdate({ label: e.target.value })}
        placeholder="Button text"
        className="h-10 flex-1 rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none focus-visible:shadow-focus"
      />
      {button.type === "url" && (
        <input
          type="url"
          value={button.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="https://…"
          className="h-10 w-[200px] rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none focus-visible:shadow-focus"
        />
      )}
      {button.type === "call" && (
        <input
          type="tel"
          value={button.phone}
          onChange={(e) => onUpdate({ phone: e.target.value })}
          placeholder="+1 555 555 5555"
          className="h-10 w-[180px] rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none focus-visible:shadow-focus"
        />
      )}
      <button
        type="button"
        aria-label="Remove button"
        onClick={onRemove}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xs text-danger hover:bg-danger-bg"
      >
        <Trash2 size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}

/* ──────────── Action bar ──────────── */

function ActionBar({ step, onPrev, onNext, canNext }) {
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
          {step === 1 ? "Cancel" : "Previous"}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className={[
            "inline-flex h-10 items-center gap-2 rounded-button px-5 text-[13px] font-medium text-white transition-opacity",
            canNext ? "bg-cta-gradient hover:opacity-90" : "bg-cta-gradient opacity-50 cursor-not-allowed",
          ].join(" ")}
        >
          {step === 1 ? "Next" : "Send Campaign"}
        </button>
      </div>
    </footer>
  );
}

/* ──────────── Confirmation modal ──────────── */

function ConfirmSendModal({ form, onCancel, onConfirm }) {
  const recipientCount = useMemo(() => recipientCountFor(form), [form]);
  const cost = (recipientCount * 0.0085).toFixed(2);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
    >
      <div className="w-full max-w-[440px] rounded-md border border-line bg-white p-6 shadow-card">
        <h3 className="text-[16px] font-semibold text-ink-heading">Send this campaign?</h3>
        <p className="mt-1 text-[13px] font-medium text-ink-muted">
          Review the details before sending.
        </p>
        <dl className="mt-4 flex flex-col gap-2 rounded-sm border border-line bg-canvas p-3">
          <ConfirmRow label="Campaign" value={form.campaignName || "Untitled campaign"} />
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

/* ──────────── Shared field/block primitives ──────────── */

function Block({ heading, subtitle, action, children }) {
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

function FieldLabel({ label, required, hint, children }) {
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

function SegmentedControl({ value, options, onChange }) {
  return (
    <div className="inline-flex h-10 w-full rounded-sm border border-line bg-surface-subtle p-0.5">
      {options.map((o) => {
        const isActive = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={[
              "flex-1 rounded-xs text-[12px] font-semibold transition-colors",
              isActive
                ? "bg-white text-ink-heading shadow-chip"
                : "text-ink-muted hover:text-ink-heading",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ToolbarBtn({ onClick, ariaLabel, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted hover:text-ink-heading"
    >
      {children}
    </button>
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

/* ──────────── Preview state mapping ──────────── */

function buildPreviewProps(form) {
  const bodyLines = form.body.trim().length > 0
    ? form.body.split(/\n+/)
    : ["Your message will appear here as you type."];
  const buttons =
    form.buttons.length > 0
      ? form.buttons
          .filter((b) => b.label.trim().length > 0)
          .slice(0, 2)
          .map((b, i) => ({
            label: b.label,
            tone: i === 0 ? "brand" : "muted",
            emoji: b.type === "url" ? "🔗" : b.type === "call" ? "📞" : undefined,
          }))
      : [{ label: "Sample button", tone: "brand" }];

  return {
    businessName: form.templateName.trim() || "Business Name",
    verifiedLabel: form.headerText.trim() || "Verified",
    bodyLines,
    buttons,
  };
}
