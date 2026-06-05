"use client";

import { useState } from "react";
import { Search, Clock, X } from "lucide-react";
import { useStore } from "@/lib/store";

export default function SearchView() {
  const pages = useStore((s) => s.pages);
  const setCurrentPage = useStore((s) => s.setCurrentPage);
  const setMobileTab = useStore((s) => s.setMobileTab);
  const [query, setQuery] = useState("");

  const activePages = Object.values(pages).filter((p) => !p.isArchived);

  const results = query
    ? activePages.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.blocks?.some((b) =>
            b.content.toLowerCase().includes(query.toLowerCase())
          )
      )
    : [];

  const recentPages = activePages
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 8);

  const handleSelect = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileTab("home");
  };

  return (
    <div className="px-4 py-4">
      {/* Search input */}
      <div className="relative mb-6">
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
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search results */}
      {query ? (
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          {results.length === 0 ? (
            <div className="py-12 text-center">
              <Search size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400">No pages found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handleSelect(page.id)}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-[#2f2f2f] dark:active:bg-[#363636]"
                >
                  <span className="shrink-0 text-xl">{page.icon || "📄"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {page.title || "Untitled"}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {page.blocks?.[0]?.content?.substring(0, 60) || "Empty page"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-gray-400">
            <Clock size={12} />
            Recent pages
          </div>
          <div className="space-y-1">
            {recentPages.map((page) => (
              <button
                key={page.id}
                onClick={() => handleSelect(page.id)}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-[#2f2f2f] dark:active:bg-[#363636]"
              >
                <span className="shrink-0 text-xl">{page.icon || "📄"}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {page.title || "Untitled"}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    {new Date(page.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
