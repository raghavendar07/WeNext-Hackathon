import { useState } from "react";
import { Search, Sparkles, Bell, HelpCircle } from "lucide-react";
import Logo from "./Logo.jsx";

export default function TopNav() {
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white px-4"
      role="banner"
    >
      <div className="flex w-[228px] items-center pl-1">
        <Logo className="h-[24px] w-auto" />
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
      <label className="relative hidden md:block">
        <Search
          size={16}
          strokeWidth={1.75}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-500"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search…"
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              alert(`Searching: ${query}`);
            }
          }}
          className={[
            "h-9 w-64 rounded-lg bg-[#F9FAFB] pl-8 pr-3 text-[13px] text-ink-900 placeholder:text-ink-500",
            "transition-colors duration-150 ease-out",
            "hover:bg-[#F3F4F6] focus:bg-white",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/30",
          ].join(" ")}
        />
      </label>

      <button
        type="button"
        onClick={() => alert("Ask AI — mock")}
        className={[
          "inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-50 px-3 text-[13px] font-medium text-brand-700",
          "transition-colors duration-150 ease-out hover:bg-brand-100",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
        ].join(" ")}
      >
        <Sparkles size={16} strokeWidth={1.75} />
        Ask AI
      </button>

      <IconButton
        label="Notifications"
        onClick={() => {
          setShowNotifications((v) => !v);
          alert("Notifications — mock");
        }}
      >
        <Bell size={20} strokeWidth={1.75} className="text-ink-700" />
      </IconButton>

      <IconButton label="Help" onClick={() => alert("Help — mock")}>
        <HelpCircle size={20} strokeWidth={1.75} className="text-ink-700" />
      </IconButton>

      <button
        type="button"
        aria-label="Profile"
        onClick={() => alert("Profile — mock")}
        className={[
          "ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-[12px] font-semibold text-brand-700",
          "transition-shadow duration-150 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
        ].join(" ")}
      >
        RS
      </button>
      </div>
    </header>
  );
}

function IconButton({ label, children, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-lg",
        "transition-colors duration-150 ease-out hover:bg-[#F9FAFB]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
