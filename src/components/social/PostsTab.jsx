import { useMemo, useState } from "react";
import { Heart, MessageCircle, Search, Send } from "lucide-react";
import { InstagramLogo, LinkedinLogo } from "../BrandLogos.jsx";
import { FacebookLogo } from "./SocialLogos.jsx";
import { POSTS, formatCount } from "./data.js";

const LOGO_BY_ID = { linkedin: LinkedinLogo, facebook: FacebookLogo, instagram: InstagramLogo };

const CHANNEL_FILTERS = [
  { id: "all",       label: "All" },
  { id: "linkedin",  label: "LinkedIn" },
  { id: "facebook",  label: "Facebook" },
  { id: "instagram", label: "Instagram" },
];

const RANGES = [
  { id: "7d",  label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

const SORTS = [
  { id: "recent",     label: "Most recent" },
  { id: "engagement", label: "Most engagement" },
  { id: "reach",      label: "Best reach" },
];

export default function PostsTab({ onOpen }) {
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("all");
  const [range, setRange] = useState("30d");
  const [sort, setSort] = useState("recent");

  const published = useMemo(() => POSTS.filter((p) => p.status === "published"), []);

  const filtered = useMemo(() => {
    let out = published;
    if (channel !== "all") out = out.filter((p) => p.channels.includes(channel));
    if (query.trim()) out = out.filter((p) => p.caption.toLowerCase().includes(query.trim().toLowerCase()));
    out = out.slice();
    if (sort === "engagement") out.sort((a, b) => totalEngagement(b) - totalEngagement(a));
    else if (sort === "reach") out.sort((a, b) => (b.engagement?.reach ?? 0) - (a.engagement?.reach ?? 0));
    else out.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
    return out;
  }, [published, query, channel, sort]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-10 w-[260px] items-center gap-2 rounded-lg border border-line bg-white px-3">
          <Search size={14} className="text-ink-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
        </label>
        <div className="flex items-center gap-1.5">
          {CHANNEL_FILTERS.map((c) => {
            const isActive = c.id === channel;
            return (
              <button key={c.id} type="button" onClick={() => setChannel(c.id)} className={["inline-flex h-9 items-center rounded-full border px-4 text-[12px] font-medium transition-colors", isActive ? "border-brand-emerald bg-brand-50 text-brand-emerald" : "border-line bg-white text-ink-muted hover:bg-surface-subtle"].join(" ")}>
                {c.label}
              </button>
            );
          })}
        </div>
        <select value={range} onChange={(e) => setRange(e.target.value)} className="h-9 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body">
          {RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="ml-auto h-9 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body">
          {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-line bg-canvas px-6 py-12 text-center">
          <h3 className="text-[14px] font-semibold text-ink-heading">No published posts match</h3>
          <p className="text-[12px] font-medium text-ink-muted">Try a different filter or date range.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((p) => <PostCard key={p.id} post={p} onOpen={onOpen} />)}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onOpen }) {
  const date = new Date(post.publishedAt).toLocaleString("en-US", { month: "short", day: "numeric" });
  const e = post.engagement ?? {};
  return (
    <article
      onClick={() => onOpen?.(post)}
      className="flex cursor-pointer flex-col rounded-md border border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-chip"
    >
      <div className="flex aspect-square items-center justify-center rounded-t-md bg-surface-muted text-[64px]">
        {post.media?.thumb ?? "📝"}
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5">
            {post.channels.map((id) => {
              const Logo = LOGO_BY_ID[id];
              return Logo ? <Logo key={id} size={14} /> : null;
            })}
          </span>
          <span className="text-[11px] font-medium text-ink-muted">{date}</span>
        </div>
        <p className="line-clamp-3 text-[12px] leading-snug text-ink-body">{post.caption}</p>
        <div className="flex items-center justify-between border-t border-line pt-2 text-[11px] font-medium text-ink-muted">
          <span className="inline-flex items-center gap-1"><Heart size={12} /> {e.likes ?? 0}</span>
          <span className="inline-flex items-center gap-1"><MessageCircle size={12} /> {e.comments ?? 0}</span>
          <span className="inline-flex items-center gap-1"><Send size={12} /> {e.shares ?? 0}</span>
        </div>
        <span className="text-[11px] font-semibold text-ink-heading">{formatCount(e.reach ?? 0)} reach</span>
      </div>
    </article>
  );
}

function totalEngagement(p) {
  const e = p.engagement ?? {};
  return (e.likes ?? 0) + (e.comments ?? 0) + (e.shares ?? 0);
}
