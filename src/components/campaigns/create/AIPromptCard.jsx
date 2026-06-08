import { useEffect, useRef, useState } from "react";
import { ArrowUp, Library, Mic, Paperclip, Sparkles } from "lucide-react";
import VariableTokenText from "./VariableTokenText.jsx";

export default function AIPromptCard({
  value,
  onChange,
  onSubmit,
  onAttach,
  onPromptLibrary,
  isListening,
  onToggleVoice,
}) {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const hasInput = value.trim().length > 0;
  const showHighlightedPreview = hasInput && !focused;

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value, focused]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (hasInput) onSubmit?.();
    }
  };

  const focusInput = () => {
    setFocused(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div className="flex flex-col rounded-sm border border-line bg-white shadow-chip">
      {/* Top region — input + actions */}
      <div className="flex flex-col gap-5 px-5 pb-2.5 pt-5">
        <div className="flex items-start gap-3">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-brand-emerald" strokeWidth={1.75} />
          <span aria-hidden className="mt-0.5 h-5 w-px shrink-0 bg-line" />
          {showHighlightedPreview ? (
            <button
              type="button"
              onClick={focusInput}
              className="flex-1 cursor-text text-left text-[14px] font-medium leading-snug text-ink-heading"
            >
              <VariableTokenText text={value} />
            </button>
          ) : (
            <textarea
              ref={inputRef}
              rows={1}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="hey, i want a Diwali sale template for my saree shop..."
              className="min-w-0 flex-1 resize-none bg-transparent text-[14px] font-medium leading-snug text-ink-heading placeholder:text-[#A7B2C1] focus:outline-none"
            />
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onToggleVoice}
            aria-label={isListening ? "Stop dictation" : "Start dictation"}
            className={[
              "inline-flex h-[30px] w-[30px] items-center justify-center rounded-sm border transition-all",
              isListening
                ? "animate-pulse border-brand-500 bg-cta-gradient text-white"
                : "border-line bg-white text-ink-body shadow-[0_5px_10px_#F3F7F9] hover:bg-surface-subtle",
            ].join(" ")}
          >
            <Mic size={14} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={hasInput ? onSubmit : undefined}
            disabled={!hasInput}
            aria-label="Send prompt"
            className={[
              "inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-cta-gradient text-white transition-all",
              hasInput ? "hover:scale-105 hover:shadow-chip" : "opacity-50 cursor-not-allowed",
            ].join(" ")}
          >
            <ArrowUp size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Bottom region — utility actions */}
      <div className="flex items-center gap-3 border-t border-line px-5 py-3">
        <button
          type="button"
          onClick={onAttach ?? (() => alert('Attach mock'))}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-heading transition-colors hover:text-brand-emerald"
        >
          <Paperclip size={14} strokeWidth={1.75} />
          Attach Files
        </button>
        <span aria-hidden className="h-4 w-px shrink-0 bg-line" />
        <button
          type="button"
          onClick={onPromptLibrary}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-heading transition-colors hover:text-brand-emerald"
        >
          <Library size={14} strokeWidth={1.75} />
          Prompt Library
        </button>
      </div>
    </div>
  );
}
