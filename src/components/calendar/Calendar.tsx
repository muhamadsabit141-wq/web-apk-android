"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDate, getDaysInMonth } from "@/lib/utils";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const tasks = useStore((s) => s.getTasks());
  const habits = useStore((s) => s.habits);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthName = currentDate.toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const getEventsForDate = (day: number) => {
    const dateStr = formatDate(new Date(year, month, day));
    const dayTasks = tasks.filter((t) => {
      if (!t.dueDate) return false;
      return (
        formatDate(new Date(t.dueDate)) === dateStr &&
        t.status !== "done"
      );
    });
    const dayHabits = habits.filter((h) => h.completedDates.includes(dateStr));
    return { tasks: dayTasks, habits: dayHabits };
  };

  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-[#2f2f2f] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-blue-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {monthName}
          </h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={goToPreviousMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
          >
            <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {days.map((day) => {
          const { tasks: dayTasks, habits: dayHabits } = getEventsForDate(day);
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

          return (
            <div
              key={day}
              className={`aspect-square rounded-lg border-2 p-1 flex flex-col justify-between text-xs transition-colors ${
                isToday
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-[#2f2f2f] hover:bg-gray-50 dark:hover:bg-[#252525]"
              }`}
            >
              <span
                className={`font-semibold ${
                  isToday
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {day}
              </span>

              {/* Event indicators */}
              <div className="flex flex-col gap-0.5">
                {dayTasks.length > 0 && (
                  <div className="flex items-center gap-0.5">
                    <Circle size={8} className="text-blue-500" />
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">
                      {dayTasks.length} task
                    </span>
                  </div>
                )}
                {dayHabits.length > 0 && (
                  <div className="flex items-center gap-0.5">
                    <CheckCircle2 size={8} className="text-green-500" />
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">
                      {dayHabits.length} habit
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#2f2f2f] flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Circle size={12} className="text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">Tasks</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={12} className="text-green-500" />
          <span className="text-gray-600 dark:text-gray-400">Habits completed</span>
        </div>
      </div>
    </div>
  );
}
