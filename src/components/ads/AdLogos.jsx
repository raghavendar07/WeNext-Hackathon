export function MetaLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M16 12.06a4 4 0 1 0-4.625 3.95V13.22h-1v-1.16h1v-.88c0-1 .6-1.55 1.51-1.55.44 0 .9.08.9.08v1h-.51c-.5 0-.66.31-.66.63v.76h1.12l-.18 1.16h-.94v2.79A4 4 0 0 0 16 12.06Z"
        fill="white"
      />
    </svg>
  );
}

export function TikTokLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#000000" />
      <path
        d="M16.5 8.4a3.4 3.4 0 0 1-2.4-1V14a3.6 3.6 0 1 1-3.6-3.6c.18 0 .35.02.52.05v1.7a1.95 1.95 0 1 0 1.4 1.85V5.5h1.7a3.4 3.4 0 0 0 2.38 2.4Z"
        fill="#FF004F"
      />
      <path
        d="M16.7 8.6a3.4 3.4 0 0 1-2.4-1V14a3.6 3.6 0 1 1-3.6-3.6c.18 0 .35.02.52.05v1.7a1.95 1.95 0 1 0 1.4 1.85V5.5h1.7a3.4 3.4 0 0 0 2.38 2.4Z"
        fill="#00F2EA"
        opacity="0.75"
      />
      <path
        d="M16.6 8.5a3.4 3.4 0 0 1-2.4-1V14a3.6 3.6 0 1 1-3.6-3.6c.18 0 .35.02.52.05v1.7a1.95 1.95 0 1 0 1.4 1.85V5.5h1.7a3.4 3.4 0 0 0 2.38 2.4Z"
        fill="white"
      />
    </svg>
  );
}

export function ChannelLogo({ id, size = 16 }) {
  if (id === "meta") return <MetaLogo size={size} />;
  if (id === "tiktok") return <TikTokLogo size={size} />;
  if (id === "linkedin") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  return null;
}

export function ChannelStack({ ids = [], size = 16 }) {
  const labelMap = { meta: "Meta", linkedin: "LinkedIn", tiktok: "TikTok" };
  const title = ids.map((id) => labelMap[id]).filter(Boolean).join(", ");
  return (
    <span className="inline-flex items-center gap-1.5" title={title}>
      {ids.map((id) => (
        <ChannelLogo key={id} id={id} size={size} />
      ))}
    </span>
  );
}
