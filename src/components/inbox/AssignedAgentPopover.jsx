import { useState } from "react";
import { UserCog, UserMinus, X } from "lucide-react";
import DropdownPopover, { PopoverItem } from "./DropdownPopover.jsx";

export default function AssignedAgentPopover({
  open,
  onClose,
  anchorRef,
  agentName = "Anita",
  onTakeOver,
  onRemove,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleTakeOver = () => {
    onClose?.();
    if (onTakeOver) {
      onTakeOver();
    } else {
      alert(`You took over from ${agentName}`);
    }
  };

  const handleRemoveClick = () => {
    onClose?.();
    setConfirmOpen(true);
  };

  const handleConfirmRemove = () => {
    setConfirmOpen(false);
    if (onRemove) {
      onRemove();
    } else {
      alert(`Removed ${agentName} (mock)`);
    }
  };

  return (
    <>
      <DropdownPopover open={open} onClose={onClose} anchorRef={anchorRef}>
        <PopoverItem
          icon={<UserCog size={14} className="text-ink-muted" strokeWidth={1.75} />}
          label={`Take over from ${agentName}`}
          onClick={handleTakeOver}
        />
        <PopoverItem
          icon={<UserMinus size={14} className="text-danger" strokeWidth={1.75} />}
          label="Remove Agent"
          danger
          onClick={handleRemoveClick}
        />
      </DropdownPopover>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] rounded-md border border-line bg-white p-5 shadow-card"
          >
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-[15px] font-semibold text-ink-heading">
                Remove agent?
              </h3>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-ink-muted hover:bg-canvas"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-[13px] text-ink-body">
              They will no longer receive messages.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="inline-flex h-9 items-center rounded-button border border-line bg-white px-4 text-[12px] font-medium text-ink-body"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="inline-flex h-9 items-center rounded-button bg-danger px-4 text-[12px] font-semibold text-white hover:opacity-90"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
