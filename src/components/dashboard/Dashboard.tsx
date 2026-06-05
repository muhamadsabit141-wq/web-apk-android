"use client";

import { motion } from "framer-motion";
import { FileText, Plus, CalendarCheck, TrendingUp, Clock, CheckSquare } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn, formatDate, getStreak } from "@/lib/utils";
import Calendar from "@/components/calendar/Calendar";

export default function Dashboard() {
  const pages = useStore((s) => s.pages);
  const habits = useStore((s) => s.habits);
  const tasks = useStore((s) => s.getTasks());
  const setCurrentPage = useStore((s) => s.setCurrentPage);
  const addPage = useStore((s) => s.addPage);
  const user = useStore((s) => s.user);

  const activePages = Object.values(pages).filter((p) => !p.isArchived);
  const recentPages = activePages
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 6);

  const today = formatDate(new Date());
  const habitsCompletedToday = habits.filter((h) =>
    h.completedDates.includes(today)
  ).length;
  const totalHabits = habits.length;

  // Get upcoming tasks (next 7 days)
  const upcomingTasks = tasks
    .filter(
      (t) =>
        t.status !== "done" &&
        t.dueDate &&
        t.dueDate >= Date.now() &&
        t.dueDate <= Date.now() + 7 * 86400000
    )
    .sort((a, b) => (a.dueDate ?? 0) - (b.dueDate ?? 0))
    .slice(0, 5);

  const overdueTasks = tasks.filter(
    (t) => t.status !== "done" && t.dueDate && t.dueDate < Date.now()
  );

  const handleNewPage = () => {
    const id = addPage("Untitled");
    setCurrentPage(id);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-4 md:px-16 md:py-12">
      {/* Welcome — mobile: compact card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 md:mb-10"
      >
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {greeting()}, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="mt-0.5 text-[13px] md:text-base text-gray-400">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </motion.div>

      {/* Stats row — mobile: horizontal scroll cards */}
      <div className="mb-5 md:mb-10 flex gap-3 md:grid md:grid-cols-4 overflow-x-auto pb-1 md:pb-0 md:overflow-visible">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex min-w-[130px] flex-1 items-center gap-3 rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/15 md:flex-col md:items-start md:gap-0 md:border md:border-gray-200 md:bg-white md:shadow-sm md:dark:border-[#2f2f2f] md:dark:bg-[#1e1e1e]"
        >
          <div className="flex h-10 w-10 md:mb-3 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <FileText size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {activePages.length}
            </p>
            <p className="text-xs text-gray-500">Pages</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex min-w-[130px] flex-1 items-center gap-3 rounded-2xl bg-green-50 p-4 dark:bg-green-900/15 md:flex-col md:items-start md:gap-0 md:border md:border-gray-200 md:bg-white md:shadow-sm md:dark:border-[#2f2f2f] md:dark:bg-[#1e1e1e]"
        >
          <div className="flex h-10 w-10 md:mb-3 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
            <CalendarCheck size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {habitsCompletedToday}/{totalHabits}
            </p>
            <p className="text-xs text-gray-500">Today</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex min-w-[130px] flex-1 items-center gap-3 rounded-2xl bg-amber-50 p-4 dark:bg-amber-900/15 md:flex-col md:items-start md:gap-0 md:border md:border-gray-200 md:bg-white md:shadow-sm md:dark:border-[#2f2f2f] md:dark:bg-[#1e1e1e]"
        >
          <div className="flex h-10 w-10 md:mb-3 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <TrendingUp size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {habits.length > 0
                ? Math.max(...habits.map((h) => getStreak(h.completedDates)))
                : 0}
            </p>
            <p className="text-xs text-gray-500">Streak</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex min-w-[130px] flex-1 items-center gap-3 rounded-2xl bg-purple-50 p-4 dark:bg-purple-900/15 md:flex-col md:items-start md:gap-0 md:border md:border-gray-200 md:bg-white md:shadow-sm md:dark:border-[#2f2f2f] md:dark:bg-[#1e1e1e]"
        >
          <div className="flex h-10 w-10 md:mb-3 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
            <CheckSquare size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {tasks.filter((t) => t.status === "done").length}
            </p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </motion.div>
      </div>

      {/* Calendar and Overdue section */}
      <div className="mb-6 md:mb-8 grid gap-4 md:grid-cols-2">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Calendar />
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          {/* Overdue tasks */}
          {overdueTasks.length > 0 && (
            <div className="rounded-2xl border-2 border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-4">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                {overdueTasks.length} overdue task{overdueTasks.length !== 1 ? "s" : ""}
              </p>
              <div className="space-y-1">
                {overdueTasks.slice(0, 3).map((task) => (
                  <p
                    key={task.id}
                    className="text-xs text-red-600 dark:text-red-300 truncate"
                  >
                    • {task.title}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming tasks */}
          {upcomingTasks.length > 0 && (
            <div className="rounded-2xl border border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10 p-4">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                Upcoming tasks
              </p>
              <div className="space-y-1">
                {upcomingTasks.map((task) => (
                  <p
                    key={task.id}
                    className="text-xs text-blue-600 dark:text-blue-300 truncate"
                  >
                    • {task.title}
                  </p>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick action — mobile FAB-style new page */}
      <div className="mb-5 md:hidden">
        <button
          onClick={handleNewPage}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F7DFF] py-3.5 text-sm font-semibold text-white active:bg-[#0b6ad4] elevation-1"
        >
          <Plus size={18} />
          Create new page
        </button>
      </div>

      {/* Recent pages */}
      <div className="mb-6 md:mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <h2 className="text-[15px] md:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent pages
            </h2>
          </div>
          <button
            onClick={handleNewPage}
            className="hidden md:flex items-center gap-1.5 rounded-lg bg-[#0F7DFF] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0b6ad4] transition-colors"
          >
            <Plus size={14} />
            New page
          </button>
        </div>

        {/* Mobile: list view / Desktop: grid */}
        <div className="space-y-1 md:hidden">
          {recentPages.map((page, i) => (
            <motion.button
              key={page.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.03 * i }}
              onClick={() => setCurrentPage(page.id)}
              className="flex w-full items-center gap-3 rounded-2xl bg-gray-50 p-3.5 text-left active:bg-gray-100 dark:bg-[#1e1e1e] dark:active:bg-[#252525]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg dark:bg-[#252525] elevation-1">

      {/* Quick action — mobile FAB-style new page */}
      <div className="mb-5 md:hidden">
        <button
          onClick={handleNewPage}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F7DFF] py-3.5 text-sm font-semibold text-white active:bg-[#0b6ad4] elevation-1"
        >
          <Plus size={18} />
          Create new page
        </button>
      </div>

      {/* Recent pages */}
      <div className="mb-6 md:mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <h2 className="text-[15px] md:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent pages
            </h2>
          </div>
          <button
            onClick={handleNewPage}
            className="hidden md:flex items-center gap-1.5 rounded-lg bg-[#0F7DFF] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0b6ad4] transition-colors"
          >
            <Plus size={14} />
            New page
          </button>
        </div>

        {/* Mobile: list view / Desktop: grid */}
        <div className="space-y-1 md:hidden">
          {recentPages.map((page, i) => (
            <motion.button
              key={page.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.03 * i }}
              onClick={() => setCurrentPage(page.id)}
              className="flex w-full items-center gap-3 rounded-2xl bg-gray-50 p-3.5 text-left active:bg-gray-100 dark:bg-[#1e1e1e] dark:active:bg-[#252525]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg dark:bg-[#252525] elevation-1">
                {page.icon || "📄"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-gray-900 dark:text-gray-100">
                  {page.title || "Untitled"}
                </p>
                <p className="text-[11px] text-gray-400">
                  {new Date(page.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {page.blocks?.length ? ` · ${page.blocks.length} blocks` : ""}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-3">
          {recentPages.map((page, i) => (
            <motion.button
              key={page.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => setCurrentPage(page.id)}
              className="flex flex-col items-start rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-gray-300 hover:shadow-md dark:border-[#2f2f2f] dark:bg-[#1e1e1e] dark:hover:border-[#3a3a3a]"
            >
              <span className="mb-2 text-2xl">{page.icon || "📄"}</span>
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
          <div className="mb-3 flex items-center gap-2">
            <CalendarCheck size={16} className="text-gray-400" />
            <h2 className="text-[15px] md:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Today&apos;s habits
            </h2>
          </div>
          <div className="space-y-1.5">
            {habits.map((habit) => {
              const done = habit.completedDates.includes(today);
              return (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3.5 dark:bg-[#1e1e1e] md:border md:border-gray-200 md:bg-white md:dark:border-[#2f2f2f]"
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2",
                      done
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300 dark:border-gray-600"
                    )}
                    style={!done ? { borderColor: habit.color + "80" } : {}}
                  />
                  <span
                    className={cn(
                      "flex-1 text-[14px]",
                      done
                        ? "text-gray-400 line-through"
                        : "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {habit.name}
                  </span>
                  <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-[#252525]">
                    {getStreak(habit.completedDates)} days
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
