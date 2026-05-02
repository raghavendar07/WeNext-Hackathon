import { FolderOpen } from "lucide-react";

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = "No shared projects yet",
  subtitle = "Projects shared with you will appear here",
  ctaLabel = "Start building",
  onCta,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-surface-card px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-emerald">
        <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="mt-3 text-[20px] font-semibold leading-tight text-ink-heading">
        {title}
      </div>
      <div className="mt-1 max-w-sm text-[14px] font-medium text-ink-muted">
        {subtitle}
      </div>
      {ctaLabel && (
        <button
          type="button"
          onClick={onCta}
          className={[
            "mt-4 inline-flex h-10 items-center rounded-button bg-cta-gradient px-4 text-[14px] font-medium text-white",
            "transition-all duration-150 ease-out hover:opacity-95",
            "focus:outline-none focus-visible:shadow-focus",
          ].join(" ")}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
