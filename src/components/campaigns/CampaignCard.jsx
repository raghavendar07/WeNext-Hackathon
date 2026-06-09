import { useEffect, useState } from "react";
import { Copy, Eye, Mail, MoreVertical, Pencil, Trash2 } from "lucide-react";
import StatusPill from "./StatusPill.jsx";
import KPIMetric from "./KPIMetric.jsx";

const CATEGORY_TINTS = {
  email:    { bg: "bg-warning-bg",          text: "text-warning" },
  whatsapp: { bg: "bg-channel-whatsappBg",  text: "text-channel-whatsappText" },
  sms:      { bg: "bg-channel-facebookBg",  text: "text-channel-facebookText" },
  social:   { bg: "bg-channel-instagramBg", text: "text-channel-instagramText" },
  push:     { bg: "bg-info-bg",             text: "text-info" },
};

export default function CampaignCard({ campaign }) {
  const tint = CATEGORY_TINTS[campaign.category] ?? CATEGORY_TINTS.email;
  const Icon = campaign.icon ?? Mail;
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2000); return () => clearTimeout(t); } }, [toast]);

  return (
    <article className="flex flex-col gap-4 rounded-md border border-line bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Row 1 — identity + menu */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-sm",
              tint.bg,
            ].join(" ")}
          >
            <Icon size={20} className={tint.text} strokeWidth={1.75} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-[14px] font-semibold text-ink-heading">
                {campaign.title}
              </h3>
              <StatusPill status={campaign.status} />
            </div>
            {campaign.tags?.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                {campaign.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Campaign actions"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle"
          >
            <MoreVertical size={16} strokeWidth={1.75} />
          </button>
          <DropdownMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            anchor="right"
            items={[
              { label: "View",      icon: <Eye size={12} />,    onClick: () => setToast("Opening campaign…") },
              { label: "Edit",      icon: <Pencil size={12} />, onClick: () => setToast("Opening editor…") },
              { label: "Duplicate", icon: <Copy size={12} />,   onClick: () => setToast("Campaign duplicated") },
              "divider",
              { label: "Delete",    icon: <Trash2 size={12} />, onClick: () => setToast("Campaign deleted"), danger: true },
            ]}
          />
        </div>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-[8px] bg-[#111827] px-3 py-2 text-[12px] font-semibold text-white shadow-lg">{toast}</div>
      )}

      {/* Row 2 — KPI metrics */}
      <div className="flex divide-x divide-line">
        <KPIMetric value={campaign.kpis.delivered} name="Delivered" />
        <KPIMetric value={campaign.kpis.opened}    name="Opened" />
        <KPIMetric value={campaign.kpis.clicked}   name="Clicked" />
        <KPIMetric value={campaign.kpis.converted} name="Converted" />
      </div>
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

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-xs border border-line bg-canvas px-2 py-0.5 text-[10px] font-medium text-ink-muted">
      {children}
    </span>
  );
}
