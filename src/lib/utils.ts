import { v4 as uuidv4 } from "uuid";
import type { Page, Habit } from "./types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function createPage(title: string, parentId: string | null = null): Page {
  return {
    id: uuidv4(),
    title,
    parentId,
    children: [],
    content: "",
    isFavorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createHabit(name: string, color: string): Habit {
  return {
    id: uuidv4(),
    name,
    color,
    completedDates: [],
    createdAt: Date.now(),
  };
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
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
