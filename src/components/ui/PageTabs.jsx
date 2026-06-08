export default function PageTabs({ tabs, active, onChange }) {
  return (
    <div className="flex w-full items-center gap-[32px] border-b border-[#EBEEF2]">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange?.(tab.id)}
            aria-current={isActive ? "page" : undefined}
            className={[
              "-mb-px border-b-2 py-3 text-sm font-medium",
              "transition-colors duration-150 ease-out",
              "focus:outline-none focus-visible:shadow-focus",
              isActive
                ? "border-[#1EB677] text-[#1EB677]"
                : "border-transparent text-[#6A6A6A] hover:text-[#222222] hover:border-[#EBEEF2]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
