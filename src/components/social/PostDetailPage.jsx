import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  ChevronDown,
  Copy,
  Edit3,
  Heart,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Play,
  Repeat,
  Send,
  Share2,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { InstagramLogo, LinkedinLogo } from "../BrandLogos.jsx";
import { FacebookLogo } from "./SocialLogos.jsx";
import { PLATFORMS, findPlatform, formatCount, formatRelative } from "./data.js";

const LOGO_BY_ID = { linkedin: LinkedinLogo, facebook: FacebookLogo, instagram: InstagramLogo };

const STATUS_PILL = {
  scheduled: { label: "Scheduled", bg: "bg-info-bg",    text: "text-info",    dot: "bg-info" },
  published: { label: "Published", bg: "bg-success-bg", text: "text-success", dot: "bg-success" },
  draft:     { label: "Draft",     bg: "bg-surface-muted", text: "text-ink-muted", dot: "bg-ink-subtle" },
  failed:    { label: "Failed",    bg: "bg-danger-bg",  text: "text-danger",  dot: "bg-danger" },
};

const CHANNEL_LABEL = { linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram" };

const MOCK_VARIANT_CAPTIONS = {
  linkedin: "Excited to share our latest update with the WeNext community. We've been working hard on what's next — and the response so far has been incredible. #SMBgrowth #Retail",
  facebook: "Big news from our team — check it out and let us know what you think in the comments! 💚",
  instagram: "swipe to see what we've been up to 🌟 link in bio for the full story · #WeNextRetail #shoplocal #smallbusiness",
};

const MOCK_COMMENTS = [
  { id: "c1", name: "Aisha Khan",   initial: "A", text: "Love this! Do you ship to Bangalore?",        replies: 1, platform: "linkedin" },
  { id: "c2", name: "Karthik Rao",  initial: "K", text: "Just placed my order, can't wait 🔥",          replies: 0, platform: "instagram" },
  { id: "c3", name: "Priya Menon",  initial: "P", text: "Will there be a pop-up at Phoenix Mall again?", replies: 2, platform: "facebook" },
  { id: "c4", name: "Rahul Verma",  initial: "R", text: "Fantastic content team. Keep them coming.",    replies: 0, platform: "linkedin" },
];

const MOCK_SEGMENTS = [
  { id: "s1", name: "Followers · India",       reach: 18200 },
  { id: "s2", name: "Spring 2026 buyers",      reach:  4100 },
  { id: "s3", name: "Lookalike · top spenders", reach:  9600 },
];

export default function PostDetailPage({ post, onBack }) {
  const [toast, setToast] = useState(null);
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pill = STATUS_PILL[post.status] ?? STATUS_PILL.draft;
  const isPublished = post.status === "published";
  const isScheduledLike = post.status === "scheduled" || post.status === "draft";

  const showToast = (text) => {
    setToast(text);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="flex flex-col gap-6">
      <Header
        post={post}
        pill={pill}
        paused={paused}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((o) => !o)}
        onMenuClose={() => setMenuOpen(false)}
        onBack={onBack}
        onEdit={() => showToast("Opening editor…")}
        onDuplicate={() => showToast("Post duplicated")}
        onPauseToggle={() => { setPaused((p) => !p); showToast(paused ? "Post resumed" : "Post paused"); }}
        onToast={showToast}
      />

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-5">
          <PreviewCard post={post} />
          <CaptionCard post={post} />
          {isPublished && <PerformanceCard post={post} />}
          <CommentsCard post={post} />
        </div>

        <aside className="flex flex-col gap-5">
          {isScheduledLike && <ScheduleCard post={post} onReschedule={() => showToast("Reschedule (mock)")} />}
          <AudienceCard />
          <BoostCard onConvert={() => showToast("Conversion flow (mock)")} />
          <HistoryCard post={post} />
        </aside>
      </div>

      {toast && (
        <div role="status" className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-ink-heading px-4 py-2 text-[12px] font-medium text-white shadow-card">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ──────────── Header ──────────── */

function Header({ post, pill, paused, menuOpen, onMenuToggle, onMenuClose, onBack, onEdit, onDuplicate, onPauseToggle, onToast }) {
  const canPause = post.status === "scheduled";
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 items-center gap-1.5 rounded-button border border-line bg-white px-3 text-[12px] font-medium text-ink-body hover:bg-surface-subtle"
        >
          <ArrowLeft size={14} /> Social posts
        </button>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={["inline-flex h-5 items-center gap-1 rounded-pill px-2 text-[11px] font-semibold", pill.bg, pill.text].join(" ")}>
              <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
              {pill.label}
            </span>
            <span className="inline-flex items-center gap-1.5">
              {post.channels.map((id) => {
                const Logo = LOGO_BY_ID[id];
                if (!Logo) return null;
                return (
                  <span key={id} className="inline-flex h-5 items-center gap-1 rounded-pill border border-line bg-white px-1.5 text-[10px] font-medium text-ink-body">
                    <Logo size={11} /> {CHANNEL_LABEL[id]}
                  </span>
                );
              })}
            </span>
          </div>
          <h1 className="line-clamp-1 max-w-[600px] text-[15px] font-semibold text-ink-heading">
            {post.caption.slice(0, 90)}{post.caption.length > 90 ? "…" : ""}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-9 items-center gap-1.5 rounded-button border border-line bg-white px-3 text-[12px] font-semibold text-ink-body hover:bg-surface-subtle"
        >
          <Edit3 size={13} /> Edit
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="inline-flex h-9 items-center gap-1.5 rounded-button border border-line bg-white px-3 text-[12px] font-semibold text-ink-body hover:bg-surface-subtle"
        >
          <Copy size={13} /> Duplicate
        </button>
        {canPause && (
          <button
            type="button"
            onClick={onPauseToggle}
            className="inline-flex h-9 items-center gap-1.5 rounded-button border border-line bg-white px-3 text-[12px] font-semibold text-ink-body hover:bg-surface-subtle"
          >
            {paused ? <><Play size={13} /> Resume</> : <><Pause size={13} /> Pause</>}
          </button>
        )}
        <div className="relative">
          <button
            type="button"
            aria-label="More actions"
            onClick={(e) => { e.stopPropagation(); onMenuToggle(); }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-line bg-white text-ink-muted hover:bg-surface-subtle"
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={onMenuClose} />
              <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-[8px] border border-line bg-white p-1 shadow-card">
                {[
                  { label: "Copy link",       onClick: () => onToast("Link copied") },
                  { label: "Convert to ad",   onClick: () => onToast("Conversion flow (mock)") },
                  { label: "Export report",   onClick: () => onToast("Report exported") },
                  { label: "Archive",         onClick: () => onToast("Archived"), danger: true },
                ].map((it, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { it.onClick?.(); onMenuClose(); }}
                    className={["flex w-full items-center rounded-[6px] px-2 py-1.5 text-left text-[12px] font-medium", it.danger ? "text-danger hover:bg-danger-bg" : "text-ink-body hover:bg-surface-subtle"].join(" ")}
                  >
                    {it.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ──────────── Preview ──────────── */

function PreviewCard({ post }) {
  const availablePlatforms = post.channels.length > 0 ? post.channels : ["linkedin"];
  const [active, setActive] = useState(availablePlatforms[0]);
  const platform = findPlatform(active) ?? PLATFORMS[0];

  return (
    <section className="flex flex-col gap-4 rounded-md border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-ink-heading">Preview</h2>
        <div className="inline-flex items-center gap-1 rounded-button border border-line bg-white p-0.5">
          {availablePlatforms.map((id) => {
            const Logo = LOGO_BY_ID[id];
            const isActive = id === active;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={["inline-flex h-7 items-center gap-1.5 rounded-[6px] px-2 text-[11px] font-semibold transition-colors", isActive ? "bg-brand-50 text-brand-emerald" : "text-ink-muted hover:text-ink-heading"].join(" ")}
              >
                {Logo && <Logo size={12} />}
                {CHANNEL_LABEL[id]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center rounded-sm bg-canvas py-6">
        <PhoneFrame post={post} platform={platform} />
      </div>

      <p className="text-center text-[11px] font-medium text-ink-muted">
        {platform.name} feed · aspect {platform.aspect}
      </p>
    </section>
  );
}

function PhoneFrame({ post, platform }) {
  return (
    <div className="relative w-[280px] rounded-[28px] border-[6px] border-ink-heading bg-white shadow-card">
      <div className="absolute left-1/2 top-1.5 z-10 h-3 w-16 -translate-x-1/2 rounded-full bg-ink-heading" />
      <div className="flex flex-col gap-2 rounded-[22px] bg-canvas p-3 pt-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-[10px] font-semibold text-brand-emerald">
            WR
          </span>
          <div className="flex flex-1 flex-col">
            <span className="text-[11px] font-semibold text-ink-heading">WeNext Retail</span>
            <span className="text-[9px] font-medium text-ink-subtle">Sponsored · just now</span>
          </div>
          <MoreHorizontal size={12} className="text-ink-muted" />
        </div>
        <div
          className="flex items-center justify-center rounded-sm bg-surface-muted text-[40px]"
          style={{ aspectRatio: platform.aspect.replace(":", "/") }}
        >
          {post.media?.thumb ?? "🖼"}
        </div>
        <p className="px-1 text-[11px] leading-snug text-ink-body">
          {post.caption.slice(0, 160)}{post.caption.length > 160 ? "…" : ""}
        </p>
        <div className="flex items-center justify-between border-t border-line px-1 pt-1.5 text-ink-muted">
          <Heart size={12} />
          <MessageCircle size={12} />
          <Send size={12} />
          <Share2 size={12} />
        </div>
      </div>
    </div>
  );
}

/* ──────────── Caption ──────────── */

function CaptionCard({ post }) {
  const variants = useMemo(() => {
    return post.channels.map((id) => ({
      id,
      caption: MOCK_VARIANT_CAPTIONS[id] ?? post.caption,
    }));
  }, [post]);

  const hashtagMatch = post.caption.match(/#[A-Za-z0-9_]+/g) ?? [];

  return (
    <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-[13px] font-semibold text-ink-heading">Caption</h2>
        <span className="text-[11px] font-medium text-ink-muted">{post.caption.length} chars</span>
      </header>
      <p className="whitespace-pre-line rounded-sm border border-line bg-canvas p-3 text-[13px] leading-relaxed text-ink-body">
        {post.caption}
      </p>
      {hashtagMatch.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {hashtagMatch.map((tag) => (
            <span key={tag} className="inline-flex h-5 items-center rounded-pill bg-brand-50 px-2 text-[10px] font-semibold text-brand-emerald">
              {tag}
            </span>
          ))}
        </div>
      )}
      {variants.length > 1 && (
        <details className="rounded-sm border border-line bg-canvas">
          <summary className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-[12px] font-semibold text-ink-body">
            <span>Per-platform variants ({variants.length})</span>
            <ChevronDown size={14} className="text-ink-muted" />
          </summary>
          <div className="flex flex-col gap-2 border-t border-line p-3">
            {variants.map((v) => {
              const Logo = LOGO_BY_ID[v.id];
              return (
                <div key={v.id} className="flex flex-col gap-1">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-heading">
                    {Logo && <Logo size={12} />} {CHANNEL_LABEL[v.id]}
                  </div>
                  <p className="text-[12px] leading-snug text-ink-body">{v.caption}</p>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </section>
  );
}

/* ──────────── Performance ──────────── */

function PerformanceCard({ post }) {
  const e = post.engagement ?? {};
  const tiles = [
    { id: "reach",    label: "Reach",    value: formatCount(e.reach ?? 0),    icon: <Sparkles size={12} /> },
    { id: "likes",    label: "Likes",    value: formatCount(e.likes ?? 0),    icon: <Heart size={12} /> },
    { id: "comments", label: "Comments", value: formatCount(e.comments ?? 0), icon: <MessageCircle size={12} /> },
    { id: "shares",   label: "Shares",   value: formatCount(e.shares ?? 0),   icon: <Send size={12} /> },
  ];

  const seed = (e.reach ?? 1000) + (e.likes ?? 100);
  const points = useMemo(() => buildSparkPoints(seed), [seed]);

  return (
    <section className="flex flex-col gap-4 rounded-md border border-line bg-white p-5">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-[13px] font-semibold text-ink-heading">Performance</h2>
        <span className="text-[11px] font-medium text-ink-muted">Since publish</span>
      </header>
      <div className="grid grid-cols-4 gap-3">
        {tiles.map((t) => (
          <div key={t.id} className="flex flex-col gap-1 rounded-sm border border-line bg-canvas p-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">
              {t.icon} {t.label}
            </span>
            <span className="text-[18px] font-semibold text-ink-heading">{t.value}</span>
          </div>
        ))}
      </div>
      <div className="rounded-sm border border-line bg-canvas p-3">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">
          <span>Reach over 7 days</span>
          <span className="text-success">+{Math.round(seed % 30) + 5}%</span>
        </div>
        <svg viewBox="0 0 200 48" preserveAspectRatio="none" className="h-12 w-full">
          <path d={`M0,48 ${points} L200,48 Z`} fill="rgba(16,185,129,0.12)" />
          <path d={`M0,${48 - points.split(" ").length} ${points}`} fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}

function buildSparkPoints(seed) {
  const N = 8;
  let out = "";
  let v = (seed % 20) + 12;
  for (let i = 0; i < N; i++) {
    const x = (i * 200) / (N - 1);
    v = Math.max(6, Math.min(42, v + ((seed >> i) % 9) - 3));
    out += `L${x.toFixed(1)},${(48 - v).toFixed(1)} `;
  }
  return out.trim();
}

/* ──────────── Comments ──────────── */

function CommentsCard({ post }) {
  return (
    <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-[13px] font-semibold text-ink-heading">Comments</h2>
        <button type="button" className="text-[11px] font-semibold text-brand-emerald hover:underline">View all</button>
      </header>
      <ul className="flex flex-col">
        {MOCK_COMMENTS.map((c, i) => {
          const Logo = LOGO_BY_ID[c.platform];
          return (
            <li key={c.id} className={["flex items-start gap-3 py-3", i < MOCK_COMMENTS.length - 1 ? "border-b border-line" : ""].join(" ")}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[12px] font-semibold text-ink-body">
                {c.initial}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-semibold text-ink-heading">{c.name}</span>
                  {Logo && <Logo size={10} />}
                </div>
                <p className="text-[12px] leading-snug text-ink-body">{c.text}</p>
                <span className="text-[10px] font-medium text-ink-muted">{c.replies} {c.replies === 1 ? "reply" : "replies"}</span>
              </div>
              <button type="button" className="text-[11px] font-semibold text-brand-emerald hover:underline">Reply</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ──────────── Schedule ──────────── */

function ScheduleCard({ post, onReschedule }) {
  const target = post.scheduledFor ?? post.savedAt;
  const d = target ? new Date(target) : null;
  const dateStr = d ? d.toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric" }) : "Not scheduled";
  const timeStr = d ? d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" }) : "—";

  return (
    <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
      <header className="flex items-center gap-2">
        <CalendarClock size={14} className="text-ink-muted" />
        <h2 className="text-[13px] font-semibold text-ink-heading">Schedule</h2>
      </header>
      <div className="flex flex-col gap-2 rounded-sm border border-line bg-canvas p-3">
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-medium text-ink-muted">Date</span>
          <span className="font-semibold text-ink-heading">{dateStr}</span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-medium text-ink-muted">Time</span>
          <span className="font-semibold text-ink-heading">{timeStr}</span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span className="inline-flex items-center gap-1 font-medium text-ink-muted"><Repeat size={11} /> Recurrence</span>
          <span className="font-semibold text-ink-heading">One-time</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onReschedule}
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-button border border-line bg-white px-3 text-[12px] font-semibold text-ink-body hover:bg-surface-subtle"
      >
        <CalendarClock size={13} /> Reschedule
      </button>
    </section>
  );
}

/* ──────────── Audience ──────────── */

function AudienceCard() {
  const total = MOCK_SEGMENTS.reduce((sum, s) => sum + s.reach, 0);
  return (
    <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
      <header className="flex items-center gap-2">
        <Users size={14} className="text-ink-muted" />
        <h2 className="text-[13px] font-semibold text-ink-heading">Audience</h2>
      </header>
      <ul className="flex flex-col gap-1.5">
        {MOCK_SEGMENTS.map((s) => (
          <li key={s.id} className="flex items-center justify-between rounded-sm border border-line bg-canvas px-3 py-2">
            <span className="text-[12px] font-medium text-ink-body">{s.name}</span>
            <span className="text-[11px] font-semibold text-ink-heading">{formatCount(s.reach)}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-line pt-2 text-[12px]">
        <span className="font-medium text-ink-muted">Estimated reach</span>
        <span className="font-semibold text-brand-emerald">{formatCount(total)}</span>
      </div>
    </section>
  );
}

/* ──────────── Boost ──────────── */

function BoostCard({ onConvert }) {
  return (
    <section className="flex flex-col gap-2 rounded-md border border-line bg-gradient-to-br from-brand-50 to-white p-5">
      <header className="flex items-center gap-2">
        <Target size={14} className="text-brand-emerald" />
        <h2 className="text-[13px] font-semibold text-ink-heading">Boost</h2>
      </header>
      <p className="text-[12px] leading-snug text-ink-muted">
        Reach 5x more people by promoting this post as an ad.
      </p>
      <button
        type="button"
        onClick={onConvert}
        className="mt-1 inline-flex h-9 items-center justify-center rounded-button bg-cta-gradient px-3 text-[12px] font-semibold text-white hover:opacity-90"
      >
        Convert to ad →
      </button>
    </section>
  );
}

/* ──────────── History ──────────── */

function HistoryCard({ post }) {
  const events = useMemo(() => buildHistory(post), [post]);
  return (
    <section className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
      <header className="flex items-center gap-2">
        <Loader2 size={14} className="text-ink-muted" />
        <h2 className="text-[13px] font-semibold text-ink-heading">History</h2>
      </header>
      <ol className="flex flex-col gap-3">
        {events.map((e, i) => (
          <li key={e.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-0.5">
              <span className={["h-2 w-2 rounded-full", e.active ? "bg-brand-emerald" : "bg-ink-subtle"].join(" ")} />
              {i < events.length - 1 && <span className="mt-1 h-6 w-px bg-line" />}
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-[12px] font-semibold text-ink-heading">{e.label}</span>
              <span className="text-[10px] font-medium text-ink-muted">{e.when}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function buildHistory(post) {
  const out = [];
  if (post.status === "draft") {
    out.push({ id: "drafted", label: "Drafted", when: post.savedAt ? formatRelative(post.savedAt) : "Recently", active: true });
  } else if (post.status === "scheduled" || post.status === "failed") {
    out.push({ id: "drafted",   label: "Drafted",   when: "2 days ago", active: false });
    out.push({ id: "scheduled", label: "Scheduled", when: post.scheduledFor ? formatRelative(post.scheduledFor) : "Soon", active: true });
  } else if (post.status === "published") {
    out.push({ id: "drafted",   label: "Drafted",   when: "3 days ago", active: false });
    out.push({ id: "scheduled", label: "Scheduled", when: "2 days ago", active: false });
    out.push({ id: "published", label: "Published", when: post.publishedAt ? formatRelative(post.publishedAt) : "Recently", active: true });
    out.push({ id: "edited",    label: "Edited caption", when: "1 day ago", active: false });
  }
  return out;
}
