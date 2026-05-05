import { useState } from "react";
import FilterChip from "../../campaigns/FilterChip.jsx";
import Switch from "../../Switch.jsx";
import { SectionedCard, SettingsHeader } from "./SettingsTab.jsx";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DURATIONS = [15, 30, 45, 60, 90];

export default function AvailabilitySection() {
  const [days, setDays] = useState(() =>
    Object.fromEntries(
      DAYS.map((d) => [d, { open: !["Sat", "Sun"].includes(d), start: "09:00", end: "17:00" }]),
    ),
  );
  const [duration, setDuration] = useState(30);
  const [buffer, setBuffer] = useState(15);
  const [maxPerDay, setMaxPerDay] = useState(8);
  const [tz, setTz] = useState("Asia/Kolkata");
  const [notice, setNotice] = useState(2);

  return (
    <div className="flex flex-col gap-5">
      <SettingsHeader
        title="Set your weekly hours"
        description="Configure which time slots accept new appointments."
      />

      <SectionedCard
        title="Working hours"
        description="Toggle each day on or off and set its start and end times."
      >
        <div className="flex flex-col gap-3">
          {DAYS.map((d, idx) => {
            const dayCfg = days[d];
            return (
              <div
                key={d}
                className={[
                  "flex items-center gap-4 pb-3",
                  idx < DAYS.length - 1 ? "border-b border-line" : "",
                ].join(" ")}
              >
                <Switch
                  checked={dayCfg.open}
                  onChange={(open) => setDays({ ...days, [d]: { ...dayCfg, open } })}
                  ariaLabel={`Toggle ${d}`}
                />
                <span className="w-12 text-[13px] font-medium text-ink-heading">{d}</span>
                <input
                  type="time"
                  disabled={!dayCfg.open}
                  value={dayCfg.start}
                  onChange={(e) => setDays({ ...days, [d]: { ...dayCfg, start: e.target.value } })}
                  className="h-9 w-32 rounded-sm border border-line bg-white px-2 text-[12px] text-ink-heading disabled:opacity-50"
                />
                <span className="text-[12px] text-ink-muted">to</span>
                <input
                  type="time"
                  disabled={!dayCfg.open}
                  value={dayCfg.end}
                  onChange={(e) => setDays({ ...days, [d]: { ...dayCfg, end: e.target.value } })}
                  className="h-9 w-32 rounded-sm border border-line bg-white px-2 text-[12px] text-ink-heading disabled:opacity-50"
                />
                {!dayCfg.open && (
                  <span className="inline-flex h-6 items-center rounded-pill bg-surface-muted px-2.5 text-xs font-medium text-ink-muted">
                    Closed
                  </span>
                )}
                {idx === 0 && (
                  <button
                    type="button"
                    className="ml-auto text-[11px] font-semibold text-brand-emerald hover:underline"
                  >
                    Copy to all weekdays
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </SectionedCard>

      <SectionedCard
        title="Default meeting duration"
        description="Customers see this as the suggested length when booking."
      >
        <div className="flex flex-wrap items-center gap-2">
          {DURATIONS.map((d) => (
            <FilterChip
              key={d}
              label={`${d} min`}
              active={duration === d}
              onClick={() => setDuration(d)}
            />
          ))}
          <FilterChip
            label="Custom"
            active={!DURATIONS.includes(duration)}
            onClick={() => setDuration(120)}
          />
        </div>
      </SectionedCard>

      <SectionedCard
        title="Booking rules"
        description="Padding, daily limits, and lead time."
      >
        <Row label="Buffer between meetings">
          <NumberInput value={buffer} onChange={setBuffer} suffix="minutes" />
        </Row>
        <Row label="Max meetings per day">
          <NumberInput value={maxPerDay} onChange={setMaxPerDay} suffix="meetings (0 = no limit)" />
        </Row>
        <Row label="Time zone">
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="h-9 w-[280px] rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-heading"
          >
            <option value="Asia/Kolkata">Indian (IST) — UTC+05:30</option>
            <option value="UTC">UTC — UTC+00:00</option>
            <option value="America/Los_Angeles">Pacific (PST) — UTC-08:00</option>
            <option value="America/New_York">Eastern (EST) — UTC-05:00</option>
          </select>
        </Row>
        <Row label="Booking notice" lastRow>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-ink-body">Customers must book at least</span>
            <NumberInput value={notice} onChange={setNotice} compact />
            <span className="text-[13px] text-ink-body">hours in advance</span>
          </div>
        </Row>
      </SectionedCard>

      <FormFooter />
    </div>
  );
}

function Row({ label, children, lastRow }) {
  return (
    <div className={["flex flex-col gap-2 py-1", lastRow ? "" : "border-b border-line pb-3"].join(" ")}>
      <span className="text-[12px] font-semibold text-ink-heading">{label}</span>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, suffix, compact }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={[
          "h-9 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-heading",
          compact ? "w-[80px]" : "w-[120px]",
        ].join(" ")}
      />
      {suffix && <span className="text-[12px] font-medium text-ink-muted">{suffix}</span>}
    </div>
  );
}

function FormFooter() {
  return (
    <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-line bg-white px-6 py-4">
      <button
        type="button"
        className="rounded-button border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
      >
        Discard
      </button>
      <button
        type="button"
        className="rounded-button bg-cta-gradient px-4 py-2 text-[13px] font-medium text-white"
      >
        Save changes
      </button>
    </div>
  );
}
