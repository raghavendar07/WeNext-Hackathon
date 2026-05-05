const TOKEN_RE = /(\{\{[^}]+\}\})/g;

export default function VariableTokenText({ text, className }) {
  const parts = String(text).split(TOKEN_RE);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        TOKEN_RE.test(part) ? (
          <span
            key={i}
            className="rounded-xs bg-brand-50 px-1 text-brand-emerald font-semibold"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}
