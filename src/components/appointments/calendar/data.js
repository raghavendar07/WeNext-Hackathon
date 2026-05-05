// Seed events for a fixed Monday-to-Sunday week. The week date labels are
// derived dynamically based on the current date, but events stay anchored to
// fixed weekday/time offsets so the demo always reads.

export const TIME_RANGE = { start: 6, end: 20 }; // 06:00 → 20:00
export const ROW_HEIGHT = 80; // px per hour
export const TIME_COL_W = 70; // px
export const EVENT_MIN_H = 40; // px
export const EVENT_BAR_W = 4; // px
export const WORK_HOURS = { start: 8, end: 18 };

export const EVENTS = [
  // Mon
  { id: "e1",  day: 0, start: 8.0,  end: 9.0,  title: "Client Presentation Preparation", category: "consultation", status: "confirmed", customer: "Aisha Khan" },
  { id: "e2",  day: 0, start: 9.0,  end: 10.5, title: "Client Meeting Planning",         category: "demo",         status: "confirmed", customer: "Rahul Verma" },
  { id: "e3",  day: 0, start: 11.0, end: 12.0, title: "Meetup with UI8 internal Team",   category: "follow-up",    status: "confirmed", customer: "Internal Team" },
  // Tue
  { id: "e4",  day: 1, start: 9.0,  end: 10.0, title: "Design Revisions",                category: "demo",         status: "confirmed", customer: "Sneha Iyer" },
  { id: "e5",  day: 1, start: 11.0, end: 12.5, title: "Client Feedback Meeting",         category: "consultation", status: "pending",   customer: "Karthik Rao" },
  { id: "e6",  day: 1, start: 12.0, end: 13.0, title: "Meetup with Gojek internal team", category: "follow-up",    status: "confirmed", customer: "Gojek" },
  // Wed
  { id: "e7",  day: 2, start: 8.0,  end: 9.0,  title: "New Project Kickoff Meeting",     category: "consultation", status: "confirmed", customer: "Lakshmi R" },
  { id: "e8",  day: 2, start: 9.0,  end: 10.0, title: "Design Refinement",               category: "demo",         status: "confirmed", customer: "Priya Menon" },
  { id: "e9",  day: 2, start: 10.0, end: 11.0, title: "Collaboration with Dev Team",     category: "onboarding",   status: "confirmed", customer: "Engineering" },
  { id: "e10", day: 2, start: 12.0, end: 13.5, title: "Client Meeting Progress report",  category: "demo",         status: "confirmed", customer: "Manoj Pillai" },
  // Thu
  { id: "e11", day: 3, start: 8.5,  end: 10.0, title: "Design Team Stand-up Meeting",    category: "follow-up",    status: "confirmed", customer: "Design" },
  { id: "e12", day: 3, start: 11.0, end: 12.0, title: "Industry Webinar / Workshop",     category: "support",      status: "confirmed", customer: "External" },
  // Fri
  { id: "e13", day: 4, start: 9.0,  end: 10.0, title: "Final Touches on Client Project", category: "onboarding",   status: "confirmed", customer: "Ananya Gupta" },
  { id: "e14", day: 4, start: 14.0, end: 15.5, title: "Tidalwave Consult",               category: "consultation", status: "confirmed", customer: "Omar Sayeed" },
  // Sat
  { id: "e15", day: 5, start: 9.0,  end: 10.0, title: "Planning & Goal Setting",         category: "consultation", status: "pending",   customer: "Team" },
  { id: "e16", day: 5, start: 10.0, end: 11.0, title: "Meetup with Adobe internal team", category: "follow-up",    status: "confirmed", customer: "Adobe" },
];

export function weekDates(refDate = new Date()) {
  const d = new Date(refDate);
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  d.setDate(d.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(d);
    dt.setDate(d.getDate() + i);
    return dt;
  });
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export function formatDayHeader(date, idx) {
  return `${date.getDate()} - ${DAY_NAMES[idx]}`;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export function formatRangeLabel(dates) {
  if (!dates?.length) return "";
  const first = dates[0];
  const last = dates[dates.length - 1];
  const day = (n) => String(n).padStart(2, "0");
  if (first.getMonth() === last.getMonth()) {
    return `${day(first.getDate())}–${day(last.getDate())} ${MONTHS[first.getMonth()]} ${first.getFullYear()}`;
  }
  return `${day(first.getDate())} ${MONTHS[first.getMonth()]} – ${day(last.getDate())} ${MONTHS[last.getMonth()]} ${last.getFullYear()}`;
}

export function formatTimeOfDay(decimal) {
  const hour = Math.floor(decimal);
  const minute = Math.round((decimal - hour) * 60);
  const ampm = hour >= 12 ? "pm" : "am";
  const h12 = ((hour + 11) % 12) + 1;
  return `${h12}:${String(minute).padStart(2, "0")}${ampm}`;
}
