import { Heart, MessageCircle, MoreHorizontal, Send, Bookmark, ThumbsUp, Music2, ImageIcon as ImageGlyph } from "lucide-react";
import { ChannelLogo } from "./AdLogos.jsx";

export default function AdPreview({ channel, business, creative }) {
  if (channel === "meta") return <MetaPreview business={business} creative={creative} />;
  if (channel === "linkedin") return <LinkedInPreview business={business} creative={creative} />;
  if (channel === "tiktok") return <TikTokPreview business={business} creative={creative} />;
  return null;
}

function MetaPreview({ business, creative }) {
  return (
    <div className="flex w-full max-w-[300px] flex-col rounded-xl border border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <header className="flex items-center gap-2 px-3 pt-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-[12px] font-semibold text-brand-emerald">
          {business[0]}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-[12px] font-semibold text-ink-heading">{business}</span>
          <span className="text-[10px] font-medium text-ink-muted">Sponsored · <ChannelLogo id="meta" size={10} /></span>
        </div>
        <MoreHorizontal size={14} className="ml-auto text-ink-muted" />
      </header>
      <div className="px-3 py-2 text-[12px] text-ink-body">{creative.description || "Your ad description appears here."}</div>
      <CreativeMedia creative={creative} aspect="aspect-[4/3]" tone="bg-brand-50 text-brand-emerald" />
      <div className="flex items-center justify-between border-t border-line px-3 py-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">{creative.url?.replace(/^https?:\/\//, "") || "yourbusiness.com"}</span>
          <span className="text-[12px] font-semibold text-ink-heading">{creative.headline || "Your headline"}</span>
        </div>
        <button type="button" className="inline-flex h-8 items-center rounded-sm border border-line bg-surface-subtle px-3 text-[11px] font-semibold text-ink-heading">
          {creative.cta || "Learn more"}
        </button>
      </div>
      <div className="flex items-center gap-4 border-t border-line px-3 py-2 text-ink-muted">
        <span className="flex items-center gap-1 text-[11px]"><ThumbsUp size={12} /> Like</span>
        <span className="flex items-center gap-1 text-[11px]"><MessageCircle size={12} /> Comment</span>
        <span className="ml-auto flex items-center gap-1 text-[11px]"><Send size={12} /> Share</span>
      </div>
    </div>
  );
}

function LinkedInPreview({ business, creative }) {
  return (
    <div className="flex w-full max-w-[300px] flex-col rounded-xl border border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <header className="flex items-center gap-2 px-3 pt-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-info-bg text-[12px] font-semibold text-info">
          {business[0]}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-[12px] font-semibold text-ink-heading">{business}</span>
          <span className="text-[10px] font-medium text-ink-muted">Promoted · 2,340 followers</span>
        </div>
        <MoreHorizontal size={14} className="ml-auto text-ink-muted" />
      </header>
      <div className="px-3 py-2 text-[12px] leading-snug text-ink-body">
        <span className="font-semibold">{creative.headline || "Your headline"}</span>
        <br />
        {creative.description || "Your ad description appears here."}
      </div>
      <CreativeMedia creative={creative} aspect="aspect-[4/3]" tone="bg-info-bg text-info" />
      <div className="flex items-center justify-between border-t border-line px-3 py-2">
        <span className="text-[10px] font-medium uppercase tracking-wide text-ink-subtle">{creative.url?.replace(/^https?:\/\//, "") || "yourbusiness.com"}</span>
        <button type="button" className="inline-flex h-8 items-center rounded-button border border-info px-3 text-[11px] font-semibold text-info">
          {creative.cta || "Learn more"}
        </button>
      </div>
    </div>
  );
}

function TikTokPreview({ business, creative }) {
  return (
    <div className="relative flex aspect-[9/16] w-full max-w-[260px] overflow-hidden rounded-2xl bg-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
      <CreativeMedia creative={creative} className="absolute inset-0 h-full w-full" tone="bg-gradient-to-br from-[#FF004F]/40 via-black to-[#00F2EA]/40 text-white" iconSize={36} />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-black text-[10px] font-semibold">{business[0]}</span>
        <Heart size={20} />
        <MessageCircle size={20} />
        <Bookmark size={20} />
        <Send size={20} />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-6">
        <span className="text-[12px] font-semibold">@{business.toLowerCase().replace(/\s+/g, "")}</span>
        <span className="text-[12px] font-medium">{creative.headline || "Your headline"}</span>
        <span className="line-clamp-2 text-[11px] text-white/80">{creative.description || "Your ad description"}</span>
        <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-white/70"><Music2 size={10} /> original sound · Sponsored</span>
        <button type="button" className="mt-2 inline-flex h-9 items-center justify-center rounded-md bg-[#FE2C55] text-[12px] font-semibold">
          {creative.cta || "Learn more"}
        </button>
      </div>
    </div>
  );
}

function CreativeMedia({ creative, aspect, tone, iconSize = 32, className = "" }) {
  if (creative.isPlaceholder) {
    return (
      <div className={[aspect, "flex items-center justify-center border border-dashed border-line bg-surface-subtle", className].filter(Boolean).join(" ")}>
        <ImageGlyph size={iconSize / 2} className="text-ink-subtle" strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <div className={[aspect, "flex items-center justify-center", tone, className].filter(Boolean).join(" ")}>
      {creative.thumb && <span style={{ fontSize: iconSize * 1.6 }}>{creative.thumb}</span>}
      {!creative.thumb && <ImageGlyph size={iconSize} className="text-current" />}
    </div>
  );
}
