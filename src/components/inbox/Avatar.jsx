const PALETTE_BY_NAME = {
  coral:  { bg: "#FFE2DC", text: "#FF6F4F" },
  pink:   { bg: "#FFD6E5", text: "#E84F87" },
  blue:   { bg: "#D6E5FF", text: "#3B7BFF" },
  green:  { bg: "#D6F4D9", text: "#1EB677" },
  rose:   { bg: "#FEE2E2", text: "#EF4444" },
};

const PALETTE_ORDER = ["coral", "pink", "blue", "green", "rose"];

export function paletteFor(palette, name) {
  if (palette && PALETTE_BY_NAME[palette]) return PALETTE_BY_NAME[palette];
  const code = (name?.charCodeAt(0) ?? 0) - 65;
  const key = PALETTE_ORDER[((code % PALETTE_ORDER.length) + PALETTE_ORDER.length) % PALETTE_ORDER.length];
  return PALETTE_BY_NAME[key];
}

export default function Avatar({ name, palette, size = 40 }) {
  const p = paletteFor(palette, name);
  const initial = name?.[0]?.toUpperCase() ?? "?";
  const fontSize = size === 40 ? 18 : Math.round(size * 0.45);

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-medium"
      style={{
        width: size,
        height: size,
        backgroundColor: p.bg,
        color: p.text,
        fontSize,
      }}
    >
      {initial}
    </span>
  );
}
