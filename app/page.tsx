import { TrendingUp, Wrench, Building2, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentToolsTable } from "@/components/dashboard/RecentToolsTable";
import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/formatters";

export default async function DashboardPage() {
  const analytics = await api.getAnalytics();
  const { budget_overview, kpi_trends, cost_analytics } = analytics ?? {};

  const kpis = [
    {
      title:         "Monthly Budget",
      value:         formatCurrency(budget_overview.current_month_total),
      sub:           "30k",
      trend:         kpi_trends.budget_change,
      icon:          TrendingUp,
      gradient:      "from-emerald-400 to-teal-600",
    },
    {
      title:         "Active Tools",
      value:         "147",
      trend:         kpi_trends.tools_change,
      icon:          Wrench,
      gradient:      "from-blue-500 to-purple-600",
    },
    {
      title:         "Departments",
      value:         "8",
      trend:         kpi_trends.departments_change,
      icon:          Building2,
      gradient:      "from-orange-500 to-pink-600",
    },
    {
      title:         "Cost/User",
      value:         formatCurrency(cost_analytics.cost_per_user),
      trend:         kpi_trends.cost_per_user_change,
      icon:          Users,
      gradient:      "from-pink-500 to-red-600",
    },
  ];

  return (
    <>
      <Header />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight">Internal Tools Dashboard</h1>
          <p className="text-ui-muted mt-1 text-sm">
            Monitor and manage your organization's software tools and expenses
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => <KPICard key={kpi.title} {...kpi} />)}
        </div>

        <RecentToolsTable />
      </main>
    </>
  );
}