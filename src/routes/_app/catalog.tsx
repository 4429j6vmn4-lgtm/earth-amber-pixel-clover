import { type ReactNode, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProduct, listProducts } from "@/lib/api";
import { bagsLabel, money } from "@/lib/format";
import { cn } from "@/lib/utils";
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
import { Badge } from "@/components/ui/badge";
import type { NewProductInput } from "@/lib/types";

export const Route = createFileRoute("/_app/catalog")({
  component: CatalogPage,
});

const empty: NewProductInput = {
  sku: "",
  name: "",
  origin: "",
  process: "Washed",
  roast: "Medium",
  bag_grams: 340,
  price_cents: 2200,
  stock_bags: 12,
  notes: "",
};

function CatalogPage() {
  const qc = useQueryClient();
  const products = useQuery({
    queryKey: ["products"],
    queryFn: () => listProducts(),
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<NewProductInput>(empty);

  const create = useMutation({
    mutationFn: (input: NewProductInput) => createProduct({ data: input }),
    onSuccess: (lot) => {
      toast.success(`PHP catalog registered ${lot.sku}`);
      setOpen(false);
      setForm(empty);
      void qc.invalidateQueries();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-micro tracking-brand text-muted uppercase">
            php://catalog
          </p>
          <h2 className="font-display text-3xl leading-tight">Lot book</h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Origins, process, and the price book. New lots land in MariaDB
            through the PHP catalog service.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Register lot</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New lot</DialogTitle>
              <DialogDescription>
                PHP writes the row; MariaDB is the system of record.
              </DialogDescription>
            </DialogHeader>
            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                create.mutate({
                  ...form,
                  sku: form.sku.trim(),
                  name: form.name.trim(),
                  origin: form.origin.trim(),
                  price_cents: Number(form.price_cents),
                  bag_grams: Number(form.bag_grams),
                  stock_bags: Number(form.stock_bags),
                });
              }}
            >
              <Field label="SKU">
                <Input
                  required
                  value={form.sku}
                  placeholder="NL-XXX-09"
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
              </Field>
              <Field label="Name">
                <Input
                  required
                  value={form.name}
                  placeholder="Yirgacheffe Washed"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Origin" className="sm:col-span-2">
                <Input
                  required
                  value={form.origin}
                  placeholder="Yirgacheffe, Ethiopia"
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                />
              </Field>
              <Field label="Process">
                <Input
                  required
                  value={form.process}
                  onChange={(e) => setForm({ ...form, process: e.target.value })}
                />
              </Field>
              <Field label="Roast">
                <Input
                  required
                  value={form.roast}
                  onChange={(e) => setForm({ ...form, roast: e.target.value })}
                />
              </Field>
              <Field label="Bag grams">
                <Input
                  required
                  type="number"
                  min={100}
                  value={form.bag_grams}
                  onChange={(e) =>
                    setForm({ ...form, bag_grams: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Price (USD)">
                <Input
                  required
                  type="number"
                  step="0.01"
                  min={1}
                  value={(form.price_cents / 100).toFixed(2)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price_cents: Math.round(Number(e.target.value) * 100),
                    })
                  }
                />
              </Field>
              <Field label="Opening bags">
                <Input
                  required
                  type="number"
                  min={0}
                  value={form.stock_bags}
                  onChange={(e) =>
                    setForm({ ...form, stock_bags: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Cupping notes" className="sm:col-span-2">
                <Input
                  value={form.notes}
                  placeholder="Jasmine, bergamot…"
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2 mt-1">
                <Button type="submit" disabled={create.isPending} className="w-full">
                  {create.isPending ? "Writing…" : "Commit to MariaDB"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {products.data?.map((p) => (
            <li
              key={p.id}
              className="rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)] sm:px-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-2xl leading-none">{p.name}</h3>
                    <span className="font-mono text-micro text-subtle">
                      {p.sku}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{p.origin}</p>
                  {p.notes ? (
                    <p className="mt-1 text-sm italic text-subtle">{p.notes}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Badge>{p.process}</Badge>
                  <Badge>{p.roast}</Badge>
                  <Badge tone={p.stock_bags < 12 ? "warning" : "paper"}>
                    {bagsLabel(p.stock_bags)}
                  </Badge>
                  <span className="pl-1 font-display text-xl tabular-nums">
                    {money(p.price_cents)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </label>
  );
}
