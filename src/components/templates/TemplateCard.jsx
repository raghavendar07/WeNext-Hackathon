import { MoreHorizontal } from "lucide-react";
import StatusPill from "../campaigns/StatusPill.jsx";
import { TEMPLATE_TYPES } from "./templateTypes.js";

export default function TemplateCard({ template }) {
  const config = TEMPLATE_TYPES[template.type] ?? TEMPLATE_TYPES.text;
  const Icon = config.icon;

  return (
    <article className="flex flex-col gap-3 rounded-md border border-line bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <header className="flex items-center justify-between gap-2">
        <span
          className={[
            "inline-flex items-center gap-1 rounded-pill px-2 py-1 text-[10px] font-semibold",
            config.tile.bg,
            config.tile.text,
          ].join(" ")}
        >
          <Icon size={12} strokeWidth={1.75} />
          {config.label}
        </span>
        <StatusPill status={template.status} />
      </header>

      <Preview template={template} config={config} />

      <footer className="flex items-center justify-between border-t border-line pt-3">
        <div className="flex flex-col text-[11px] text-ink-muted">
          <span className="font-medium text-ink-heading">{template.name}</span>
          <span>Updated {template.updated}</span>
        </div>
        <button
          type="button"
          aria-label="Template actions"
          className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle"
        >
          <MoreHorizontal size={16} strokeWidth={1.75} />
        </button>
      </footer>
    </article>
  );
}

function Preview({ template, config }) {
  const Icon = config.icon;
  const baseClass =
    "flex h-[140px] items-center justify-start rounded-xs bg-canvas p-3";

  if (template.type === "text") {
    return (
      <div className={baseClass}>
        <p
          className="line-clamp-3 text-[12px] font-medium text-ink-body"
          style={{ lineHeight: 1.5 }}
        >
          {template.body}
        </p>
      </div>
    );
  }

  if (template.type === "location") {
    return (
      <div className={`${baseClass} flex-col justify-center gap-2`}>
        <Icon size={28} className={config.tile.text} strokeWidth={1.75} />
        <div className="flex flex-col items-center text-center">
          <span className="text-[12px] font-semibold text-ink-heading">
            {template.placeName}
          </span>
          <span className="text-[11px] font-medium text-ink-muted">
            {template.address}
          </span>
        </div>
      </div>
    );
  }

  // image / video / document
  return (
    <div className={`${baseClass} flex-col justify-center gap-2`}>
      <Icon size={28} className={config.tile.text} strokeWidth={1.75} />
      <span className="truncate text-[11px] font-medium text-ink-muted">
        {template.filename}
      </span>
    </div>
  );
}
