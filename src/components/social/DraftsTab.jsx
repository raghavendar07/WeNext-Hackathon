import { useMemo } from "react";
import { AlertTriangle, CalendarPlus, Clock, Trash2 } from "lucide-react";
import { InstagramLogo, LinkedinLogo } from "../BrandLogos.jsx";
import { FacebookLogo } from "./SocialLogos.jsx";
import { POSTS, formatRelative } from "./data.js";

const LOGO_BY_ID = { linkedin: LinkedinLogo, facebook: FacebookLogo, instagram: InstagramLogo };

export default function DraftsTab({ onCreate }) {
  const drafts = useMemo(() => POSTS.filter((p) => p.status === "draft").sort((a, b) => (b.savedAt ?? "").localeCompare(a.savedAt ?? "")), []);

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
      {drafts.map((p) => <DraftRow key={p.id} post={p} />)}
    </div>
  );
}

function DraftRow({ post }) {
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
            <button type="button" className="inline-flex h-8 items-center gap-1 rounded-button bg-cta-gradient px-3 text-[12px] font-semibold text-white hover:opacity-90">
              <CalendarPlus size={12} /> Schedule
            </button>
            <button type="button" className="inline-flex h-8 items-center gap-1 rounded-button px-3 text-[12px] font-medium text-danger hover:bg-danger-bg">
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
