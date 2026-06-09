import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ title, onClose, children, footer, size = "md" }) {
  const w =
    size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-md" : "max-w-lg";

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${w} rounded-[14px] bg-white shadow-xl`}
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3.5">
          <h2 className="text-[15px] font-semibold text-[#0F172A]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
