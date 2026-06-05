"use client";

import {
  Moon,
  Sun,
  LogOut,
  Info,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function SettingsView() {
  const user = useStore((s) => s.user);
  const pages = useStore((s) => s.pages);
  const habits = useStore((s) => s.habits);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const logout = useStore((s) => s.logout);

  const activePages = Object.values(pages).filter((p) => !p.isArchived);
  const archivedPages = Object.values(pages).filter((p) => p.isArchived);

  return (
    <div className="px-4 py-4">
      {/* Profile card */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold text-white backdrop-blur-sm">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-semibold text-white">{user?.name || "User"}</p>
          <p className="text-sm text-white/70">{user?.email || ""}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center dark:border-[#2f2f2f] dark:bg-[#1e1e1e]">
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {activePages.length}
          </p>
          <p className="text-[11px] text-gray-400">Pages</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center dark:border-[#2f2f2f] dark:bg-[#1e1e1e]">
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {habits.length}
          </p>
          <p className="text-[11px] text-gray-400">Habits</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center dark:border-[#2f2f2f] dark:bg-[#1e1e1e]">
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {archivedPages.length}
          </p>
          <p className="text-[11px] text-gray-400">Archived</p>
        </div>
      </div>

      {/* Settings items */}
      <div className="space-y-1">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
          Preferences
        </p>

        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-[#2f2f2f]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-[#2f2f2f]">
            {darkMode ? (
              <Sun size={18} className="text-yellow-500" />
            ) : (
              <Moon size={18} className="text-indigo-500" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Appearance
            </p>
            <p className="text-xs text-gray-400">
              {darkMode ? "Dark mode" : "Light mode"}
            </p>
          </div>
          <div
            className={cn(
              "flex h-7 w-12 items-center rounded-full p-1 transition-colors",
              darkMode ? "bg-[#0F7DFF]" : "bg-gray-300"
            )}
          >
            <div
              className={cn(
                "h-5 w-5 rounded-full bg-white shadow transition-transform",
                darkMode ? "translate-x-5" : "translate-x-0"
              )}
            />
          </div>
        </button>
      </div>

      {/* About */}
      <div className="mt-6 space-y-1">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
          About
        </p>
        <div className="flex items-center gap-3 rounded-xl p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-[#2f2f2f]">
            <Info size={18} className="text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              HabitsXD
            </p>
            <p className="text-xs text-gray-400">
              Version 1.0.0 — Built with Next.js
            </p>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="mt-6">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-medium text-red-600 transition-colors active:bg-red-100 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
}
