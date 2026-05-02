export default function Kbd({ children }) {
  return (
    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-xs border border-line bg-white px-1 text-[11px] font-medium text-ink-muted">
      {children}
    </span>
  );
}
