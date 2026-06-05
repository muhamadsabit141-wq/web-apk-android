"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, ArrowLeft, Search, MoreVertical } from "lucide-react";
import { useStore } from "@/lib/store";
import Sidebar from "@/components/sidebar/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import PageEditor from "@/components/editor/PageEditor";
import HabitTracker from "@/components/habit-tracker/HabitTracker";
import TasksView from "@/components/tasks/TasksView";
import BottomNav from "@/components/navigation/BottomNav";
import SearchView from "@/components/navigation/SearchView";
import SettingsView from "@/components/navigation/SettingsView";
import CommandPalette from "@/components/ui/CommandPalette";
import { AIAssistant } from "@/components/ai/AIAssistant";

export default function WorkspacePage() {
  const user = useStore((s) => s.user);
  const currentPageId = useStore((s) => s.currentPageId);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const mobileTab = useStore((s) => s.mobileTab);
  const setCurrentPage = useStore((s) => s.setCurrentPage);
  const pages = useStore((s) => s.pages);
  const toggleCommandPalette = useStore((s) => s.toggleCommandPalette);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const currentPage =
    currentPageId && currentPageId !== "__habits__"
      ? pages[currentPageId]
      : null;

  const showBackButton = currentPageId && mobileTab === "home";

  const getMobileTitle = () => {
    if (mobileTab === "search") return "Search";
    if (mobileTab === "tasks" || currentPageId === "__tasks__") return "Tasks";
    if (mobileTab === "settings") return "Settings";
    if (mobileTab === "habits" || currentPageId === "__habits__") return "Habit Tracker";
    if (currentPage) return currentPage.title || "Untitled";
    return "HabitsXD";
  };

  const renderMobileContent = () => {
    if (mobileTab === "search") return <SearchView />;
    if (mobileTab === "tasks" || currentPageId === "__tasks__")
      return <TasksView />;
    if (mobileTab === "settings") return <SettingsView />;
    if (mobileTab === "habits" || currentPageId === "__habits__")
      return <HabitTracker />;
    if (currentPageId && currentPageId !== "__habits__" && currentPageId !== "__tasks__")
      return <PageEditor pageId={currentPageId} />;
    return <Dashboard />;
  };

  const renderDesktopContent = () => {
    if (!currentPageId) return <Dashboard />;
    if (currentPageId === "__tasks__") return <TasksView />;
    if (currentPageId === "__habits__") return <HabitTracker />;
    return <PageEditor pageId={currentPageId} />;
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-white dark:bg-[#191919]">
      <Sidebar />
      <CommandPalette />

      <main className="flex-1 overflow-y-auto">
        {/* Desktop: top bar when sidebar collapsed */}
        {!sidebarOpen && (
          <div className="fixed left-0 right-0 top-0 z-30 hidden md:flex items-center gap-2 bg-white/80 px-4 py-2 backdrop-blur-lg dark:bg-[#191919]/80">
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#2f2f2f]"
            >
              <Menu size={18} />
            </button>
            <button
              onClick={toggleCommandPalette}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
            >
              <Search size={14} />
              <span>Search...</span>
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 text-[10px] dark:border-[#3a3a3a] dark:bg-[#1e1e1e]">
                Ctrl+K
              </kbd>
            </button>
          </div>
        )}

        {/* Mobile header — Android app bar style */}
        <div className="sticky top-0 z-20 md:hidden">
          <div className="flex h-14 items-center gap-1 bg-white px-2 dark:bg-[#1e1e1e] elevation-1">
            {/* Left action */}
            {showBackButton ? (
              <button
                onClick={() => setCurrentPage(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 active:bg-gray-100 dark:text-gray-200 dark:active:bg-[#2f2f2f]"
              >
                <ArrowLeft size={22} strokeWidth={1.8} />
              </button>
            ) : (
              <button
                onClick={toggleSidebar}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 active:bg-gray-100 dark:text-gray-200 dark:active:bg-[#2f2f2f]"
              >
                <Menu size={22} strokeWidth={1.8} />
              </button>
            )}

            {/* Title */}
            <div className="flex-1 min-w-0 px-1">
              <h1 className="truncate text-base font-semibold text-gray-900 dark:text-gray-50">
                {getMobileTitle()}
              </h1>
              {currentPage && mobileTab === "home" && (
                <p className="truncate text-[11px] text-gray-400 leading-tight">
                  {currentPage.icon || "📄"} {new Date(currentPage.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                </p>
              )}
            </div>

            {/* Right actions */}
            <button
              onClick={toggleCommandPalette}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 active:bg-gray-100 dark:text-gray-400 dark:active:bg-[#2f2f2f]"
            >
              <Search size={20} strokeWidth={1.8} />
            </button>
            <button
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 active:bg-gray-100 dark:text-gray-400 dark:active:bg-[#2f2f2f]"
            >
              <MoreVertical size={20} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="hidden md:block">
          {!sidebarOpen && <div className="h-12" />}
          {renderDesktopContent()}
        </div>
        <div className="md:hidden pb-[72px]">{renderMobileContent()}</div>
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}
