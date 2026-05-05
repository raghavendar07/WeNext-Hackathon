import {
  Briefcase,
  HeartHandshake,
  LifeBuoy,
  PlayCircle,
  Repeat,
} from "lucide-react";

export const CATEGORIES = {
  consultation: {
    id: "consultation",
    label: "Consultation",
    Icon: Briefcase,
    bg: "bg-brand-50",
    text: "text-brand-emerald",
    border: "border-brand-200",
    dot: "bg-brand-emerald",
  },
  demo: {
    id: "demo",
    label: "Demo",
    Icon: PlayCircle,
    bg: "bg-info-bg",
    text: "text-info",
    border: "border-info-border",
    dot: "bg-info",
  },
  "follow-up": {
    id: "follow-up",
    label: "Follow-up",
    Icon: Repeat,
    bg: "bg-warning-bg",
    text: "text-warning",
    border: "border-warning-border",
    dot: "bg-warning",
  },
  onboarding: {
    id: "onboarding",
    label: "Onboarding",
    Icon: HeartHandshake,
    bg: "bg-[#EBE7FF]",
    text: "text-[#7C3AED]",
    border: "border-[#D9D2FF]",
    dot: "bg-[#7C3AED]",
  },
  support: {
    id: "support",
    label: "Support",
    Icon: LifeBuoy,
    bg: "bg-danger-bg",
    text: "text-danger",
    border: "border-danger-border",
    dot: "bg-danger",
  },
};

export const CATEGORY_ORDER = [
  "consultation",
  "demo",
  "follow-up",
  "onboarding",
  "support",
];
