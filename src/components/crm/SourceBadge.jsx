import { Globe, Megaphone } from "lucide-react";
import { InstagramLogo, WhatsappLogo } from "../BrandLogos.jsx";

const SOURCES = {
  instagram: { Icon: InstagramLogo, label: "Instagram", iconAsLogo: true },
  whatsapp:  { Icon: WhatsappLogo,  label: "WhatsApp",  iconAsLogo: true },
  ads:       { Icon: Megaphone,     label: "Ads" },
  website:   { Icon: Globe,         label: "Website" },
};

export default function SourceBadge({ source, compact = false }) {
  const cfg = SOURCES[source] ?? SOURCES.website;
  const Icon = cfg.Icon;

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-ink-muted">
      {cfg.iconAsLogo ? (
        <Icon size={12} />
      ) : (
        <Icon size={12} strokeWidth={1.75} className="text-ink-muted" />
      )}
      {!compact && <span>{cfg.label}</span>}
    </span>
  );
}
