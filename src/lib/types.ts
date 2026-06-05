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

export type MobileTab = "home" | "search" | "add" | "habits" | "settings";
