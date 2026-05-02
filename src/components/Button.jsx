const SIZE = {
  sm: "h-[30px] px-2 text-[13px]",
  md: "h-10 px-3 text-[14px]",
  lg: "h-12 px-4 text-[15px]",
};

const VARIANT = {
  primary:
    "bg-cta-gradient text-white hover:opacity-95 focus-visible:shadow-focus",
  secondary:
    "bg-transparent border border-brand-emerald text-brand-emerald hover:bg-brand-50 focus-visible:shadow-focus",
  tertiary:
    "bg-transparent text-ink-muted hover:bg-surface-muted focus-visible:shadow-focus",
  destructive:
    "bg-danger text-white hover:opacity-95 focus-visible:shadow-focus",
  subtle:
    "bg-surface-muted text-ink-body hover:bg-line-default focus-visible:shadow-focus",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  children,
  className = "",
  ...rest
}) {
  return (
    <button
      type="button"
      className={[
        "inline-flex items-center justify-center gap-1.5 rounded-button font-medium",
        "transition-all duration-150 ease-out focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
        SIZE[size],
        VARIANT[variant],
        className,
      ].join(" ")}
      {...rest}
    >
      {Icon && <Icon size={16} strokeWidth={1.5} aria-hidden="true" />}
      {children}
    </button>
  );
}
