import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listEvents } from "@/lib/api";
import { relative, serviceHost } from "@/lib/format";
import { ServiceChip } from "@/components/service-chip";
import { cn } from "@/lib/utils";
import phpSource from "@/stack/CatalogService.php?raw";
import javaSource from "@/stack/FulfillmentService.java?raw";
import sqlSource from "@/stack/schema.mariadb.sql?raw";
import type { ServiceName } from "@/lib/types";

export const Route = createFileRoute("/_app/stack")({
  component: StackPage,
});

const files: {
  id: ServiceName;
  file: string;
  source: string;
  blurb: string;
}[] = [
  {
    id: "php",
    file: "CatalogService.php",
    source: phpSource,
    blurb: "Lot book and price writes. PDO against MariaDB.",
  },
  {
    id: "java",
    file: "FulfillmentService.java",
    source: javaSource,
    blurb: "Ticket pipeline, stock allocation, roast states.",
  },
  {
    id: "mariadb",
    file: "schema.mariadb.sql",
    source: sqlSource,
    blurb: "InnoDB core: lots, tickets, cellar ledger.",
  },
];

function StackPage() {
  const [active, setActive] = useState<ServiceName>("php");
  const events = useQuery({ queryKey: ["events"], queryFn: () => listEvents() });
  const file = files.find((f) => f.id === active)!;

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-micro tracking-brand text-muted uppercase">
          Polyglot topology
        </p>
        <h2 className="font-display text-3xl leading-tight">The stack</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Three services, one cellar. The console in this preview is the
          operator desk; catalog traffic is PHP, fulfillment is Java, and every
          durable row lives in MariaDB.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Node
          service="php"
          title="Catalog"
          port=":8081"
          lines={["GET /lots", "POST /lots", "PDO → MariaDB"]}
        />
        <Node
          service="java"
          title="Fulfillment"
          port=":8082"
          lines={["POST /tickets", "POST /advance", "JDBC → MariaDB"]}
        />
        <Node
          service="mariadb"
          title="Core"
          port=":3306"
          lines={["products", "orders + lines", "stock_moves"]}
        />
      </div>

      <div className="flex flex-col gap-1 rounded-xl bg-surface p-4 font-mono text-xs text-muted shadow-[var(--shadow-border)] sm:text-sm">
        <p>
          <span className="text-subtle">01</span>{" "}
          <span className="text-fg">operator</span> → php://catalog · list lots
        </p>
        <p>
          <span className="text-subtle">02</span>{" "}
          <span className="text-fg">operator</span> → java://fulfillment · open
          ticket
        </p>
        <p>
          <span className="text-subtle">03</span>{" "}
          <span className="text-fg">java</span> SELECT … FOR UPDATE · allocate
        </p>
        <p>
          <span className="text-subtle">04</span>{" "}
          <span className="text-fg">mariadb</span> COMMIT orders, lines,
          stock_moves
        </p>
      </div>

      <section className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <div className="flex gap-1 overflow-x-auto border-b border-border px-2 pt-2">
          {files.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={cn(
                "h-11 shrink-0 rounded-t-md px-3 text-sm transition-colors duration-150",
                active === f.id
                  ? "bg-raised text-fg"
                  : "text-muted hover:text-fg",
              )}
            >
              {f.file}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-border bg-raised px-4 py-2">
          <ServiceChip service={file.id} />
          <p className="truncate text-xs text-subtle">{file.blurb}</p>
        </div>
        <pre className="max-h-96 overflow-auto p-4 font-mono text-micro leading-relaxed text-fg/90">
          {file.source}
        </pre>
      </section>

      <section>
        <h3 className="mb-3 font-display text-xl">Recent calls</h3>
        <ul className="divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]">
          {events.data?.map((event) => (
            <li
              key={event.id}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <ServiceChip service={event.service} />
                  <span className="font-mono text-micro text-subtle">
                    {serviceHost(event.service)}/{event.verb}
                  </span>
                </div>
                <p className="text-sm text-fg">{event.detail}</p>
              </div>
              <span className="font-mono text-micro text-subtle">
                {relative(event.created_at)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Node({
  service,
  title,
  port,
  lines,
}: {
  service: ServiceName;
  title: string;
  port: string;
  lines: string[];
}) {
  return (
    <article className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between">
        <ServiceChip service={service} />
        <span className="font-mono text-micro text-subtle">{port}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl leading-none">{title}</h3>
      <ul className="mt-3 space-y-1 font-mono text-micro text-muted">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </article>
  );
}
