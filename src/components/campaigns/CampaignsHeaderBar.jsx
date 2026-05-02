import { Plus } from "lucide-react";
import DropdownSelect from "./DropdownSelect.jsx";

export default function CampaignsHeaderBar({
  status,
  statusOptions,
  onStatusChange,
  onNew,
}) {
  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-semibold text-ink-heading">
          Campaigns
        </h1>
        <p className="text-[13px] font-medium text-ink-muted">
          Create and manage WhatsApp marketing campaigns
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <DropdownSelect
          value={status}
          options={statusOptions}
          onChange={onStatusChange}
          ariaLabel="Filter by status"
        />
        <button
          type="button"
          onClick={onNew}
          className="inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white shadow-[0_0_10px_rgba(1,170,154,0.3)]"
        >
          <Plus size={14} strokeWidth={2} />
          New Campaign
        </button>
      </div>
    </header>
  );
}
