import { MoreHorizontal } from "lucide-react";
import StatusPill from "../campaigns/StatusPill.jsx";
import { TEMPLATE_TYPES } from "./templateTypes.js";

export default function TemplateCard({ template }) {
  const config = TEMPLATE_TYPES[template.type] ?? TEMPLATE_TYPES.text;
  const Icon = config.icon;

  return (
    <article className="flex flex-col gap-3 rounded-md border border-line bg-white p-4 shadow-chip">
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
  if (template.type === "text") {
    return (
      <p
        className="line-clamp-3 rounded-xs bg-canvas p-3 text-[12px] font-medium text-ink-body"
        style={{ lineHeight: 1.5 }}
      >
        {template.body}
      </p>
    );
  }
  if (template.type === "location") {
    return (
      <div className="flex flex-col gap-2">
        <div
          className={[
            "flex h-24 items-center justify-center rounded-xs",
            config.tile.bg,
          ].join(" ")}
        >
          <config.icon size={28} className={config.tile.text} strokeWidth={1.75} />
        </div>
        <div className="flex flex-col">
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
    <div className="flex flex-col gap-2">
      <div
        className={[
          "flex h-24 items-center justify-center rounded-xs",
          config.tile.bg,
        ].join(" ")}
      >
        <config.icon size={28} className={config.tile.text} strokeWidth={1.75} />
      </div>
      <span className="truncate text-[11px] font-medium text-ink-muted">
        {template.filename}
      </span>
    </div>
  );
}
