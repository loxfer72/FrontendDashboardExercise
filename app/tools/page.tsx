"use client";

import { useEffect, useState } from "react";
import { Plus, LayoutGrid, List, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolFilters } from "@/components/tools/ToolFilters";
import { AddToolModal } from "@/components/tools/AddToolModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchTools, toggleSelectTool, clearSelection, setPage } from "@/store/toolsSlice";
import { formatCurrency } from "@/utils/formatters";

const PER_PAGE = 12;

export default function ToolsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, filters, currentPage, selectedTools } = useAppSelector((s) => s.tools);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchTools());
  }, [dispatch]);

  // Filter
  const filtered = items.filter((t) => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.department && t.owner_department !== filters.department) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.search && !t.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const departments = [...new Set(items.map((t) => t.owner_department))].filter(Boolean).sort();
  const categories = [...new Set(items.map((t) => t.category))].filter(Boolean).sort();

  return (
    <>
      <Header />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tools Catalog</h1>
            <p className="text-light-muted dark:text-dark-muted text-sm mt-1">
              {filtered.length} tools found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-brand-purple text-white" : "hover:bg-light-border dark:hover:bg-dark-border"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-brand-purple text-white" : "hover:bg-light-border dark:hover:bg-dark-border"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple text-white text-sm font-medium hover:bg-brand-purple/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Tool
            </button>
          </div>
        </div>

        {selectedTools.length > 0 && (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-between animate-fade-in">
            <span className="text-sm font-medium text-brand-purple">
              {selectedTools.length} tool{selectedTools.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
              <button onClick={() => dispatch(clearSelection())} className="px-3 py-1.5 rounded-lg text-xs hover:bg-light-border dark:hover:bg-dark-border transition-colors">
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <ToolFilters 
            departments={departments}
            categories={categories} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20 text-light-muted dark:text-dark-muted animate-fade-in">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">No tools match your filters</p>
            <p className="text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
            {paginated.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                selected={selectedTools.includes(tool.id)}
                onSelect={(id) => dispatch(toggleSelectTool(id))}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border overflow-hidden animate-fade-in">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border">
                  <th className="px-4 py-3 text-left w-8"><input type="checkbox" className="accent-brand-purple" /></th>
                  {["Tool", "Category", "Department", "Users", "Cost", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-light-muted dark:text-dark-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((tool) => (
                  <tr key={tool.id} className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-bg dark:hover:bg-dark-bg transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedTools.includes(tool.id)} onChange={() => dispatch(toggleSelectTool(tool.id))} className="accent-brand-purple" />
                    </td>
                    <td className="px-4 py-3 font-medium">{tool.name}</td>
                    <td className="px-4 py-3 text-light-muted dark:text-dark-muted">{tool.category}</td>
                    <td className="px-4 py-3 text-light-muted dark:text-dark-muted">{tool.owner_department}</td>
                    <td className="px-4 py-3">{tool.active_users_count}</td>
                    <td className="px-4 py-3">{formatCurrency(tool.monthly_cost)}</td>
                    <td className="px-4 py-3"><StatusBadge status={tool.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => dispatch(setPage(i + 1))}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i + 1 ? "bg-brand-purple text-white" : "hover:bg-light-border dark:hover:bg-dark-border"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>

      {showModal && <AddToolModal categories={categories} onClose={() => setShowModal(false)} />}
    </>
  );
}