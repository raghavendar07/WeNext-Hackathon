export const PLATFORMS = [
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Post to your company page",
    color: "#0A66C2",
    captionLimit: 3000,
    aspect: "1.91:1",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Reach customers on your Facebook Page",
    color: "#1877F2",
    captionLimit: 5000,
    aspect: "1.91:1",
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Share photos, reels, and stories",
    color: "#E84F87",
    captionLimit: 2200,
    aspect: "1:1",
    requiresFacebook: true,
  },
];

export const INITIAL_ACCOUNTS = {
  linkedin: { connected: true,  name: "WeNext Retail",       handle: "wenext-retail" },
  facebook: { connected: true,  name: "WeNext Retail Page",  handle: "wenextretail" },
  instagram:{ connected: false, name: null,                  handle: null },
};

export const POSTS = [
  {
    id: "p1",
    status: "scheduled",
    scheduledFor: "2026-05-06T09:30:00",
    channels: ["linkedin", "facebook"],
    caption: "Excited to launch our new festive collection! 🪔 Use code DIWALI20 for 20% off. Shop now at wenextretail.com — limited stock available.",
    media: { type: "image", thumb: "🪔" },
    engagement: null,
  },
  {
    id: "p2",
    status: "scheduled",
    scheduledFor: "2026-05-06T16:00:00",
    channels: ["instagram", "facebook"],
    caption: "Spring menu drops tomorrow. Tag a friend who needs to try the matcha bowl 🌸",
    media: { type: "image", thumb: "🌸" },
    engagement: null,
  },
  {
    id: "p3",
    status: "scheduled",
    scheduledFor: "2026-05-07T11:00:00",
    channels: ["linkedin"],
    caption: "We're hiring! Looking for a senior frontend engineer to join our growing team. Remote-friendly, India-based.",
    media: null,
    engagement: null,
  },
  {
    id: "p4",
    status: "scheduled",
    scheduledFor: "2026-05-08T18:30:00",
    channels: ["instagram"],
    caption: "Behind the scenes: how we hand-pick every product 📸",
    media: { type: "image", thumb: "📸" },
    engagement: null,
  },
  {
    id: "p5",
    status: "draft",
    savedAt: "2026-05-05T22:10:00",
    channels: ["linkedin", "facebook", "instagram"],
    caption: "Customer story: How Aisha used WeNext to grow her boutique by 3x in 6 months. Read the full case study →",
    media: null,
    engagement: null,
  },
  {
    id: "p6",
    status: "draft",
    savedAt: "2026-05-06T08:30:00",
    channels: ["facebook"],
    caption: "Thank you for 10K followers! We're celebrating with a giveaway this week...",
    media: { type: "image", thumb: "🎉" },
    engagement: null,
  },
  {
    id: "p7",
    status: "published",
    publishedAt: "2026-05-04T10:00:00",
    channels: ["linkedin", "facebook"],
    caption: "Heads up — only 24 hours left to save 25% on our spring collection. Use code SPRING25 at checkout.",
    media: { type: "image", thumb: "🌷" },
    engagement: { likes: 132, comments: 18, shares: 24, reach: 4200 },
  },
  {
    id: "p8",
    status: "published",
    publishedAt: "2026-05-03T15:30:00",
    channels: ["instagram", "facebook"],
    caption: "New arrival 🌟 Pearl drop earrings, hand-finished and ready to ship today.",
    media: { type: "image", thumb: "🌟" },
    engagement: { likes: 287, comments: 41, shares: 12, reach: 6800 },
  },
  {
    id: "p9",
    status: "published",
    publishedAt: "2026-05-02T09:00:00",
    channels: ["linkedin"],
    caption: "Q1 wrap: 40% revenue growth, 12 new team members, and 3 new product lines. Grateful for an incredible quarter.",
    media: null,
    engagement: { likes: 412, comments: 67, shares: 38, reach: 9100 },
  },
  {
    id: "p10",
    status: "published",
    publishedAt: "2026-05-01T18:00:00",
    channels: ["facebook", "instagram"],
    caption: "Weekend recap: thank you for stopping by our pop-up at Phoenix Mall! 💚",
    media: { type: "image", thumb: "💚" },
    engagement: { likes: 198, comments: 22, shares: 8, reach: 3900 },
  },
  {
    id: "p11",
    status: "failed",
    scheduledFor: "2026-05-05T20:00:00",
    channels: ["instagram"],
    caption: "Late-night snack alert 🍜",
    media: null,
    engagement: null,
    failureReason: "Instagram account disconnected",
  },
];

export const ANALYTICS = {
  totals: {
    reach: 84200,
    engagement: 4700,
    newFollowers: 240,
    postsPublished: 32,
  },
  deltas: {
    reach: { dir: "up", value: "+15%" },
    engagement: { dir: "up", value: "+22%" },
    newFollowers: { dir: "up", value: "+9%" },
    postsPublished: { dir: "up", value: "+6%" },
  },
  spark: {
    reach:        [9100, 11200, 9800, 12400, 13800, 12100, 14200, 11600],
    engagement:   [420, 480, 540, 610, 720, 690, 800, 740],
    newFollowers: [22, 28, 31, 27, 35, 30, 38, 29],
    postsPublished: [2, 3, 4, 4, 5, 4, 5, 5],
  },
  perChannel: {
    linkedin: {
      account: "WeNext Retail",
      reach: 32400, engagement: 1800, posts: 12, followers: 1240,
      deltas: { reach: "+18%", engagement: "+22%", followers: "+9%" },
      bestPostId: "p9",
    },
    facebook: {
      account: "WeNext Retail Page",
      reach: 28100, engagement: 2100, posts: 14, followers: 4120,
      deltas: { reach: "+12%", engagement: "+15%", followers: "+5%" },
      bestPostId: "p7",
    },
    instagram: {
      account: null,
      reach: 0, engagement: 0, posts: 0, followers: 0,
      deltas: null,
      bestPostId: null,
    },
  },
  series: {
    linkedin: [110, 180, 220, 260, 300, 340, 390, 432],
    facebook: [90, 140, 200, 240, 270, 300, 320, 350],
    instagram:[0, 0, 0, 0, 0, 0, 0, 0],
  },
  audience: {
    ageBuckets: [
      { label: "18-24", pct: 12 },
      { label: "25-34", pct: 42 },
      { label: "35-44", pct: 26 },
      { label: "45-54", pct: 14 },
      { label: "55+",   pct: 6 },
    ],
    gender: { female: 61, male: 39 },
    cities: [
      { label: "Mumbai",    count: 312 },
      { label: "Delhi",     count: 248 },
      { label: "Bengaluru", count: 184 },
    ],
    headline: "Most of your engagement comes from women aged 25-34.",
  },
  // 7 days × 24 hours, 0-10 intensity
  heatmap: [
    [0,0,0,0,0,0,1,2,3,3,2,2,3,3,4,4,5,6,5,4,3,2,1,0], // Mon
    [0,0,0,0,0,0,1,2,4,4,3,3,4,5,5,5,6,7,6,5,4,2,1,0], // Tue
    [0,0,0,0,0,0,1,2,5,5,4,4,5,6,6,7,8,9,8,6,5,3,2,1], // Wed
    [0,0,0,0,0,0,1,2,4,4,3,3,4,5,5,6,7,7,6,5,4,3,2,1], // Thu
    [0,0,0,0,0,0,1,3,4,4,3,3,4,5,6,6,7,7,6,5,4,3,2,1], // Fri
    [1,0,0,0,0,1,2,3,4,4,4,4,5,5,5,5,5,5,4,4,3,2,2,1], // Sat
    [1,0,0,0,0,1,2,3,4,5,5,5,5,5,5,5,5,5,4,4,3,3,2,2], // Sun
  ],
  heatmapBest: "Wednesdays 6–8 PM",
  suggestions: [
    { id: "s1", body: "Post 2 more times per week — your top performers all post 4-5x weekly.", apply: "See schedule" },
    { id: "s2", body: "Your Instagram engagement is 40% higher than LinkedIn. Consider shifting more content there.", apply: "Plan IG posts" },
    { id: "s3", body: "Posts with images get 3x more engagement than text-only. 8 of your last 12 posts had no image.", apply: "Add images" },
  ],
};

export const CONVERSATIONS = [
  {
    id: "c1",
    platform: "linkedin",
    type: "comment",
    contact: { name: "Aisha Khan", initial: "A" },
    preview: "Love this collection! Do you ship to Bangalore?",
    timestamp: "12 min ago",
    unread: true,
    sentiment: "positive",
    postRef: "Spring Collection Launch",
    thread: [
      { from: "them", text: "Love this collection! Do you ship to Bangalore?", time: "12 min ago" },
    ],
  },
  {
    id: "c2",
    platform: "instagram",
    type: "dm",
    contact: { name: "Karthik Rao", initial: "K" },
    preview: "Hey, do you have the pearl earrings in gold?",
    timestamp: "1 hr ago",
    unread: true,
    sentiment: "neutral",
    postRef: null,
    thread: [
      { from: "them", text: "Hey, do you have the pearl earrings in gold?", time: "1 hr ago" },
    ],
  },
  {
    id: "c3",
    platform: "facebook",
    type: "comment",
    contact: { name: "Priya Menon", initial: "P" },
    preview: "When is the next pop-up at Phoenix Mall?",
    timestamp: "3 hr ago",
    unread: false,
    sentiment: "positive",
    postRef: "Pop-up at Phoenix Mall",
    thread: [
      { from: "them", text: "When is the next pop-up at Phoenix Mall?", time: "3 hr ago" },
      { from: "us",   text: "Hi Priya — next one is May 18! See you there 💚", time: "2 hr ago" },
    ],
  },
  {
    id: "c4",
    platform: "linkedin",
    type: "mention",
    contact: { name: "Rahul Verma", initial: "R" },
    preview: "Just used @WeNextRetail — fantastic experience!",
    timestamp: "5 hr ago",
    unread: false,
    sentiment: "positive",
    postRef: null,
    thread: [
      { from: "them", text: "Just used @WeNextRetail — fantastic experience! Highly recommend for SMBs.", time: "5 hr ago" },
    ],
  },
  {
    id: "c5",
    platform: "instagram",
    type: "dm",
    contact: { name: "Divya Nair", initial: "D" },
    preview: "Order #4021 hasn't shipped yet, any update?",
    timestamp: "Yesterday",
    unread: false,
    sentiment: "negative",
    postRef: null,
    thread: [
      { from: "them", text: "Order #4021 hasn't shipped yet, any update?", time: "Yesterday" },
      { from: "us",   text: "So sorry for the delay — checking with the warehouse and back to you within an hour.", time: "Yesterday" },
    ],
  },
];

export const TRACKED_ITEMS = [
  { id: "t1", kind: "mention",  label: "@WeNextRetail",     active: true },
  { id: "t2", kind: "hashtag",  label: "#WeNextDiwali",     active: true },
  { id: "t3", kind: "keyword",  label: "WeNext",            active: true },
  { id: "t4", kind: "keyword",  label: "wenext.shop",       active: false },
];

export const MENTIONS = [
  { id: "m1", platform: "linkedin",  author: "Aisha Khan",     text: "Loving the new packaging from @WeNextRetail — small touches matter.",                  time: "2 hr ago",  sentiment: "positive" },
  { id: "m2", platform: "instagram", author: "@kavita_reads",  text: "#WeNextDiwali pieces are stunning. Just ordered 3 sets.",                              time: "4 hr ago",  sentiment: "positive" },
  { id: "m3", platform: "facebook",  author: "Suresh Kumar",   text: "Has anyone tried WeNext for B2B? Looking for a WhatsApp marketing tool for our team.", time: "Yesterday", sentiment: "neutral" },
  { id: "m4", platform: "linkedin",  author: "Lakshmi R",       text: "Their support team replied in 6 minutes. WeNext is on it.",                            time: "Yesterday", sentiment: "positive" },
  { id: "m5", platform: "instagram", author: "@manoj_eats",    text: "Took 4 days to reach me. Slower than expected from WeNext.",                           time: "2 days ago", sentiment: "negative" },
];

export const TOP_POSTS_FALLBACK_THUMB = "📝";

export function formatScheduledTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatDayHeader(iso) {
  const d = new Date(iso);
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const target = new Date(d); target.setHours(0,0,0,0);
  if (target.getTime() === today.getTime()) return `Today, ${d.toLocaleString("en-US", { month: "short", day: "numeric" })}`;
  if (target.getTime() === tomorrow.getTime()) return `Tomorrow, ${d.toLocaleString("en-US", { month: "short", day: "numeric" })}`;
  return d.toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export function dayKey(iso) {
  const d = new Date(iso); d.setHours(0,0,0,0);
  return d.toISOString();
}

export function formatRelative(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMin = Math.round((now - d) / 60000);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH} hour${diffH === 1 ? "" : "s"} ago`;
  const diffD = Math.round(diffH / 24);
  return `${diffD} day${diffD === 1 ? "" : "s"} ago`;
}

export function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return String(n);
}

export function formatCurrency(n) {
  return n.toLocaleString("en-IN");
}

export function findPlatform(id) {
  return PLATFORMS.find((p) => p.id === id);
}

export function lowestCaptionLimit(channelIds) {
  const limits = channelIds.map((id) => findPlatform(id)?.captionLimit ?? 5000);
  return limits.length > 0 ? Math.min(...limits) : 5000;
}
