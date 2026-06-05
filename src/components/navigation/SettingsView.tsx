"use client";

import {
  Moon,
  Sun,
  LogOut,
  Info,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Download,
  Trash2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function SettingsView() {
  const user = useStore((s) => s.user);
  const pages = useStore((s) => s.pages);
  const habits = useStore((s) => s.habits);
  const tasks = useStore((s) => s.getTasks());
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const logout = useStore((s) => s.logout);

  const activePages = Object.values(pages).filter((p) => !p.isArchived);
  const archivedPages = Object.values(pages).filter((p) => p.isArchived);

  const handleExportData = () => {
    const data = {
      user,
      pages,
      habits,
      tasks,
      exportDate: new Date().toISOString(),
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `habitsxd-backup-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 py-3">
      {/* Profile card — Android style */}
      <div className="mb-5 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-bold text-white">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-white">
            {user?.name || "User"}
          </p>
          <p className="truncate text-[13px] text-white/70">
            {user?.email || ""}
          </p>
        </div>
      </div>

      {/* Stats — horizontal chips */}
      <div className="mb-5 flex gap-2">
        <div className="flex-1 rounded-2xl bg-gray-50 px-4 py-3 text-center dark:bg-[#1e1e1e]">
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {activePages.length}
          </p>
          <p className="text-[11px] text-gray-400">Pages</p>
        </div>
        <div className="flex-1 rounded-2xl bg-gray-50 px-4 py-3 text-center dark:bg-[#1e1e1e]">
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {habits.length}
          </p>
          <p className="text-[11px] text-gray-400">Habits</p>
        </div>
        <div className="flex-1 rounded-2xl bg-gray-50 px-4 py-3 text-center dark:bg-[#1e1e1e]">
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {tasks.length}
          </p>
          <p className="text-[11px] text-gray-400">Tasks</p>
        </div>
      </div>

      {/* Settings list — Android style grouped list */}
      <div className="mb-4 overflow-hidden rounded-2xl bg-gray-50 dark:bg-[#1e1e1e]">
        {/* Preferences */}
        <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Preferences
        </p>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-gray-100 dark:active:bg-[#252525]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#252525] elevation-1">
            {darkMode ? (
              <Sun size={20} className="text-amber-500" />
            ) : (
              <Moon size={20} className="text-indigo-500" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
              Dark mode
            </p>
            <p className="text-[12px] text-gray-400">
              {darkMode ? "On" : "Off"}
            </p>
          </div>
          <div
            className={cn(
              "flex h-7 w-12 items-center rounded-full p-0.5 transition-colors",
              darkMode ? "bg-[#0F7DFF]" : "bg-gray-300 dark:bg-gray-600"
            )}
          >
            <div
              className={cn(
                "h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
                darkMode ? "translate-x-5" : "translate-x-0"
              )}
            />
          </div>
        </button>

        {/* Notifications */}
        <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-gray-100 dark:active:bg-[#252525] border-t border-gray-200 dark:border-[#2f2f2f]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#252525] elevation-1">
            <Bell size={20} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
              Notifications
            </p>
            <p className="text-[12px] text-gray-400">Manage alerts</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>

        {/* Data & Privacy */}
        <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-t border-gray-200 dark:border-[#2f2f2f]">
          Data & Privacy
        </p>

        {/* Export Data */}
        <button
          onClick={handleExportData}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-gray-100 dark:active:bg-[#252525]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#252525] elevation-1">
            <Download size={20} className="text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
              Export Data
            </p>
            <p className="text-[12px] text-gray-400">Backup your data</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>

        {/* Privacy */}
        <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-gray-100 dark:active:bg-[#252525] border-t border-gray-200 dark:border-[#2f2f2f]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#252525] elevation-1">
            <Shield size={20} className="text-purple-500" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
              Privacy & Security
            </p>
            <p className="text-[12px] text-gray-400">Manage permissions</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>

        {/* About & Help */}
        <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-t border-gray-200 dark:border-[#2f2f2f]">
          About & Help
        </p>

        {/* Help */}
        <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-gray-100 dark:active:bg-[#252525]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#252525] elevation-1">
            <HelpCircle size={20} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
              Help & Support
            </p>
            <p className="text-[12px] text-gray-400">Get assistance</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>

        {/* About */}
        <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-gray-100 dark:active:bg-[#252525] border-t border-gray-200 dark:border-[#2f2f2f]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#252525] elevation-1">
            <Info size={20} className="text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
              About HabitsXD
            </p>
            <p className="text-[12px] text-gray-400">Version 1.0.0</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 active:bg-red-100 dark:active:bg-red-900/30"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}

        <div className="mx-4 border-t border-gray-200 dark:border-[#2f2f2f]" />

        {/* Notifications — placeholder */}
        <div className="flex items-center gap-3 px-4 py-3.5 opacity-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#252525] elevation-1">
            <Bell size={20} className="text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
              Notifications
            </p>
            <p className="text-[12px] text-gray-400">Coming soon</p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>

        <div className="mx-4 border-t border-gray-200 dark:border-[#2f2f2f]" />

        {/* Privacy — placeholder */}
        <div className="flex items-center gap-3 px-4 py-3.5 opacity-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#252525] elevation-1">
            <Shield size={20} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
              Privacy & Security
            </p>
            <p className="text-[12px] text-gray-400">Coming soon</p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>
      </div>

      {/* About section */}
      <div className="mb-4 overflow-hidden rounded-2xl bg-gray-50 dark:bg-[#1e1e1e]">
        <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          About
        </p>

        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#252525] elevation-1">
            <Info size={20} className="text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
              HabitsXD
            </p>
            <p className="text-[12px] text-gray-400">
              Version 1.0.0
            </p>
          </div>
        </div>

        <div className="mx-4 border-t border-gray-200 dark:border-[#2f2f2f]" />

        <div className="flex items-center gap-3 px-4 py-3.5 opacity-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-[#252525] elevation-1">
            <HelpCircle size={20} className="text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
              Help & Feedback
            </p>
            <p className="text-[12px] text-gray-400">Coming soon</p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 text-[14px] font-semibold text-red-600 active:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:active:bg-red-900/20"
      >
        <LogOut size={18} />
        Sign out
      </button>
    </div>
  );
}
