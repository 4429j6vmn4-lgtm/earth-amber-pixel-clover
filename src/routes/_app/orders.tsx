import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  advanceOrder,
  cancelOrder,
  createOrder,
  listAccounts,
  listOrders,
  listProducts,
} from "@/lib/api";
import { bagsLabel, money, nextStatusLabel, relative } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import type { OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/_app/orders")({
  component: OrdersPage,
});

const filters: { id: "all" | OrderStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "queued", label: "Queued" },
  { id: "roasting", label: "Roasting" },
  { id: "packed", label: "Packed" },
  { id: "shipped", label: "Shipped" },
];

function OrdersPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const orders = useQuery({ queryKey: ["orders"], queryFn: () => listOrders() });
  const accounts = useQuery({
    queryKey: ["accounts"],
    queryFn: () => listAccounts(),
  });
  const products = useQuery({
    queryKey: ["products"],
    queryFn: () => listProducts(),
  });

  const visible = useMemo(
    () =>
      (orders.data ?? []).filter((o) =>
        filter === "all" ? o.status !== "cancelled" : o.status === filter,
      ),
    [orders.data, filter],
  );

  const advance = useMutation({
    mutationFn: (id: number) => advanceOrder({ data: { id } }),
    onSuccess: (order) => {
      toast.success(`Java advanced ${order.order_no}`);
      void qc.invalidateQueries();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const cancel = useMutation({
    mutationFn: (id: number) => cancelOrder({ data: { id } }),
    onSuccess: (order) => {
      toast.success(`Java released ${order.order_no}`);
      void qc.invalidateQueries();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-micro tracking-brand text-muted uppercase">
            java://fulfillment
          </p>
          <h2 className="font-display text-3xl leading-tight">Tickets</h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Queued, roasting, packed, shipped. Java allocates cellar stock and
            walks each ticket through the roast pipeline.
          </p>
        </div>
        <NewOrderDialog
          accounts={accounts.data ?? []}
          products={products.data ?? []}
          onCreated={() => void qc.invalidateQueries()}
        />
      </div>

      <div className="flex gap-1 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`h-11 shrink-0 rounded-full px-4 text-sm transition-colors duration-150 ${
              filter === f.id
                ? "bg-primary text-primary-fg"
                : "bg-surface text-muted hover:text-fg"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {orders.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted">No tickets in this lane.</p>
      ) : (
        <ul className="space-y-2">
          {visible.map((order) => {
            const next = nextStatusLabel(order.status);
            return (
              <li
                key={order.id}
                className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm text-fg">
                        {order.order_no}
                      </span>
                      <StatusBadge status={order.status} />
                      <span className="text-sm text-subtle">
                        {relative(order.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {order.trade_name}, {order.city} · {bagsLabel(order.bag_count)} ·{" "}
                      {money(order.total_cents)}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {order.lines.map((line) => (
                        <li
                          key={line.id}
                          className="font-mono text-micro text-subtle"
                        >
                          {line.sku} × {line.bags}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {next ? (
                      <Button
                        size="sm"
                        disabled={advance.isPending}
                        onClick={() => advance.mutate(order.id)}
                      >
                        {next}
                      </Button>
                    ) : null}
                    {order.status !== "shipped" &&
                    order.status !== "cancelled" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={cancel.isPending}
                        onClick={() => cancel.mutate(order.id)}
                      >
                        Release
                      </Button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function NewOrderDialog({
  accounts,
  products,
  onCreated,
}: {
  accounts: { id: number; trade_name: string; city: string }[];
  products: {
    id: number;
    sku: string;
    name: string;
    stock_bags: number;
    price_cents: number;
  }[];
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [accountId, setAccountId] = useState<string>("");
  const [lines, setLines] = useState<{ product_id: string; bags: number }[]>([
    { product_id: "", bags: 4 },
  ]);

  const create = useMutation({
    mutationFn: () =>
      createOrder({
        data: {
          account_id: Number(accountId),
          lines: lines
            .filter((l) => l.product_id)
            .map((l) => ({
              product_id: Number(l.product_id),
              bags: Number(l.bags),
            })),
        },
      }),
    onSuccess: (order) => {
      toast.success(`Java opened ${order.order_no}`);
      setOpen(false);
      setAccountId("");
      setLines([{ product_id: "", bags: 4 }]);
      onCreated();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open ticket</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Wholesale ticket</DialogTitle>
          <DialogDescription>
            Java allocates bags immediately. Short lots will be refused.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!accountId) {
              toast.error("Choose a café");
              return;
            }
            create.mutate();
          }}
        >
          <div className="grid gap-1.5">
            <Label>Café</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.trade_name} · {a.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {lines.map((line, i) => (
              <div key={i} className="grid grid-cols-[1fr_5.5rem] gap-2">
                <Select
                  value={line.product_id}
                  onValueChange={(v) => {
                    const next = [...lines];
                    next[i] = { ...line, product_id: v };
                    setLines(next);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Lot" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name} · {p.stock_bags} left
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={1}
                  value={line.bags}
                  onChange={(e) => {
                    const next = [...lines];
                    next[i] = { ...line, bags: Number(e.target.value) };
                    setLines(next);
                  }}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setLines([...lines, { product_id: "", bags: 2 }])
              }
            >
              Add line
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={create.isPending}>
            {create.isPending ? "Allocating…" : "Commit through Java"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
