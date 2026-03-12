import { AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatters";
import type { Tool } from "@/types";

export function InsightCards({ tools }: { tools: Tool[] }) {
  const unused     = tools.filter((t) => t.status === "unused");
  const expiring   = tools.filter((t) => t.status === "expiring");
  const active     = tools.filter((t) => t.status === "active");
  const unusedCost = unused.reduce((acc, t) => acc + t.monthly_cost, 0);

  const cards = [
    { icon: TrendingDown, color: "text-red-500 bg-red-500/10",    title: "Cost Optimization", desc: `${unused.length} unused tools costing ${formatCurrency(unusedCost)}/month`,            href: "/tools", action: "Review unused tools →"  },
    { icon: AlertTriangle, color: "text-amber-500 bg-amber-500/10", title: "Expiring Soon",    desc: `${expiring.length} tool${expiring.length !== 1 ? "s" : ""} need renewal attention`, href: "/tools", action: "View expiring tools →" },
    { icon: CheckCircle,  color: "text-emerald-500 bg-emerald-500/10", title: "Active Stack",  desc: `${active.length} tools running smoothly`,                                            href: "/tools", action: "See all active →"      },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="rounded-2xl p-5 bg-ui-card border border-ui-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
            <card.icon className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-sm">{card.title}</h4>
          <p className="text-xs text-ui-muted mt-1">{card.desc}</p>
          <Link href={card.href} className="inline-block text-xs font-medium text-brand-purple mt-3 hover:underline">
            {card.action}
          </Link>
        </div>
      ))}
    </div>
  );
}