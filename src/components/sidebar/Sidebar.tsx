"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Star,
  Clock,
  ChevronsLeft,
  X,
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  CalendarCheck,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import PageTreeItem from "./PageTreeItem";

export default function Sidebar() {
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const pages = useStore((s) => s.pages);
  const pageOrder = useStore((s) => s.pageOrder);
  const addPage = useStore((s) => s.addPage);
  const setCurrentPage = useStore((s) => s.setCurrentPage);
  const currentPageId = useStore((s) => s.currentPageId);
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);

  const favorites = Object.values(pages).filter((p) => p.isFavorite);
  const recentPages = Object.values(pages)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);

  const handleNewPage = () => {
    const id = addPage("Untitled");
    setCurrentPage(id);
    if (window.innerWidth < 768) toggleSidebar();
  };

  const handleNavClick = (pageId: string | null) => {
    setCurrentPage(pageId);
    if (window.innerWidth < 768) toggleSidebar();
  };

  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const sidebarContent = (
    <div className="flex h-full w-[280px] md:w-[260px] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white">
            HX
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            HabitsXD
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-300"
        >
          <span className="hidden md:inline"><ChevronsLeft size={16} /></span>
          <span className="md:hidden"><X size={18} /></span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-1">
        <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-200/60 dark:text-gray-400 dark:hover:bg-[#2f2f2f]">
          <Search size={14} />
          Search
        </button>
      </div>

      {/* Nav items */}
      <div className="px-3 py-1 space-y-0.5">
        <button
          onClick={() => handleNavClick(null)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-2 py-2.5 md:py-1.5 text-sm transition-colors",
            currentPageId === null
              ? "bg-gray-200/80 text-gray-900 dark:bg-[#363636] dark:text-gray-100"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#2f2f2f]"
          )}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </button>
        <button
          onClick={() => handleNavClick("__habits__")}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-2 py-2.5 md:py-1.5 text-sm transition-colors",
            currentPageId === "__habits__"
              ? "bg-gray-200/80 text-gray-900 dark:bg-[#363636] dark:text-gray-100"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#2f2f2f]"
          )}
        >
          <CalendarCheck size={16} />
          Habit Tracker
        </button>
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {/* Favorites */}
        {favorites.length > 0 && (
          <div>
            <div className="mb-1 flex items-center gap-1 px-2 text-xs font-medium uppercase tracking-wider text-gray-400">
              <Star size={12} />
              Favorites
            </div>
            {favorites.map((p) => (
              <PageTreeItem key={p.id} pageId={p.id} onNavigate={() => { if (window.innerWidth < 768) toggleSidebar(); }} />
            ))}
          </div>
        )}

        {/* Recent */}
        {recentPages.length > 0 && (
          <div>
            <div className="mb-1 flex items-center gap-1 px-2 text-xs font-medium uppercase tracking-wider text-gray-400">
              <Clock size={12} />
              Recent
            </div>
            {recentPages.map((p) => (
              <PageTreeItem key={`recent-${p.id}`} pageId={p.id} onNavigate={() => { if (window.innerWidth < 768) toggleSidebar(); }} />
            ))}
          </div>
        )}

        {/* All pages */}
        <div>
          <div className="mb-1 flex items-center justify-between px-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Pages
            </span>
            <button
              onClick={handleNewPage}
              className="rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-300"
            >
              <Plus size={14} />
            </button>
          </div>
          {pageOrder.map((pageId) => (
            <PageTreeItem key={pageId} pageId={pageId} onNavigate={() => { if (window.innerWidth < 768) toggleSidebar(); }} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 dark:border-[#3a3a3a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xs font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
              {user?.name || "User"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleDarkMode}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-300"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={logout}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-200 hover:text-red-500 dark:hover:bg-[#3a3a3a]"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="relative hidden md:flex h-screen shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-[#F7F7F5] dark:border-[#2f2f2f] dark:bg-[#252525]"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] flex-col bg-[#F7F7F5] shadow-xl dark:bg-[#252525] md:hidden safe-area-top"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
