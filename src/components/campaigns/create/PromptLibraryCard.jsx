import { Copy, Image as ImageIcon } from "lucide-react";
import VariableTokenText from "./VariableTokenText.jsx";

const CATEGORY_BADGE = {
  marketing:      { label: "Marketing",      bg: "bg-info-bg",    text: "text-info" },
  utility:        { label: "Utility",        bg: "bg-success-bg", text: "text-success" },
  authentication: { label: "Authentication", bg: "bg-warning-bg", text: "text-warning" },
};

export default function PromptLibraryCard({
  prompt,
  onUse,
  onCopy,
  onHover,
}) {
  const cat = CATEGORY_BADGE[prompt.category] ?? CATEGORY_BADGE.marketing;
  return (
    <article
      onMouseEnter={() => onHover?.(prompt)}
      onClick={() => onUse?.(prompt)}
      className="group flex h-[166px] cursor-pointer flex-col gap-3 rounded-md border border-line bg-white p-5 transition-all hover:border-line-default hover:shadow-chip"
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={[
              "inline-flex items-center rounded-pill px-2.5 py-0.5 text-[11px] font-semibold",
              cat.bg,
              cat.text,
            ].join(" ")}
          >
            {cat.label}
          </span>
          {prompt.hasImage && (
            <span className="inline-flex items-center gap-1 rounded-pill bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
              <ImageIcon size={10} strokeWidth={1.75} />
              Contains Image
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label="Copy prompt"
          onClick={(e) => {
            e.stopPropagation();
            onCopy?.(prompt);
          }}
          className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-emerald"
        >
          <Copy size={14} strokeWidth={1.75} />
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <span className="text-[10px] font-medium text-ink-muted">
          {prompt.createdAt}
        </span>
        <p className="line-clamp-4 text-[12px] leading-snug text-ink-body">
          <VariableTokenText text={prompt.body} />
        </p>
      </div>
    </article>
  );
}
