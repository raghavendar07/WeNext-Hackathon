import { WhatsappLogo } from "../BrandLogos.jsx";

export default function ListHeader({
  title = "WhatsApp",
  subtitle = "Manage WhatsApp conversations",
  icon = <WhatsappLogo size={24} />,
}) {
  return (
    <header className="flex items-start gap-[10px]">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-[20px] font-semibold leading-tight text-ink-heading">
          {title}
        </span>
        <span className="text-[14px] font-normal text-ink-muted">
          {subtitle}
        </span>
      </div>
    </header>
  );
}
