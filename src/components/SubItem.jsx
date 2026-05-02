import Badge from "./Badge.jsx";

export default function SubItem({
  icon: Icon,
  iconColor,
  label,
  badge,
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
        "group flex min-h-[36px] w-full items-center gap-[8px] rounded-[8px] py-[8px] pr-[10px] text-left",
        nested ? "pl-[25px]" : "pl-[10px]",
        "transition-colors duration-150 ease-out",
        "focus:outline-none focus-visible:shadow-focus",
        active
          ? "bg-[#E7E8E9] text-[#111827]"
          : "text-[#5E6373] hover:bg-[#F3F4F6]",
      ].join(" ")}
    >
      {Icon && (
        <Icon
          size={18}
          strokeWidth={1.5}
          className={
            active ? "text-[#111827]" : iconColor || "text-[#5E6373]"
          }
          aria-hidden="true"
        />
      )}
      <span className="flex-1 text-[14px] font-semibold leading-none">
        {label}
      </span>
      {badge && <Badge variant={badge} />}
    </button>
  );
}
