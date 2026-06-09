import { useEffect, useRef, useState } from "react";
import {
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Printer,
  Search,
  Settings,
  X,
} from "lucide-react";

const SERVICE_TYPES = ["All services", "Consultation", "Demo", "Follow-up", "Onboarding", "Support"];
const STAFF_OPTIONS = ["All staff", "Anita", "Vikram", "Sneha", "Karthik"];
const STATUS_OPTIONS = ["All", "Confirmed", "Pending", "Cancelled", "Completed"];
const SERVICE_DURATIONS = [15, 30, 45, 60];

export default function CalendarPageHeader({ query, onQueryChange }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold leading-tight text-ink-heading">
          Calendar
        </h1>
        <p className="text-[13px] font-medium text-ink-muted">
          Stay organized and on track with your personalized schedule
        </p>
      </div>
      <div className="flex items-center gap-2">
        <label className="flex h-9 w-[240px] items-center gap-2 rounded-sm border border-line bg-white px-3">
          <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
          <input
            type="text"
            value={query ?? ""}
            onChange={(e) => onQueryChange?.(e.target.value)}
            placeholder="Search..."
            className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
        </label>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
        >
          <Filter size={14} strokeWidth={1.75} />
          Filter
        </button>
        <MoreActionsMenu open={menuOpen} setOpen={setMenuOpen} />
        <button
          type="button"
          onClick={() => setNewOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-sm bg-cta-gradient px-3 text-[13px] font-medium text-white"
        >
          <Plus size={14} strokeWidth={2} />
          New
        </button>
      </div>

      {filtersOpen && <FiltersModal onClose={() => setFiltersOpen(false)} />}
      {newOpen && <NewAppointmentModal onClose={() => setNewOpen(false)} />}
    </header>
  );
}

function MoreActionsMenu({ open, setOpen }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="More actions"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white text-ink-muted hover:bg-surface-subtle"
      >
        <MoreHorizontal size={16} strokeWidth={1.75} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-[200px] rounded-md border border-line bg-white shadow-chip">
          <MenuItem icon={Download} label="Export schedule" onClick={() => setOpen(false)} />
          <MenuItem icon={Printer} label="Print" onClick={() => setOpen(false)} />
          <MenuItem icon={Settings} label="Settings" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
    >
      <Icon size={14} strokeWidth={1.75} className="text-ink-muted" />
      {label}
    </button>
  );
}

function FiltersModal({ onClose }) {
  const [service, setService] = useState(SERVICE_TYPES[0]);
  const [staff, setStaff] = useState(STAFF_OPTIONS[0]);
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);

  const reset = () => {
    setService(SERVICE_TYPES[0]);
    setStaff(STAFF_OPTIONS[0]);
    setStatus(STATUS_OPTIONS[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-[14px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="text-[15px] font-semibold text-ink-heading">Filters</div>
          <button onClick={onClose} className="rounded p-1.5 text-ink-muted hover:bg-surface-subtle">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4 px-5 py-5">
          <ModalSelect label="Service type" value={service} onChange={setService} options={SERVICE_TYPES} />
          <ModalSelect label="Staff" value={staff} onChange={setStaff} options={STAFF_OPTIONS} />
          <ModalSelect label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3.5">
          <button
            type="button"
            onClick={reset}
            className="rounded-button border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-button bg-cta-gradient px-4 py-2 text-[13px] font-medium text-white"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function NewAppointmentModal({ onClose, prefill }) {
  const [customer, setCustomer] = useState("");
  const [service, setService] = useState(SERVICE_TYPES[1]);
  const [date, setDate] = useState(prefill?.date ?? "");
  const [time, setTime] = useState(prefill?.time ?? "");
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-[14px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="text-[15px] font-semibold text-ink-heading">New appointment</div>
          <button onClick={onClose} className="rounded p-1.5 text-ink-muted hover:bg-surface-subtle">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4 px-5 py-5">
          <ModalField label="Customer name">
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="e.g. Aisha Khan"
              className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading focus:outline-none focus:border-brand-emerald"
            />
          </ModalField>
          <ModalSelect label="Service" value={service} onChange={setService} options={SERVICE_TYPES.slice(1)} />
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading focus:outline-none focus:border-brand-emerald"
              />
            </ModalField>
            <ModalField label="Time">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] text-ink-heading focus:outline-none focus:border-brand-emerald"
              />
            </ModalField>
          </div>
          <ModalField label="Duration">
            <div className="flex flex-wrap gap-2">
              {SERVICE_DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={[
                    "h-9 rounded-sm border px-3 text-[12px] font-medium",
                    duration === d
                      ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                      : "border-line bg-white text-ink-body hover:bg-surface-subtle",
                  ].join(" ")}
                >
                  {d} min
                </button>
              ))}
            </div>
          </ModalField>
          <ModalField label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional notes..."
              className="w-full rounded-sm border border-line bg-white p-3 text-[13px] text-ink-heading focus:outline-none focus:border-brand-emerald"
            />
          </ModalField>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-button border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-button bg-cta-gradient px-4 py-2 text-[13px] font-medium text-white"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-ink-heading">{label}</span>
      {children}
    </div>
  );
}

function ModalSelect({ label, value, onChange, options }) {
  return (
    <ModalField label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-heading focus:outline-none focus:border-brand-emerald"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </ModalField>
  );
}

export { NewAppointmentModal };
