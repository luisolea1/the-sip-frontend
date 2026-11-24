import type { CardDesign } from "../card-designs";
import bearLights from "../images/card-designs/bear-lights.svg";
import gingerbread from "../images/card-designs/gingerbread.svg";
import polarGift from "../images/card-designs/polar-gift.svg";
import snowSanta from "../images/card-designs/snow-santa.svg";
import snowVillage from "../images/card-designs/snow-village.svg";
import threadPine from "../images/card-designs/thread-pine.svg";

const illustrations: Record<CardDesign["id"], string> = {
  "bear-lights": bearLights,
  gingerbread,
  "polar-gift": polarGift,
  "snow-santa": snowSanta,
  "snow-village": snowVillage,
  "thread-pine": threadPine,
};

export function CardIllustration({ design }: { design: CardDesign }) {
  return <img src={illustrations[design.id]} alt="" width="180" height="190" className="block size-full object-contain" />;
}
