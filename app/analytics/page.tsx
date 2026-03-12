"use client";

import { useEffect } from "react";
import { TrendingUp, Users, Target, BarChart3 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MonthlySpendChart, DepartmentCostChart, TopToolsChart } from "@/components/analytics/CostCharts";
import { InsightCards } from "@/components/analytics/InsightCards";
import { KPICard } from "@/components/dashboard/KPICard";
import { KPICardSkeleton } from "@/components/ui/Skeleton";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchAnalytics, setTimeRange } from "@/store/analyticsSlice";
import { fetchTools } from "@/store/toolsSlice";
import { formatCurrency } from "@/utils/formatters";

const TIME_RANGES = ["30d", "90d", "1y"] as const;

export default function AnalyticsPage() {
  const dispatch  = useAppDispatch();
  const { data, loading, timeRange } = useAppSelector((s) => s.analytics);
  const tools     = useAppSelector((s) => s.tools.items);

  useEffect(() => {
    dispatch(fetchAnalytics());
    if (tools.length === 0) dispatch(fetchTools());
  }, [dispatch]);

  const kpis = data ? [
    { title: "Monthly Total",
      value: formatCurrency(data.budget_overview.current_month_total),
      trend: `+${data.budget_overview.trend_percentage}%`,
      icon: TrendingUp,
      gradient: "from-emerald-400 to-teal-600" },

    { title: "Budget Utilization",
      value: data.budget_overview.budget_utilization,
      trend: data.kpi_trends.budget_change,
      icon: Target,
      gradient: "from-orange-500 to-pink-600"},

    { title: "Active Users",
      value: String(data.cost_analytics.active_users),
      trend: `/${data.cost_analytics.total_users} total`,
      icon: BarChart3,
      gradient: "from-blue-500 to-purple-600" },

    { title: "Cost / User",
      value: formatCurrency(data.cost_analytics.cost_per_user),
      trend: data.kpi_trends.cost_per_user_change,
      icon: Users,
      gradient: "from-pink-500 to-red-600"  },
  ] : [];

  return (
    <>
      <Header />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-ui-muted mt-1 text-sm">
              Cost &amp; usage insights across your tool stack
            </p>
          </div>
          <div className="flex rounded-xl border border-ui-border overflow-hidden">
            {TIME_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => dispatch(setTimeRange(r))}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  timeRange === r ? "bg-brand-purple text-white" : "hover:bg-ui-border"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {loading
            ? [...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)
            : kpis.map((kpi) => <KPICard key={kpi.title} {...kpi} />)
          }
        </div>

        <div className="mb-6 animate-slide-up">
          <InsightCards tools={tools} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6 animate-slide-up">
          <MonthlySpendChart />
          {tools.length > 0 && <DepartmentCostChart tools={tools} />}
        </div>

        {tools.length > 0 && <TopToolsChart tools={tools} />}
      </main>
    </>
  );
}