import { STATUS_CONFIG } from "@/utils/constants";
import type { Tool } from "@/types";

export function StatusBadge({ status }: { status: Tool["status"] }) {
  const { label, className } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}