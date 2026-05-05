import TemplateStyleCard from "./TemplateStyleCard.jsx";

export default function TemplateCarouselBlock({ templates, onPick }) {
  return (
    <div className="flex items-stretch gap-3 overflow-x-auto pb-1">
      {templates.map((t) => (
        <TemplateStyleCard
          key={t.id}
          label={t.label}
          tone={t.tone}
          onClick={() => onPick?.(t)}
        />
      ))}
    </div>
  );
}
