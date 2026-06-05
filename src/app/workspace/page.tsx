"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import Sidebar from "@/components/sidebar/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import PageEditor from "@/components/editor/PageEditor";
import HabitTracker from "@/components/habit-tracker/HabitTracker";
import BottomNav from "@/components/navigation/BottomNav";
import SearchView from "@/components/navigation/SearchView";
import SettingsView from "@/components/navigation/SettingsView";

export default function WorkspacePage() {
  const user = useStore((s) => s.user);
  const currentPageId = useStore((s) => s.currentPageId);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const mobileTab = useStore((s) => s.mobileTab);
  const setCurrentPage = useStore((s) => s.setCurrentPage);
  const pages = useStore((s) => s.pages);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const currentPage = currentPageId && currentPageId !== "__habits__"
    ? pages[currentPageId]
    : null;

  const renderMobileContent = () => {
    if (mobileTab === "search") return <SearchView />;
    if (mobileTab === "settings") return <SettingsView />;
    if (mobileTab === "habits" || currentPageId === "__habits__") return <HabitTracker />;
    if (currentPageId && currentPageId !== "__habits__") return <PageEditor pageId={currentPageId} />;
    return <Dashboard />;
  };

  const renderDesktopContent = () => {
    if (!currentPageId) return <Dashboard />;
    if (currentPageId === "__habits__") return <HabitTracker />;
    return <PageEditor pageId={currentPageId} />;
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-white dark:bg-[#191919]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Desktop: hamburger menu when sidebar collapsed */}
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed left-4 top-4 z-30 hidden md:flex rounded-lg bg-white p-2 text-gray-500 shadow-md hover:bg-gray-50 dark:bg-[#252525] dark:text-gray-400 dark:hover:bg-[#2f2f2f]"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Mobile header */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-white/95 px-4 py-3 backdrop-blur-lg dark:bg-[#191919]/95 md:hidden">
          {currentPageId && mobileTab === "home" ? (
            <button
              onClick={() => setCurrentPage(null)}
              className="flex items-center gap-1 rounded-lg p-1.5 text-gray-500 active:bg-gray-100 dark:text-gray-400"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-1 rounded-lg p-1.5 text-gray-500 active:bg-gray-100 dark:text-gray-400"
            >
              <Menu size={20} />
            </button>
          )}

          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
            {mobileTab === "search"
              ? "Search"
              : mobileTab === "settings"
                ? "Settings"
                : mobileTab === "habits" || currentPageId === "__habits__"
                  ? "Habit Tracker"
                  : currentPage
                    ? currentPage.title || "Untitled"
                    : "HabitsXD"}
          </span>

          <div className="w-8" />
        </div>

        {/* Content */}
        <div className="hidden md:block">{renderDesktopContent()}</div>
        <div className="md:hidden pb-20">{renderMobileContent()}</div>
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}
