import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const tone: Record<
  OrderStatus,
  "neutral" | "paper" | "success" | "warning" | "danger"
> = {
  queued: "paper",
  roasting: "warning",
  packed: "neutral",
  shipped: "success",
  cancelled: "danger",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={tone[status]}>{statusLabel(status)}</Badge>;
}
