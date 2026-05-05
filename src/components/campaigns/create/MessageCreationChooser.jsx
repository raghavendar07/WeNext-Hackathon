import CreationModeCard from "./CreationModeCard.jsx";
import {
  AICreateIllustration,
  ManualCreateIllustration,
  TemplateLibraryIllustration,
} from "./illustrations.jsx";

const MODES = [
  {
    id: "ai",
    eyebrow: "AI - Powered",
    title: "Write with AI",
    description:
      "Describe your goal and AI will draft a message for you. Edit, refine and make it yours.",
    tone: "brand",
    Illustration: AICreateIllustration,
  },
  {
    id: "manual",
    eyebrow: "Full Control",
    title: "Write it Myself",
    description:
      "Start with a blank canvas. Write exactly what you want with full control over every word.",
    tone: "info",
    Illustration: ManualCreateIllustration,
  },
  {
    id: "template",
    eyebrow: "Saved Templates",
    title: "From Message Library",
    description:
      "Pick a pre-approved message from the library. Ready to send, no edits needed unless you want to.",
    tone: "warning",
    Illustration: TemplateLibraryIllustration,
  },
];

export default function MessageCreationChooser({ selected, onSelect }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 px-6 py-10">
      <header className="flex max-w-[640px] flex-col items-center gap-2 text-center">
        <h2 className="text-[32px] font-semibold leading-tight text-ink-heading">
          How do you want to create your message?
        </h2>
        <p className="text-[15px] font-medium text-ink-muted">
          Choose a starting point. You can edit everything later.
        </p>
      </header>

      <div className="grid w-full max-w-[1100px] grid-cols-1 gap-6 lg:grid-cols-3">
        {MODES.map((m) => (
          <CreationModeCard
            key={m.id}
            eyebrow={m.eyebrow}
            title={m.title}
            description={m.description}
            tone={m.tone}
            Illustration={m.Illustration}
            selected={selected === m.id}
            onClick={() => onSelect?.(m.id)}
          />
        ))}
      </div>
    </div>
  );
}
