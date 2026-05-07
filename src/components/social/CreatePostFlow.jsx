import { useEffect, useMemo, useState } from "react";
import {
  AtSign,
  Bold,
  Calendar,
  Check,
  ChevronLeft,
  Hash,
  Italic,
  Smile,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { InstagramLogo, LinkedinLogo } from "../BrandLogos.jsx";
import { FacebookLogo } from "./SocialLogos.jsx";
import { PLATFORMS, findPlatform, lowestCaptionLimit } from "./data.js";
import PlatformFeedPreview from "./PlatformFeedPreview.jsx";

const LOGO_BY_ID = { linkedin: LinkedinLogo, facebook: FacebookLogo, instagram: InstagramLogo };

export default function CreatePostFlow({ accounts, onCancel, onPublish }) {
  const [form, setForm] = useState({
    target: null, // "linkedin" | "facebook" | "instagram" | "global"
    channels: [],
    captionMode: "shared",
    sharedCaption: "",
    perCaption: { linkedin: "", facebook: "", instagram: "" },
    media: null,
    hashtags: "",
    firstComment: "",
    schedule: "now",
    scheduleAt: "",
    advancedOpen: false,
  });
  const [confirm, setConfirm] = useState(null);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const captionLimit = useMemo(() => lowestCaptionLimit(form.channels), [form.channels]);
  const captionLength = form.captionMode === "shared" ? form.sharedCaption.length : Math.max(...form.channels.map((id) => form.perCaption[id]?.length ?? 0), 0);
  const canPublish = form.channels.length > 0 && (form.captionMode === "shared" ? form.sharedCaption.trim().length > 0 : form.channels.every((id) => (form.perCaption[id] ?? "").trim().length > 0));

  const handlePublish = () => {
    if (!canPublish) return;
    if (form.schedule === "now") {
      onPublish({ kind: "now", channels: form.channels });
    } else {
      setConfirm({ at: form.scheduleAt, channels: form.channels });
    }
  };

  return (
    <div className="flex h-full flex-col bg-canvas">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel} aria-label="Back" className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white text-ink-body hover:bg-surface-subtle">
            <ChevronLeft size={16} />
          </button>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-ink-heading">Create Post</span>
            <span className="text-[11px] font-medium text-ink-muted">Publish across LinkedIn, Facebook, and Instagram</span>
          </div>
        </div>
        <button type="button" onClick={onCancel} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted hover:bg-surface-subtle">
          <X size={18} />
        </button>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-y-auto px-8 py-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-6">
            <ChannelPicker form={form} update={update} accounts={accounts} />
            <CaptionField form={form} update={update} limit={captionLimit} length={captionLength} />
            <MediaField form={form} update={update} />
            <HashtagsField form={form} update={update} />
            {form.channels.includes("instagram") && <FirstCommentField form={form} update={update} />}
            <ScheduleField form={form} update={update} />
            <AdvancedAccordion form={form} update={update} />
          </div>
        </div>

        <aside className="flex w-[400px] shrink-0 flex-col border-l border-line bg-white px-6 py-6">
          <h3 className="text-[13px] font-semibold text-ink-heading">Live preview</h3>
          <p className="mb-4 text-[12px] font-medium text-ink-muted">Updates as you type</p>
          <PreviewRail form={form} />
        </aside>
      </div>

      <ActionBar
        canPublish={canPublish}
        scheduleMode={form.schedule}
        onCancel={onCancel}
        onPublish={handlePublish}
      />

      {confirm && (
        <ScheduleConfirm
          confirm={confirm}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            const c = confirm;
            setConfirm(null);
            onPublish({ kind: "scheduled", at: c.at, channels: c.channels });
          }}
        />
      )}
    </div>
  );
}

/* ──────────── Channel picker ──────────── */

function ChannelPicker({ form, update, accounts }) {
  const connectedIds = PLATFORMS.filter((p) => accounts[p.id]?.connected).map((p) => p.id);

  const pickPlatform = (id) => {
    const platform = PLATFORMS.find((p) => p.id === id);
    if (!accounts[id]?.connected) return;
    update({ target: id, channels: [id], captionMode: "shared" });
    void platform;
  };
  const pickGlobal = () => {
    if (connectedIds.length === 0) return;
    update({ target: "global", channels: connectedIds, captionMode: "shared" });
  };

  return (
    <Block heading="Where do you want to post?">
      <div className="grid grid-cols-4 gap-3">
        {PLATFORMS.map((p) => {
          const acct = accounts[p.id];
          const Logo = LOGO_BY_ID[p.id];
          const connected = !!acct?.connected;
          const selected = form.target === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => pickPlatform(p.id)}
              disabled={!connected}
              className={[
                "flex h-[160px] flex-col items-start justify-between gap-2 rounded-md border bg-white p-4 text-left transition-all",
                selected
                  ? "border-[1.5px] border-brand-emerald bg-brand-50/30 shadow-[0_0_0_4px_rgba(30,182,119,0.08)]"
                  : "border-line hover:border-line-strong",
                !connected ? "cursor-not-allowed opacity-80" : "",
              ].join(" ")}
            >
              <Logo size={24} />
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-ink-heading">{p.name}</span>
                <span className="text-[11px] font-medium text-ink-muted">
                  {connected ? acct.name : (p.requiresFacebook ? "Connect via Facebook" : `Connect to publish`)}
                </span>
              </div>
              {connected ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-success">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" /> Connected
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-brand-emerald">Connect →</span>
              )}
            </button>
          );
        })}
        <GlobalCard
          selected={form.target === "global"}
          connectedCount={connectedIds.length}
          onClick={pickGlobal}
        />
      </div>
    </Block>
  );
}

function GlobalCard({ selected, connectedCount, onClick }) {
  const disabled = connectedCount === 0;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex h-[160px] flex-col items-start justify-between gap-2 rounded-md border bg-white p-4 text-left transition-all",
        selected
          ? "border-[1.5px] border-brand-emerald bg-brand-50/30 shadow-[0_0_0_4px_rgba(30,182,119,0.08)]"
          : "border-line hover:border-line-strong",
        disabled ? "cursor-not-allowed opacity-70" : "",
      ].join(" ")}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-emerald">
        🌐
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-semibold text-ink-heading">Global Post</span>
        <span className="text-[11px] font-medium text-ink-muted">Post the same content to all connected platforms.</span>
      </div>
      <span className="text-[11px] font-medium text-ink-muted">
        {connectedCount} platform{connectedCount === 1 ? "" : "s"} connected
      </span>
    </button>
  );
}

/* ──────────── Caption ──────────── */

function CaptionField({ form, update, limit, length }) {
  return (
    <Block heading="Caption" subtitle={`${limit.toLocaleString()} character limit (smallest selected platform)`}>
      <div className="flex items-center gap-1 rounded-sm border border-line bg-surface-subtle px-2 py-1">
        <ToolbarBtn icon={<Bold size={14} />} label="Bold" />
        <ToolbarBtn icon={<Italic size={14} />} label="Italic" />
        <ToolbarBtn icon={<Hash size={14} />} label="Hashtag" />
        <ToolbarBtn icon={<Smile size={14} />} label="Emoji" />
        <ToolbarBtn icon={<AtSign size={14} />} label="Mention" />
        <span aria-hidden className="mx-1 h-4 w-px bg-line" />
        <button type="button" className="inline-flex h-7 items-center gap-1 rounded-xs px-2 text-[11px] font-semibold text-brand-emerald hover:bg-brand-50">
          <Sparkles size={12} /> Generate with AI
        </button>
      </div>

      {form.captionMode === "shared" ? (
        <div className="relative">
          <textarea
            value={form.sharedCaption}
            maxLength={limit}
            onChange={(e) => update({ sharedCaption: e.target.value })}
            placeholder="What's on your mind? Write once, post everywhere."
            className="min-h-[160px] w-full resize-y rounded-sm border border-line bg-white px-3 pb-6 pt-2 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
          <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] font-medium text-ink-subtle">{length}/{limit}</span>
        </div>
      ) : (
        <PerPlatformCaptions form={form} update={update} />
      )}

      <button
        type="button"
        onClick={() => update({ captionMode: form.captionMode === "shared" ? "per" : "shared" })}
        className="self-start text-[11px] font-semibold text-brand-emerald hover:underline"
      >
        {form.captionMode === "shared" ? "Customize per platform →" : "← Use the same caption everywhere"}
      </button>
    </Block>
  );
}

function PerPlatformCaptions({ form, update }) {
  const channels = form.channels;
  const [tab, setTab] = useState(channels[0]);
  useEffect(() => { if (!channels.includes(tab)) setTab(channels[0]); }, [channels, tab]);
  const platform = findPlatform(tab);
  if (!platform) return null;
  const value = form.perCaption[tab] ?? "";
  return (
    <div className="flex flex-col gap-2">
      <div className="inline-flex self-start rounded-md bg-surface-muted p-0.5">
        {channels.map((id) => {
          const Logo = LOGO_BY_ID[id];
          const active = id === tab;
          return (
            <button key={id} type="button" onClick={() => setTab(id)} className={["inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-[12px] font-semibold", active ? "bg-white text-ink-heading shadow-chip" : "text-ink-muted"].join(" ")}>
              <Logo size={12} /> {findPlatform(id)?.name}
            </button>
          );
        })}
      </div>
      <div className="relative">
        <textarea
          value={value}
          maxLength={platform.captionLimit}
          onChange={(e) => update({ perCaption: { ...form.perCaption, [tab]: e.target.value } })}
          placeholder={`Caption for ${platform.name}`}
          className="min-h-[140px] w-full resize-y rounded-sm border border-line bg-white px-3 pb-6 pt-2 text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none"
        />
        <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] font-medium text-ink-subtle">{value.length}/{platform.captionLimit}</span>
      </div>
    </div>
  );
}

function ToolbarBtn({ icon, label }) {
  return (
    <button type="button" aria-label={label} className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted hover:text-ink-heading">
      {icon}
    </button>
  );
}

/* ──────────── Media ──────────── */

function MediaField({ form, update }) {
  const cross = form.channels.length > 1;
  return (
    <Block heading="Media" subtitle="Up to 10 images or 1 video">
      <div className="flex flex-col items-center gap-1 rounded-md border border-dashed border-line bg-canvas px-4 py-8 text-center">
        <UploadCloud size={20} className="text-ink-muted" strokeWidth={1.5} />
        <span className="text-[13px] font-semibold text-ink-heading">Drag & drop your file here, or click to browse</span>
        <span className="text-[11px] font-medium text-ink-muted">JPG, PNG up to 5 MB · MP4 up to 100 MB</span>
      </div>
      {cross && (
        <p className="text-[11px] font-medium text-ink-muted">
          💡 Aspect ratios differ per platform. We'll auto-crop to {form.channels.map((id) => `${findPlatform(id)?.name} ${findPlatform(id)?.aspect}`).join(" · ")}.
        </p>
      )}
    </Block>
  );
}

/* ──────────── Hashtags + first comment ──────────── */

function HashtagsField({ form, update }) {
  return (
    <details className="rounded-md border border-line bg-white p-4" open={false}>
      <summary className="cursor-pointer text-[13px] font-semibold text-ink-heading">Hashtags</summary>
      <div className="mt-3 flex flex-col gap-2">
        <input
          type="text"
          value={form.hashtags}
          onChange={(e) => update({ hashtags: e.target.value })}
          placeholder="festive, retail, diwali"
          className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px]"
        />
        <span className="text-[11px] font-medium text-ink-muted">
          We'll prepend on LinkedIn, append on Facebook, and post as the first comment on Instagram.
        </span>
      </div>
    </details>
  );
}

function FirstCommentField({ form, update }) {
  return (
    <details className="rounded-md border border-line bg-white p-4">
      <summary className="cursor-pointer text-[13px] font-semibold text-ink-heading">First comment (Instagram)</summary>
      <div className="mt-3 flex flex-col gap-2">
        <textarea
          value={form.firstComment}
          onChange={(e) => update({ firstComment: e.target.value })}
          placeholder="Hashtags or extra context to keep the caption clean."
          className="min-h-[80px] w-full resize-y rounded-sm border border-line bg-white px-3 py-2 text-[13px]"
        />
        <span className="text-[11px] font-medium text-ink-muted">
          Some marketers post hashtags as the first comment to keep the caption clean.
        </span>
      </div>
    </details>
  );
}

/* ──────────── Schedule ──────────── */

function ScheduleField({ form, update }) {
  return (
    <Block heading="When to publish">
      <div className="grid grid-cols-2 gap-3">
        <ScheduleCard
          selected={form.schedule === "now"}
          title="Publish now"
          body="Goes live as soon as you hit Publish."
          onClick={() => update({ schedule: "now" })}
        />
        <ScheduleCard
          selected={form.schedule === "later"}
          title="Schedule for later"
          body="Pick a date and time — we'll post for you."
          onClick={() => update({ schedule: "later" })}
        />
      </div>
      {form.schedule === "later" && (
        <div className="flex items-center gap-3 rounded-md border border-line bg-canvas p-3">
          <Calendar size={14} className="text-ink-muted" />
          <input
            type="datetime-local"
            value={form.scheduleAt}
            onChange={(e) => update({ scheduleAt: e.target.value })}
            className="h-9 rounded-sm border border-line bg-white px-3 text-[12px] text-ink-heading"
          />
          {form.scheduleAt && (
            <span className="text-[12px] font-medium text-ink-muted">
              Will post on {new Date(form.scheduleAt).toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} IST
            </span>
          )}
        </div>
      )}
    </Block>
  );
}

function ScheduleCard({ selected, title, body, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={["flex items-start gap-2 rounded-md border bg-white p-4 text-left transition-colors", selected ? "border-brand-emerald bg-brand-50/30" : "border-line hover:border-line-strong"].join(" ")}
    >
      <span aria-hidden className={["mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border", selected ? "border-brand-emerald border-[2px]" : "border-line-strong"].join(" ")}>
        {selected && <span className="h-2 w-2 rounded-full bg-brand-emerald" />}
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-semibold text-ink-heading">{title}</span>
        <span className="text-[11px] font-medium text-ink-muted">{body}</span>
      </div>
    </button>
  );
}

/* ──────────── Advanced ──────────── */

function AdvancedAccordion({ form, update }) {
  return (
    <details className="rounded-md border border-line bg-surface-subtle p-4" open={form.advancedOpen}>
      <summary className="cursor-pointer text-[13px] font-semibold text-ink-heading" onClick={(e) => { e.preventDefault(); update({ advancedOpen: !form.advancedOpen }); }}>
        Advanced settings
      </summary>
      {form.advancedOpen && (
        <div className="mt-3 flex flex-col gap-3 text-[12px] text-ink-muted">
          <span>Boost as ad after publishing · UTM tracking · Disable comments · Tag people · Add location</span>
        </div>
      )}
    </details>
  );
}

/* ──────────── Preview rail ──────────── */

function PreviewRail({ form }) {
  const [tab, setTab] = useState(form.channels[0]);
  useEffect(() => { if (!form.channels.includes(tab)) setTab(form.channels[0]); }, [form.channels, tab]);
  if (!tab) {
    return <div className="flex h-[400px] items-center justify-center text-[12px] font-medium text-ink-muted">Pick a channel to preview your post.</div>;
  }
  const caption = form.captionMode === "shared" ? form.sharedCaption : (form.perCaption[tab] ?? form.sharedCaption);
  return (
    <div className="flex flex-col gap-3">
      {form.channels.length > 1 && (
        <div className="inline-flex self-center rounded-md bg-surface-muted p-1">
          {form.channels.map((c) => {
            const Logo = LOGO_BY_ID[c];
            return (
              <button key={c} type="button" onClick={() => setTab(c)} className={["inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[12px] font-semibold transition-colors", tab === c ? "bg-ink-heading text-white" : "text-ink-muted hover:text-ink-heading"].join(" ")}>
                <Logo size={12} />
                {findPlatform(c)?.name}
              </button>
            );
          })}
        </div>
      )}
      <div className="flex justify-center">
        <PlatformFeedPreview platform={tab} caption={caption} media={form.media} />
      </div>
      <span className="text-center text-[11px] font-medium text-ink-muted">
        Preview: {findPlatform(tab)?.name} feed
      </span>
    </div>
  );
}

/* ──────────── Action bar + confirm ──────────── */

function ActionBar({ canPublish, scheduleMode, onCancel, onPublish }) {
  return (
    <footer className="flex items-center justify-between border-t border-line bg-white px-6 py-4">
      <button type="button" className="inline-flex h-10 items-center rounded-button px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle">
        Save Draft
      </button>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onCancel} className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[13px] font-medium text-ink-body hover:bg-surface-subtle">
          Cancel
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={!canPublish}
          className={["inline-flex h-10 items-center rounded-button px-5 text-[13px] font-semibold text-white transition-opacity", canPublish ? "bg-cta-gradient hover:opacity-90" : "bg-cta-gradient opacity-40 cursor-not-allowed"].join(" ")}
        >
          {scheduleMode === "later" ? "Schedule" : "Publish Now"}
        </button>
      </div>
    </footer>
  );
}

function ScheduleConfirm({ confirm, onCancel, onConfirm }) {
  const at = confirm.at ? new Date(confirm.at).toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "the selected time";
  return (
    <div role="dialog" aria-modal="true" onClick={onCancel} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div onClick={(e) => e.stopPropagation()} className="flex w-full max-w-[440px] flex-col gap-3 rounded-md border border-line bg-white p-6 shadow-card">
        <h3 className="text-[16px] font-semibold text-ink-heading">Schedule this post?</h3>
        <p className="text-[13px] font-medium text-ink-muted">
          We'll publish to {confirm.channels.map((id) => findPlatform(id)?.name).join(", ")} on {at}.
        </p>
        <div className="mt-3 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[13px] font-medium text-ink-body">Cancel</button>
          <button type="button" onClick={onConfirm} className="inline-flex h-10 items-center rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white">Confirm schedule</button>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Block primitive ──────────── */

function Block({ heading, subtitle, children }) {
  return (
    <section className="flex flex-col gap-3">
      <header className="flex flex-col gap-0.5">
        <h2 className="text-[15px] font-semibold text-ink-heading">{heading}</h2>
        {subtitle && <p className="text-[12px] font-medium text-ink-muted">{subtitle}</p>}
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
