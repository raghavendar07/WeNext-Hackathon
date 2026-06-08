import { Plus, Sparkles } from "lucide-react";

export default function QuickRepliesBar({ onGenerateAI }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-ink-muted">
          Quick Replays :
        </span>
        <Chip>Let's do it!</Chip>
        <Chip>Let's do it!</Chip>
        <button
          type="button"
          onClick={() => alert('Add quick reply — mock')}
          className="inline-flex items-center gap-1 rounded-xs border border-line bg-white px-2 py-1 text-[11px] font-medium text-ink-muted shadow-chip transition-colors hover:bg-canvas"
        >
          <Plus size={10} className="text-ink-muted" strokeWidth={2} />
          Add
        </button>
      </div>
      <button
        type="button"
        onClick={onGenerateAI}
        className="inline-flex items-center gap-1.5"
      >
        <Sparkles size={14} className="text-brand-emerald" strokeWidth={1.75} />
        <span className="bg-cta-gradient bg-clip-text text-[12px] font-semibold text-transparent">
          Generate AI Replay
        </span>
      </button>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-xs border border-line bg-white px-2 py-1 text-[11px] font-medium text-ink-muted shadow-chip">
      {children}
    </span>
  );
}
