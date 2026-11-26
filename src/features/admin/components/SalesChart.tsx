import { useId, useState } from "react";
import { formatMoney } from "@/shared/utils/format-money";
import type { SalesBucket } from "../sales-series";

type Props = {
  title: string;
  subtitle: string;
  groups: SalesBucket[];
  metric: "revenue" | "tickets";
  defaultIndex?: number;
};

export function SalesChart({ title, subtitle, groups, metric, defaultIndex }: Props) {
  const titleId = useId();
  const [selection, setSelection] = useState<string | null>(null);
  const maximum = Math.max(...groups.map(group => group[metric]));
  const peaks = groups.filter(group => group[metric] === maximum);
  const selected = groups.find(group => group.detail === selection) ?? (defaultIndex === undefined ? peaks[0] : groups[defaultIndex]);
  const money = metric === "revenue";
  const valueText = (value: number) => money ? formatMoney(value) : `${value} ${value === 1 ? "ticket" : "tickets"}`;
  const peakLabel = money ? "Mayores ventas" : "Hora pico";

  return <section aria-labelledby={titleId} className="staff-workspace-panel admin-chart">
    <header><h2 id={titleId}>{title}</h2><p>{subtitle}</p></header>
    {maximum === 0 ? <p className="admin-chart-empty">{money ? "No hay ventas confirmadas este mes." : "No hubo tickets en horario de atención durante este periodo."}</p> : <>
      <div className="admin-chart-value" aria-live="polite" aria-atomic="true">
        <strong>{valueText(selected[metric])}</strong><span>{selected.detail}</span>
      </div>
      <div className="admin-chart-scroll">
        <div className="admin-chart-bars">
          {groups.map(group => <button key={group.detail} type="button" className="admin-chart-column"
            aria-label={`${group.detail}: ${valueText(group[metric])}`} aria-pressed={selected === group}
            onClick={() => setSelection(group.detail)}>
            <span className="admin-chart-track" aria-hidden="true">
              <span className="admin-chart-bar" style={{ height: `${100 * group[metric] / maximum}%` }}>
                {groups.length <= 4 && <span>{formatMoney(group[metric]).replace(/\.00$/, "")}</span>}
              </span>
            </span>
            <span className="admin-chart-label" aria-hidden="true">{group.label}</span>
          </button>)}
        </div>
      </div>
      <p className="admin-chart-insight"><strong>{peakLabel}{peaks.length > 1 ? " (empate)" : ""}:</strong>{" "}
        {peaks.map(group => group.detail).join(", ")} · {valueText(maximum)}{peaks.length > 1 ? " en cada franja" : ""}.
      </p>
    </>}
  </section>;
}
