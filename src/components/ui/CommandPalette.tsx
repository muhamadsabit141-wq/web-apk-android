"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  CalendarCheck,
  LayoutDashboard,
  Moon,
  Sun,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function CommandPalette() {
  const open = useStore((s) => s.commandPaletteOpen);
  const toggleCommandPalette = useStore((s) => s.toggleCommandPalette);
  const pages = useStore((s) => s.pages);
  const setCurrentPage = useStore((s) => s.setCurrentPage);
  const addPage = useStore((s) => s.addPage);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [toggleCommandPalette]);

  useEffect(() => {
    if (open) {
      /* eslint-disable react-hooks/set-state-in-effect -- resetting state when dialog opens */
      setQuery("");
      setSelected(0);
      /* eslint-enable react-hooks/set-state-in-effect */
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const pageItems = Object.values(pages)
    .filter((p) => !p.isArchived)
    .filter(
      (p) =>
        !query || p.title.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      label: p.title || "Untitled",
      icon: p.icon || "📄",
      type: "page" as const,
    }));

  const actions = [
    { id: "__new__", label: "New page", icon: <Plus size={16} />, type: "action" as const },
    { id: "__dashboard__", label: "Dashboard", icon: <LayoutDashboard size={16} />, type: "action" as const },
    { id: "__habits__", label: "Habit Tracker", icon: <CalendarCheck size={16} />, type: "action" as const },
    {
      id: "__theme__",
      label: darkMode ? "Switch to light mode" : "Switch to dark mode",
      icon: darkMode ? <Sun size={16} /> : <Moon size={16} />,
      type: "action" as const,
    },
  ].filter(
    (a) => !query || a.label.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [...pageItems, ...actions];

  const handleSelect = (item: { id: string; type: string }) => {
    toggleCommandPalette();
    if (item.type === "page") {
      setCurrentPage(item.id);
    } else if (item.id === "__new__") {
      const id = addPage("Untitled");
      setCurrentPage(id);
    } else if (item.id === "__dashboard__") {
      setCurrentPage(null);
    } else if (item.id === "__habits__") {
      setCurrentPage("__habits__");
    } else if (item.id === "__theme__") {
      toggleDarkMode();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && allItems[selected]) {
      e.preventDefault();
      handleSelect(allItems[selected]);
    } else if (e.key === "Escape") {
      toggleCommandPalette();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-[15vh] px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) toggleCommandPalette();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-[#3a3a3a] dark:bg-[#252525]"
          >
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-[#3a3a3a]">
              <Search size={18} className="shrink-0 text-gray-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search pages or type a command..."
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
              />
              <kbd className="hidden sm:inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:border-[#3a3a3a] dark:bg-[#1e1e1e]">
                ESC
              </kbd>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-2">
              {pageItems.length > 0 && (
                <div className="mb-1">
                  <p className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Pages
                  </p>
                  {pageItems.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        selected === i
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-[#2f2f2f]"
                      )}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {actions.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Actions
                  </p>
                  {actions.map((item, i) => {
                    const globalIdx = pageItems.length + i;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          selected === globalIdx
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-[#2f2f2f]"
                        )}
                      >
                        <span className="text-gray-500 dark:text-gray-400">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {allItems.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-400">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
