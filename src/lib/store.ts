"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Page, Habit, User, Block, Database, MobileTab } from "./types";
import { createPage, createHabit, createBlock } from "./utils";

interface AppState {
  user: User | null;
  pages: Record<string, Page>;
  pageOrder: string[];
  habits: Habit[];
  databases: Record<string, Database>;
  sidebarOpen: boolean;
  darkMode: boolean;
  currentPageId: string | null;
  mobileTab: MobileTab;
  searchQuery: string;

  setUser: (user: User | null) => void;
  login: (email: string, name: string) => void;
  logout: () => void;

  addPage: (title: string, parentId?: string | null) => string;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setCurrentPage: (id: string | null) => void;

  addBlock: (pageId: string, afterBlockId: string | null, type?: Block["type"]) => string;
  updateBlock: (pageId: string, blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (pageId: string, blockId: string) => void;
  moveBlock: (pageId: string, blockId: string, direction: "up" | "down") => void;

  addHabit: (name: string, color: string) => void;
  removeHabit: (id: string) => void;
  toggleHabitDate: (habitId: string, date: string) => void;

  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setMobileTab: (tab: MobileTab) => void;
  setSearchQuery: (query: string) => void;
}

const defaultPages = (): { pages: Record<string, Page>; pageOrder: string[] } => {
  const gettingStarted = createPage("Getting Started");
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

        setUser: (user) => set({ user }),
        login: (email, name) =>
          set({ user: { id: email, email, name } }),
        logout: () => set({ user: null }),

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
              children: newPages[page.parentId].children.filter(
                (c) => c !== id
              ),
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

        addBlock: (pageId, afterBlockId, type = "text") => {
          const state = get();
          const page = state.pages[pageId];
          if (!page) return "";
          const block = createBlock(type);
          const blocks = [...(page.blocks || [])];
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
          const page = state.pages[pageId];
          if (!page) return;
          set({
            pages: {
              ...state.pages,
              [pageId]: {
                ...page,
                blocks: (page.blocks || []).map((b) =>
                  b.id === blockId ? { ...b, ...updates } : b
                ),
                updatedAt: Date.now(),
              },
            },
          });
        },

        deleteBlock: (pageId, blockId) => {
          const state = get();
          const page = state.pages[pageId];
          if (!page) return;
          const blocks = (page.blocks || []).filter((b) => b.id !== blockId);
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
          const page = state.pages[pageId];
          if (!page) return;
          const blocks = [...(page.blocks || [])];
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
      };
    },
    { name: "habitsxd-store" }
  )
);
