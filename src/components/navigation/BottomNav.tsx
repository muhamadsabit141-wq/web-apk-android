"use client";

import { motion } from "framer-motion";
import {
  Home,
  Search,
  Plus,
  CalendarCheck,
  Settings,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { MobileTab } from "@/lib/types";

const TABS: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", icon: <Home size={22} /> },
  { id: "search", label: "Search", icon: <Search size={22} /> },
  { id: "add", label: "New", icon: <Plus size={22} /> },
  { id: "habits", label: "Habits", icon: <CalendarCheck size={22} /> },
  { id: "settings", label: "Settings", icon: <Settings size={22} /> },
];

export default function BottomNav() {
  const mobileTab = useStore((s) => s.mobileTab);
  const setMobileTab = useStore((s) => s.setMobileTab);
  const setCurrentPage = useStore((s) => s.setCurrentPage);
  const addPage = useStore((s) => s.addPage);

  const handleTabClick = (tab: MobileTab) => {
    if (tab === "add") {
      const id = addPage("Untitled");
      setCurrentPage(id);
      setMobileTab("home");
      return;
    }
    if (tab === "home") {
      setCurrentPage(null);
    } else if (tab === "habits") {
      setCurrentPage("__habits__");
    }
    setMobileTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-lg dark:border-[#2f2f2f] dark:bg-[#191919]/95 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {TABS.map((tab) => {
          const isActive = mobileTab === tab.id;
          const isAdd = tab.id === "add";

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-colors min-w-[56px]",
                isAdd && "relative -mt-3"
              )}
            >
              {isAdd ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F7DFF] text-white shadow-lg shadow-blue-500/25">
                  {tab.icon}
                </div>
              ) : (
                <>
                  <div
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "text-[#0F7DFF]"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                  >
                    {tab.icon}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      isActive
                        ? "text-[#0F7DFF]"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -top-0.5 h-0.5 w-5 rounded-full bg-[#0F7DFF]"
                    />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
