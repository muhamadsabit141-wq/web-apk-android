import { v4 as uuidv4 } from "uuid";
import type { Page, Habit, Block, BlockType, Task } from "./types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function createBlock(
  type: BlockType = "text",
  content: string = ""
): Block {
  return {
    id: uuidv4(),
    type,
    content,
    checked: type === "todo" ? false : undefined,
    collapsed: type === "toggle" ? false : undefined,
    children: type === "toggle" ? [] : undefined,
  };
}

export function createPage(
  title: string,
  parentId: string | null = null
): Page {
  return {
    id: uuidv4(),
    title,
    parentId,
    children: [],
    content: "",
    blocks: [createBlock("text", "")],
    isFavorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createHabit(name: string, color: string, icon?: string): Habit {
  return {
    id: uuidv4(),
    name,
    color,
    icon,
    frequency: "daily",
    completedDates: [],
    createdAt: Date.now(),
    currentStreak: 0,
    longestStreak: 0,
    completionRate: 0,
  };
}

export function createTask(
  title: string,
  priority: "low" | "medium" | "high" | "urgent" = "medium"
): Task {
  return {
    id: uuidv4(),
    title,
    priority,
    status: "todo",
    tags: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    checklist: [],
  };
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDateDisplay(date: number | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort().reverse();
  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 86400000));

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = (prev.getTime() - curr.getTime()) / 86400000;
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function calculateLongestStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort();
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / 86400000;
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

export function calculateCompletionRate(
  completedDates: string[],
  createdAt: number
): number {
  const daysElapsed = Math.ceil((Date.now() - createdAt) / 86400000);
  if (daysElapsed === 0) return 0;
  return Math.round((completedDates.length / daysElapsed) * 100);
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400",
    medium: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-900 dark:text-blue-400",
    high: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-900 dark:text-amber-400",
    urgent: "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-900 dark:text-red-400",
  };
  return colors[priority] || colors["medium"];
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    todo: "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900/20 dark:border-gray-900 dark:text-gray-400",
    "in-progress":
      "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-900 dark:text-blue-400",
    done: "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400",
    cancelled:
      "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-900 dark:text-red-400",
  };
  return colors[status] || colors["todo"];
}

export function isTaskOverdue(dueDate?: number): boolean {
  if (!dueDate) return false;
  return dueDate < Date.now();
}

export function isTaskDueSoon(dueDate?: number): boolean {
  if (!dueDate) return false;
  const oneDayMs = 86400000;
  return dueDate < Date.now() + 3 * oneDayMs && dueDate >= Date.now();
}

