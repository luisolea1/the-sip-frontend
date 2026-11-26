import { useState } from "react";

export type Birthday = { day: number; month: number };
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const daysPerMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function readBirthday(data: FormData): Birthday | undefined {
  const day = Number(data.get("birthdayDay"));
  const month = Number(data.get("birthdayMonth"));
  return day && month ? { day, month } : undefined;
}

export function BirthdayFields({ initial }: { initial?: Birthday }) {
  const [day, setDay] = useState(initial?.day ?? 0);
  const [month, setMonth] = useState(initial?.month ?? 0);
  return <fieldset className="min-w-0">
    <legend className="mb-2 font-semibold">Cumpleaños (opcional)</legend>
    <div className="grid grid-cols-2 gap-3">
      <label>Día<select name="birthdayDay" className="shared-form-text-input" autoComplete="bday-day" required={!!month} value={day || ""}
        onChange={e => setDay(Number(e.target.value))}>
        <option value="">Día</option>{Array.from({ length: daysPerMonth[month - 1] ?? 31 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
      </select></label>
      <label>Mes<select name="birthdayMonth" className="shared-form-text-input" autoComplete="bday-month" required={!!day} value={month || ""}
        onChange={e => { const next = Number(e.target.value); setMonth(next); if (day > daysPerMonth[next - 1]) setDay(0); }}>
        <option value="">Mes</option>{months.map((label, i) => <option key={label} value={i + 1}>{label}</option>)}
      </select></label>
    </div>
  </fieldset>;
}
