import { useEffect, useState } from "react";
import QuickRepliesBar from "./QuickRepliesBar.jsx";
import MessageInputCard from "./MessageInputCard.jsx";
import AISuggestionsCard, { AI_SUGGESTIONS } from "./AISuggestionsCard.jsx";
import KbdHints from "./KbdHints.jsx";

export default function MessageComposerFooter({ mode, onModeChange, onSchedule }) {
  const [highlighted, setHighlighted] = useState(0);
  const isAi = mode === "ai-suggestions";

  useEffect(() => {
    if (!isAi) return;
    function handleKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onModeChange("composer");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, AI_SUGGESTIONS.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        onModeChange("composer");
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isAi, onModeChange]);

  return (
    <div className="px-5 pb-5 pt-3">
      <div className="flex flex-col gap-3 rounded-md border border-line bg-canvas px-3 pb-3 pt-4">
        <QuickRepliesBar onGenerateAI={() => onModeChange("ai-suggestions")} />
        {isAi ? (
          <>
            <AISuggestionsCard
              highlighted={highlighted}
              onHighlight={setHighlighted}
              onSend={() => onModeChange("composer")}
              onCancel={() => onModeChange("composer")}
              onWriteSomethingElse={() => onModeChange("composer")}
            />
            <KbdHints />
          </>
        ) : (
          <MessageInputCard onSchedule={onSchedule} />
        )}
        <p className="text-center text-[11px] font-medium text-ink-muted">
          AI can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  );
}
