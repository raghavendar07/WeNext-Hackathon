import { MoreHorizontal } from "lucide-react";
import DeltaTile from "./DeltaTile.jsx";

export default function CampaignKpiCard({ title, value, suffix, delta }) {
  return (
    <article className="flex flex-1 flex-col gap-4 rounded-md border border-line bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <header className="flex items-start justify-between gap-2">
        <h3 className="text-[14px] font-medium text-ink-heading">{title}</h3>
        <button
          type="button"
          aria-label="KPI actions"
          onClick={() => alert('KPI actions')}
          className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle"
        >
          <MoreHorizontal size={16} strokeWidth={1.75} />
        </button>
      </header>

      <p className="text-[36px] font-bold leading-none text-ink-heading">
        {formatValue(value, suffix)}
        {suffix && <span className="font-bold">{suffix}</span>}
      </p>

      {delta && (
        <DeltaTile
          direction={delta.direction}
          value={delta.value}
          period={delta.period}
        />
      )}
    </article>
  );
}

function formatValue(value, suffix) {
  if (value == null) return "—";
  if (suffix === "%") {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }
  return value.toLocaleString();
}
