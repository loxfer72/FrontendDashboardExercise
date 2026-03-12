import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title:         string;
  value:         string;
  sub?:          string;
  trend:         string;
  icon:          LucideIcon;
  gradient:      string;
}

export function KPICard({ title, value, sub, trend, icon: Icon, gradient }: KPICardProps) {
  return (
    <div className="rounded-2xl p-6 bg-ui-card border border-ui-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 animate-fade-in">
      <div className="flex items-start justify-between">
        <p className="text-sm text-ui-muted font-medium">{title}</p>
        <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight">
        {value}
        {sub && <span className="text-ui-muted font-normal text-lg">/{sub}</span>}
      </p>

      <span className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-linear-to-r ${gradient} text-xs font-semibold`}>
        {trend}
      </span>
    </div>
  );
}