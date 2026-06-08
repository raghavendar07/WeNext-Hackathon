import { Mail, MoreVertical } from "lucide-react";
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

        <button
          type="button"
          aria-label="Campaign actions"
          onClick={(e) => { e.stopPropagation(); alert('Menu: edit/duplicate/delete'); }}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle"
        >
          <MoreVertical size={16} strokeWidth={1.75} />
        </button>
      </div>

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

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-xs border border-line bg-canvas px-2 py-0.5 text-[10px] font-medium text-ink-muted">
      {children}
    </span>
  );
}
