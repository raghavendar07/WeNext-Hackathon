import Kbd from "./Kbd.jsx";

export default function KbdHints() {
  return (
    <div className="flex items-center justify-between text-[11px] font-medium text-ink-muted">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <span>Navigate</span>
        </div>
        <div className="flex items-center gap-1">
          <Kbd>↵</Kbd>
          <span>Select</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Kbd>ESC</Kbd>
        <span>Close</span>
      </div>
    </div>
  );
}
