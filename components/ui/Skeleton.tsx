export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-ui-border rounded ${className}`} />
  );
}

export function KPICardSkeleton() {
  return (
    <div className="rounded-2xl p-6 bg-ui-card border border-ui-border">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-36 mt-4" />
      <Skeleton className="h-5 w-16 mt-2 rounded-full" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}