"use client";

import { ExternalLink, MoreVertical } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/utils/formatters";
import type { Tool } from "@/types";

interface Props {
  tool:     Tool;
  selected: boolean;
  onSelect: (id: number) => void;
}

export function ToolCard({ tool, selected, onSelect }: Props) {
  return (
    <div className={`relative rounded-2xl p-5 bg-ui-card border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
      selected ? "border-brand-purple ring-2 ring-brand-purple/20" : "border-ui-border"
    }`}>
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onSelect(tool.id)}
        className="absolute top-4 left-4 accent-brand-purple"
      />

      <div className="flex items-start justify-between mb-3 pl-6">
        <div className="flex items-center gap-3">
          <img
            src={tool.icon_url || "/icons/placeholder.svg"}
            alt={tool.name}
            className="w-8 h-8 rounded-lg"
            onError={(e) => { e.currentTarget.src = "/icons/placeholder.svg"; }}
          />
          <div>
            <h3 className="font-semibold text-sm">{tool.name}</h3>
            <p className="text-xs text-ui-muted">{tool.vendor}</p>
          </div>
        </div>
        <button className="p-1 rounded hover:bg-ui-border transition-colors">
          <MoreVertical className="w-4 h-4 text-ui-muted" />
        </button>
      </div>

      <p className="text-xs text-ui-muted mb-4 line-clamp-2 pl-6">{tool.description}</p>

      <div className="flex items-center justify-between pl-6">
        <div>
          <p className="text-xs text-ui-muted">Monthly Cost</p>
          <p className="font-semibold text-sm">{formatCurrency(tool.monthly_cost)}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs text-ui-muted">{tool.active_users_count} users</p>
          <StatusBadge status={tool.status} />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-ui-border flex items-center justify-between pl-6">
        <span className="text-xs bg-ui-bg px-2 py-0.5 rounded-full text-ui-muted">
          Department: {tool.owner_department}
        </span>
        <span className="text-xs bg-ui-bg px-2 py-0.5 rounded-full text-ui-muted">
          Category: {tool.category}
        </span>
        
        <a href={tool.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded hover:bg-ui-border transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-ui-muted" />
        </a>
      </div>
    </div>
  );
}