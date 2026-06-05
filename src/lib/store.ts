"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Page, Habit, User, Block, Database, MobileTab, Task, CalendarEvent } from "./types";
import { createPage, createHabit, createBlock, createTask, getStreak, calculateLongestStreak, calculateCompletionRate } from "./utils";

interface AppState {
  user: User | null;
  pages: Record<string, Page>;
  pageOrder: string[];
  habits: Habit[];
  tasks: Task[];
  databases: Record<string, Database>;
  calendarEvents: CalendarEvent[];
  sidebarOpen: boolean;
  darkMode: boolean;
  currentPageId: string | null;
  mobileTab: MobileTab;
  searchQuery: string;
  commandPaletteOpen: boolean;

  setUser: (user: User | null) => void;
  login: (email: string, name: string) => void;
  logout: () => void;

  addPage: (title: string, parentId?: string | null) => string;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  archivePage: (id: string) => void;
  restorePage: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setCurrentPage: (id: string | null) => void;
  duplicatePage: (id: string) => string;

  addBlock: (pageId: string, afterBlockId: string | null, type?: Block["type"]) => string;
  updateBlock: (pageId: string, blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (pageId: string, blockId: string) => void;
  moveBlock: (pageId: string, blockId: string, direction: "up" | "down") => void;

  addHabit: (name: string, color: string, icon?: string) => void;
  removeHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  toggleHabitDate: (habitId: string, date: string) => void;

  addTask: (title: string, priority?: Task["priority"]) => string;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  getTasks: (filter?: "all" | "today" | "overdue" | "done") => Task[];

  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setMobileTab: (tab: MobileTab) => void;
  setSearchQuery: (query: string) => void;
  toggleCommandPalette: () => void;

  getPageBreadcrumbs: (pageId: string) => { id: string; title: string }[];
}

function ensureBlocks(page: Page): Page {
  if (!page.blocks || page.blocks.length === 0) {
    return { ...page, blocks: [createBlock("text", page.content || "")] };
  }
  return page;
}

const defaultPages = (): { pages: Record<string, Page>; pageOrder: string[] } => {
  const gettingStarted = createPage("Getting Started");
  gettingStarted.blocks = [
    createBlock("heading1", "Welcome to HabitsXD"),
    createBlock("text", "Your Notion-inspired workspace for notes, tasks, and habit tracking."),
    createBlock("divider"),
    createBlock("heading2", "Quick Start"),
    createBlock("bulletList", "Type '/' to open the slash command menu"),
    createBlock("bulletList", "Create new pages from the sidebar"),
    createBlock("bulletList", "Use the habit tracker to build daily habits"),
    createBlock("todo", "Try checking this to-do item"),
    createBlock("callout", "Tip: Press Ctrl+K to open the command palette for quick navigation"),
  ];
  const quickNote = createPage("Quick Note");
  return {
    pages: {
      [gettingStarted.id]: gettingStarted,
      [quickNote.id]: quickNote,
    },
    pageOrder: [gettingStarted.id, quickNote.id],
  };
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => {
      const { pages: defaultP, pageOrder: defaultO } = defaultPages();
      return {
        user: null,
        pages: defaultP,
        pageOrder: defaultO,
        habits: [],
        tasks: [],
        databases: {},
        calendarEvents: [],
        sidebarOpen: true,
        darkMode: false,
        currentPageId: null,
        mobileTab: "home",
        searchQuery: "",
        commandPaletteOpen: false,

        setUser: (user) => set({ user }),
        login: (email, name) =>
          set({ user: { id: email, email, name } }),
        logout: () => set({ user: null, currentPageId: null }),

        addPage: (title, parentId = null) => {
          const page = createPage(title, parentId);
          const state = get();
          const newPages = { ...state.pages, [page.id]: page };
          let newOrder = [...state.pageOrder];

          if (parentId && newPages[parentId]) {
            newPages[parentId] = {
              ...newPages[parentId],
              children: [...newPages[parentId].children, page.id],
            };
          } else {
            newOrder = [...newOrder, page.id];
          }

          set({ pages: newPages, pageOrder: newOrder });
          return page.id;
        },

        updatePage: (id, updates) => {
          const state = get();
          if (!state.pages[id]) return;
          set({
            pages: {
              ...state.pages,
              [id]: { ...state.pages[id], ...updates, updatedAt: Date.now() },
            },
          });
        },

        deletePage: (id) => {
          const state = get();
          const page = state.pages[id];
          if (!page) return;

          const collectIds = (pageId: string): string[] => {
            const p = state.pages[pageId];
            if (!p) return [pageId];
            return [pageId, ...p.children.flatMap(collectIds)];
          };
          const toDelete = new Set(collectIds(id));
          const newPages = { ...state.pages };
          toDelete.forEach((pid) => delete newPages[pid]);

          if (page.parentId && newPages[page.parentId]) {
            newPages[page.parentId] = {
              ...newPages[page.parentId],
              children: newPages[page.parentId].children.filter((c) => c !== id),
            };
          }

          set({
            pages: newPages,
            pageOrder: state.pageOrder.filter((pid) => !toDelete.has(pid)),
            currentPageId:
              state.currentPageId && toDelete.has(state.currentPageId)
                ? null
                : state.currentPageId,
          });
        },

        archivePage: (id) => {
          const state = get();
          if (!state.pages[id]) return;
          set({
            pages: {
              ...state.pages,
              [id]: { ...state.pages[id], isArchived: true, updatedAt: Date.now() },
            },
            currentPageId: state.currentPageId === id ? null : state.currentPageId,
          });
        },

        restorePage: (id) => {
          const state = get();
          if (!state.pages[id]) return;
          set({
            pages: {
              ...state.pages,
              [id]: { ...state.pages[id], isArchived: false, updatedAt: Date.now() },
            },
          });
        },

        toggleFavorite: (id) => {
          const state = get();
          if (!state.pages[id]) return;
          set({
            pages: {
              ...state.pages,
              [id]: {
                ...state.pages[id],
                isFavorite: !state.pages[id].isFavorite,
              },
            },
          });
        },

        setCurrentPage: (id) => set({ currentPageId: id }),

        duplicatePage: (id) => {
          const state = get();
          const original = state.pages[id];
          if (!original) return "";
          const dup = createPage(original.title + " (copy)", original.parentId);
          dup.icon = original.icon;
          dup.coverUrl = original.coverUrl;
          dup.blocks = original.blocks.map((b) => ({
            ...b,
            id: createBlock().id,
          }));
          const newPages = { ...state.pages, [dup.id]: dup };
          let newOrder = [...state.pageOrder];

          if (original.parentId && newPages[original.parentId]) {
            newPages[original.parentId] = {
              ...newPages[original.parentId],
              children: [...newPages[original.parentId].children, dup.id],
            };
          } else {
            newOrder = [...newOrder, dup.id];
          }

          set({ pages: newPages, pageOrder: newOrder });
          return dup.id;
        },

        addBlock: (pageId, afterBlockId, type = "text") => {
          const state = get();
          const page = ensureBlocks(state.pages[pageId]);
          if (!page) return "";
          const block = createBlock(type);
          const blocks = [...page.blocks];
          if (afterBlockId) {
            const idx = blocks.findIndex((b) => b.id === afterBlockId);
            blocks.splice(idx + 1, 0, block);
          } else {
            blocks.push(block);
          }
          set({
            pages: {
              ...state.pages,
              [pageId]: { ...page, blocks, updatedAt: Date.now() },
            },
          });
          return block.id;
        },

        updateBlock: (pageId, blockId, updates) => {
          const state = get();
          const page = ensureBlocks(state.pages[pageId]);
          if (!page) return;
          set({
            pages: {
              ...state.pages,
              [pageId]: {
                ...page,
                blocks: page.blocks.map((b) =>
                  b.id === blockId ? { ...b, ...updates } : b
                ),
                updatedAt: Date.now(),
              },
            },
          });
        },

        deleteBlock: (pageId, blockId) => {
          const state = get();
          const page = ensureBlocks(state.pages[pageId]);
          if (!page) return;
          const blocks = page.blocks.filter((b) => b.id !== blockId);
          if (blocks.length === 0) blocks.push(createBlock("text"));
          set({
            pages: {
              ...state.pages,
              [pageId]: { ...page, blocks, updatedAt: Date.now() },
            },
          });
        },

        moveBlock: (pageId, blockId, direction) => {
          const state = get();
          const page = ensureBlocks(state.pages[pageId]);
          if (!page) return;
          const blocks = [...page.blocks];
          const idx = blocks.findIndex((b) => b.id === blockId);
          if (idx === -1) return;
          const newIdx = direction === "up" ? idx - 1 : idx + 1;
          if (newIdx < 0 || newIdx >= blocks.length) return;
          [blocks[idx], blocks[newIdx]] = [blocks[newIdx], blocks[idx]];
          set({
            pages: {
              ...state.pages,
              [pageId]: { ...page, blocks, updatedAt: Date.now() },
            },
          });
        },

        addHabit: (name, color, icon) => {
          const newHabit = createHabit(name, color, icon);
          const state = get();
          const updatedHabit = {
            ...newHabit,
            currentStreak: 0,
            longestStreak: 0,
            completionRate: 0,
          };
          set({ habits: [...state.habits, updatedHabit] });
        },

        removeHabit: (id) => {
          set({ habits: get().habits.filter((h) => h.id !== id) });
        },

        updateHabit: (id, updates) => {
          set({
            habits: get().habits.map((h) => {
              if (h.id !== id) return h;
              const updated = { ...h, ...updates };
              // Calculate metrics
              updated.currentStreak = getStreak(h.completedDates);
              updated.longestStreak = calculateLongestStreak(h.completedDates);
              updated.completionRate = calculateCompletionRate(h.completedDates, h.createdAt);
              return updated;
            }),
          });
        },

        toggleHabitDate: (habitId, date) => {
          set({
            habits: get().habits.map((h) => {
              if (h.id !== habitId) return h;
              const has = h.completedDates.includes(date);
              const completedDates = has
                ? h.completedDates.filter((d) => d !== date)
                : [...h.completedDates, date];
              return {
                ...h,
                completedDates,
                currentStreak: getStreak(completedDates),
                longestStreak: calculateLongestStreak(completedDates),
                completionRate: calculateCompletionRate(completedDates, h.createdAt),
                lastCompletedAt: has ? h.lastCompletedAt : Date.now(),
              };
            }),
          });
        },

        addTask: (title, priority = "medium") => {
          const task = createTask(title, priority);
          set({ tasks: [...get().tasks, task] });
          return task.id;
        },

        updateTask: (id, updates) => {
          set({
            tasks: get().tasks.map((t) =>
              t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
            ),
          });
        },

        deleteTask: (id) => {
          set({ tasks: get().tasks.filter((t) => t.id !== id) });
        },

        toggleTaskStatus: (id) => {
          const task = get().tasks.find((t) => t.id === id);
          if (!task) return;
          const statusMap: Record<Task["status"], Task["status"]> = {
            todo: "in-progress",
            "in-progress": "done",
            done: "todo",
            cancelled: "todo",
          };
          set({
            tasks: get().tasks.map((t) =>
              t.id === id ? { ...t, status: statusMap[t.status], updatedAt: Date.now() } : t
            ),
          });
        },

        getTasks: (filter = "all") => {
          const tasks = get().tasks;
          const today = new Date().toISOString().split("T")[0];
          const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

          switch (filter) {
            case "today":
              return tasks.filter((t) => {
                if (!t.dueDate) return false;
                const dueDate = new Date(t.dueDate).toISOString().split("T")[0];
                return dueDate === today && t.status !== "done";
              });
            case "overdue":
              return tasks.filter((t) => {
                if (!t.dueDate || t.status === "done") return false;
                return t.dueDate < Date.now();
              });
            case "done":
              return tasks.filter((t) => t.status === "done");
            default:
              return tasks;
          }
        },

        toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
        toggleDarkMode: () => set({ darkMode: !get().darkMode }),
        setMobileTab: (tab) => set({ mobileTab: tab }),
        setSearchQuery: (query) => set({ searchQuery: query }),
        toggleCommandPalette: () =>
          set({ commandPaletteOpen: !get().commandPaletteOpen }),

        getPageBreadcrumbs: (pageId) => {
          const state = get();
          const crumbs: { id: string; title: string }[] = [];
          let current = state.pages[pageId];
          while (current) {
            crumbs.unshift({ id: current.id, title: current.title || "Untitled" });
            current = current.parentId ? state.pages[current.parentId] : undefined as unknown as Page;
          }
          return crumbs;
        },
      };
    },
    { name: "habitsxd-store" }
  )
);

function ensureBlocks(page: Page): Page {
  if (!page.blocks || page.blocks.length === 0) {
    return { ...page, blocks: [createBlock("text", page.content || "")] };
  }
  return page;
}

const defaultPages = (): { pages: Record<string, Page>; pageOrder: string[] } => {
  const gettingStarted = createPage("Getting Started");
  gettingStarted.blocks = [
    createBlock("heading1", "Welcome to HabitsXD"),
    createBlock("text", "Your Notion-inspired workspace for notes, tasks, and habit tracking."),
    createBlock("divider"),
    createBlock("heading2", "Quick Start"),
    createBlock("bulletList", "Type '/' to open the slash command menu"),
    createBlock("bulletList", "Create new pages from the sidebar"),
    createBlock("bulletList", "Use the habit tracker to build daily habits"),
    createBlock("todo", "Try checking this to-do item"),
    createBlock("callout", "Tip: Press Ctrl+K to open the command palette for quick navigation"),
  ];
  const quickNote = createPage("Quick Note");
  return {
    pages: {
      [gettingStarted.id]: gettingStarted,
      [quickNote.id]: quickNote,
    },
    pageOrder: [gettingStarted.id, quickNote.id],
  };
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => {
      const { pages: defaultP, pageOrder: defaultO } = defaultPages();
      return {
        user: null,
        pages: defaultP,
        pageOrder: defaultO,
        habits: [],
        databases: {},
        sidebarOpen: true,
        darkMode: false,
        currentPageId: null,
        mobileTab: "home",
        searchQuery: "",
        commandPaletteOpen: false,

        setUser: (user) => set({ user }),
        login: (email, name) =>
          set({ user: { id: email, email, name } }),
        logout: () => set({ user: null, currentPageId: null }),

        addPage: (title, parentId = null) => {
          const page = createPage(title, parentId);
          const state = get();
          const newPages = { ...state.pages, [page.id]: page };
          let newOrder = [...state.pageOrder];

          if (parentId && newPages[parentId]) {
            newPages[parentId] = {
              ...newPages[parentId],
              children: [...newPages[parentId].children, page.id],
            };
          } else {
            newOrder = [...newOrder, page.id];
          }

          set({ pages: newPages, pageOrder: newOrder });
          return page.id;
        },

        updatePage: (id, updates) => {
          const state = get();
          if (!state.pages[id]) return;
          set({
            pages: {
              ...state.pages,
              [id]: { ...state.pages[id], ...updates, updatedAt: Date.now() },
            },
          });
        },

        deletePage: (id) => {
          const state = get();
          const page = state.pages[id];
          if (!page) return;

          const collectIds = (pageId: string): string[] => {
            const p = state.pages[pageId];
            if (!p) return [pageId];
            return [pageId, ...p.children.flatMap(collectIds)];
          };
          const toDelete = new Set(collectIds(id));
          const newPages = { ...state.pages };
          toDelete.forEach((pid) => delete newPages[pid]);

          if (page.parentId && newPages[page.parentId]) {
            newPages[page.parentId] = {
              ...newPages[page.parentId],
              children: newPages[page.parentId].children.filter((c) => c !== id),
            };
          }

          set({
            pages: newPages,
            pageOrder: state.pageOrder.filter((pid) => !toDelete.has(pid)),
            currentPageId:
              state.currentPageId && toDelete.has(state.currentPageId)
                ? null
                : state.currentPageId,
          });
        },

        archivePage: (id) => {
          const state = get();
          if (!state.pages[id]) return;
          set({
            pages: {
              ...state.pages,
              [id]: { ...state.pages[id], isArchived: true, updatedAt: Date.now() },
            },
            currentPageId: state.currentPageId === id ? null : state.currentPageId,
          });
        },

        restorePage: (id) => {
          const state = get();
          if (!state.pages[id]) return;
          set({
            pages: {
              ...state.pages,
              [id]: { ...state.pages[id], isArchived: false, updatedAt: Date.now() },
            },
          });
        },

        toggleFavorite: (id) => {
          const state = get();
          if (!state.pages[id]) return;
          set({
            pages: {
              ...state.pages,
              [id]: {
                ...state.pages[id],
                isFavorite: !state.pages[id].isFavorite,
              },
            },
          });
        },

        setCurrentPage: (id) => set({ currentPageId: id }),

        duplicatePage: (id) => {
          const state = get();
          const original = state.pages[id];
          if (!original) return "";
          const dup = createPage(original.title + " (copy)", original.parentId);
          dup.icon = original.icon;
          dup.coverUrl = original.coverUrl;
          dup.blocks = original.blocks.map((b) => ({
            ...b,
            id: createBlock().id,
          }));
          const newPages = { ...state.pages, [dup.id]: dup };
          let newOrder = [...state.pageOrder];

          if (original.parentId && newPages[original.parentId]) {
            newPages[original.parentId] = {
              ...newPages[original.parentId],
              children: [...newPages[original.parentId].children, dup.id],
            };
          } else {
            newOrder = [...newOrder, dup.id];
          }

          set({ pages: newPages, pageOrder: newOrder });
          return dup.id;
        },

        addBlock: (pageId, afterBlockId, type = "text") => {
          const state = get();
          const page = ensureBlocks(state.pages[pageId]);
          if (!page) return "";
          const block = createBlock(type);
          const blocks = [...page.blocks];
          if (afterBlockId) {
            const idx = blocks.findIndex((b) => b.id === afterBlockId);
            blocks.splice(idx + 1, 0, block);
          } else {
            blocks.push(block);
          }
          set({
            pages: {
              ...state.pages,
              [pageId]: { ...page, blocks, updatedAt: Date.now() },
            },
          });
          return block.id;
        },

        updateBlock: (pageId, blockId, updates) => {
          const state = get();
          const page = ensureBlocks(state.pages[pageId]);
          if (!page) return;
          set({
            pages: {
              ...state.pages,
              [pageId]: {
                ...page,
                blocks: page.blocks.map((b) =>
                  b.id === blockId ? { ...b, ...updates } : b
                ),
                updatedAt: Date.now(),
              },
            },
          });
        },

        deleteBlock: (pageId, blockId) => {
          const state = get();
          const page = ensureBlocks(state.pages[pageId]);
          if (!page) return;
          const blocks = page.blocks.filter((b) => b.id !== blockId);
          if (blocks.length === 0) blocks.push(createBlock("text"));
          set({
            pages: {
              ...state.pages,
              [pageId]: { ...page, blocks, updatedAt: Date.now() },
            },
          });
        },

        moveBlock: (pageId, blockId, direction) => {
          const state = get();
          const page = ensureBlocks(state.pages[pageId]);
          if (!page) return;
          const blocks = [...page.blocks];
          const idx = blocks.findIndex((b) => b.id === blockId);
          if (idx === -1) return;
          const newIdx = direction === "up" ? idx - 1 : idx + 1;
          if (newIdx < 0 || newIdx >= blocks.length) return;
          [blocks[idx], blocks[newIdx]] = [blocks[newIdx], blocks[idx]];
          set({
            pages: {
              ...state.pages,
              [pageId]: { ...page, blocks, updatedAt: Date.now() },
            },
          });
        },

        addHabit: (name, color) => {
          set({ habits: [...get().habits, createHabit(name, color)] });
        },

        removeHabit: (id) => {
          set({ habits: get().habits.filter((h) => h.id !== id) });
        },

        toggleHabitDate: (habitId, date) => {
          set({
            habits: get().habits.map((h) => {
              if (h.id !== habitId) return h;
              const has = h.completedDates.includes(date);
              return {
                ...h,
                completedDates: has
                  ? h.completedDates.filter((d) => d !== date)
                  : [...h.completedDates, date],
              };
            }),
          });
        },

        toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
        toggleDarkMode: () => set({ darkMode: !get().darkMode }),
        setMobileTab: (tab) => set({ mobileTab: tab }),
        setSearchQuery: (query) => set({ searchQuery: query }),
        toggleCommandPalette: () =>
          set({ commandPaletteOpen: !get().commandPaletteOpen }),

        getPageBreadcrumbs: (pageId) => {
          const state = get();
          const crumbs: { id: string; title: string }[] = [];
          let current = state.pages[pageId];
          while (current) {
            crumbs.unshift({ id: current.id, title: current.title || "Untitled" });
            current = current.parentId ? state.pages[current.parentId] : undefined as unknown as Page;
          }
          return crumbs;
        },
      };
    },
    { name: "habitsxd-store" }
  )
);
