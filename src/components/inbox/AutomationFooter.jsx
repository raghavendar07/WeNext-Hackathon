import { Info } from "lucide-react";

export default function AutomationFooter({
  flowName = "Delivery Status Flow",
  onTakeOver,
}) {
  return (
    <footer className="flex items-center justify-between border-t border-[#F0F2F5] px-[30px] py-5">
      <div className="flex items-start gap-[5px]">
        <Info size={16} className="mt-[2px] shrink-0 text-ink-muted" strokeWidth={1.75} />
        <div className="flex flex-col">
          <p className="text-[14px] leading-snug text-[#08090A]">
            <span className="font-semibold text-brand-emerald">
              "{flowName}"
            </span>
            <span className="font-medium"> is running on this chat</span>
          </p>
          <p className="text-[12px] font-medium text-ink-muted">
            Messages are being sent automatically. You can watch but not reply.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onTakeOver}
        className={[
          "shrink-0 rounded-[6px] bg-cta-gradient px-[15px] py-[12px]",
          "text-[14px] font-medium text-white",
          "transition-opacity duration-150 ease-out hover:opacity-95",
          "focus:outline-none focus-visible:shadow-focus",
        ].join(" ")}
      >
        Take over and Reply Yourself
      </button>
    </footer>
  );
}
