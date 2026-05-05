export default function KPIMetric({ value, name }) {
  return (
    <div className="flex flex-1 items-center gap-2 px-4 first:pl-0 last:pr-0">
      <span className="text-[24px] font-semibold leading-none text-ink-heading">
        {value.toLocaleString()}
      </span>
      <span className="text-[12px] font-semibold text-ink-heading">
        {name}
      </span>
    </div>
  );
}
