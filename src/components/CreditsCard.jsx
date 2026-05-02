import { Plus, Gift } from "lucide-react";

export default function CreditsCard({
  credits = 5,
  total = 50,
  onUpgrade,
  onBuy,
  onShare,
}) {
  const pct = Math.min(100, Math.max(0, (credits / total) * 100));

  return (
    <div className="space-y-2">
      <div className="px-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[12px] font-medium text-[#6B7280]">
            Credits
          </span>
          <span className="text-[12px] font-semibold text-[#111827]">
            {credits} left
          </span>
        </div>
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]"
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-brand-emerald"
            style={{ width: `${pct}%` }}
          />
        </div>

        <button
          type="button"
          onClick={onUpgrade}
          className={[
            "mt-3 flex h-9 w-full items-center justify-center rounded-button",
            "bg-cta-gradient text-[13px] font-medium text-white",
            "transition-all duration-150 ease-out hover:opacity-95",
            "focus:outline-none focus-visible:shadow-focus",
          ].join(" ")}
        >
          Upgrade
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <SecondaryRow icon={Plus} label="Buy credits" onClick={onBuy} />
        <SecondaryRow
          icon={Gift}
          label="Share Wenext"
          hint="+100"
          onClick={onShare}
        />
      </div>
    </div>
  );
}

function SecondaryRow({ icon: Icon, label, hint, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left",
        "transition-colors duration-150 ease-out hover:bg-[#F1F5F9]",
        "focus:outline-none focus-visible:shadow-focus",
      ].join(" ")}
      style={{ letterSpacing: "0.6px" }}
    >
      {Icon && (
        <Icon
          size={16}
          strokeWidth={1.5}
          className="text-side-itemIcon"
          aria-hidden="true"
        />
      )}
      <span className="flex-1 text-[12px] font-semibold leading-none text-side-itemText">
        {label}
      </span>
      {hint && (
        <span className="text-[11px] font-semibold text-brand-emerald">
          {hint}
        </span>
      )}
    </button>
  );
}
