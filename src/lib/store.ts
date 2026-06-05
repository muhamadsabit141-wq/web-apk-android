"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Page, Habit, User } from "./types";
import { createPage, createHabit } from "./utils";

interface AppState {
  user: User | null;
  pages: Record<string, Page>;
  pageOrder: string[];
  habits: Habit[];
  sidebarOpen: boolean;
  darkMode: boolean;
  currentPageId: string | null;

  setUser: (user: User | null) => void;
  login: (email: string, name: string) => void;
  logout: () => void;

  addPage: (title: string, parentId?: string | null) => string;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setCurrentPage: (id: string | null) => void;

  addHabit: (name: string, color: string) => void;
  removeHabit: (id: string) => void;
  toggleHabitDate: (habitId: string, date: string) => void;

  toggleSidebar: () => void;
  toggleDarkMode: () => void;
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
        sidebarOpen: true,
        darkMode: false,
        currentPageId: null,

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
              [id]: { ...state.pages[id], isFavorite: !state.pages[id].isFavorite },
            },
          });
        },

        setCurrentPage: (id) => set({ currentPageId: id }),

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
      };
    },
    { name: "habitsxd-store" }
  )
);
