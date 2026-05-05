import { ChevronDown, ChevronLeft, SlidersHorizontal } from "lucide-react";

export default function ChatTopBar({ workspace = "SAND-4", onBack, onToggleControls }) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-line bg-white px-5 py-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-sm border border-line bg-white text-ink-body hover:bg-surface-subtle"
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-canvas px-2.5 py-1 text-[11px] font-semibold text-ink-heading hover:bg-surface-subtle"
        >
          <span aria-hidden>🪐</span>
          {workspace}
          <ChevronDown size={12} strokeWidth={1.75} className="text-ink-muted" />
        </button>
      </div>
      <button
        type="button"
        onClick={onToggleControls}
        className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[12px] font-medium text-ink-heading hover:bg-surface-subtle"
      >
        <SlidersHorizontal size={14} strokeWidth={1.75} />
        Control
      </button>
    </header>
  );
}
