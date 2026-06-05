"use client";

import { useState } from "react";
import {
  Filter,
  X,
  ChevronDown,
  Plus,
  ArrowUpDown,
} from "lucide-react";
import type { Task } from "@/lib/types";

export interface FilterConfig {
  field: "priority" | "status" | "dueDate";
  operator: "equals" | "contains" | "greater" | "less";
  value: string;
}

export interface SortConfig {
  field: "title" | "priority" | "status" | "dueDate" | "created";
  order: "asc" | "desc";
}

interface TaskFilterProps {
  tasks: Task[];
  onFiltersChange?: (filters: FilterConfig[]) => void;
  onSortChange?: (sort: SortConfig) => void;
}

export default function TaskFilter({
  tasks,
  onFiltersChange,
  onSortChange,
}: TaskFilterProps) {
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [sort, setSort] = useState<SortConfig>({
    field: "dueDate",
    order: "asc",
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const handleAddFilter = (field: FilterConfig["field"]) => {
    const newFilter: FilterConfig = {
      field,
      operator: "equals",
      value: "",
    };
    const newFilters = [...filters, newFilter];
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleUpdateFilter = (
    index: number,
    updates: Partial<FilterConfig>
  ) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSort = (field: SortConfig["field"]) => {
    const newSort: SortConfig = {
      field,
      order: sort.field === field && sort.order === "asc" ? "desc" : "asc",
    };
    setSort(newSort);
    onSortChange?.(newSort);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Filter & Sort controls */}
      <div className="flex gap-2 flex-wrap items-center">
        {/* Filter button */}
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#2f2f2f] text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-sm font-medium"
          >
            <Filter size={14} />
            Filter
            <ChevronDown size={14} />
          </button>

          {showFilterMenu && (
            <div className="absolute top-full mt-1 left-0 z-10 rounded-lg bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2f2f2f] shadow-md p-2">
              {[
                { label: "Priority", value: "priority" as const },
                { label: "Status", value: "status" as const },
                { label: "Due Date", value: "dueDate" as const },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleAddFilter(option.value);
                    setShowFilterMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort button */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#2f2f2f] text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-sm font-medium"
          >
            <ArrowUpDown size={14} />
            Sort
            <ChevronDown size={14} />
          </button>

          {showSortMenu && (
            <div className="absolute top-full mt-1 left-0 z-10 rounded-lg bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2f2f2f] shadow-md p-2">
              {[
                { label: "Due Date", value: "dueDate" as const },
                { label: "Priority", value: "priority" as const },
                { label: "Title", value: "title" as const },
                { label: "Created", value: "created" as const },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleSort(option.value);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded ${
                    sort.field === option.value ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  {option.label} {sort.field === option.value && (sort.order === "asc" ? "↑" : "↓")}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active filters count */}
        {filters.length > 0 && (
          <div className="text-xs font-medium text-gray-500">
            {filters.length} filter{filters.length !== 1 ? "s" : ""} active
          </div>
        )}
      </div>

      {/* Active filters display */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/40 text-xs"
            >
              <span className="text-blue-700 dark:text-blue-300">
                {filter.field}: {filter.value || "..."}
              </span>
              <button
                onClick={() => handleRemoveFilter(index)}
                className="text-blue-500 hover:text-blue-700"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
