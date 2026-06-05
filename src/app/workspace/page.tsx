"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useStore } from "@/lib/store";
import Sidebar from "@/components/sidebar/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import PageEditor from "@/components/editor/PageEditor";
import HabitTracker from "@/components/habit-tracker/HabitTracker";

export default function WorkspacePage() {
  const user = useStore((s) => s.user);
  const currentPageId = useStore((s) => s.currentPageId);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const renderContent = () => {
    if (!currentPageId) return <Dashboard />;
    if (currentPageId === "__habits__") return <HabitTracker />;
    return <PageEditor pageId={currentPageId} />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#191919]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed left-4 top-4 z-30 rounded-lg bg-white p-2 text-gray-500 shadow-md hover:bg-gray-50 dark:bg-[#252525] dark:text-gray-400 dark:hover:bg-[#2f2f2f]"
          >
            <Menu size={18} />
          </button>
        )}
        {renderContent()}
      </main>
    </div>
  );
}
