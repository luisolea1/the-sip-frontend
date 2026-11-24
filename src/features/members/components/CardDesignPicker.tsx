import { cardDesigns, type CardDesign } from "../card-designs";
import { CardIllustration } from "./CardIllustration";

type CardDesignPickerProps = {
  selected: CardDesign;
  onSelect: (design: CardDesign) => void;
};

export function CardDesignPicker({ selected, onSelect }: CardDesignPickerProps) {
  return <fieldset className="min-w-0">
    <legend className="mb-3 font-semibold">Diseños disponibles</legend>
    <div className="grid grid-cols-3 gap-x-2.5 gap-y-6">
      {cardDesigns.map(design => <label key={design.id} className="member-card-design-option">
        <input className="peer sr-only" type="radio" name="design" checked={selected.id === design.id}
          onChange={() => onSelect(design)} aria-label={design.name} />
        <span aria-hidden="true" style={{ backgroundColor: design.background, color: design.foreground }}
          className="member-card-design-thumbnail">
          <span className="absolute top-2 left-2.5 text-xs font-extrabold tracking-tight">THE SIP</span>
          <span className="absolute right-1 bottom-1.5 size-[66%]"><CardIllustration design={design} /></span>
          {selected.id === design.id && <span className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-white text-sm font-bold text-primary">✓</span>}
        </span>
        <span className="text-center text-xs">{design.name}</span>
      </label>)}
    </div>
  </fieldset>;
}
