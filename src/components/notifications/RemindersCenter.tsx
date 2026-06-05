"use client";

import { useEffect, useState } from "react";
import { Bell, X, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Task } from "@/lib/types";

export interface Reminder {
  id: string;
  taskId: string;
  type: "dueSoon" | "overdue" | "custom";
  message: string;
  timestamp: number;
  read: boolean;
}

const NOTIFICATION_REMINDERS: Reminder[] = [];

export default function RemindersNotificationCenter() {
  const tasks = useStore((s) => s.getTasks());
  const [reminders, setReminders] = useState<Reminder[]>(NOTIFICATION_REMINDERS);
  const [showNotifications, setShowNotifications] = useState(false);

  // Generate reminders based on tasks
  useEffect(() => {
    const newReminders: Reminder[] = [];

    tasks.forEach((task) => {
      if (!task.dueDate || task.status === "done") return;

      const timeUntilDue = task.dueDate - Date.now();
      const oneDayMs = 86400000;

      // Overdue reminder
      if (timeUntilDue < 0) {
        const id = `overdue-${task.id}`;
        if (!reminders.find((r) => r.id === id)) {
          newReminders.push({
            id,
            taskId: task.id,
            type: "overdue",
            message: `Task "${task.title}" is overdue`,
            timestamp: Date.now(),
            read: false,
          });
        }
      }
      // Due soon reminder (within 24 hours)
      else if (timeUntilDue < oneDayMs) {
        const id = `dueSoon-${task.id}`;
        if (!reminders.find((r) => r.id === id)) {
          newReminders.push({
            id,
            taskId: task.id,
            type: "dueSoon",
            message: `Task "${task.title}" is due soon`,
            timestamp: Date.now(),
            read: false,
          });
        }
      }
    });

    if (newReminders.length > 0) {
      setReminders((prev) => [...prev, ...newReminders]);
    }
  }, [tasks]);

  const unreadCount = reminders.filter((r) => !r.read).length;

  const handleMarkAsRead = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, read: true } : r))
    );
  };

  const handleDismiss = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="relative">
      {/* Notification bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-lg transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2f2f2f] shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between bg-gray-50 dark:bg-[#252525] px-4 py-3 border-b border-gray-200 dark:border-[#2f2f2f]">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Notifications
            </h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          {reminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <Bell size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-[#2f2f2f]">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-3 flex items-start gap-2 transition-colors ${
                    reminder.read
                      ? "bg-white dark:bg-[#1e1e1e]"
                      : "bg-blue-50 dark:bg-blue-900/10"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                      reminder.type === "overdue"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-yellow-100 dark:bg-yellow-900/30"
                    }`}
                  >
                    <Bell
                      size={16}
                      className={
                        reminder.type === "overdue"
                          ? "text-red-600 dark:text-red-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        reminder.read
                          ? "text-gray-600 dark:text-gray-400"
                          : "font-semibold text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {reminder.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(reminder.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex gap-1">
                    {!reminder.read && (
                      <button
                        onClick={() => handleMarkAsRead(reminder.id)}
                        className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDismiss(reminder.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded"
                      title="Dismiss"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
