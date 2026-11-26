type ChartSale = { daysAgo: number; time: string; total: number };
export type SalesBucket = { label: string; detail: string; revenue: number; tickets: number };

const dateFormat = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" });
const monthFormat = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" });
const openingHour = 7;
const closingHour = 20;

function bucket(label: string, detail: string): SalesBucket {
  return { label, detail, revenue: 0, tickets: 0 };
}

function record(group: SalesBucket, sale: ChartSale) {
  group.revenue += sale.total;
  group.tickets++;
}

function hourLabel(hour: number) {
  return String(hour).padStart(2, "0");
}

export function hourlyTickets(sales: ChartSale[]) {
  const hours = Array.from({ length: closingHour - openingHour }, (_, index) => {
    const hour = openingHour + index;
    return bucket(hourLabel(hour), `${hourLabel(hour)}:00–${hourLabel(hour + 1)}:00`);
  });
  for (const sale of sales) {
    const hour = Number(sale.time.split(":")[0]);
    if (hour >= openingHour && hour < closingHour) record(hours[hour - openingHour], sale);
  }
  return hours;
}

function weekIndex(day: number) {
  return Math.min(3, Math.floor((day - 1) / 7));
}

export function monthlyRevenue(sales: ChartSale[], today = new Date()) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const weeks = Array.from({ length: 4 }, (_, index) => {
    const start = new Date(year, month, index * 7 + 1);
    const end = index === 3 ? new Date(year, month + 1, 0) : new Date(year, month, (index + 1) * 7);
    const label = `Semana ${index + 1}`;
    return bucket(label, `${label} · ${dateFormat.formatRange(start, end)}`);
  });
  for (const sale of sales) {
    const day = today.getDate() - sale.daysAgo;
    if (day >= 1) record(weeks[weekIndex(day)], sale);
  }
  return { weeks, currentWeek: weekIndex(today.getDate()), month: monthFormat.format(today) };
}
