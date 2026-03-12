"use client";

import { Filter } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setFilter } from "@/store/toolsSlice";
import type { Tool } from "@/types";

interface Props { departments: string[], categories: string[] }
type FilterKey = "status" | "department" | "category";

const STATUSES: { value: Tool["status"] | ""; label: string }[] = [
  { value: "",         label: "All Statuses"  },
  { value: "active",   label: "Active"        },
  { value: "expiring", label: "Expiring"      },
  { value: "unused",   label: "Unused"        },
];

interface SelectProps {
  label:     string;
  filterKey: FilterKey;
  options:   { value: string; label: string }[];
  value:     string;
  onChange:  (key: FilterKey, value: string) => void;
}

function FilterSelect({ label, filterKey, options, value, onChange }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ui-muted uppercase tracking-wider">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(filterKey, e.target.value)}
        className="text-sm rounded-xl px-3 py-2 bg-ui-bg border border-ui-border focus:outline-none focus:ring-2 focus:ring-brand-purple/40 transition-all"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function ToolFilters({ departments,categories }: Props) {
  const dispatch = useAppDispatch();
  const filters  = useAppSelector((s) => s.tools.filters);

  const handleChange = (key: FilterKey, value: string) => {
    dispatch(setFilter({ key, value }));
  };

  return (
    <div className="rounded-2xl bg-ui-card border border-ui-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-brand-purple" />
        <span className="font-semibold text-sm">Filters</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FilterSelect
          label="Status"
          filterKey="status"
          value={filters.status}
          onChange={handleChange}
          options={STATUSES}
        />
        <FilterSelect
          label="Department"
          filterKey="department"
          value={filters.department}
          onChange={handleChange}
          options={[
            { value: "", label: "All Departments" },
            ...departments.map((d) => ({ value: d, label: d })),
          ]}
        />
        <FilterSelect
          label="Category"
          filterKey="category"
          value={filters.category}
          onChange={handleChange}
          options={[
            { value: "", label: "All Categories" },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
        />
      </div>
    </div>
  );
}