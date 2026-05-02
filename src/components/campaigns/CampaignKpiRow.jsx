import CampaignKpiCard from "./CampaignKpiCard.jsx";

export default function CampaignKpiRow({ kpis, contextLabel }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-stretch gap-3">
        {kpis.map((kpi) => (
          <CampaignKpiCard key={kpi.id} {...kpi} />
        ))}
      </div>
      {contextLabel && (
        <p className="text-[11px] font-medium text-ink-muted">{contextLabel}</p>
      )}
    </div>
  );
}
