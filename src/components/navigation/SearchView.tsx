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
    <div className="px-4 py-3">
      {/* Search input — Material style */}
      <div className="relative mb-5">
        <Search
          size={20}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pages and content..."
          autoFocus
          className="w-full rounded-2xl border-0 bg-gray-100 py-3.5 pl-11 pr-11 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F7DFF]/30 dark:bg-[#252525] dark:text-gray-100"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 active:bg-gray-200 dark:active:bg-[#363636]"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search results */}
      {query ? (
        <div>
          <p className="mb-2 px-1 text-[12px] font-medium text-gray-400">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          {results.length === 0 ? (
            <div className="py-16 text-center">
              <Search size={40} className="mx-auto mb-3 text-gray-200 dark:text-gray-700" />
              <p className="text-sm font-medium text-gray-400">No pages found</p>
              <p className="mt-1 text-xs text-gray-300 dark:text-gray-600">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {results.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handleSelect(page.id)}
                  className="flex w-full items-center gap-3 rounded-2xl p-3.5 text-left active:bg-gray-100 dark:active:bg-[#2f2f2f]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg dark:bg-[#2f2f2f]">
                    {page.icon || "📄"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-gray-900 dark:text-gray-100">
                      {page.title || "Untitled"}
                    </p>
                    <p className="truncate text-[12px] text-gray-400">
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
          <div className="mb-2 flex items-center gap-1.5 px-1 text-[12px] font-medium text-gray-400">
            <Clock size={13} />
            Recent pages
          </div>
          <div className="space-y-0.5">
            {recentPages.map((page) => (
              <button
                key={page.id}
                onClick={() => handleSelect(page.id)}
                className="flex w-full items-center gap-3 rounded-2xl p-3.5 text-left active:bg-gray-100 dark:active:bg-[#2f2f2f]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg dark:bg-[#2f2f2f]">
                  {page.icon || "📄"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-gray-900 dark:text-gray-100">
                    {page.title || "Untitled"}
                  </p>
                  <p className="text-[12px] text-gray-400">
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
