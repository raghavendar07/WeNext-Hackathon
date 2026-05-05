import { MessageSquarePlus, PanelLeft, Search } from "lucide-react";

const STATUS = {
  draft:        { label: "Draft",        edge: "bg-ink-subtle",      text: "text-ink-muted" },
  "in-progress":{ label: "In-Progress",  edge: "bg-warning",         text: "text-warning" },
  sent:         { label: "Sent",         edge: "bg-brand-emerald",   text: "text-brand-emerald" },
  scheduled:    { label: "Scheduled",    edge: "bg-info",            text: "text-info" },
  failed:       { label: "Failed",       edge: "bg-danger",          text: "text-danger" },
};

const ITEMS = {
  today: [
    { id: "h1", title: "Diwali sale — 25% off new collection", status: "in-progress", meta: "edited 2m ago" },
    { id: "h2", title: "New saree drops weekly digest",        status: "sent",        meta: "340 / 1248 Contacts" },
    { id: "h3", title: "Karva Chauth combo offer",             status: "scheduled",   meta: "tomorrow 9:00 AM" },
    { id: "h4", title: "Welcome flow — first-time buyer",      status: "draft",       meta: "edited 12m ago" },
  ],
  recents: [
    { id: "h5", title: "Festive lehenga restock",              status: "sent",        meta: "3 days ago" },
    { id: "h6", title: "Cart abandonment nudge",               status: "failed",      meta: "5 days ago" },
    { id: "h7", title: "Birthday surprise — 15% off",          status: "sent",        meta: "1 week ago" },
  ],
};

export default function CampaignsHistorySidebar({
  activeId,
  onSelect,
  onNewCampaign,
  onCollapse,
  query,
  onQueryChange,
}) {
  const filterFn = (item) => {
    const q = (query ?? "").trim().toLowerCase();
    if (!q) return true;
    return item.title.toLowerCase().includes(q);
  };

  return (
    <aside className="flex w-[300px] shrink-0 flex-col gap-7 rounded-md border border-line bg-white p-5">
      <div className="flex items-center justify-start">
        <button
          type="button"
          aria-label="Close campaigns history"
          aria-pressed
          onClick={onCollapse}
          className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-xs bg-brand-50 text-brand-emerald transition-colors hover:bg-brand-100"
        >
          <PanelLeft size={20} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onNewCampaign}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-button bg-cta-gradient text-[13px] font-medium text-white"
        >
          <MessageSquarePlus size={16} strokeWidth={1.75} />
          New Campaign
        </button>
        <label className="flex h-10 w-full items-center gap-2 rounded-pill border border-line bg-canvas px-3 shadow-chip">
          <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
          <input
            type="text"
            value={query ?? ""}
            onChange={(e) => onQueryChange?.(e.target.value)}
            placeholder="Search Campaign"
            className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-muted focus:outline-none"
          />
        </label>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto">
        <Group label="Today" items={ITEMS.today.filter(filterFn)} activeId={activeId} onSelect={onSelect} />
        <Group label="Recents" items={ITEMS.recents.filter(filterFn)} activeId={activeId} onSelect={onSelect} />
      </div>
    </aside>
  );
}

function Group({ label, items, activeId, onSelect }) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[12px] font-medium text-ink-muted">{label}</h3>
      <div className="flex flex-col gap-3.5">
        {items.map((item) => {
          const cfg = STATUS[item.status] ?? STATUS.draft;
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(item.id)}
              className={[
                "flex items-start gap-2.5 rounded-xs px-1 py-1.5 text-left transition-colors",
                isActive ? "bg-brand-50" : "hover:bg-surface-subtle",
              ].join(" ")}
            >
              <span
                aria-hidden
                className={["mt-1 h-2.5 w-1 shrink-0 rounded-pill", cfg.edge].join(" ")}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-[13px] font-medium text-ink-heading">
                  {item.title}
                </span>
                <div className="flex items-center gap-2 text-[11px] font-medium">
                  <span className={cfg.text}>{cfg.label}</span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-ink-subtle" />
                  <span className="truncate text-ink-muted">{item.meta}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
