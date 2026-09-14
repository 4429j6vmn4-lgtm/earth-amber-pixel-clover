import { formatDistanceToNow } from "date-fns";
import type { OrderStatus, ServiceName } from "./types";

export function money(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function bagsLabel(n: number): string {
  return `${n} ${n === 1 ? "bag" : "bags"}`;
}

export function relative(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "queued":
      return "Queued";
    case "roasting":
      return "Roasting";
    case "packed":
      return "Packed";
    case "shipped":
      return "Shipped";
    case "cancelled":
      return "Cancelled";
  }
}

export function nextStatus(status: OrderStatus): OrderStatus | null {
  switch (status) {
    case "queued":
      return "roasting";
    case "roasting":
      return "packed";
    case "packed":
      return "shipped";
    default:
      return null;
  }
}

export function nextStatusLabel(status: OrderStatus): string | null {
  const next = nextStatus(status);
  if (!next) return null;
  switch (next) {
    case "roasting":
      return "Start roast";
    case "packed":
      return "Mark packed";
    case "shipped":
      return "Ship";
    default:
      return null;
  }
}

export function serviceLabel(service: ServiceName): string {
  switch (service) {
    case "php":
      return "PHP";
    case "java":
      return "Java";
    case "mariadb":
      return "MariaDB";
  }
}

export function serviceHost(service: ServiceName): string {
  switch (service) {
    case "php":
      return "php://catalog";
    case "java":
      return "java://fulfillment";
    case "mariadb":
      return "mariadb://core";
  }
}
