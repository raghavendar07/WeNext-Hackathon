import { Eye, MoreHorizontal, Pencil, Workflow } from "lucide-react";

const TYPE_LABEL = {
  manual:       { label: "Manual",     bg: "bg-surface-muted", text: "text-ink-muted" },
  auto:         { label: "Auto",       bg: "bg-info-bg",       text: "text-info" },
  "rule-based": { label: "Rule-based", bg: "bg-brand-50",      text: "text-brand-emerald" },
};

export default function TagCard({ tag }) {
  const typeCfg = TYPE_LABEL[tag.type] ?? TYPE_LABEL.manual;

  return (
    <article className="flex flex-col gap-3 rounded-md border border-line bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-chip">
      <header className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: tag.color }}
          />
          <h3 className="text-[14px] font-semibold text-ink-heading">{tag.name}</h3>
        </div>
        <button
          type="button"
          aria-label="Tag actions"
          onClick={() => alert('Tag actions — mock')}
          className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle"
        >
          <MoreHorizontal size={16} strokeWidth={1.75} />
        </button>
      </header>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[20px] font-bold leading-none text-ink-heading">
            {tag.count.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] font-medium text-ink-muted">contacts</div>
        </div>
        <span
          className={[
            "inline-flex items-center rounded-pill px-2 py-1 text-[10px] font-semibold",
            typeCfg.bg,
            typeCfg.text,
          ].join(" ")}
        >
          {typeCfg.label}
        </span>
      </div>

      <ul className="flex flex-col gap-1.5 border-t border-line pt-3 text-[11px] font-medium text-ink-muted">
        <li>
          Used in <span className="font-semibold text-ink-heading">{tag.automations}</span> automations
        </li>
        <li>
          Used in <span className="font-semibold text-ink-heading">{tag.campaigns}</span> campaigns
        </li>
      </ul>

      <div className="flex items-center gap-2 border-t border-line pt-3">
        <ActionBtn icon={Eye} label="Contacts" />
        <ActionBtn icon={Pencil} label="Edit" />
        <ActionBtn icon={Workflow} label="Trigger" tone="brand" />
      </div>
    </article>
  );
}

function ActionBtn({ icon: Icon, label, tone }) {
  return (
    <button
      type="button"
      onClick={() => alert(label + ' — mock')}
      className={[
        "inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-xs border border-line text-[11px] font-medium",
        tone === "brand"
          ? "border-brand-500 bg-brand-50 text-brand-emerald hover:bg-brand-100"
          : "bg-white text-ink-muted hover:bg-surface-subtle hover:text-ink-heading",
      ].join(" ")}
    >
      <Icon size={12} strokeWidth={1.75} />
      {label}
    </button>
  );
}
