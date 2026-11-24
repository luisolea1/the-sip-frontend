import { useState } from "react";
import { Link } from "react-router";
import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { paths } from "@/app/paths";
import { cardDesigns, type CardDesign } from "../card-designs";
import { CardDesignPicker } from "../components/CardDesignPicker";
import { SampleMemberCard } from "../components/SampleMemberCard";

export default function MemberCardPage() {
  const [selected, setSelected] = useState<CardDesign>(cardDesigns[0]);
  return (
    <>
      <AreaIntroduction title="Mi tarjeta" description="Explora los seis diseños de la colección navideña. Son tarjetas de muestra: no necesitas registrarte y tu selección no se guarda." />
      <div className="grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
        <SampleMemberCard design={selected} />
        <CardDesignPicker selected={selected} onSelect={setSelected} />
      </div>
      <Link to={paths.registration}>Volver al registro de miembros</Link>
    </>
  );
}
