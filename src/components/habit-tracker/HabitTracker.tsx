"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ChevronLeft, ChevronRight, Flame } from "lucide-react";
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

export default function HabitTracker() {
  const habits = useStore((s) => s.habits);
  const addHabit = useStore((s) => s.addHabit);
  const removeHabit = useStore((s) => s.removeHabit);
  const toggleHabitDate = useStore((s) => s.toggleHabitDate);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const monthName = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleAdd = () => {
    if (!newName.trim()) return;
    addHabit(newName.trim(), newColor);
    setNewName("");
    setNewColor(COLORS[0]);
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
