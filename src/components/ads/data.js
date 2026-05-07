export const CHANNELS = [
  {
    id: "meta",
    label: "Meta",
    sublabel: "Facebook + Instagram",
    bestFor: "Best for retail, restaurants, B2C brands",
    connected: true,
    color: "#1877F2",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    sublabel: "Professionals",
    bestFor: "Best for B2B, professional services",
    connected: false,
    color: "#0A66C2",
  },
  {
    id: "tiktok",
    label: "TikTok",
    sublabel: "Younger audiences",
    bestFor: "Best for fashion, food, lifestyle, entertainment",
    connected: true,
    color: "#000000",
  },
];

export const GOALS = [
  { id: "traffic",   label: "Get more website visitors",  hint: "Send people to your site",          icon: "globe",      cta: "Learn more", channels: ["meta", "linkedin", "tiktok"] },
  { id: "leads",     label: "Get more leads",             hint: "Collect names, phone, email",        icon: "form",       cta: "Sign up",    channels: ["meta", "linkedin", "tiktok"] },
  { id: "product",   label: "Promote a product or service", hint: "Drive shop visits or purchases",  icon: "bag",        cta: "Shop now",   channels: ["meta", "linkedin", "tiktok"] },
  { id: "installs",  label: "Get more app installs",      hint: "Drive iOS / Android downloads",      icon: "phone",      cta: "Download",   channels: ["meta", "tiktok"] },
  { id: "boost",     label: "Boost a social post",        hint: "Promote an existing post",            icon: "thumbsup",   cta: "Learn more", channels: ["meta", "linkedin", "tiktok"] },
  { id: "profile",   label: "Get more profile visits",    hint: "Grow your social followers",         icon: "profile",    cta: "Learn more", channels: ["meta", "tiktok"] },
];

export const CTA_OPTIONS = [
  "Learn more",
  "Shop now",
  "Sign up",
  "Contact us",
  "Book now",
  "Download",
  "Get offer",
];

export const ADS = [
  {
    id: "a1",
    name: "Diwali Sale - Get Leads",
    goalId: "leads",
    status: "active",
    channels: ["meta", "linkedin", "tiktok"],
    createdAt: "2026-04-28",
    spent: 2450,
    dailySpend: 350,
    spendByChannel: { meta: 1200, linkedin: 800, tiktok: 450 },
    results: 47,
    resultLabel: "leads",
    costPerResult: 52,
    reach: 12400,
    clicks: 340,
    impressions: 89200,
    creative: {
      format: "single",
      thumb: "🪔",
      headline: "Light up your Diwali",
      description: "Up to 40% off festive collection. Limited time only.",
      cta: "Shop now",
      url: "https://wenext.shop/diwali",
    },
    series: [12, 18, 22, 28, 32, 38, 41, 47],
    spendSeries: [180, 320, 450, 720, 1100, 1450, 1880, 2450],
    perChannel: {
      meta:     { results: 22, spent: 1034, costPerResult: 47 },
      linkedin: { results: 18, spent: 1224, costPerResult: 68 },
      tiktok:   { results: 7,  spent: 273,  costPerResult: 39 },
    },
    audience: {
      demographics: { female: 64, male: 36, ageBuckets: [{ label: "18-24", pct: 9 }, { label: "25-34", pct: 41 }, { label: "35-44", pct: 27 }, { label: "45-54", pct: 15 }, { label: "55+", pct: 8 }] },
      cities: [{ label: "Mumbai", count: 18 }, { label: "Delhi", count: 11 }, { label: "Bengaluru", count: 7 }, { label: "Pune", count: 6 }, { label: "Hyderabad", count: 5 }],
      interests: [{ label: "Festive shopping", lift: "3.2x" }, { label: "Home decor", lift: "2.4x" }, { label: "Apparel", lift: "1.9x" }, { label: "Gifting", lift: "1.7x" }, { label: "Lifestyle", lift: "1.4x" }],
    },
    suggestions: [
      { id: "s1", body: "Your cost per lead is 18% higher than similar businesses. Try narrowing your audience age range to 25–44.", apply: "Apply 25–44", why: "Similar businesses in retail with age 25–44 see ₹42 per lead — 19% lower than your current ₹52." },
      { id: "s2", body: "Most of your clicks come from Instagram, not Facebook. Increasing Instagram budget could help.", apply: "Shift +₹100/day", why: "Instagram drives 68% of clicks but only gets 50% of Meta budget. Rebalancing should improve cost per lead by ~12%." },
      { id: "s3", body: "TikTok has the lowest cost per lead. Move budget from LinkedIn to TikTok.", apply: "Move ₹200/day", why: "TikTok is at ₹39/lead vs LinkedIn at ₹68/lead. Moving ₹200/day should yield ~5 extra leads/day." },
    ],
  },
  {
    id: "a2",
    name: "Spring Menu Launch",
    goalId: "product",
    status: "active",
    channels: ["meta", "tiktok"],
    createdAt: "2026-04-22",
    spent: 1180,
    dailySpend: 200,
    spendByChannel: { meta: 740, tiktok: 440 },
    results: 86,
    resultLabel: "orders",
    costPerResult: 14,
    reach: 9100,
    clicks: 412,
    impressions: 56400,
    creative: {
      format: "single",
      thumb: "🌸",
      headline: "Spring is on the menu",
      description: "Try our seasonal small plates this week. Walk-in or order ahead.",
      cta: "Book now",
      url: "https://wenext.shop/spring",
    },
    series: [4, 12, 21, 36, 48, 62, 74, 86],
    spendSeries: [120, 250, 380, 520, 690, 870, 1020, 1180],
    perChannel: {
      meta:   { results: 58, spent: 740, costPerResult: 13 },
      tiktok: { results: 28, spent: 440, costPerResult: 16 },
    },
    suggestions: [
      { id: "s1", body: "Your cost per order on TikTok rose 12% this week. Refresh the creative to recover performance.", apply: "Refresh creative", why: "Creative fatigue typical after 7 days. New creative usually recovers cost per order to within 5% of launch baseline." },
    ],
  },
  {
    id: "a3",
    name: "Yoga Class Signups",
    goalId: "leads",
    status: "paused",
    channels: ["meta"],
    createdAt: "2026-04-12",
    spent: 640,
    dailySpend: 0,
    spendByChannel: { meta: 640 },
    results: 22,
    resultLabel: "signups",
    costPerResult: 29,
    reach: 4800,
    clicks: 142,
    impressions: 22100,
    creative: {
      format: "single",
      thumb: "🧘",
      headline: "Stretch into spring",
      description: "Drop-in classes weeknights — first session free.",
      cta: "Sign up",
      url: "https://wenext.shop/yoga",
    },
    series: [],
    spendSeries: [],
    perChannel: { meta: { results: 22, spent: 640, costPerResult: 29 } },
    suggestions: [],
  },
  {
    id: "a4",
    name: "Loan Calculator Promo",
    goalId: "traffic",
    status: "review",
    channels: ["linkedin"],
    createdAt: "2026-05-04",
    spent: 0,
    dailySpend: 250,
    spendByChannel: { linkedin: 0 },
    results: 0,
    resultLabel: "visits",
    costPerResult: 0,
    reach: 0,
    clicks: 0,
    impressions: 0,
    creative: {
      format: "single",
      thumb: "💼",
      headline: "Plan smarter loans",
      description: "Free calculator for SMBs. Try it in 30 seconds.",
      cta: "Learn more",
      url: "https://wenext.shop/loan",
    },
    series: [],
    spendSeries: [],
    perChannel: {},
    suggestions: [],
  },
  {
    id: "a5",
    name: "Salon Mid-Week Booster",
    goalId: "boost",
    status: "ended",
    channels: ["meta", "tiktok"],
    createdAt: "2026-03-15",
    spent: 1980,
    dailySpend: 0,
    spendByChannel: { meta: 1180, tiktok: 800 },
    results: 64,
    resultLabel: "bookings",
    costPerResult: 31,
    reach: 8400,
    clicks: 281,
    impressions: 41200,
    creative: {
      format: "single",
      thumb: "💇",
      headline: "Mid-week glow-ups",
      description: "20% off Tue-Thu services. Walk in or book online.",
      cta: "Book now",
      url: "https://wenext.shop/salon",
    },
    series: [4, 9, 17, 25, 32, 41, 52, 64],
    spendSeries: [240, 480, 700, 920, 1180, 1440, 1700, 1980],
    perChannel: {
      meta:   { results: 41, spent: 1180, costPerResult: 29 },
      tiktok: { results: 23, spent: 800,  costPerResult: 35 },
    },
    suggestions: [],
  },
];

export const STATUS_PILLS = {
  active:   { label: "Active",   dot: "bg-success",       text: "text-success",   bg: "bg-success-bg" },
  paused:   { label: "Paused",   dot: "bg-ink-subtle",    text: "text-ink-muted", bg: "bg-surface-muted" },
  review:   { label: "In review",dot: "bg-warning",       text: "text-warning",   bg: "bg-warning-bg" },
  rejected: { label: "Rejected", dot: "bg-danger",        text: "text-danger",    bg: "bg-danger-bg" },
  ended:    { label: "Ended",    dot: "bg-ink-subtle",    text: "text-ink-muted", bg: "bg-surface-muted" },
};

export function findChannel(id) {
  return CHANNELS.find((c) => c.id === id);
}

export function findGoal(id) {
  return GOALS.find((g) => g.id === id);
}

export function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return String(n);
}

export function aggregateMonthSpend(ads) {
  return ads.reduce((s, a) => s + a.spent, 0);
}

export function aggregateActiveChannels(ads) {
  const set = new Set();
  ads.filter((a) => a.status === "active").forEach((a) => a.channels.forEach((c) => set.add(c)));
  return set.size;
}
