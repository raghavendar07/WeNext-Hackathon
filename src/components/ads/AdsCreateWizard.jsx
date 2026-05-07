import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Battery,
  Check,
  Globe,
  Phone as PhoneIcon,
  Signal,
  Sparkles,
  ShoppingBag,
  ThumbsUp,
  User,
  UserPlus,
  UploadCloud,
  Wifi,
} from "lucide-react";
import Switch from "../Switch.jsx";
import { CHANNELS, GOALS, CTA_OPTIONS, findChannel, findGoal, formatCurrency } from "./data.js";
import AdPreview from "./AdPreview.jsx";
import { ChannelLogo } from "./AdLogos.jsx";

const STEPS = [
  { id: 1, label: "Channels & Goal" },
  { id: 2, label: "Audience & Budget" },
  { id: 3, label: "Creative" },
];

const GOAL_ICONS = {
  globe:    Globe,
  form:     UserPlus,
  bag:      ShoppingBag,
  phone:    PhoneIcon,
  thumbsup: ThumbsUp,
  profile:  User,
};

const GOAL_TINT = {
  traffic:  { bg: "bg-info-bg",     text: "text-info" },
  leads:    { bg: "bg-brand-50",    text: "text-brand-emerald" },
  product:  { bg: "bg-[#F3E8FF]",   text: "text-[#7C3AED]" },
  installs: { bg: "bg-[#E0E7FF]",   text: "text-[#4F46E5]" },
  boost:    { bg: "bg-[#FCE7F3]",   text: "text-[#DB2777]" },
  profile:  { bg: "bg-warning-bg",  text: "text-warning" },
};

const QUICK_AMOUNTS = [200, 500, 1000, 2500];

const initial = {
  channels: [],
  goalId: null,
  audienceMode: "recommended",
  customAudience: { city: "Mumbai", radiusKm: 25, ageMin: 25, ageMax: 54, gender: "all", interests: ["Festive shopping"], languages: ["en"] },
  budgetType: "daily",
  budgetAmount: 500,
  duration: "open",
  endDate: "",
  splitMode: "auto",
  channelSplit: { meta: 50, linkedin: 30, tiktok: 20 },
  format: "single",
  headline: "",
  description: "",
  cta: "Learn more",
  url: "https://yourbusiness.com",
  business: "WeNext Retail",
};

export default function AdsCreateWizard({ presetGoal, presetChannels, onCancel, onLaunch }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => ({
    ...initial,
    goalId: presetGoal ?? null,
    channels: presetChannels && presetChannels.length > 0 ? presetChannels : initial.channels,
  }));
  const [reviewOpen, setReviewOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));
  const goTo = (target) => target <= step && setStep(target);

  // Smart-pick CTA from goal.
  useEffect(() => {
    const g = findGoal(form.goalId);
    if (g && (form.cta === "" || form.cta === "Learn more")) {
      update({ cta: g.cta });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.goalId]);

  const canStep1Continue = form.channels.length > 0 && form.goalId;
  const canStep2Continue = form.budgetAmount > 0;
  const canLaunch = form.headline.trim().length > 0;

  const previewChannels = form.channels.length > 0 ? form.channels : ["meta"];

  return (
    <div className="flex h-full flex-col bg-canvas">
      <Stepper step={step} onJump={goTo} />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-y-auto px-8 py-6">
          <div className="mx-auto max-w-[640px]">
            {step === 1 && <Step1 form={form} update={update} />}
            {step === 2 && <Step2 form={form} update={update} />}
            {step === 3 && <Step3 form={form} update={update} />}
          </div>
        </div>

        <aside className="flex w-[400px] shrink-0 flex-col border-l border-line bg-white px-6 py-6">
          <h3 className="text-[13px] font-semibold text-ink-heading">Live ad preview</h3>
          <p className="mb-4 text-[12px] font-medium text-ink-muted">Updates as you fill the form</p>
          <PreviewRail channels={previewChannels} business={form.business} creative={{
            format: form.format,
            thumb: previewThumbForGoal(form.goalId),
            headline: form.headline,
            description: form.description,
            cta: form.cta,
            url: form.url,
          }} />
        </aside>
      </div>

      <ActionBar
        step={step}
        onCancel={onCancel}
        onPrev={() => setStep(step - 1)}
        onNext={() => {
          if (step === 1 && canStep1Continue) setStep(2);
          else if (step === 2 && canStep2Continue) setStep(3);
          else if (step === 3 && canLaunch) setReviewOpen(true);
        }}
        canNext={step === 1 ? canStep1Continue : step === 2 ? canStep2Continue : canLaunch}
        validationHint={step === 3 && !canLaunch ? "Add a headline and description to launch" : null}
      />

      {reviewOpen && (
        <ReviewModal
          form={form}
          authorized={authorized}
          onAuthorize={setAuthorized}
          onCancel={() => setReviewOpen(false)}
          onConfirm={() => {
            setReviewOpen(false);
            onLaunch?.(form);
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
        const active = s.id === step;
        const complete = s.id < step;
        const inactive = !active && !complete;
        return (
          <div key={s.id} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onJump(s.id)}
              disabled={inactive}
              className={[
                "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[12px] font-semibold transition-colors",
                active
                  ? "border-brand-emerald bg-brand-emerald text-white"
                  : complete
                    ? "border-brand-emerald bg-white text-brand-emerald hover:bg-brand-50"
                    : "border-line bg-white text-ink-muted",
              ].join(" ")}
            >
              {complete ? <Check size={14} strokeWidth={2.25} /> : <span className={["inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]", active ? "bg-white/20 text-white" : "bg-surface-muted text-ink-muted"].join(" ")}>{s.id}</span>}
              <span>{s.label}</span>
            </button>
            {i < STEPS.length - 1 && <span aria-hidden className="h-px w-8 bg-line" />}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────── Step 1 ──────────── */

function Step1({ form, update }) {
  const goal = findGoal(form.goalId);
  const incompatibleChannels = useMemo(() => {
    if (!goal) return [];
    return form.channels.filter((c) => !goal.channels.includes(c));
  }, [form.channels, goal]);

  const toggleChannel = (id) => {
    const ch = findChannel(id);
    if (!ch.connected) return;
    const next = form.channels.includes(id)
      ? form.channels.filter((x) => x !== id)
      : [...form.channels, id];
    update({ channels: next });
  };

  return (
    <div className="flex flex-col gap-8">
      <Block heading="Where do you want to advertise?" subtitle="Pick one or more. You can run the same ad across multiple platforms.">
        <div className="grid grid-cols-3 gap-4">
          {CHANNELS.map((c) => {
            const selected = form.channels.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleChannel(c.id)}
                disabled={!c.connected}
                className={[
                  "flex h-full flex-col items-start gap-3 rounded-xl border p-5 text-left transition-all focus:outline-none focus-visible:shadow-focus",
                  selected
                    ? "border-[1.5px] border-brand-emerald bg-brand-50/30 shadow-[0_0_0_4px_rgba(30,182,119,0.08)]"
                    : "border-line bg-white hover:border-line-strong",
                  !c.connected ? "cursor-not-allowed opacity-90" : "",
                ].join(" ")}
              >
                <div className="flex w-full items-center justify-between">
                  <ChannelLogo id={c.id} size={28} />
                  <span
                    aria-hidden
                    className={["inline-flex h-5 w-5 items-center justify-center rounded-full border", selected ? "border-brand-emerald bg-brand-emerald" : "border-line-strong bg-white"].join(" ")}
                  >
                    {selected && <Check size={12} strokeWidth={3} className="text-white" />}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-ink-heading">{c.label}</span>
                  <span className="text-[11px] font-medium text-ink-muted">{c.sublabel}</span>
                </div>
                <p className="text-[12px] leading-relaxed text-ink-muted">{c.bestFor}</p>
                {c.connected ? (
                  <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-success">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />
                    Connected
                  </span>
                ) : (
                  <span className="mt-auto text-[11px] font-semibold text-brand-emerald">Connect →</span>
                )}
              </button>
            );
          })}
        </div>
      </Block>

      {form.channels.length > 0 && (
        <Block heading="What's your goal?">
          <div className="grid grid-cols-3 gap-3">
            {GOALS.map((g) => {
              const Icon = GOAL_ICONS[g.icon] ?? Globe;
              const tint = GOAL_TINT[g.id] ?? GOAL_TINT.leads;
              const selected = form.goalId === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => update({ goalId: g.id })}
                  className={[
                    "flex h-[140px] w-full flex-col items-start justify-between gap-2 rounded-xl border p-4 text-left transition-all focus:outline-none focus-visible:shadow-focus",
                    selected
                      ? "border-[1.5px] border-brand-emerald bg-brand-50/30 shadow-[0_0_0_4px_rgba(30,182,119,0.08)]"
                      : "border-line bg-white hover:border-line-strong",
                  ].join(" ")}
                >
                  <span className={["flex h-9 w-9 items-center justify-center rounded-md", tint.bg, tint.text].join(" ")}>
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-semibold leading-tight text-ink-heading">{g.label}</span>
                    <span className="text-[11px] font-medium text-ink-muted">{g.hint}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {incompatibleChannels.length > 0 && (
            <CompatibilityWarning
              goal={goal}
              incompatible={incompatibleChannels}
              onKeep={() => {/* keep */}}
              onRemove={() => update({ channels: form.channels.filter((c) => !incompatibleChannels.includes(c)) })}
            />
          )}
        </Block>
      )}
    </div>
  );
}

function CompatibilityWarning({ goal, incompatible, onKeep, onRemove }) {
  const names = incompatible.map((id) => findChannel(id)?.label).filter(Boolean).join(", ");
  return (
    <div className="flex items-start gap-3 rounded-md border border-warning-border bg-warning-bg p-4">
      <AlertTriangle size={16} className="mt-0.5 text-warning" />
      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-medium text-ink-body">
          {goal.label} works on {goal.channels.map((id) => findChannel(id)?.label).filter(Boolean).join(", ")}, not {names}.
        </span>
        <div className="flex gap-2">
          <button type="button" onClick={onKeep} className="inline-flex h-8 items-center rounded-button border border-line bg-white px-3 text-[11px] font-semibold text-ink-body">Keep selection</button>
          <button type="button" onClick={onRemove} className="inline-flex h-8 items-center rounded-button bg-warning px-3 text-[11px] font-semibold text-white">Remove {names}</button>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Step 2 ──────────── */

function Step2({ form, update }) {
  const reach = useMemo(() => estimateReach(form), [form]);
  const projected = useMemo(() => projectResults(form, reach), [form, reach]);

  return (
    <div className="flex flex-col gap-8">
      <Block heading="Who should see your ad?">
        <div className="grid grid-cols-2 gap-4">
          <ModeCard
            selected={form.audienceMode === "recommended"}
            onClick={() => update({ audienceMode: "recommended" })}
            title="Let WeNext suggest"
            badge="Recommended"
            body="We'll target people most likely to be interested based on your business and goal."
          >
            <div className="flex flex-col gap-1.5 text-[12px]">
              <DetailLine label="Estimated reach" value={`${reach.lo.toLocaleString()} – ${reach.hi.toLocaleString()} people`} />
              <DetailLine label="Within" value="25 km of your business" />
              <DetailLine label="Age" value="25–54" />
              <DetailLine label="Interests" value="Auto from business category" />
            </div>
          </ModeCard>
          <ModeCard
            selected={form.audienceMode === "custom"}
            onClick={() => update({ audienceMode: "custom" })}
            title="Customize"
            body="Set your own location, age, interests, and more."
          />
        </div>

        {form.audienceMode === "custom" && (
          <CustomAudienceForm
            customAudience={form.customAudience}
            onChange={(patch) => update({ customAudience: { ...form.customAudience, ...patch } })}
            reach={reach}
          />
        )}
      </Block>

      <Block heading="How much do you want to spend?">
        <div className="grid grid-cols-[1fr_300px] gap-6">
          <div className="flex flex-col gap-4">
            <Segmented
              value={form.budgetType}
              onChange={(v) => update({ budgetType: v })}
              options={[
                { id: "daily", label: "Daily" },
                { id: "total", label: "Total" },
              ]}
            />
            <div className="flex flex-col gap-2">
              <label className="flex h-14 items-center gap-2 rounded-md border border-line bg-white px-4">
                <span className="text-[20px] font-semibold text-ink-muted">₹</span>
                <input
                  type="number"
                  value={form.budgetAmount}
                  onChange={(e) => update({ budgetAmount: Number(e.target.value) })}
                  className="min-w-0 flex-1 bg-transparent text-[24px] font-semibold text-ink-heading focus:outline-none"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => update({ budgetAmount: amt })}
                    className={[
                      "inline-flex h-9 items-center rounded-full border px-4 text-[12px] font-medium",
                      form.budgetAmount === amt
                        ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                        : "border-line bg-white text-ink-muted hover:bg-surface-subtle",
                    ].join(" ")}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
                <button
                  type="button"
                  className="inline-flex h-9 items-center rounded-full border border-line bg-white px-4 text-[12px] font-medium text-ink-muted"
                >
                  Custom
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-semibold text-ink-heading">Duration</span>
              <RadioRow
                checked={form.duration === "open"}
                onClick={() => update({ duration: "open" })}
                label="Run until I stop it"
              />
              <RadioRow
                checked={form.duration === "end"}
                onClick={() => update({ duration: "end" })}
                label="End on a specific date"
              />
              {/* radio styled */}
              {form.duration === "end" && (
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => update({ endDate: e.target.value })}
                  className="ml-6 h-9 w-[200px] rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading"
                />
              )}
            </div>

            {form.channels.length > 1 && (
              <BudgetSplit form={form} update={update} />
            )}
          </div>

          <RecommendationCard projected={projected} budget={form.budgetAmount} duration={form.duration} />
        </div>
      </Block>
    </div>
  );
}

function CustomAudienceForm({ customAudience, onChange, reach }) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-line bg-canvas p-4">
      <div className="text-[12px] font-medium text-brand-emerald">
        Estimated reach: {reach.lo.toLocaleString()} – {reach.hi.toLocaleString()} people
      </div>
      <Field label="Location">
        <input
          type="text"
          value={customAudience.city}
          onChange={(e) => onChange({ city: e.target.value })}
          className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px]"
        />
      </Field>
      <Field label={`Age range: ${customAudience.ageMin}–${customAudience.ageMax}`}>
        <div className="flex items-center gap-3">
          <input
            type="range" min={18} max={65} value={customAudience.ageMin}
            onChange={(e) => onChange({ ageMin: Math.min(Number(e.target.value), customAudience.ageMax) })}
            className="flex-1"
          />
          <input
            type="range" min={18} max={65} value={customAudience.ageMax}
            onChange={(e) => onChange({ ageMax: Math.max(Number(e.target.value), customAudience.ageMin) })}
            className="flex-1"
          />
        </div>
      </Field>
      <Field label="Gender">
        <Segmented
          value={customAudience.gender}
          onChange={(v) => onChange({ gender: v })}
          options={[{ id: "all", label: "All" }, { id: "men", label: "Men" }, { id: "women", label: "Women" }]}
        />
      </Field>
      <Field label="Interests">
        <div className="flex flex-wrap gap-1.5">
          {customAudience.interests.map((tag) => (
            <span key={tag} className="inline-flex h-7 items-center gap-1 rounded-full bg-brand-50 px-2.5 text-[11px] font-semibold text-brand-emerald">
              {tag}
            </span>
          ))}
        </div>
      </Field>
    </div>
  );
}

function BudgetSplit({ form, update }) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-canvas p-4">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-ink-heading">Split budget across channels</span>
        <Switch
          checked={form.splitMode === "auto"}
          onChange={(v) => update({ splitMode: v ? "auto" : "manual" })}
          ariaLabel="Auto-optimize"
        />
      </div>
      <span className="text-[11px] font-medium text-ink-muted">
        {form.splitMode === "auto"
          ? "Auto-optimize on. WeNext will shift spend to the best-performing channel."
          : "Manual. Set the percent split below (must total 100%)."}
      </span>
      {form.splitMode === "manual" && (
        <div className="flex flex-col gap-2">
          {form.channels.map((id) => (
            <div key={id} className="flex items-center gap-3">
              <ChannelLogo id={id} size={14} />
              <span className="w-24 text-[12px] font-medium text-ink-heading">{findChannel(id)?.label}</span>
              <input
                type="range" min={0} max={100}
                value={form.channelSplit[id] ?? 0}
                onChange={(e) => update({ channelSplit: { ...form.channelSplit, [id]: Number(e.target.value) } })}
                className="flex-1"
              />
              <span className="w-10 text-right text-[12px] font-semibold text-ink-heading">{form.channelSplit[id] ?? 0}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ projected, budget, duration }) {
  return (
    <aside className="flex flex-col gap-3 rounded-r-xl border-l-4 border-brand-emerald bg-brand-50/40 p-4">
      <h4 className="text-[13px] font-semibold text-ink-heading">Our recommendation</h4>
      <p className="text-[12px] leading-relaxed text-ink-body">
        Most retail businesses spend ₹400–800 per day for this goal.
      </p>
      <div className="rounded-md border border-line bg-white p-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
          At {formatCurrency(budget)}/day for 7 days
        </span>
        <ul className="mt-1.5 flex flex-col gap-1 text-[12px] font-medium text-ink-body">
          <li>~{projected.resultsLo}–{projected.resultsHi} {projected.label}</li>
          <li>~{projected.reachLo.toLocaleString()}–{projected.reachHi.toLocaleString()} people reached</li>
          <li>Total spend: {formatCurrency(budget * 7)}</li>
        </ul>
      </div>
    </aside>
  );
}

/* ──────────── Step 3 ──────────── */

function Step3({ form, update }) {
  return (
    <div className="flex flex-col gap-6">
      <Block heading="Make it eye-catching">
        <Field label="Format">
          <Segmented
            value={form.format}
            onChange={(v) => update({ format: v })}
            options={[
              { id: "single",   label: "Single image" },
              { id: "video",    label: "Video" },
              { id: "carousel", label: "Carousel" },
              { id: "post",     label: "Use existing post" },
            ]}
          />
        </Field>

        <Field label="Media">
          <Dropzone format={form.format} />
          {form.channels.length > 1 && (
            <div className="rounded-md border border-info-border bg-info-bg/40 p-3 text-[12px] text-ink-body">
              💡 Your selected channels need different sizes. Use the same image everywhere (we'll auto-crop), or upload one per channel.
            </div>
          )}
        </Field>

        <Field label="Headline" hint="Short, attention-grabbing. Like a billboard." action={<AiButton field="headline" />}>
          <CharInput
            value={form.headline} onChange={(v) => update({ headline: v })}
            max={40}
            placeholder="e.g. Light up your Diwali"
          />
        </Field>

        <Field label="Description" hint="What's in it for the customer?" action={<AiButton field="description" />}>
          <CharTextarea
            value={form.description} onChange={(v) => update({ description: v })}
            max={125}
            placeholder="Tell people what they get."
          />
        </Field>

        <Field label="Call to action">
          <select
            value={form.cta}
            onChange={(e) => update({ cta: e.target.value })}
            className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading"
          >
            {CTA_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Destination URL">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={form.url}
              onChange={(e) => update({ url: e.target.value })}
              className="h-10 flex-1 rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading"
            />
            <button
              type="button"
              onClick={() => window.open(form.url, "_blank", "noopener")}
              className="inline-flex h-9 items-center rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
            >
              Test link
            </button>
          </div>
        </Field>

        <details className="group rounded-xl border border-line bg-surface-subtle p-4">
          <summary className="flex cursor-pointer items-center justify-between text-[13px] font-semibold text-ink-heading">
            Advanced settings
            <span className="text-ink-muted transition-transform group-open:rotate-180">▾</span>
          </summary>
          <div className="mt-3 flex flex-col gap-3 text-[12px] font-medium text-ink-muted">
            <Field label="UTM parameters">
              <input type="text" placeholder="utm_source=meta&utm_campaign=diwali" className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px]" />
            </Field>
            <Field label="Custom tracking pixel ID">
              <input type="text" placeholder="123456789" className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px]" />
            </Field>
            <Field label="Lead form template">
              <select className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px]">
                <option>None — use destination URL</option>
                <option>Quick contact (name + phone)</option>
                <option>Full inquiry (name, email, message)</option>
              </select>
            </Field>
          </div>
        </details>
      </Block>
    </div>
  );
}

function AiButton() {
  return (
    <button
      type="button"
      className="inline-flex h-7 items-center gap-1 rounded-xs px-2 text-[11px] font-semibold text-brand-emerald hover:bg-brand-50"
    >
      <Sparkles size={12} />
      Generate with AI
    </button>
  );
}

function Dropzone({ format }) {
  const hint =
    format === "video" ? "MP4 up to 16 MB · 9:16 vertical recommended" :
    format === "carousel" ? "PNG, JPG up to 5 MB each · 2–10 cards" :
    format === "post" ? "Pick from your recent posts in connected accounts" :
    "PNG, JPG up to 5 MB";
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line bg-canvas px-4 py-8 text-center">
        <UploadCloud size={20} className="text-ink-muted" strokeWidth={1.5} />
        <span className="text-[13px] font-semibold text-ink-heading">Drag & drop your file here, or click to browse</span>
        <span className="text-[11px] font-medium text-ink-muted">{hint}</span>
      </div>
      <div className="flex flex-wrap gap-3 text-[11px] font-medium text-ink-muted">
        <span>Meta: 1080×1080</span>
        <span aria-hidden>·</span>
        <span>LinkedIn: 1200×627</span>
        <span aria-hidden>·</span>
        <span>TikTok: 1080×1920</span>
      </div>
    </div>
  );
}

/* ──────────── Preview rail ──────────── */

function PreviewRail({ channels, business, creative }) {
  const [tab, setTab] = useState(channels[0]);
  useEffect(() => {
    if (!channels.includes(tab)) setTab(channels[0]);
  }, [channels, tab]);
  const labelByChannel = { meta: "Preview: Facebook feed", linkedin: "Preview: LinkedIn feed", tiktok: "Preview: TikTok For You" };
  const placeholderCreative = {
    ...creative,
    isPlaceholder: !creative.image,
  };
  return (
    <div className="flex flex-col gap-3">
      {channels.length > 1 && (
        <div className="inline-flex self-center rounded-md bg-surface-muted p-1">
          {channels.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setTab(c)}
              className={[
                "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[12px] font-semibold transition-colors",
                tab === c
                  ? "bg-ink-heading text-white"
                  : "text-ink-muted hover:text-ink-heading",
              ].join(" ")}
            >
              <ChannelLogo id={c} size={12} />
              {findChannel(c)?.label}
            </button>
          ))}
        </div>
      )}
      <PhoneShell channel={tab}>
        <AdPreview channel={tab} business={business} creative={placeholderCreative} />
      </PhoneShell>
      <span className="text-center text-[11px] font-medium text-ink-muted">{labelByChannel[tab]}</span>
    </div>
  );
}

function PhoneShell({ channel, children }) {
  return (
    <div className="relative mx-auto h-[540px] w-[280px] rounded-[40px] bg-[#111827] p-[6px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.18)]">
      <span aria-hidden className="absolute left-1/2 top-[6px] z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-[#111827]" />
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[34px] bg-white">
        <div className="flex h-7 shrink-0 items-center justify-between bg-white px-5 pt-1 text-[10px] font-semibold text-ink-heading">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <Signal size={10} strokeWidth={2.25} />
            <Wifi size={10} strokeWidth={2.25} />
            <Battery size={12} strokeWidth={2.25} />
          </div>
        </div>
        <div
          className={[
            "flex min-h-0 flex-1 items-start justify-center overflow-hidden p-3",
            channel === "tiktok" ? "bg-black" : "bg-surface-subtle",
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ──────────── Action bar ──────────── */

function ActionBar({ step, onCancel, onPrev, onNext, canNext, validationHint }) {
  return (
    <footer className="flex items-center justify-between border-t border-line bg-white px-6 py-4">
      <button
        type="button"
        className="inline-flex h-10 items-center rounded-button px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
      >
        Save Draft
      </button>
      <div className="flex items-center gap-3">
        {validationHint && (
          <span className="text-[12px] font-medium text-ink-muted">{validationHint}</span>
        )}
        <button
          type="button"
          onClick={step === 1 ? onCancel : onPrev}
          className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
        >
          {step === 1 ? "Cancel" : "Back"}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className={[
            "inline-flex h-10 items-center rounded-button px-5 text-[13px] font-semibold text-white transition-opacity",
            canNext ? "bg-cta-gradient hover:opacity-90" : "bg-cta-gradient opacity-40 cursor-not-allowed",
          ].join(" ")}
        >
          {step === 3 ? "Launch Ad" : "Continue"}
        </button>
      </div>
    </footer>
  );
}

/* ──────────── Review modal ──────────── */

function ReviewModal({ form, authorized, onAuthorize, onCancel, onConfirm }) {
  const goal = findGoal(form.goalId);
  const reach = useMemo(() => estimateReach(form), [form]);
  const projected = useMemo(() => projectResults(form, reach), [form, reach]);
  return (
    <div role="dialog" aria-modal="true" onClick={onCancel} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[560px] rounded-md border border-line bg-white p-6 shadow-card">
        <h3 className="text-[18px] font-semibold text-ink-heading">Ready to launch?</h3>
        <dl className="mt-4 flex flex-col gap-2 rounded-md border border-line bg-canvas p-4 text-[13px]">
          <DetailLine label="Goal" value={goal?.label ?? "—"} />
          <DetailLine label="Channels" value={`${form.channels.map((id) => findChannel(id)?.label).join(", ")} (${form.channels.length})`} />
          <DetailLine label="Audience" value={`${reach.lo.toLocaleString()} – ${reach.hi.toLocaleString()} people in ${form.customAudience.city}`} />
          <DetailLine label="Budget" value={`${formatCurrency(form.budgetAmount)}/day, ${form.duration === "open" ? "runs until stopped" : `ends ${form.endDate}`}`} />
          <DetailLine label="Estimated results" value={`${projected.resultsLo}–${projected.resultsHi} ${projected.label} in first 7 days`} />
          <DetailLine label="Estimated cost (7 days)" value={formatCurrency(form.budgetAmount * 7)} />
        </dl>
        <label className="mt-4 flex items-start gap-3 rounded-md border border-line bg-canvas p-3 text-[12px] text-ink-body">
          <input
            type="checkbox"
            checked={authorized}
            onChange={(e) => onAuthorize(e.target.checked)}
            className="mt-0.5"
          />
          I authorize WeNext to charge my payment method up to {formatCurrency(form.budgetAmount)}/day.
        </label>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button type="button" onClick={onCancel} className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[13px] font-medium text-ink-body">Cancel</button>
          <button
            type="button"
            disabled={!authorized}
            onClick={onConfirm}
            className={[
              "inline-flex h-10 items-center rounded-button px-5 text-[13px] font-semibold text-white",
              authorized ? "bg-cta-gradient hover:opacity-90" : "bg-cta-gradient opacity-40 cursor-not-allowed",
            ].join(" ")}
          >
            Launch Ad
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Shared primitives ──────────── */

function Block({ heading, subtitle, children }) {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-[18px] font-semibold text-ink-heading">{heading}</h2>
        {subtitle && <p className="text-[13px] font-medium text-ink-muted">{subtitle}</p>}
      </header>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({ label, hint, action, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-semibold text-ink-heading">{label}</span>
        {action}
      </span>
      {children}
      {hint && <span className="text-[11px] font-medium text-ink-muted">{hint}</span>}
    </label>
  );
}

function ModeCard({ selected, onClick, title, badge, body, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex flex-col items-start gap-2 rounded-xl border p-5 text-left transition-all",
        selected
          ? "border-brand-emerald bg-brand-50/30 shadow-[0_0_0_4px_rgba(30,182,119,0.08)]"
          : "border-line bg-white hover:border-line-strong",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span aria-hidden className={["h-3.5 w-3.5 rounded-full border", selected ? "border-brand-emerald bg-brand-emerald" : "border-line bg-white"].join(" ")} />
        <span className="text-[14px] font-semibold text-ink-heading">{title}</span>
        {badge && <span className="rounded-pill bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-emerald">{badge}</span>}
      </div>
      <p className="text-[12px] leading-relaxed text-ink-muted">{body}</p>
      {children}
    </button>
  );
}

function DetailLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-medium text-ink-muted">{label}</span>
      <span className="text-right font-semibold text-ink-heading">{value}</span>
    </div>
  );
}

function Segmented({ value, options, onChange }) {
  return (
    <div className="inline-flex rounded-lg bg-surface-muted p-1">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={[
              "inline-flex h-8 items-center rounded-md px-4 text-[12px] font-semibold transition-colors",
              active ? "bg-white text-ink-heading shadow-[0_1px_2px_rgba(0,0,0,0.06)]" : "text-ink-muted hover:text-ink-heading",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function RadioRow({ checked, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 text-left text-[13px] font-medium text-ink-heading focus:outline-none"
    >
      <span
        aria-hidden
        className={[
          "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          checked ? "border-brand-emerald border-[2px]" : "border-line-strong",
        ].join(" ")}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-brand-emerald" />}
      </span>
      {label}
    </button>
  );
}

function CharInput({ value, onChange, max, placeholder }) {
  return (
    <div className="relative">
      <input
        type="text" value={value} maxLength={max}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="h-10 w-full rounded-sm border border-line bg-white px-3 pr-14 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none focus-visible:shadow-focus"
      />
      <span className="pointer-events-none absolute bottom-1 right-2 text-[10px] font-medium text-ink-subtle">{value.length}/{max}</span>
    </div>
  );
}

function CharTextarea({ value, onChange, max, placeholder }) {
  return (
    <div className="relative">
      <textarea
        value={value} maxLength={max} rows={3}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-sm border border-line bg-white px-3 pb-6 pt-2 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none focus-visible:shadow-focus"
      />
      <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] font-medium text-ink-subtle">{value.length}/{max}</span>
    </div>
  );
}

/* ──────────── helpers ──────────── */

function previewThumbForGoal(goalId) {
  if (goalId === "leads") return "📋";
  if (goalId === "product") return "🛍️";
  if (goalId === "installs") return "📱";
  if (goalId === "boost") return "👍";
  if (goalId === "profile") return "🙋";
  return "🌐";
}

function estimateReach(form) {
  // Rough demo: scales with channel count.
  const base = 80000 * (form.channels.length || 1);
  const lo = Math.round(base * 0.9);
  const hi = Math.round(base * 1.4);
  return { lo, hi };
}

function projectResults(form, reach) {
  const goal = findGoal(form.goalId) ?? {};
  const ctr = 0.012;
  const conv = goal.id === "leads" ? 0.05 : goal.id === "product" ? 0.025 : 0.03;
  const total = form.budgetAmount * 7;
  const clicks = total / 18;
  const lo = Math.round(clicks * conv * 0.85);
  const hi = Math.round(clicks * conv * 1.25);
  return {
    resultsLo: lo,
    resultsHi: hi,
    reachLo: Math.round(reach.lo * 0.05),
    reachHi: Math.round(reach.hi * 0.07),
    label: goal.id === "leads" ? "leads" : goal.id === "product" ? "orders" : goal.id === "installs" ? "installs" : "results",
  };
}
