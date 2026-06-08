import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
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

  const [tipOpen, setTipOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!tipOpen) return;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setTipOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [tipOpen]);

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
        <div className="flex items-center gap-1.5">
          <div
            className="text-[11px] font-semibold uppercase leading-none"
            style={{ color: "rgba(255,255,255,0.75)", letterSpacing: "0.6px" }}
          >
            {planName}
          </div>

          {description && (
            <div ref={wrapRef} className="relative inline-flex">
              <button
                type="button"
                aria-label="More info about your plan"
                aria-expanded={tipOpen}
                onClick={() => setTipOpen((v) => !v)}
                onMouseEnter={() => setTipOpen(true)}
                onMouseLeave={() => setTipOpen(false)}
                onFocus={() => setTipOpen(true)}
                onBlur={() => setTipOpen(false)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:shadow-focus"
              >
                <Info size={12} strokeWidth={2} />
              </button>

              {tipOpen && (
                <div
                  role="tooltip"
                  className="absolute left-1/2 top-full z-30 mt-2 w-[200px] -translate-x-1/2 rounded-[8px] bg-[#111827] px-2.5 py-2 text-[11px] leading-[1.45] text-white shadow-lg"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#111827]"
                  />
                  {description}
                </div>
              )}
            </div>
          )}
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
