export function AICreateIllustration({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Speech bubble */}
      <path
        d="M50 45h70a14 14 0 0 1 14 14v36a14 14 0 0 1-14 14H86l-14 14V109H50a14 14 0 0 1-14-14V59a14 14 0 0 1 14-14z"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Inner content lines */}
      <line x1="56" y1="68" x2="98" y2="68" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="80" x2="114" y2="80" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="92" x2="86" y2="92" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      {/* Big sparkle */}
      <path
        d="M148 38l4.5 9 9 4.5-9 4.5-4.5 9-4.5-9-9-4.5 9-4.5z"
        fill="currentColor"
      />
      {/* Small sparkle */}
      <path
        d="M168 76l2 4 4 2-4 2-2 4-2-4-4-2 4-2z"
        fill="currentColor"
      />
      {/* Tiny dot */}
      <circle cx="40" cy="32" r="3" fill="currentColor" />
    </svg>
  );
}

export function ManualCreateIllustration({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Paper */}
      <rect
        x="44"
        y="34"
        width="88"
        height="100"
        rx="8"
        stroke="#9CA3AF"
        strokeWidth="2"
      />
      {/* Writing lines */}
      <line x1="56" y1="58" x2="116" y2="58" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="74" x2="120" y2="74" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="90" x2="100" y2="90" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="106" x2="92" y2="106" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      {/* Pen body */}
      <path
        d="M132 82l28-28a6 6 0 0 1 8.5 8.5L140.5 90.5l-12 3.5z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Pen tip */}
      <path
        d="M128.5 94l4-12 8 8z"
        fill="#9CA3AF"
      />
      {/* Floating dot */}
      <circle cx="170" cy="38" r="3" fill="currentColor" />
    </svg>
  );
}

export function TemplateLibraryIllustration({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Back card */}
      <rect
        x="62"
        y="42"
        width="84"
        height="74"
        rx="8"
        fill="#fff"
        stroke="#9CA3AF"
        strokeWidth="2"
        transform="rotate(-6 104 79)"
      />
      {/* Middle card */}
      <rect
        x="58"
        y="50"
        width="84"
        height="74"
        rx="8"
        fill="#fff"
        stroke="#9CA3AF"
        strokeWidth="2"
      />
      {/* Front card */}
      <rect
        x="54"
        y="58"
        width="92"
        height="78"
        rx="8"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Front card content */}
      <line x1="66" y1="78" x2="110" y2="78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="66" y1="92" x2="130" y2="92" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <line x1="66" y1="106" x2="118" y2="106" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      {/* Message bubble badge */}
      <circle cx="138" cy="60" r="14" fill="currentColor" />
      <path
        d="M138 56v6m0 4h.01"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Sparkle */}
      <path
        d="M40 36l2 4 4 2-4 2-2 4-2-4-4-2 4-2z"
        fill="currentColor"
      />
    </svg>
  );
}
