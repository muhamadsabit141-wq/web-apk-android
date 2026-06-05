"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Flame,
  TrendingUp,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn, formatDate, getDaysInMonth, getStreak } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

const COLORS = [
  "#0F7DFF",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
];

const ICONS = ["🔥", "📚", "💪", "🧘", "🏃", "💧", "😴", "🎯", "🎨", "🎵"];

export default function HabitTracker() {
  const habits = useStore((s) => s.habits);
  const addHabit = useStore((s) => s.addHabit);
  const removeHabit = useStore((s) => s.removeHabit);
  const updateHabit = useStore((s) => s.updateHabit);
  const toggleHabitDate = useStore((s) => s.toggleHabitDate);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [newIcon, setNewIcon] = useState(ICONS[0]);
  const [viewMode, setViewMode] = useState<"calendar" | "stats">("calendar");

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const monthName = new Date(year, month).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const handleAdd = () => {
    if (!newName.trim()) return;
    addHabit(newName.trim(), newColor, newIcon);
    setNewName("");
    setNewDescription("");
    setNewColor(COLORS[0]);
    setNewIcon(ICONS[0]);
    setShowAdd(false);
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-3 pb-24 md:px-16 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Habit Tracker
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track your daily habits and build streaks
            </p>
          </div>
          <Button onClick={() => setShowAdd(true)} size="sm" className="md:hidden">
            <Plus size={16} />
          </Button>
          <Button onClick={() => setShowAdd(true)} size="md" className="hidden md:inline-flex">
            <Plus size={16} className="mr-1.5" />
            Add habit
          </Button>
        </div>

        {/* View toggle */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              viewMode === "calendar"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-[#2f2f2f] text-gray-600 dark:text-gray-400 hover:bg-gray-200"
            }`}
          >
            <Calendar size={16} className="inline mr-1.5" />
            Calendar
          </button>
          <button
            onClick={() => setViewMode("stats")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              viewMode === "stats"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-[#2f2f2f] text-gray-600 dark:text-gray-400 hover:bg-gray-200"
            }`}
          >
            <TrendingUp size={16} className="inline mr-1.5" />
            Stats
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-12 md:py-16 dark:border-[#3a3a3a]">
            <Flame
              size={36}
              className="mb-4 text-gray-300 dark:text-gray-600"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No habits yet. Add one to get started!
            </p>
          </div>
        ) : viewMode === "calendar" ? (
          // Calendar view
          <>
            {/* Month nav */}
            <div className="mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
              <button
                onClick={prevMonth}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-[#2f2f2f]"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[140px] md:min-w-[160px] text-center">
                {monthName}
              </span>
              <button
                onClick={nextMonth}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-[#2f2f2f]"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Grid */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-[#2f2f2f] dark:bg-[#1e1e1e]">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-white px-3 md:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 dark:bg-[#1e1e1e]">
                      Habit
                    </th>
                    {Array.from({ length: daysInMonth }, (_, i) => (
                      <th
                        key={i}
                        className="px-0.5 md:px-1 py-3 text-center text-[10px] md:text-xs font-medium text-gray-400"
                      >
                        {i + 1}
                      </th>
                    ))}
                    <th className="px-2 md:px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
                      <Flame size={12} className="inline" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {habits.map((habit) => {
                    const streak = getStreak(habit.completedDates);
                    return (
                      <tr
                        key={habit.id}
                        className="border-t border-gray-100 dark:border-[#2f2f2f]"
                      >
                        <td className="sticky left-0 bg-white dark:bg-[#1e1e1e]">
                          <div className="flex items-center gap-2 px-3 md:px-4 py-2">
                            <span className="text-xl">{habit.icon || "🎯"}</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 truncate max-w-[80px] md:max-w-[120px] block">
                                {habit.name}
                              </span>
                              {habit.description && (
                                <span className="text-[10px] text-gray-400 truncate max-w-[80px] md:max-w-[120px] block">
                                  {habit.description}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => removeHabit(habit.id)}
                              className="shrink-0 rounded p-0.5 text-gray-300 opacity-0 hover:text-red-500 group-hover:opacity-100 hover:opacity-100"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                        {Array.from({ length: daysInMonth }, (_, i) => {
                          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                          const done = habit.completedDates.includes(dateStr);
                          const isToday = dateStr === formatDate(new Date());

                          return (
                            <td key={i} className="px-0.5 md:px-1 py-2 text-center">
                              <button
                                onClick={() =>
                                  toggleHabitDate(habit.id, dateStr)
                                }
                                className={cn(
                                  "mx-auto flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-md text-[10px] md:text-xs transition-all",
                                  done
                                    ? "text-white shadow-sm"
                                    : "bg-gray-50 hover:bg-gray-100 dark:bg-[#252525] dark:hover:bg-[#2f2f2f]",
                                  isToday &&
                                    !done &&
                                    "ring-2 ring-blue-400/40"
                                )}
                                style={
                                  done
                                    ? { backgroundColor: habit.color }
                                    : undefined
                                }
                              >
                                {done && "✓"}
                              </button>
                            </td>
                          );
                        })}
                        <td className="px-2 md:px-3 py-2 text-center">
                          <span className="inline-flex items-center gap-0.5 text-xs md:text-sm font-medium text-orange-500">
                            <Flame size={10} />
                            {streak}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          // Stats view
          <div className="grid gap-4 md:grid-cols-2">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="rounded-2xl border border-gray-200 dark:border-[#2f2f2f] bg-white dark:bg-[#1e1e1e] p-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{habit.icon || "🎯"}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {habit.name}
                      </h3>
                      {habit.description && (
                        <p className="text-xs text-gray-500">{habit.description}</p>
                      )}
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2f2f2f]">
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  {/* Current streak */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                    <div className="flex items-center gap-2">
                      <Flame size={18} className="text-orange-500" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Current Streak
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {getStreak(habit.completedDates)} days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Longest streak */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} className="text-purple-500" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Longest Streak
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {habit.longestStreak || 0} days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Completion rate */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                        Completion Rate
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-[#2f2f2f] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${habit.completionRate || 0}%`,
                              backgroundColor: habit.color,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100 min-w-[40px]">
                          {habit.completionRate || 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total completions */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-green-500" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Total Completions
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {habit.completedDates.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Add habit modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New habit">
        <div className="space-y-4">
          <Input
            label="Habit name"
            placeholder="e.g., Exercise, Read, Meditate"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Input
            label="Description (optional)"
            placeholder="Why you want to build this habit"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Icon
            </label>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setNewIcon(icon)}
                  className={`text-2xl p-2 rounded-lg transition-colors ${
                    newIcon === icon
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-[#2f2f2f] hover:bg-gray-200"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={cn(
                    "h-8 w-8 rounded-full transition-transform",
                    newColor === c &&
                      "scale-110 ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-[#252525]"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add habit</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-3 pb-24 md:px-16 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Habit Tracker
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track your daily habits and build streaks
            </p>
          </div>
          <Button onClick={() => setShowAdd(true)} size="sm" className="md:hidden">
            <Plus size={16} />
          </Button>
          <Button onClick={() => setShowAdd(true)} size="md" className="hidden md:inline-flex">
            <Plus size={16} className="mr-1.5" />
            Add habit
          </Button>
        </div>

        {/* Month nav */}
        <div className="mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
          <button
            onClick={prevMonth}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-[#2f2f2f]"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[140px] md:min-w-[160px] text-center">
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-[#2f2f2f]"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Grid */}
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-12 md:py-16 dark:border-[#3a3a3a]">
            <Flame
              size={36}
              className="mb-4 text-gray-300 dark:text-gray-600"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No habits yet. Add one to get started!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-[#2f2f2f] dark:bg-[#1e1e1e]">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-white px-3 md:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 dark:bg-[#1e1e1e]">
                    Habit
                  </th>
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <th
                      key={i}
                      className="px-0.5 md:px-1 py-3 text-center text-[10px] md:text-xs font-medium text-gray-400"
                    >
                      {i + 1}
                    </th>
                  ))}
                  <th className="px-2 md:px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
                    <Flame size={12} className="inline" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {habits.map((habit) => {
                  const streak = getStreak(habit.completedDates);
                  return (
                    <tr
                      key={habit.id}
                      className="border-t border-gray-100 dark:border-[#2f2f2f]"
                    >
                      <td className="sticky left-0 bg-white dark:bg-[#1e1e1e]">
                        <div className="flex items-center gap-2 px-3 md:px-4 py-2">
                          <div
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: habit.color }}
                          />
                          <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 truncate max-w-[80px] md:max-w-[120px]">
                            {habit.name}
                          </span>
                          <button
                            onClick={() => removeHabit(habit.id)}
                            className="ml-auto shrink-0 rounded p-0.5 text-gray-300 opacity-0 hover:text-red-500 group-hover:opacity-100 hover:opacity-100"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                        const done = habit.completedDates.includes(dateStr);
                        const isToday = dateStr === formatDate(new Date());

                        return (
                          <td key={i} className="px-0.5 md:px-1 py-2 text-center">
                            <button
                              onClick={() =>
                                toggleHabitDate(habit.id, dateStr)
                              }
                              className={cn(
                                "mx-auto flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-md text-[10px] md:text-xs transition-all",
                                done
                                  ? "text-white shadow-sm"
                                  : "bg-gray-50 hover:bg-gray-100 dark:bg-[#252525] dark:hover:bg-[#2f2f2f]",
                                isToday &&
                                  !done &&
                                  "ring-2 ring-blue-400/40"
                              )}
                              style={
                                done
                                  ? { backgroundColor: habit.color }
                                  : undefined
                              }
                            >
                              {done && "✓"}
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-2 md:px-3 py-2 text-center">
                        <span className="inline-flex items-center gap-0.5 text-xs md:text-sm font-medium text-orange-500">
                          <Flame size={10} />
                          {streak}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Add habit modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New habit">
        <div className="space-y-4">
          <Input
            label="Habit name"
            placeholder="e.g., Exercise, Read, Meditate"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={cn(
                    "h-8 w-8 rounded-full transition-transform",
                    newColor === c &&
                      "scale-110 ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-[#252525]"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add habit</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
