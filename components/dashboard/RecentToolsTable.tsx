"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, MoreVertical, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/formatters";
import { api } from "@/utils/api";
import type { Tool } from "@/types";

type SortKey = "name" | "monthly_cost";

export function RecentToolsTable() {
  const [tools,   setTools]   = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page,    setPage]    = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    api.getRecentTools()
      .then(setTools)
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...tools].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === "string" && typeof bv === "string")
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  const paginated  = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(sorted.length / PER_PAGE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
    : <ChevronDown className="w-3 h-3 opacity-30" />;

  const COLUMNS = [
    { label: "Tool",         sortKey: "name"         as SortKey, sortable: true  },
    { label: "Department",   sortKey: null,                      sortable: false },
    { label: "Users",        sortKey: null,                      sortable: false },
    { label: "Monthly Cost", sortKey: "monthly_cost" as SortKey, sortable: true  },
    { label: "Status",       sortKey: null,                      sortable: false },
    { label: "",             sortKey: null,                      sortable: false },
  ];

  return (
    <div className="rounded-2xl bg-ui-card border border-ui-border overflow-hidden animate-slide-up">
      <div className="flex items-center justify-between px-6 py-4 border-b border-ui-border">
        <h2 className="font-semibold">Recent Tools</h2>
        <div className="flex items-center gap-1.5 text-xs text-ui-muted">
          <Calendar className="w-3.5 h-3.5" />
          Last 30 days
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ui-border">
              {COLUMNS.map((col, i) => (
                <th
                  key={i}
                  onClick={() => col.sortable && col.sortKey && handleSort(col.sortKey)}
                  className={`px-6 py-3 text-left text-xs font-medium text-ui-muted uppercase tracking-wider ${
                    col.sortable ? "cursor-pointer hover:text-ui-text select-none" : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && col.sortKey && <SortIcon k={col.sortKey} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(8)].map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              : paginated.map((tool) => (
                <tr
                  key={tool.id}
                  className="border-b border-ui-border last:border-0 hover:bg-ui-bg transition-colors group/row"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={tool.icon_url || "/icons/placeholder.svg"}
                        alt={tool.name}
                        className="w-6 h-6 rounded"
                        onError={(e) => { e.currentTarget.src = "/icons/placeholder.svg"; }}
                      />
                      <span className="font-medium">{tool.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-ui-muted">{tool.owner_department}</td>
                  <td className="px-6 py-4">{tool.active_users_count}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(tool.monthly_cost)}</td>
                  <td className="px-6 py-4"><StatusBadge status={tool.status} /></td>
                  <td className="px-6 py-4">
                    <button className="opacity-0 group-hover/row:opacity-100 p-1 rounded hover:bg-ui-border transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-ui-border">
          <p className="text-xs text-ui-muted">
            {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, tools.length)} of {tools.length}
          </p>
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  page === i + 1 ? "bg-brand-purple text-white" : "hover:bg-ui-border"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}