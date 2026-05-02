import { Fragment } from "react";
import FilterChip from "./FilterChip.jsx";

export default function FilterChipGroup({ chips, active, onChange }) {
  return (
    <div className="flex items-center gap-2">
      {chips.map((chip, i) => (
        <Fragment key={chip.id}>
          {i === 1 && (
            <span aria-hidden className="mx-1 h-4 w-px bg-line" />
          )}
          <FilterChip
            label={chip.label}
            icon={chip.icon}
            active={chip.id === active}
            onClick={() => onChange?.(chip.id)}
          />
        </Fragment>
      ))}
    </div>
  );
}
