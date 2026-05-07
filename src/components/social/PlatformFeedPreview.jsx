import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2, Send, ThumbsUp } from "lucide-react";
import { InstagramLogo, LinkedinLogo } from "../BrandLogos.jsx";
import { FacebookLogo } from "./SocialLogos.jsx";

const LOGO_BY_ID = { linkedin: LinkedinLogo, facebook: FacebookLogo, instagram: InstagramLogo };

export default function PlatformFeedPreview({ platform, business = "WeNext Retail", caption, media }) {
  if (platform === "linkedin") return <LinkedInFeed business={business} caption={caption} media={media} />;
  if (platform === "facebook") return <FacebookFeed business={business} caption={caption} media={media} />;
  if (platform === "instagram") return <InstagramFeed business={business} caption={caption} media={media} />;
  return null;
}

function LinkedInFeed({ business, caption, media }) {
  return (
    <article className="flex w-full max-w-[320px] flex-col rounded-xl border border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <header className="flex items-start gap-2 px-3 pt-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-info-bg text-[12px] font-semibold text-info">
          {business[0]}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[12px] font-semibold text-ink-heading">{business}</span>
          <span className="truncate text-[10px] font-medium text-ink-muted">SMB · Retail</span>
          <span className="text-[10px] font-medium text-ink-subtle">2h · 🌐</span>
        </div>
        <MoreHorizontal size={14} className="text-ink-muted" />
      </header>
      <p className="px-3 py-2 text-[12px] leading-snug text-ink-body">
        {clamp(caption, 220) || <Placeholder>Your post will appear here…</Placeholder>}
      </p>
      <MediaTile media={media} aspect="aspect-[1.91/1]" tone="bg-info-bg text-info" />
      <div className="flex items-center justify-around border-t border-line px-3 py-1.5 text-ink-muted">
        <Action icon={<ThumbsUp size={14} />} label="Like" />
        <Action icon={<MessageCircle size={14} />} label="Comment" />
        <Action icon={<Repeat2 size={14} />} label="Repost" />
        <Action icon={<Send size={14} />} label="Send" />
      </div>
    </article>
  );
}

function FacebookFeed({ business, caption, media }) {
  return (
    <article className="flex w-full max-w-[320px] flex-col rounded-xl border border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <header className="flex items-start gap-2 px-3 pt-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2]/15 text-[12px] font-semibold text-[#1877F2]">
          {business[0]}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[12px] font-semibold text-ink-heading">{business}</span>
          <span className="text-[10px] font-medium text-ink-subtle">2h · 🌐</span>
        </div>
        <MoreHorizontal size={14} className="text-ink-muted" />
      </header>
      <p className="px-3 py-2 text-[12px] leading-snug text-ink-body">
        {clamp(caption, 280) || <Placeholder>Your post will appear here…</Placeholder>}
      </p>
      <MediaTile media={media} aspect="aspect-[1.91/1]" tone="bg-[#1877F2]/12 text-[#1877F2]" />
      <div className="flex items-center justify-around border-t border-line px-3 py-1.5 text-ink-muted">
        <Action icon={<ThumbsUp size={14} />} label="Like" />
        <Action icon={<MessageCircle size={14} />} label="Comment" />
        <Action icon={<Send size={14} />} label="Share" />
      </div>
    </article>
  );
}

function InstagramFeed({ business, caption, media }) {
  return (
    <article className="flex w-full max-w-[320px] flex-col rounded-xl border border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <header className="flex items-center gap-2 px-3 pt-3 pb-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FDF497] via-[#D6249F] to-[#285AEB] p-0.5">
          <span className="flex h-full w-full items-center justify-center rounded-full bg-white text-[10px] font-semibold text-ink-heading">
            {business[0]}
          </span>
        </span>
        <span className="flex-1 text-[12px] font-semibold text-ink-heading">{business.toLowerCase().replace(/\s+/g, ".")}</span>
        <MoreHorizontal size={14} className="text-ink-muted" />
      </header>
      <MediaTile media={media} aspect="aspect-square" tone="bg-gradient-to-br from-[#FDF497]/30 via-[#D6249F]/15 to-[#285AEB]/15 text-[#D6249F]" />
      <div className="flex items-center gap-3 px-3 pt-2 text-ink-muted">
        <Heart size={16} />
        <MessageCircle size={16} />
        <Send size={16} />
        <Bookmark size={16} className="ml-auto" />
      </div>
      <div className="flex flex-col gap-0.5 px-3 pb-3 pt-1">
        <span className="text-[11px] font-semibold text-ink-heading">Liked by {business.toLowerCase().replace(/\s+/g, "_")}_fan and 142 others</span>
        <p className="text-[12px] leading-snug text-ink-body">
          <span className="font-semibold">{business.toLowerCase().replace(/\s+/g, ".")}</span>{" "}
          {clamp(caption, 180) || <Placeholder>Your caption will appear here…</Placeholder>}
        </p>
        <span className="text-[10px] font-medium text-ink-subtle">View all 23 comments</span>
      </div>
    </article>
  );
}

function MediaTile({ media, aspect, tone }) {
  return (
    <div className={[aspect, "flex items-center justify-center", tone].join(" ")}>
      {media?.thumb ? (
        <span style={{ fontSize: 56 }}>{media.thumb}</span>
      ) : (
        <span className="text-[11px] font-medium opacity-70">Media preview</span>
      )}
    </div>
  );
}

function Action({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium">
      {icon}
      {label}
    </span>
  );
}

function Placeholder({ children }) {
  return <span className="italic text-ink-subtle">{children}</span>;
}

function clamp(text, max) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}

export { LOGO_BY_ID };
