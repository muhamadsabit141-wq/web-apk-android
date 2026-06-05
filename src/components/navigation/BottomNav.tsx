"use client";

import { motion } from "framer-motion";
import {
  Home,
  Search,
  Plus,
  CalendarCheck,
  CheckSquare,
  Settings,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { MobileTab } from "@/lib/types";

const TABS: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", icon: <Home size={24} strokeWidth={1.8} /> },
  { id: "search", label: "Search", icon: <Search size={24} strokeWidth={1.8} /> },
  { id: "tasks", label: "Tasks", icon: <CheckSquare size={24} strokeWidth={1.8} /> },
  { id: "habits", label: "Habits", icon: <CalendarCheck size={24} strokeWidth={1.8} /> },
  { id: "settings", label: "Settings", icon: <Settings size={24} strokeWidth={1.8} /> },
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
    } else if (tab === "tasks") {
      setCurrentPage("__tasks__");
    }
    setMobileTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#1e1e1e] md:hidden safe-area-bottom elevation-2">
      <div className="flex items-stretch justify-around">
        {TABS.map((tab) => {
          const isActive = mobileTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
              )}
            >
              <>
                {isActive && (
                  <motion.div
                    layoutId="mobileNavPill"
                    className="absolute top-1 h-[3px] w-8 rounded-full bg-[#0F7DFF]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div
                  className={cn(
                    "flex h-8 w-16 items-center justify-center rounded-2xl transition-colors",
                    isActive
                      ? "bg-blue-50 text-[#0F7DFF] dark:bg-blue-900/20"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {tab.icon}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium leading-tight",
                    isActive
                      ? "text-[#0F7DFF]"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {tab.label}
                </span>
              </>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
