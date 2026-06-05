"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function SearchView() {
  const pages = useStore((s) => s.pages);
  const setCurrentPage = useStore((s) => s.setCurrentPage);
  const setMobileTab = useStore((s) => s.setMobileTab);
  const [query, setQuery] = useState("");

  const allPages = Object.values(pages);
  const filtered = query
    ? allPages.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.content.toLowerCase().includes(query.toLowerCase())
      )
    : allPages.sort((a, b) => b.updatedAt - a.updatedAt);

  const handleSelect = (id: string) => {
    setCurrentPage(id);
    setMobileTab("home");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search header */}
      <div className="sticky top-0 z-10 bg-white px-4 pb-3 pt-2 dark:bg-[#191919]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages..."
            autoFocus
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0F7DFF] focus:outline-none focus:ring-2 focus:ring-[#0F7DFF]/20 dark:border-[#3a3a3a] dark:bg-[#1e1e1e] dark:text-gray-100"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {query && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search size={40} className="mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">
              No results for &ldquo;{query}&rdquo;
            </p>
          </div>
        )}

        {!query && (
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            Recent
          </p>
        )}

        <div className="space-y-1">
          {filtered.map((page, i) => (
            <motion.button
              key={page.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => handleSelect(page.id)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors active:bg-gray-100 dark:active:bg-[#2f2f2f]"
            >
              <span className="text-lg">{page.icon || "📄"}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {page.title || "Untitled"}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {new Date(page.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
