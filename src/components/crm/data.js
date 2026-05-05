export const STAGES = [
  { id: "prospects",      label: "Prospects" },
  { id: "in-conversation", label: "In Conversation" },
  { id: "proposal",       label: "Proposal" },
  { id: "qualified",      label: "Qualified" },
  { id: "closed",         label: "Closed" },
];

export const LEADS = [
  { id: "l1",  name: "Aisha Khan",    phone: "+91 98213 11102", source: "instagram", intent: "hot",   lastActivity: "Replied 2h ago",        action: "Reply now",     tags: ["VIP", "Trial"],         stage: "in-conversation", palette: "pink" },
  { id: "l2",  name: "Rahul Verma",   phone: "+91 98765 43210", source: "ads",       intent: "warm",  lastActivity: "Viewed pricing 1d ago", action: "Send proposal", tags: ["Pricing"],              stage: "proposal",        palette: "blue" },
  { id: "l3",  name: "Sneha Iyer",    phone: "+91 99812 71198", source: "website",   intent: "cold",  lastActivity: "No response 5 days",    action: "Follow up",     tags: ["Webinar"],              stage: "prospects",       palette: "green" },
  { id: "l4",  name: "Karthik Rao",   phone: "+91 90215 76543", source: "instagram", intent: "hot",   lastActivity: "Booked call today",     action: "Send proposal", tags: ["Demo", "Hot"],          stage: "qualified",       palette: "coral" },
  { id: "l5",  name: "Priya Menon",   phone: "+91 95412 09876", source: "whatsapp",  intent: "warm",  lastActivity: "Replied 4h ago",        action: "Reply now",     tags: ["Returning"],            stage: "in-conversation", palette: "rose" },
  { id: "l6",  name: "Manoj Pillai",  phone: "+91 98330 12233", source: "ads",       intent: "cold",  lastActivity: "Opened email 2d ago",   action: "Follow up",     tags: ["Newsletter"],           stage: "prospects",       palette: "blue" },
  { id: "l7",  name: "Divya Nair",    phone: "+91 90020 18876", source: "website",   intent: "warm",  lastActivity: "Filled form 1d ago",    action: "Reply now",     tags: ["Inbound"],              stage: "in-conversation", palette: "green" },
  { id: "l8",  name: "Suresh Kumar",  phone: "+91 99110 65532", source: "instagram", intent: "hot",   lastActivity: "Reviewed proposal 3h",  action: "Close deal",    tags: ["Hot", "Enterprise"],    stage: "proposal",        palette: "coral" },
  { id: "l9",  name: "Lakshmi R",     phone: "+91 97891 04432", source: "whatsapp",  intent: "warm",  lastActivity: "Negotiating terms",     action: "Send proposal", tags: ["SMB"],                  stage: "qualified",       palette: "pink" },
  { id: "l10", name: "Vikram Shetty", phone: "+91 98700 12122", source: "ads",       intent: "cold",  lastActivity: "Joined waitlist",       action: "Nurture",       tags: ["Waitlist"],             stage: "prospects",       palette: "blue" },
  { id: "l11", name: "Ananya Gupta",  phone: "+91 90120 99812", source: "website",   intent: "hot",   lastActivity: "Signed today",          action: "Onboard",       tags: ["Closed"],               stage: "closed",          palette: "green" },
  { id: "l12", name: "Omar Sayeed",   phone: "+91 98982 11881", source: "instagram", intent: "warm",  lastActivity: "Renewed subscription",  action: "Onboard",       tags: ["Closed"],               stage: "closed",          palette: "rose" },
];

export const CUSTOMERS = [
  { id: "cu1", name: "Aisha Khan",    email: "aisha@northstar.io",   lifecycle: "champion",  engagement: "high",   ltv: 4280, lastPurchase: "3 days ago",    palette: "pink"  },
  { id: "cu2", name: "Rahul Verma",   email: "rahul@flexlabs.com",   lifecycle: "active",    engagement: "high",   ltv: 2120, lastPurchase: "1 week ago",    palette: "blue"  },
  { id: "cu3", name: "Karthik Rao",   email: "k.rao@orbital.app",    lifecycle: "active",    engagement: "medium", ltv: 980,  lastPurchase: "2 weeks ago",   palette: "coral" },
  { id: "cu4", name: "Priya Menon",   email: "priya@sundayco.in",    lifecycle: "at-risk",   engagement: "low",    ltv: 1640, lastPurchase: "2 months ago",  palette: "rose"  },
  { id: "cu5", name: "Lakshmi R",     email: "l@brookfield.in",      lifecycle: "champion",  engagement: "high",   ltv: 6400, lastPurchase: "Yesterday",     palette: "pink"  },
  { id: "cu6", name: "Ananya Gupta",  email: "ananya@retainly.app",  lifecycle: "new",       engagement: "high",   ltv: 280,  lastPurchase: "Today",         palette: "green" },
  { id: "cu7", name: "Omar Sayeed",   email: "omar@tidalwave.io",    lifecycle: "active",    engagement: "medium", ltv: 1340, lastPurchase: "3 weeks ago",   palette: "rose"  },
  { id: "cu8", name: "Divya Nair",    email: "divya@arclight.co",    lifecycle: "at-risk",   engagement: "low",    ltv: 720,  lastPurchase: "3 months ago",  palette: "green" },
];

export const TAGS = [
  { id: "tg1", name: "VIP",         color: "#EF4444", count: 124, type: "manual",     automations: 3, campaigns: 2 },
  { id: "tg2", name: "Hot Lead",    color: "#F97316", count: 86,  type: "auto",       automations: 5, campaigns: 4 },
  { id: "tg3", name: "Trial",       color: "#1EB677", count: 320, type: "rule-based", automations: 4, campaigns: 6 },
  { id: "tg4", name: "Enterprise",  color: "#7C3AED", count: 42,  type: "manual",     automations: 2, campaigns: 1 },
  { id: "tg5", name: "Newsletter",  color: "#1877F2", count: 1840, type: "auto",      automations: 1, campaigns: 12 },
  { id: "tg6", name: "Webinar",     color: "#0EA5A4", count: 246, type: "rule-based", automations: 2, campaigns: 3 },
  { id: "tg7", name: "Returning",   color: "#E84F87", count: 180, type: "rule-based", automations: 3, campaigns: 5 },
  { id: "tg8", name: "Closed Won",  color: "#10B981", count: 64,  type: "auto",       automations: 4, campaigns: 0 },
];
