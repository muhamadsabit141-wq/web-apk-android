"use client";

import { motion } from "framer-motion";
import { FileText, Plus, CalendarCheck, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn, formatDate, getStreak } from "@/lib/utils";

export default function Dashboard() {
  const pages = useStore((s) => s.pages);
  const habits = useStore((s) => s.habits);
  const setCurrentPage = useStore((s) => s.setCurrentPage);
  const addPage = useStore((s) => s.addPage);
  const user = useStore((s) => s.user);

  const recentPages = Object.values(pages)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 6);

  const today = formatDate(new Date());
  const habitsCompletedToday = habits.filter((h) =>
    h.completedDates.includes(today)
  ).length;
  const totalHabits = habits.length;

  const handleNewPage = () => {
    const id = addPage("Untitled");
    setCurrentPage(id);
  };

  return (
    <div className="mx-auto w-full max-w-[900px] px-6 py-12 md:px-16">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user?.name || "there"} 👋
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Here&apos;s your workspace overview
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#2f2f2f] dark:bg-[#1e1e1e]"
        >
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <FileText size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Object.keys(pages).length}
          </p>
          <p className="text-sm text-gray-500">Total pages</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#2f2f2f] dark:bg-[#1e1e1e]"
        >
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
            <CalendarCheck
              size={18}
              className="text-green-600 dark:text-green-400"
            />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {habitsCompletedToday}/{totalHabits}
          </p>
          <p className="text-sm text-gray-500">Habits done today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#2f2f2f] dark:bg-[#1e1e1e]"
        >
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <TrendingUp
              size={18}
              className="text-amber-600 dark:text-amber-400"
            />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {habits.length > 0
              ? Math.max(...habits.map((h) => getStreak(h.completedDates)))
              : 0}
          </p>
          <p className="text-sm text-gray-500">Best streak</p>
        </motion.div>
      </div>

      {/* Recent pages */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent pages
          </h2>
          <button
            onClick={handleNewPage}
            className="flex items-center gap-1.5 rounded-lg bg-[#0F7DFF] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0b6ad4] transition-colors"
          >
            <Plus size={14} />
            New page
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentPages.map((page, i) => (
            <motion.button
              key={page.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => setCurrentPage(page.id)}
              className={cn(
                "flex flex-col items-start rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-gray-300 hover:shadow-md dark:border-[#2f2f2f] dark:bg-[#1e1e1e] dark:hover:border-[#3a3a3a]"
              )}
            >
              <span className="mb-2 text-2xl">
                {page.icon || "📄"}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate w-full">
                {page.title || "Untitled"}
              </span>
              <span className="mt-1 text-xs text-gray-400">
                {new Date(page.updatedAt).toLocaleDateString()}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Habit summary */}
      {habits.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Today&apos;s habits
          </h2>
          <div className="space-y-2">
            {habits.map((habit) => {
              const done = habit.completedDates.includes(today);
              return (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-[#2f2f2f] dark:bg-[#1e1e1e]"
                >
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full",
                      done ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                    )}
                    style={done ? {} : { backgroundColor: habit.color + "40" }}
                  />
                  <span
                    className={cn(
                      "flex-1 text-sm",
                      done
                        ? "text-gray-400 line-through"
                        : "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {habit.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    🔥 {getStreak(habit.completedDates)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
