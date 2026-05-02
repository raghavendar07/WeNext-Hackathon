import planBg from "../assets/plan-bg.png";

export default function PlanCard({
  planName = "Pro trial",
  usedCredits = 820,
  totalCredits = 1000,
  description = "Upgrade to Pro for more credits and advanced AI features.",
  ctaLabel = "Upgrade",
  onCta,
}) {
  const pct = Math.min(
    100,
    Math.max(0, (usedCredits / totalCredits) * 100)
  );

  return (
    <div
      className="relative overflow-hidden rounded-[14px] p-[14px]"
      style={{
        backgroundImage: `url(${planBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      role="region"
      aria-label="Plan and credits"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.5))",
        }}
      />

      <div className="relative">
        <div
          className="text-[11px] font-semibold uppercase leading-none"
          style={{ color: "rgba(255,255,255,0.75)", letterSpacing: "0.6px" }}
        >
          {planName}
        </div>

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-[22px] font-semibold leading-none text-white">
            {usedCredits.toLocaleString()}
            <span
              className="font-medium"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {" "}
              / {totalCredits.toLocaleString()}
            </span>
          </span>
          <span
            className="text-[11px] font-medium leading-none"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            credits
          </span>
        </div>

        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.25)" }}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #34D399, #10B981)",
            }}
          />
        </div>

        {description && (
          <p
            className="mt-2 text-[11px] leading-[1.45]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {description}
          </p>
        )}

        <button
          type="button"
          onClick={onCta}
          className={[
            "mt-3 flex h-9 w-full items-center justify-center rounded-[8px]",
            "text-[13px] font-medium text-white",
            "transition-all duration-150 ease-out hover:bg-white/25",
            "focus:outline-none focus-visible:shadow-focus",
          ].join(" ")}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
