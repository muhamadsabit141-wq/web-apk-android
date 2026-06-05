export type BlockType =
  | "text"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bulletList"
  | "numberedList"
  | "todo"
  | "divider"
  | "code"
  | "quote"
  | "callout"
  | "toggle"
  | "image"
  | "table";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
  collapsed?: boolean;
  children?: Block[];
  language?: string;
  url?: string;
}

export interface Page {
  id: string;
  title: string;
  icon?: string;
  coverUrl?: string;
  parentId: string | null;
  children: string[];
  content: string;
  blocks: Block[];
  isFavorite: boolean;
  isArchived?: boolean;
  createdAt: number;
  updatedAt: number;
}

export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in-progress" | "done" | "cancelled";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: number;
  startDate?: number;
  tags: string[];
  assignee?: string;
  createdAt: number;
  updatedAt: number;
  checklist?: { id: string; text: string; completed: boolean }[];
  pageId?: string;
  position?: number;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  frequency: "daily" | "weekly" | "monthly";
  completedDates: string[];
  createdAt: number;
  lastCompletedAt?: number;
  currentStreak?: number;
  longestStreak?: number;
  completionRate?: number;
  goal?: number; // goal per time period
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export type ViewMode = "table" | "board" | "list" | "calendar";

export interface DatabaseColumn {
  id: string;
  name: string;
  type:
    | "text"
    | "number"
    | "date"
    | "select"
    | "multi-select"
    | "checkbox"
    | "url";
  options?: string[];
}

export interface DatabaseRow {
  id: string;
  cells: Record<string, string | number | boolean | string[]>;
}

export interface Database {
  id: string;
  name: string;
  columns: DatabaseColumn[];
  rows: DatabaseRow[];
  viewMode: ViewMode;
}

export type MobileTab = "home" | "search" | "add" | "tasks" | "habits" | "settings";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "task" | "habit" | "event" | "reminder";
  color?: string;
  icon?: string;
  taskId?: string;
  habitId?: string;
}

