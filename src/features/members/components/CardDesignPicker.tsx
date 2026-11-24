import { cardDesigns, type CardDesign } from "../card-designs";

type CardDesignPickerProps = {
  selected: CardDesign;
  onSelect: (design: CardDesign) => void;
};

export function CardDesignPicker({ selected, onSelect }: CardDesignPickerProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-lg font-semibold">Elige un diseño</legend>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {cardDesigns.map(design => (
          <label key={design.id} className="member-card-design-option">
            <input type="radio" name="card-design" value={design.id}
              checked={selected.id === design.id} onChange={() => onSelect(design)}
              className="size-4 accent-primary" />
            <span>{design.name}</span>
            <span aria-hidden="true" className="ml-auto size-5 rounded-full border"
              style={{ backgroundColor: design.background, borderColor: design.foreground }} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
