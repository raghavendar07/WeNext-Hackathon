export default function ChannelItem({
  logo: Logo,
  label,
  badge = false,
  active = false,
  nested = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex min-h-[36px] w-full items-center gap-[8px] rounded-[8px] py-[8px] pr-[10px] text-left",
        nested ? "pl-[25px]" : "pl-[10px]",
        "transition-colors duration-150 ease-out",
        "focus:outline-none focus-visible:shadow-focus",
        active
          ? "bg-[#E7E8E9] text-[#111827]"
          : "text-[#5E6373] hover:bg-[#F3F4F6]",
      ].join(" ")}
    >
      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
        {Logo && <Logo size={18} />}
      </span>
      <span className="flex-1 text-[14px] font-semibold leading-none">
        {label}
      </span>
      {badge && (
        <span
          aria-label="notifications"
          className="h-1.5 w-1.5 rounded-full bg-brand-emerald"
        />
      )}
    </button>
  );
}
