import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarPlus, Clock, Trash2, X } from "lucide-react";
import { InstagramLogo, LinkedinLogo } from "../BrandLogos.jsx";
import { FacebookLogo } from "./SocialLogos.jsx";
import { POSTS, formatRelative } from "./data.js";

const LOGO_BY_ID = { linkedin: LinkedinLogo, facebook: FacebookLogo, instagram: InstagramLogo };

export default function DraftsTab({ onCreate }) {
  const drafts = useMemo(() => POSTS.filter((p) => p.status === "draft").sort((a, b) => (b.savedAt ?? "").localeCompare(a.savedAt ?? "")), []);
  const [schedulePost, setSchedulePost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [toast, setToast] = useState(null);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2000); return () => clearTimeout(t); } }, [toast]);

  if (drafts.length === 0) {
    return (
      <section className="flex flex-col items-center gap-3 rounded-md border border-dashed border-line bg-canvas px-6 py-16 text-center">
        <h2 className="text-[16px] font-semibold text-ink-heading">No drafts yet</h2>
        <p className="max-w-[420px] text-[13px] font-medium text-ink-muted">
          Drafts auto-save when you start writing a post.
        </p>
        <button type="button" onClick={onCreate} className="mt-2 inline-flex h-10 items-center rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white">
          + Create Post
        </button>
      </section>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-3">
      {drafts.map((p) => <DraftRow key={p.id} post={p} onSchedule={() => setSchedulePost(p)} onDelete={() => setDeletePost(p)} />)}
      {schedulePost && (
        <ScheduleDraftModal
          post={schedulePost}
          onCancel={() => setSchedulePost(null)}
          onConfirm={() => { setSchedulePost(null); setToast("Draft scheduled"); }}
        />
      )}
      {deletePost && (
        <DeleteDraftModal
          post={deletePost}
          onCancel={() => setDeletePost(null)}
          onConfirm={() => { setDeletePost(null); setToast("Draft deleted"); }}
        />
      )}
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-[8px] bg-[#111827] px-3 py-2 text-[12px] font-semibold text-white shadow-lg">{toast}</div>
      )}
    </div>
  );
}

function ScheduleDraftModal({ post, onCancel, onConfirm }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState(false);
  return (
    <div role="dialog" aria-modal="true" onClick={onCancel} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div onClick={(e) => e.stopPropagation()} className="flex w-full max-w-[440px] flex-col gap-4 rounded-md border border-line bg-white p-6 shadow-card">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-[16px] font-semibold text-ink-heading">Schedule draft</h3>
            <p className="text-[12px] font-medium text-ink-muted">Pick when to publish this post.</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close" className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted">
            <X size={16} />
          </button>
        </header>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-10 rounded-sm border border-line bg-white px-3 text-[13px]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-10 rounded-sm border border-line bg-white px-3 text-[13px]" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-[12px] font-medium text-ink-body">
          <input type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} className="h-4 w-4 accent-brand-emerald" />
          Repeat weekly
        </label>
        <div className="flex justify-end gap-2 border-t border-line pt-3">
          <button type="button" onClick={onCancel} className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[13px] font-medium text-ink-body hover:bg-surface-subtle">Cancel</button>
          <button type="button" onClick={onConfirm} className="inline-flex h-10 items-center rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white">Schedule</button>
        </div>
      </div>
    </div>
  );
}

function DeleteDraftModal({ post, onCancel, onConfirm }) {
  return (
    <div role="dialog" aria-modal="true" onClick={onCancel} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div onClick={(e) => e.stopPropagation()} className="flex w-full max-w-[400px] flex-col gap-3 rounded-md border border-line bg-white p-6 shadow-card">
        <h3 className="text-[16px] font-semibold text-ink-heading">Delete draft?</h3>
        <p className="text-[13px] font-medium text-ink-muted">"{post.caption.slice(0, 80)}{post.caption.length > 80 ? "…" : ""}" will be removed. This can't be undone.</p>
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[13px] font-medium text-ink-body">Cancel</button>
          <button type="button" onClick={onConfirm} className="inline-flex h-10 items-center rounded-button bg-danger px-5 text-[13px] font-semibold text-white hover:opacity-90">Delete</button>
        </div>
      </div>
    </div>
  );
}

function DraftRow({ post, onSchedule, onDelete }) {
  const noPlatform = post.channels.length === 0;
  return (
    <article className="flex items-start gap-3 rounded-md border border-line bg-white p-4">
      <PostThumb post={post} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5">
            {post.channels.map((id) => {
              const Logo = LOGO_BY_ID[id];
              return Logo ? <Logo key={id} size={14} /> : null;
            })}
            {noPlatform && (
              <span className="inline-flex items-center gap-1 rounded-pill bg-warning-bg px-2 py-0.5 text-[10px] font-semibold text-warning">
                <AlertTriangle size={10} /> Pick a platform
              </span>
            )}
          </span>
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
            <button type="button" onClick={onSchedule} className="inline-flex h-8 items-center gap-1 rounded-button bg-cta-gradient px-3 text-[12px] font-semibold text-white hover:opacity-90">
              <CalendarPlus size={12} /> Schedule
            </button>
            <button type="button" onClick={onDelete} className="inline-flex h-8 items-center gap-1 rounded-button px-3 text-[12px] font-medium text-danger hover:bg-danger-bg">
              <Trash2 size={12} /> Delete
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
    return <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-surface-muted text-[28px]">{thumb}</span>;
  }
  return <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-dashed border-line bg-surface-subtle text-[10px] font-medium text-ink-subtle">Text only</span>;
}
