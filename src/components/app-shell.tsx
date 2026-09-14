import { Link } from "@tanstack/react-router";
import { Coffee, Boxes, Layers3, LayoutDashboard, ScrollText } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ServiceChip } from "@/components/service-chip";

const nav = [
  { to: "/", label: "Desk", icon: LayoutDashboard },
  { to: "/catalog", label: "Catalog", icon: Coffee },
  { to: "/orders", label: "Orders", icon: ScrollText },
  { to: "/cellar", label: "Cellar", icon: Boxes },
  { to: "/stack", label: "Stack", icon: Layers3 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-5 pb-0 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-micro tracking-brand text-muted uppercase">
                Wholesale coffee
              </p>
              <h1 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">
                Northline
              </h1>
            </div>
            <div className="hidden items-center gap-4 pt-2 sm:flex">
              <ServiceChip service="php" />
              <ServiceChip service="java" />
              <ServiceChip service="mariadb" />
            </div>
          </div>
          <nav className="-mb-px flex gap-1 overflow-x-auto">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 shrink-0 items-center gap-2 border-b-2 border-transparent px-3 text-sm text-muted transition-colors duration-150",
                  "hover:text-fg",
                )}
                activeProps={{
                  className: "border-primary text-fg",
                }}
                activeOptions={
                  item.to === "/" ? { exact: true } : undefined
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
