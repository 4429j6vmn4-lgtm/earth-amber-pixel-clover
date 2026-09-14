import { cn } from "@/lib/utils";
import { serviceLabel } from "@/lib/format";
import type { ServiceName } from "@/lib/types";

export function ServiceChip({
  service,
  className,
}: {
  service: ServiceName;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-micro tracking-wider text-muted uppercase",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          service === "php" && "bg-success",
          service === "java" && "bg-warning",
          service === "mariadb" && "bg-primary",
        )}
      />
      {serviceLabel(service)}
    </span>
  );
}
