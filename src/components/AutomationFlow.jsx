import {
  WhatsappLogo,
  InstagramLogo,
  LinkedinLogo,
} from "./BrandLogos.jsx";
import { Send, MousePointerClick, BarChart3 } from "lucide-react";

const W = 600;
const H = 480;
const CENTER = { x: W / 2, y: H / 2 };

const INPUTS = [
  {
    id: "linkedin-in",
    y: 80,
    Logo: LinkedinLogo,
    label: "Linkedin",
    bg: "#E6F6FF",
    color: "#007AB9",
  },
  {
    id: "facebook-in",
    y: 192,
    Logo: FacebookLogo,
    label: "Facebook",
    bg: "#E6F1FF",
    color: "#1877F2",
  },
  {
    id: "instagram-in",
    y: 304,
    Logo: InstagramLogo,
    label: "Instagram",
    bg: "#FFCFE2",
    color: "#FF1C74",
  },
  {
    id: "meta-in",
    y: 400,
    Logo: MetaLogo,
    label: "Meta Ads",
    bg: "#E7F3FF",
    color: "#0668E1",
  },
];

const OUTPUTS = [
  {
    id: "social-out",
    y: 80,
    Icon: Send,
    title: "Social Media",
    subtitle: "Posting",
  },
  {
    id: "ctw-out",
    y: 192,
    Icon: MousePointerClick,
    title: "CTW",
    subtitle: "Ads",
  },
  {
    id: "linkedinads-out",
    y: 304,
    Icon: BarChart3,
    title: "Linkedin",
    subtitle: "Ads",
  },
  {
    id: "whatsapp-out",
    y: 416,
    Icon: WhatsappLogo,
    title: "WhatsApp",
    subtitle: "Campaigns & Automations",
  },
];

const LEFT_X = 60;
const RIGHT_X = W - 60;

export default function AutomationFlow() {
  return (
    <div
      className="relative w-full max-w-[600px] rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {INPUTS.map((node) => (
          <path
            key={`line-in-${node.id}`}
            d={cubicPath(LEFT_X + 20, node.y, CENTER.x - 40, CENTER.y)}
            stroke="#A0E6CC"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
        ))}
        {OUTPUTS.map((node) => (
          <path
            key={`line-out-${node.id}`}
            d={cubicPath(CENTER.x + 40, CENTER.y, RIGHT_X - 20, node.y)}
            stroke="#FFC9D6"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </svg>

      <div
        className="absolute z-10 flex flex-col items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(1,170,154,0.35)]"
        style={{
          left: CENTER.x - 40,
          top: CENTER.y - 40,
          width: 80,
          height: 80,
          backgroundImage:
            "linear-gradient(93.67deg, #01AA9A 2.47%, #1EB677 100%)",
        }}
      >
        <WeNextMark className="h-[18px] w-[17.18px]" />
        <span className="mt-1 text-[12px] font-semibold leading-none">
          WeNext
        </span>
      </div>

      {INPUTS.map((node) => (
        <div
          key={node.id}
          className="absolute flex items-center gap-2.5"
          style={{ left: LEFT_X - 20, top: node.y - 20 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.08)]">
            <node.Logo size={20} />
          </div>
          <span
            className="rounded-[30px] px-2.5 py-1 text-[11px] font-semibold"
            style={{ backgroundColor: node.bg, color: node.color }}
          >
            {node.label}
          </span>
        </div>
      ))}

      {OUTPUTS.map((node) => {
        const Icon = node.Icon;
        return (
          <div
            key={node.id}
            className="absolute flex items-center gap-2.5"
            style={{ right: W - RIGHT_X - 20, top: node.y - 20 }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBFCFD] shadow-[0_0_20px_rgba(0,0,0,0.08)] ring-1 ring-[#EDF1F7]">
              <Icon size={18} className="text-[#101828]" strokeWidth={1.75} />
            </div>
            <div className="text-[11px] font-semibold leading-tight text-[#101828]">
              <div>{node.title}</div>
              <div>{node.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function cubicPath(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const cx1 = x1 + dx * 0.5;
  const cx2 = x2 - dx * 0.5;
  return `M${x1},${y1} C${cx1},${y1} ${cx2},${y2} ${x2},${y2}`;
}

function FacebookLogo({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#1877F2"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12z" />
    </svg>
  );
}

function MetaLogo({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="meta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0064E0" />
          <stop offset="100%" stopColor="#0085FF" />
        </linearGradient>
      </defs>
      <path
        fill="url(#meta-grad)"
        d="M9.5 8C5.91 8 3 11.36 3 15.5c0 4.14 2.91 7.5 6.5 7.5 1.92 0 3.5-1.06 4.86-2.7 1.04-1.27 1.94-2.86 2.78-4.6.84 1.74 1.74 3.33 2.78 4.6C21.28 21.94 22.86 23 24.78 23c3.59 0 6.5-3.36 6.5-7.5C31.28 11.36 28.37 8 24.78 8c-2.13 0-3.84 1.18-5.32 3.04-1.05 1.32-2.02 3.05-2.96 4.97-.94-1.92-1.91-3.65-2.96-4.97C12.06 9.18 10.4 8 9.5 8zm0 2.5c.65 0 1.34.65 2.32 1.86C13.06 14.04 14.27 16.06 15 17.5c-.73 1.44-1.94 3.46-3.18 5.14-.98 1.21-1.67 1.86-2.32 1.86-2.21 0-4-2.46-4-5.5s1.79-5.5 4-5.5zm15.28 0c2.21 0 4 2.46 4 5.5s-1.79 5.5-4 5.5c-.65 0-1.34-.65-2.32-1.86C21.22 17.96 20.01 15.94 19.28 14.5c.73-1.44 1.94-3.46 3.18-5.14.98-1.21 1.67-1.86 2.32-1.86z"
      />
    </svg>
  );
}

function WeNextMark({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.5 1H10.5C12 1 13 2 13 3.5V8.5C13 10 12 11 10.5 11.2L3 11.5H1V3.5C1 2 2 1 3.5 1Z"
        stroke="white"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 5.5L7.5 7.5M7.5 7.5L5.5 5.5M7.5 7.5V13.5"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
