export default function Switch({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange?.(!checked)}
      className={[
        "relative inline-flex h-[20px] w-9 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-brand-emerald" : "bg-line-strong",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-[16px] w-[16px] rounded-full bg-white shadow transition-all duration-200 ease-out",
          checked ? "translate-x-[18px]" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}
