import { useEffect, useState } from "react";
import { Download, MoreHorizontal, RefreshCw, Settings } from "lucide-react";
import DeltaTile from "./DeltaTile.jsx";

export default function CampaignKpiCard({ title, value, suffix, delta }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2000); return () => clearTimeout(t); } }, [toast]);

  return (
    <article className="relative flex flex-1 flex-col gap-4 rounded-md border border-line bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <header className="flex items-start justify-between gap-2">
        <h3 className="text-[14px] font-medium text-ink-heading">{title}</h3>
        <div className="relative">
          <button
            type="button"
            aria-label="KPI actions"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle"
          >
            <MoreHorizontal size={16} strokeWidth={1.75} />
          </button>
          <DropdownMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            anchor="right"
            items={[
              { label: "Refresh",   icon: <RefreshCw size={12} />, onClick: () => setToast("Refreshed") },
              { label: "Configure", icon: <Settings size={12} />,  onClick: () => setToast("Configure (mock)") },
              { label: "Export",    icon: <Download size={12} />,  onClick: () => setToast("Exported CSV") },
            ]}
          />
        </div>
      </header>

      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-[8px] bg-[#111827] px-3 py-2 text-[12px] font-semibold text-white shadow-lg">{toast}</div>
      )}

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

function DropdownMenu({ open, onClose, anchor = "right", items }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className={`absolute ${anchor === "right" ? "right-0" : "left-0"} top-full mt-1 z-20 w-44 rounded-[8px] border border-[#E5E7EB] bg-white p-1 shadow-lg`}>
        {items.map((it, i) => it === "divider" ? (
          <div key={i} className="my-1 h-px bg-[#F3F4F6]" />
        ) : (
          <button key={i} onClick={() => { it.onClick?.(); onClose(); }} className={`flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-[12px] font-medium ${it.danger ? "text-red-600 hover:bg-red-50" : "text-[#374151] hover:bg-[#F3F4F6]"}`}>
            {it.icon}{it.label}
          </button>
        ))}
      </div>
    </>
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
