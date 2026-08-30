import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import type { Order, OrderStatus } from "@/lib/dashboard-data";

const statusVariant: Record<OrderStatus, "paid" | "pending" | "refunded"> = {
  Paid: "paid",
  Pending: "pending",
  Refunded: "refunded",
};

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <GlassCard className="flex flex-col">
      <div className="flex items-center justify-between p-5 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Recent orders</h3>
          <p className="text-xs text-zinc-500">Latest transactions</p>
        </div>
        <button className="text-xs font-medium text-indigo-700 hover:text-indigo-800 outline-none focus-visible:underline">
          View all
        </button>
      </div>
      <Table>
        <THead>
          <TR className="hover:bg-transparent">
            <TH>Order</TH>
            <TH>Customer</TH>
            <TH>Item</TH>
            <TH className="text-right">Amount</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {orders.map((o) => (
            <TR key={o.id}>
              <TD className="font-mono text-xs text-zinc-500">{o.id}</TD>
              <TD className="font-medium text-zinc-900">{o.customer}</TD>
              <TD className="text-zinc-600">{o.item}</TD>
              <TD className="text-right font-mono font-medium text-zinc-900">
                {o.amount}
              </TD>
              <TD>
                <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </GlassCard>
  );
}
