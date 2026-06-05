export interface Page {
  id: string;
  title: string;
  icon?: string;
  parentId: string | null;
  children: string[];
  content: string;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  completedDates: string[];
  createdAt: number;
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
  type: "text" | "number" | "date" | "select" | "multi-select" | "checkbox" | "url";
  options?: string[];
}

export interface DatabaseRow {
  id: string;
  cells: Record<string, string | number | boolean | string[]>;
}

export interface Database {
  id: string;
  pageId: string;
  columns: DatabaseColumn[];
  rows: DatabaseRow[];
  viewMode: ViewMode;
}
