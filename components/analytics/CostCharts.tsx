"use client";

import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { useAppSelector } from "@/hooks/useRedux";
import type { Tool } from "@/types";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const PALETTE = ["#7C3AED","#2563EB","#EC4899","#10B981","#F59E0B","#EF4444"];

function useChartTheme() {
  const isDark = useAppSelector((s) => s.theme.isDark);
  return {
    grid: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    text: isDark ? "#6B7280" : "#64748B",
  };
}

export function MonthlySpendChart() {
  const { grid, text } = useChartTheme();
  const data = {
    labels:   ["Sep","Oct","Nov","Dec","Jan","Feb","Mar"],
    datasets: [{
      label: "Monthly Spend (€)",
      data:  [22000,24500,23800,26000,25400,27100,28750],
      borderColor:     "#7C3AED",
      backgroundColor: "rgba(124,58,237,0.1)",
      fill: true, tension: 0.4,
      pointBackgroundColor: "#7C3AED", pointRadius: 4,
    }],
  };
  return (
    <div className="rounded-2xl p-5 bg-ui-card border border-ui-border">
      <h3 className="font-semibold text-sm mb-4">Monthly Spend Evolution</h3>
      <Line data={data} options={{
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
        scales: {
          x: { grid: { color: grid }, ticks: { color: text } },
          y: { grid: { color: grid }, ticks: { color: text, callback: (v) => `€${Number(v)/1000}k` } },
        },
      }} />
    </div>
  );
}

export function DepartmentCostChart({ tools }: { tools: Tool[] }) {
  const { text } = useChartTheme();
  const deptMap  = tools.reduce((acc: Record<string, number>, t) => {
    acc[t.owner_department] = (acc[t.owner_department] || 0) + t.monthly_cost;
    return acc;
  }, {});
  return (
    <div className="rounded-2xl p-5 bg-ui-card border border-ui-border">
      <h3 className="font-semibold text-sm mb-4">Cost by Department</h3>
      <Doughnut
        data={{ labels: Object.keys(deptMap), datasets: [{ data: Object.values(deptMap), backgroundColor: PALETTE, borderWidth: 0 }] }}
        options={{ plugins: { legend: { position: "right", labels: { color: text, boxWidth: 12, padding: 16 } } }, cutout: "65%" }}
      />
    </div>
  );
}

export function TopToolsChart({ tools }: { tools: Tool[] }) {
  const { grid, text } = useChartTheme();
  const top = [...tools].sort((a, b) => b.monthly_cost - a.monthly_cost).slice(0, 8);
  return (
    <div className="rounded-2xl p-5 bg-ui-card border border-ui-border">
      <h3 className="font-semibold text-sm mb-4">Top Expensive Tools</h3>
      <Bar
        data={{
          labels:   top.map((t) => t.name),
          datasets: [{ label: "€/month", data: top.map((t) => t.monthly_cost), backgroundColor: "rgba(124,58,237,0.8)", borderRadius: 6 }],
        }}
        options={{
          indexAxis: "y" as const,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: grid }, ticks: { color: text, callback: (v) => `€${v}` } },
            y: { grid: { display: false }, ticks: { color: text } },
          },
        }}
      />
    </div>
  );
}