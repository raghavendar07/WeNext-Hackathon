import { useMemo } from "react";
import { CalendarPlus, Clock, MoreHorizontal, Pause, Pencil, RefreshCw } from "lucide-react";
import { InstagramLogo, LinkedinLogo } from "../BrandLogos.jsx";
import { FacebookLogo } from "./SocialLogos.jsx";
import { POSTS, dayKey, findPlatform, formatDayHeader, formatRelative, formatScheduledTime } from "./data.js";

const LOGO_BY_ID = { linkedin: LinkedinLogo, facebook: FacebookLogo, instagram: InstagramLogo };

export default function QueueTab({ accounts, onCreate }) {
  const { scheduledByDay } = useMemo(() => {
    const scheduled = POSTS.filter((p) => p.status === "scheduled" || p.status === "failed").sort((a, b) => (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""));
    const map = new Map();
    for (const p of scheduled) {
      const key = dayKey(p.scheduledFor);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    return { scheduledByDay: Array.from(map.entries()).map(([k, items]) => ({ key: k, items })) };
  }, []);

  const isEmpty = scheduledByDay.length === 0;

  if (isEmpty) {
    return (
      <div className="grid grid-cols-[1fr_320px] gap-6">
        <EmptyQueue onCreate={onCreate} />
        <RightRail accounts={accounts} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <div className="flex flex-col gap-6">
        {scheduledByDay.map((day) => (
          <section key={day.key} className="flex flex-col gap-3">
            <h2 className="sticky top-0 z-10 -mx-1 bg-white px-1 py-1 text-[14px] font-semibold text-ink-heading">
              {formatDayHeader(day.key)}
            </h2>
            <div className="flex flex-col gap-2">
              {day.items.map((p) => <PostRow key={p.id} post={p} />)}
            </div>
          </section>
        ))}
      </div>
      <RightRail accounts={accounts} />
    </div>
  );
}

function PostRow({ post }) {
  const isFailed = post.status === "failed";
  return (
    <article className="flex items-start gap-3 rounded-md border border-line bg-white p-4">
      <PostThumb post={post} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <ChannelRow channels={post.channels} />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-ink-muted">{formatScheduledTime(post.scheduledFor)}</span>
            <button type="button" aria-label="Actions" onClick={(e) => { e.stopPropagation(); alert('Row menu mock'); }} className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
        <p className="line-clamp-2 text-[13px] leading-snug text-ink-body">{post.caption}</p>
        <div className="flex items-center justify-between gap-2">
          <StatusLine post={post} />
          <div className="flex items-center gap-1">
            {isFailed ? (
              <button type="button" onClick={() => alert('Try again (mock)')} className="inline-flex h-8 items-center gap-1 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle">
                <RefreshCw size={12} /> Try again
              </button>
            ) : (
              <>
                <button type="button" onClick={() => alert('Edit (mock)')} className="inline-flex h-8 items-center gap-1 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle">
                  <Pencil size={12} /> Edit
                </button>
                <button type="button" onClick={() => alert('Pause (mock)')} className="inline-flex h-8 items-center gap-1 rounded-button px-3 text-[12px] font-medium text-ink-muted hover:bg-surface-subtle">
                  <Pause size={12} /> Pause
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function DraftRow({ post }) {
  return (
    <article className="flex items-start gap-3 rounded-md border border-line bg-white p-4">
      <PostThumb post={post} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <ChannelRow channels={post.channels} />
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-muted">
            <Clock size={11} /> Saved {formatRelative(post.savedAt)}
          </span>
        </div>
        <p className="line-clamp-2 text-[13px] leading-snug text-ink-body">{post.caption}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ink-subtle" />
            Draft · Not scheduled
          </span>
          <div className="flex items-center gap-1">
            <button type="button" className="inline-flex h-8 items-center gap-1 rounded-button bg-cta-gradient px-3 text-[12px] font-semibold text-white hover:opacity-90">
              <CalendarPlus size={12} /> Schedule
            </button>
            <button type="button" className="inline-flex h-8 items-center rounded-button px-3 text-[12px] font-medium text-ink-muted hover:bg-surface-subtle">
              Edit
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function PostThumb({ post }) {
  const thumb = post.media?.thumb;
  if (thumb) {
    return (
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-surface-muted text-[28px]">
        {thumb}
      </span>
    );
  }
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-dashed border-line bg-surface-subtle text-[10px] font-medium text-ink-subtle">
      Text only
    </span>
  );
}

function ChannelRow({ channels }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {channels.map((id) => {
        const Logo = LOGO_BY_ID[id];
        return Logo ? <Logo key={id} size={14} /> : null;
      })}
    </span>
  );
}

function StatusLine({ post }) {
  if (post.status === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-danger">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-danger" />
        {post.failureReason ?? "Failed to post"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-success">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />
      Scheduled · {post.channels.length} platform{post.channels.length === 1 ? "" : "s"}
    </span>
  );
}

function RightRail({ accounts }) {
  const counts = useMemo(() => ({
    scheduled: POSTS.filter((p) => p.status === "scheduled").length,
    published: POSTS.filter((p) => p.status === "published").length,
    drafts:    POSTS.filter((p) => p.status === "draft").length,
  }), []);

  return (
    <aside className="sticky top-5 flex h-fit flex-col gap-4">
      <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-4">
        <header className="flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-ink-heading">Accounts</h3>
          <button type="button" onClick={() => alert('Manage accounts (mock)')} className="text-[11px] font-semibold text-brand-emerald hover:underline">Manage</button>
        </header>
        <div className="flex flex-col gap-2">
          {Object.entries(LOGO_BY_ID).map(([id, Logo]) => {
            const acct = accounts[id];
            const platform = findPlatform(id);
            return (
              <div key={id} className="flex items-center gap-2">
                <Logo size={16} />
                <span className="flex-1 truncate text-[12px] text-ink-heading">
                  {acct?.connected ? acct.name : `Connect ${platform.name} to enable`}
                </span>
                <span aria-hidden className={["h-1.5 w-1.5 rounded-full", acct?.connected ? "bg-success" : "bg-ink-subtle"].join(" ")} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-4">
        <h3 className="text-[13px] font-semibold text-ink-heading">This week</h3>
        <div className="flex flex-col gap-2 text-[12px]">
          <Stat label="Scheduled" value={counts.scheduled} />
          <Stat label="Published" value={counts.published} />
          <Stat label="In draft" value={counts.drafts} />
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-4">
        <h3 className="text-[13px] font-semibold text-ink-heading">Quick stats</h3>
        <div className="flex flex-col gap-2 text-[12px]">
          <Stat label="Engagement" value="1,240" delta="↑ 18%" />
          <Stat label="Reach" value="8.4K" delta="↑ 12%" />
          <Stat label="New followers" value="47" delta="↑ 9%" />
        </div>
      </section>
    </aside>
  );
}

function Stat({ label, value, delta }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-ink-muted">{label}</span>
      <span className="flex items-center gap-2 font-semibold text-ink-heading">
        {value}
        {delta && <span className="text-[10px] font-medium text-success">{delta}</span>}
      </span>
    </div>
  );
}

function EmptyQueue({ onCreate }) {
  return (
    <section className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line bg-canvas px-6 py-16 text-center">
      <CalendarPlus size={28} className="text-ink-subtle" strokeWidth={1.5} />
      <h2 className="text-[18px] font-semibold text-ink-heading">Nothing scheduled yet</h2>
      <p className="max-w-[420px] text-[13px] font-medium text-ink-muted">
        Plan your week. Schedule posts in advance and let WeNext publish them automatically.
      </p>
      <button type="button" onClick={onCreate} className="mt-2 inline-flex h-11 items-center rounded-button bg-cta-gradient px-6 text-[13px] font-semibold text-white hover:opacity-90">
        + Create Your First Post
      </button>
    </section>
  );
}
