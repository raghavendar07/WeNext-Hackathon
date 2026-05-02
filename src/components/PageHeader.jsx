import { LayoutGrid, List } from "lucide-react";

export default function PageHeader({ title, view = "grid", onChangeView }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-[20px] font-semibold leading-tight text-ink-heading">
        {title}
      </h1>

      <div
        className="inline-flex items-center rounded-sm border border-line-default bg-surface-card p-0.5"
        role="tablist"
        aria-label="View"
      >
        <ViewBtn
          active={view === "grid"}
          onClick={() => onChangeView?.("grid")}
          label="Grid view"
        >
          <LayoutGrid size={16} strokeWidth={1.5} />
        </ViewBtn>
        <ViewBtn
          active={view === "list"}
          onClick={() => onChangeView?.("list")}
          label="List view"
        >
          <List size={16} strokeWidth={1.5} />
        </ViewBtn>
      </div>
    </div>
  );
}

function ViewBtn({ active, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      aria-label={label}
      className={[
        "inline-flex h-7 w-8 items-center justify-center rounded-xs",
        "transition-colors duration-150 ease-out",
        active
          ? "bg-brand-50 text-brand-emerald"
          : "text-ink-muted hover:bg-surface-muted hover:text-ink-body",
        "focus:outline-none focus-visible:shadow-focus",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
