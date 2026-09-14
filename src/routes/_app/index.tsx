import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDesk } from "@/lib/api";
import { bagsLabel, money, relative, serviceHost } from "@/lib/format";
import { ServiceChip } from "@/components/service-chip";
import { StatusBadge } from "@/components/status-badge";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/")({
  component: DeskPage,
});

function DeskPage() {
  const desk = useQuery({ queryKey: ["desk"], queryFn: () => getDesk() });

  if (desk.isLoading) {
    return <DeskSkeleton />;
  }

  if (desk.error || !desk.data) {
    return (
      <p className="text-sm text-danger">
        Could not read the desk from MariaDB.
      </p>
    );
  }

  const data = desk.data;
  const low = data.products.filter((p) => p.stock_bags < 12).slice(0, 4);
  const chart = data.series.map((row) => ({
    ...row,
    label: format(parseISO(row.day), "EEE"),
  }));

  return (
    <div className="space-y-8">
      <div className="rise flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-micro tracking-brand text-muted uppercase">
            {format(new Date(), "EEEE d MMMM")}
          </p>
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">
            Morning roast
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted">
          PHP serves the lot book. Java runs the ticket pipeline. MariaDB holds
          the cellar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          className="rise"
          label="Open tickets"
          value={String(data.open_orders)}
          hint="Java fulfillment"
        />
        <Kpi
          className="rise rise-2"
          label="Bags on hand"
          value={String(data.bags_on_hand)}
          hint="MariaDB cellar"
        />
        <Kpi
          className="rise rise-3"
          label="Low lots"
          value={String(data.low_stock)}
          hint="Below 12 bags"
        />
        <Kpi
          className="rise rise-4"
          label="Shipped (7d)"
          value={String(data.shipped_week)}
          hint="Bags out the door"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-5">
        <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-3">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="font-display text-xl">Bags allocated</h3>
            <span className="font-mono text-micro tracking-wider text-muted uppercase">
              Last seven days
            </span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart.length ? chart : [{ label: "—", bags: 0 }]}>
                <defs>
                  <linearGradient id="bags" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-raised)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    color: "var(--color-fg)",
                    fontSize: 12,
                  }}
                  formatter={(value) => [String(value ?? 0), "bags"]}
                />
                <Area
                  type="monotone"
                  dataKey="bags"
                  stroke="var(--color-primary)"
                  strokeWidth={1.5}
                  fill="url(#bags)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-2">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="font-display text-xl">Low cellar</h3>
            <Link to="/cellar" className="text-sm text-muted hover:text-fg">
              Open cellar
            </Link>
          </div>
          <ul className="space-y-3">
            {low.length === 0 ? (
              <li className="text-sm text-muted">All lots are healthy.</li>
            ) : (
              low.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-fg">{p.name}</p>
                    <p className="font-mono text-micro text-subtle">{p.sku}</p>
                  </div>
                  <span className="font-display text-lg tabular-nums text-warning">
                    {p.stock_bags}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="font-display text-xl">Live tickets</h3>
            <Link to="/orders" className="text-sm text-muted hover:text-fg">
              All orders
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {data.orders.slice(0, 5).map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="font-mono text-sm text-fg">{order.order_no}</p>
                  <p className="truncate text-sm text-muted">
                    {order.trade_name} · {bagsLabel(order.bag_count)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={order.status} />
                  <span className="font-mono text-micro tabular-nums text-subtle">
                    {money(order.total_cents)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <h3 className="mb-3 font-display text-xl">Service log</h3>
          <ul className="space-y-3">
            {data.events.map((event) => (
              <li key={event.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <ServiceChip service={event.service} />
                    <span className="font-mono text-micro text-subtle">
                      {serviceHost(event.service)}
                    </span>
                  </div>
                  <p className="text-sm text-fg">{event.detail}</p>
                </div>
                <span className="shrink-0 font-mono text-micro text-subtle">
                  {relative(event.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <p className="font-mono text-micro tracking-wider text-muted uppercase">
        {label}
      </p>
      <p className="font-display text-4xl leading-none tabular-nums">{value}</p>
      <p className="mt-2 text-sm text-subtle">{hint}</p>
    </div>
  );
}

function DeskSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-xl bg-surface shadow-[var(--shadow-border)]"
        />
      ))}
    </div>
  );
}
