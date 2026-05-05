import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import VariableTokenText from "../VariableTokenText.jsx";
import TemplateCarouselBlock from "./TemplateCarouselBlock.jsx";
import SuggestionChipsBlock from "./SuggestionChipsBlock.jsx";

export default function AIMessageCard({ blocks, onPickTemplate, onPickChip, isStreaming }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <article className="w-full rounded-md border border-line bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <header className="flex items-center justify-between gap-2 border-b border-line pb-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-50">
          <Sparkles size={14} className="text-brand-emerald" strokeWidth={1.75} />
        </span>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand message" : "Collapse message"}
          className="inline-flex h-6 w-6 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle"
        >
          <ChevronDown
            size={14}
            strokeWidth={1.75}
            className={[
              "transition-transform",
              collapsed ? "-rotate-90" : "rotate-0",
            ].join(" ")}
          />
        </button>
      </header>

      {!collapsed && (
        <div className="flex flex-col gap-4 pt-4">
          {blocks.map((b, i) => {
            if (b.type === "text") {
              return (
                <p
                  key={i}
                  className="text-[14px] leading-relaxed text-ink-body"
                >
                  <VariableTokenText text={b.text} />
                  {isStreaming && i === blocks.length - 1 && (
                    <span aria-hidden className="ml-1 inline-block h-3 w-2 animate-pulse bg-brand-emerald align-middle" />
                  )}
                </p>
              );
            }
            if (b.type === "template-carousel") {
              return (
                <TemplateCarouselBlock
                  key={i}
                  templates={b.templates}
                  onPick={onPickTemplate}
                />
              );
            }
            if (b.type === "suggestion-chips") {
              return (
                <SuggestionChipsBlock
                  key={i}
                  chips={b.chips}
                  onPick={onPickChip}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </article>
  );
}
