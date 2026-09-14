import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { listProducts, listStockMoves, receiveStock } from "@/lib/api";
import { bagsLabel, relative } from "@/lib/format";
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
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/cellar")({
  component: CellarPage,
});

function CellarPage() {
  const qc = useQueryClient();
  const products = useQuery({
    queryKey: ["products"],
    queryFn: () => listProducts(),
  });
  const moves = useQuery({
    queryKey: ["moves"],
    queryFn: () => listStockMoves(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-micro tracking-brand text-muted uppercase">
            mariadb://core
          </p>
          <h2 className="font-display text-3xl leading-tight">Cellar</h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            On-hand bags and the movement ledger. Receives write through
            MariaDB; Java only allocates, never invents stock.
          </p>
        </div>
        <ReceiveDialog
          products={products.data ?? []}
          onReceived={() => void qc.invalidateQueries()}
        />
      </div>

      <section className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-border font-mono text-micro tracking-wider text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Lot</th>
              <th className="px-4 py-3 font-medium">Origin</th>
              <th className="px-4 py-3 font-medium">Roast</th>
              <th className="px-4 py-3 text-right font-medium">On hand</th>
            </tr>
          </thead>
          <tbody>
            {products.data?.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <p className="text-fg">{p.name}</p>
                  <p className="font-mono text-micro text-subtle">{p.sku}</p>
                </td>
                <td className="px-4 py-3 text-muted">{p.origin}</td>
                <td className="px-4 py-3">
                  <Badge>{p.roast}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`font-display text-xl tabular-nums ${
                      p.stock_bags < 12 ? "text-warning" : "text-fg"
                    }`}
                  >
                    {p.stock_bags}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3 className="mb-3 font-display text-xl">Movement ledger</h3>
        <ul className="divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]">
          {moves.data?.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-fg">
                  {m.product_name}{" "}
                  <span className="font-mono text-micro text-subtle">
                    {m.sku}
                  </span>
                </p>
                <p className="font-mono text-micro text-subtle">
                  {m.reason}
                  {m.ref ? ` · ${m.ref}` : ""} · {relative(m.created_at)}
                </p>
              </div>
              <span
                className={`font-mono text-sm tabular-nums ${
                  m.delta_bags < 0 ? "text-danger" : "text-success"
                }`}
              >
                {m.delta_bags > 0 ? "+" : ""}
                {bagsLabel(m.delta_bags)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ReceiveDialog({
  products,
  onReceived,
}: {
  products: { id: number; sku: string; name: string }[];
  onReceived: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [bags, setBags] = useState(12);
  const [reason, setReason] = useState("receive");

  const receive = useMutation({
    mutationFn: () =>
      receiveStock({
        data: {
          product_id: Number(productId),
          bags,
          reason,
        },
      }),
    onSuccess: (lot) => {
      toast.success(`MariaDB received ${bags} bags of ${lot.sku}`);
      setOpen(false);
      onReceived();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Receive roast</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receive into cellar</DialogTitle>
          <DialogDescription>
            A roast batch landing in MariaDB. Does not go through Java.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!productId) {
              toast.error("Choose a lot");
              return;
            }
            receive.mutate();
          }}
        >
          <div className="grid gap-1.5">
            <Label>Lot</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select lot" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name} · {p.sku}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5">
              <Label>Bags</Label>
              <Input
                type="number"
                min={1}
                value={bags}
                onChange={(e) => setBags(Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1.5">
              <Label>Reason</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={receive.isPending}>
            {receive.isPending ? "Writing…" : "Write to MariaDB"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
