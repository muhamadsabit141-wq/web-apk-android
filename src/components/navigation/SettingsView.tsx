"use client";

import { motion } from "framer-motion";
import { Moon, Sun, LogOut, User, FileText, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function SettingsView() {
  const user = useStore((s) => s.user);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const logout = useStore((s) => s.logout);
  const pages = useStore((s) => s.pages);
  const habits = useStore((s) => s.habits);

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Settings
      </h1>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-[#2f2f2f] dark:bg-[#1e1e1e]"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xl font-bold text-white">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {user?.name || "User"}
          </p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 grid grid-cols-2 gap-3"
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-[#2f2f2f] dark:bg-[#1e1e1e]">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <FileText size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Object.keys(pages).length}
          </p>
          <p className="text-xs text-gray-500">Pages</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-[#2f2f2f] dark:bg-[#1e1e1e]">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
            <User size={18} className="text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {habits.length}
          </p>
          <p className="text-xs text-gray-500">Habits</p>
        </div>
      </motion.div>

      {/* Options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <button
          onClick={toggleDarkMode}
          className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 transition-colors active:bg-gray-50 dark:border-[#2f2f2f] dark:bg-[#1e1e1e] dark:active:bg-[#252525]"
        >
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Sun size={20} className="text-amber-500" />
            ) : (
              <Moon size={20} className="text-indigo-500" />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </div>
          <div
            className={cn(
              "h-7 w-12 rounded-full p-0.5 transition-colors",
              darkMode ? "bg-[#0F7DFF]" : "bg-gray-300"
            )}
          >
            <div
              className={cn(
                "h-6 w-6 rounded-full bg-white shadow transition-transform",
                darkMode && "translate-x-5"
              )}
            />
          </div>
        </button>

        <button
          onClick={logout}
          className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 transition-colors active:bg-gray-50 dark:border-[#2f2f2f] dark:bg-[#1e1e1e] dark:active:bg-[#252525]"
        >
          <div className="flex items-center gap-3">
            <LogOut size={20} className="text-red-500" />
            <span className="text-sm font-medium text-red-500">Log out</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </motion.div>

      {/* Version */}
      <p className="mt-8 text-center text-xs text-gray-400">
        HabitsXD v1.0.0
      </p>
    </div>
  );
}
