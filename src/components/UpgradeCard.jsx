export default function UpgradeCard({
  plan = "Pro trial",
  usedGb = 18.2,
  totalGb = 20,
  onUpgrade,
}) {
  const pct = Math.min(100, Math.max(0, (usedGb / totalGb) * 100));

  return (
    <div
      className="rounded-xl border border-[#E5E7EB] bg-[#E6F7EC] p-[14px]"
      role="region"
      aria-label="Plan and usage"
    >
      <div className="text-[12px] text-[#6B7280]">Current plan</div>
      <div className="mt-0.5 text-[14px] font-semibold text-[#111827]">
        {plan}
      </div>

      <div className="mt-3 text-[12px] text-[#6B7280]">
        {usedGb} GB of {totalGb} GB used
      </div>
      <div
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[#0EB64F]"
          style={{ width: `${pct}%` }}
        />
      </div>

      <button
        type="button"
        onClick={onUpgrade}
        className={[
          "mt-3 flex h-9 w-full items-center justify-center rounded-lg",
          "border border-[#D1D5DB] bg-white text-[13px] font-medium text-[#111827]",
          "transition-colors duration-150 ease-out hover:bg-[#F9FAFB]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
        ].join(" ")}
      >
        Upgrade to Pro
      </button>
    </div>
  );
}
