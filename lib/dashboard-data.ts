export type RevenuePoint = { d: string; v: number };
export type TierSlice = { name: string; value: number; color: string };
export type OrderStatus = "Paid" | "Pending" | "Refunded";
export type Order = {
  id: string;
  customer: string;
  item: string;
  amount: string;
  status: OrderStatus;
};
export type EventRow = { day: string; mon: string; title: string; meta: string };

// 90 days of mock revenue, descending granularity handled by the chart.
const seed = (n: number) => Math.round(4200 + Math.sin(n / 3) * 900 + n * 18);

export const revenue90d: RevenuePoint[] = Array.from({ length: 90 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (89 - i));
  return { d: d.toISOString().slice(0, 10), v: seed(i) };
});

export const revenue30d: RevenuePoint[] = revenue90d.slice(-30).map((p, i) => ({
  d: p.d,
  v: Math.round(p.v * 0.6 + i * 22),
}));

export const revenue7d: RevenuePoint[] = revenue90d.slice(-7).map((p, i) => ({
  d: p.d,
  v: Math.round(p.v * 0.4 + i * 60),
}));

export const tierSlices: TierSlice[] = [
  { name: "VIP", value: 48, color: "#4338CA" },
  { name: "Premium", value: 126, color: "#0D9488" },
  { name: "Basic", value: 214, color: "#F59E0B" },
];

export const recentOrders: Order[] = [
  { id: "#ORD-7841", customer: "Maria Ivanova", item: "VIP Membership · Monthly", amount: "€89.00", status: "Paid" },
  { id: "#ORD-7840", customer: "Dimitar Petrov", item: "Crystal Set · Amethyst", amount: "€34.50", status: "Pending" },
  { id: "#ORD-7839", customer: "Sofia Koleva", item: "Workshop · Inner Authority", amount: "€120.00", status: "Paid" },
  { id: "#ORD-7838", customer: "Ivan Stoyanov", item: "Premium Membership · Yearly", amount: "€480.00", status: "Paid" },
  { id: "#ORD-7837", customer: "Elena Dimitrova", item: "Coaching Session · 1:1", amount: "€150.00", status: "Refunded" },
  { id: "#ORD-7836", customer: "Nikolay Hristov", item: "Bracelet · Tiger's Eye", amount: "€22.00", status: "Pending" },
  { id: "#ORD-7835", customer: "Petra Marinova", item: "Basic Membership · Monthly", amount: "€19.00", status: "Paid" },
];

export const upcomingEvents: EventRow[] = [
  { day: "04", mon: "SEP", title: "Inner Authority Retreat", meta: "18 registered · 4 waitlist" },
  { day: "11", mon: "SEP", title: "Crystal Healing Workshop", meta: "24 registered · 2 spots left" },
  { day: "19", mon: "SEP", title: "Coaching Circle · VIP", meta: "12 registered · members only" },
  { day: "27", mon: "SEP", title: "New Moon Manifestation", meta: "31 registered · open" },
];
