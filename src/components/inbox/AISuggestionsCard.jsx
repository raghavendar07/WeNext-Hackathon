import { useState } from "react";
import { ArrowUp, Brush, RefreshCw, XCircle } from "lucide-react";
import SuggestionRow from "./SuggestionRow.jsx";

export const AI_SUGGESTIONS = [
  "Sure! I've scheduled your delivery for tomorrow between 2–5 PM. You'll receive a tracking link shortly 😊",
  "Done! Your order will be delivered tomorrow between 2–5 PM. Tracking details will be shared soon.",
  "No worries, I've rescheduled your delivery to tomorrow (2–5 PM). Everything is confirmed, and we'll send you tracking updates shortly.",
];

const SUGGESTION_POOL = [
  "Sure! I've scheduled your delivery for tomorrow between 2–5 PM. You'll receive a tracking link shortly 😊",
  "Done! Your order will be delivered tomorrow between 2–5 PM. Tracking details will be shared soon.",
  "No worries, I've rescheduled your delivery to tomorrow (2–5 PM). Everything is confirmed, and we'll send you tracking updates shortly.",
  "Got it! Delivery is locked in for 2–5 PM tomorrow. I'll text you the courier's number as soon as it's out.",
  "All set 👍 Your package is out for delivery tomorrow afternoon. Anything else you'd like me to flag for the rider?",
  "Confirmed for tomorrow, 2–5 PM. If you need a narrower slot, just reply and I'll see what we can do!",
];

export default function AISuggestionsCard({
  suggestions: suggestionsProp,
  highlighted,
  onHighlight,
  onSend,
  onCancel,
  onWriteSomethingElse,
  onRefresh,
}) {
  const [rotation, setRotation] = useState(0);

  // When parent doesn't pass suggestions, rotate through pool in groups of 3.
  const suggestions =
    suggestionsProp ??
    [0, 1, 2].map(
      (i) => SUGGESTION_POOL[(rotation * 3 + i) % SUGGESTION_POOL.length]
    );

  const handleRefresh = () => {
    setRotation((r) => (r + 1) % (SUGGESTION_POOL.length / 3 || 1));
    onRefresh?.();
  };

  return (
    <div className="flex flex-col gap-4 rounded-sm border border-line bg-white p-3 shadow-chip">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-medium text-ink-heading">Suggestions</h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-muted"
          >
            Try different replies
            <RefreshCw size={12} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close suggestions"
            className="inline-flex h-5 w-5 items-center justify-center text-ink-muted hover:text-ink-heading"
          >
            <XCircle size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Suggestion list */}
      <div className="flex flex-col gap-2">
        {suggestions.map((text, i) => (
          <SuggestionRow
            key={`${rotation}-${i}`}
            index={i + 1}
            text={text}
            highlighted={highlighted === i}
            onClick={() => onHighlight?.(i)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onWriteSomethingElse}
          className="inline-flex items-center gap-2 text-[10px] font-medium text-ink-muted"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-line bg-canvas">
            <Brush size={10} className="text-ink-muted" strokeWidth={1.75} />
          </span>
          write something else
        </button>
        <button
          type="button"
          onClick={() => onSend?.(highlighted ?? 0)}
          disabled={highlighted == null}
          aria-label="Send selected suggestion"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cta-gradient transition-opacity disabled:opacity-50"
        >
          <ArrowUp size={14} className="text-white" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
