import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import DetailDrawer from "../DetailDrawer.jsx";
import ScheduleMessageTabs from "./ScheduleMessageTabs.jsx";
import ScheduleNewMessageForm from "./ScheduleNewMessageForm.jsx";
import ScheduledMessagesList from "./ScheduledMessagesList.jsx";

const SEED_SCHEDULED = [
  {
    id: "s1",
    date: "05 APR",
    message: "Reminder: your renewal kicks in tomorrow at 10:00 AM IST.",
    time: "5:00 PM",
    relative: "Today",
    tone: "info",
  },
  {
    id: "s2",
    date: "04 APR",
    message: "Thanks for reaching out! Our team will respond by tomorrow.",
    time: "9:30 AM",
    relative: "Yesterday",
    tone: "warning",
  },
  {
    id: "s3",
    date: "23 MAR",
    message: "Welcome aboard! Here's your onboarding guide.",
    time: "11:15 AM",
    relative: "12 days ago",
    tone: "success",
  },
];

export default function ScheduleMessageDrawer({ open, onClose }) {
  const [tab, setTab] = useState("new");
  const [form, setForm] = useState({
    message: "",
    date: "",
    timezone: "IST",
    time: "",
  });
  const [scheduled, setScheduled] = useState(SEED_SCHEDULED);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!open) {
      setTab("new");
      setForm({ message: "", date: "", timezone: "IST", time: "" });
    }
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const isValid =
    form.message.trim() && form.date && form.timezone && form.time;

  const handleSchedule = () => {
    if (!isValid) return;
    const dateLabel = formatDateLabel(form.date);
    const timeLabel = formatTimeLabel(form.time);
    const id = `s-${Date.now()}`;
    setScheduled((prev) => [
      {
        id,
        date: dateLabel.short,
        message: form.message,
        time: timeLabel,
        relative: "Today",
        tone: "info",
      },
      ...prev,
    ]);
    setToast(`Message scheduled for ${dateLabel.long} at ${timeLabel}`);
    setForm({ message: "", date: "", timezone: form.timezone, time: "" });
    setTab("list");
  };

  return (
    <DetailDrawer open={open} onClose={onClose} ariaLabel="Schedule message">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-4">
        <h2 className="text-[18px] font-semibold text-ink-heading">
          Schedule Message
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close drawer"
          className="inline-flex h-7 w-7 items-center justify-center text-ink-muted hover:text-ink-heading"
        >
          <XCircle size={20} strokeWidth={1.75} />
        </button>
      </header>

      <div className="border-b border-line px-5">
        <ScheduleMessageTabs active={tab} onChange={setTab} />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {tab === "new" ? (
          <ScheduleNewMessageForm form={form} onChange={setForm} />
        ) : (
          <ScheduledMessagesList
            messages={scheduled}
            onCreateNew={() => setTab("new")}
          />
        )}
      </div>

      {tab === "new" && (
        <footer className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-line bg-white px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-button border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSchedule}
            disabled={!isValid}
            className={[
              "rounded-button bg-cta-gradient px-4 py-2 text-[13px] font-medium text-white",
              isValid ? "hover:opacity-95" : "opacity-50 cursor-not-allowed",
            ].join(" ")}
          >
            Schedule Send
          </button>
        </footer>
      )}

      {toast && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 rounded-sm border border-line bg-ink-body px-3 py-2 text-[12px] font-medium text-white shadow-float">
          {toast}
        </div>
      )}
    </DetailDrawer>
  );
}

function formatDateLabel(iso) {
  if (!iso) return { short: "", long: "" };
  const d = new Date(iso);
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const monthsLong = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const day = String(d.getDate()).padStart(2, "0");
  return {
    short: `${day} ${months[d.getMonth()]}`,
    long: `${monthsLong[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
  };
}

function formatTimeLabel(value) {
  if (!value) return "";
  const [h, m] = value.split(":").map(Number);
  const hour12 = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
}
