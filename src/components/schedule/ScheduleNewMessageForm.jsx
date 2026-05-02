import { Calendar, ChevronDown, Clock } from "lucide-react";

export default function ScheduleNewMessageForm({ form, onChange }) {
  const update = (key) => (e) => onChange({ ...form, [key]: e.target.value });

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-canvas p-4">
      <header className="flex flex-col gap-1">
        <h3 className="text-[14px] font-semibold text-ink-body">
          Schedule New Message
        </h3>
        <p className="text-[12px] font-medium text-ink-muted">
          Pick a date and time to send this message.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <Field label="Message" required>
          <textarea
            value={form.message}
            onChange={update("message")}
            placeholder="Enter message"
            rows={3}
            className="min-h-[80px] w-full rounded-sm border border-line bg-white px-3 py-2 text-[12px] font-medium text-ink-heading shadow-chip placeholder:text-ink-muted focus:outline-none focus:border-line-strong"
          />
        </Field>

        <Field label="Select Date" required>
          <InputShell icon={<Calendar size={16} className="text-ink-muted" strokeWidth={1.75} />}>
            <input
              type="date"
              value={form.date}
              onChange={update("date")}
              placeholder="Select date"
              className="min-w-0 flex-1 bg-transparent text-[12px] font-medium text-ink-heading placeholder:text-ink-muted focus:outline-none"
            />
          </InputShell>
        </Field>

        <Field label="Time Zone" required>
          <InputShell trailing={<ChevronDown size={16} className="text-ink-muted" strokeWidth={1.75} />}>
            <select
              value={form.timezone}
              onChange={update("timezone")}
              className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-[12px] font-medium text-ink-heading focus:outline-none"
            >
              <option value="IST">Indian (IST) - (UTC + 05:30)</option>
              <option value="UTC">UTC - (UTC + 00:00)</option>
              <option value="PST">Pacific (PST) - (UTC - 08:00)</option>
              <option value="EST">Eastern (EST) - (UTC - 05:00)</option>
            </select>
          </InputShell>
        </Field>

        <Field label="Select Time" required>
          <InputShell icon={<Clock size={16} className="text-ink-muted" strokeWidth={1.75} />}>
            <input
              type="time"
              value={form.time}
              onChange={update("time")}
              placeholder="Select time"
              className="min-w-0 flex-1 bg-transparent text-[12px] font-medium text-ink-heading placeholder:text-ink-muted focus:outline-none"
            />
          </InputShell>
        </Field>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12px] font-semibold text-ink-heading">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </span>
      {children}
    </label>
  );
}

function InputShell({ icon, trailing, children }) {
  return (
    <div className="flex h-10 items-center gap-2 rounded-sm border border-line bg-white px-3 shadow-chip focus-within:border-line-strong">
      {icon}
      {children}
      {trailing}
    </div>
  );
}
