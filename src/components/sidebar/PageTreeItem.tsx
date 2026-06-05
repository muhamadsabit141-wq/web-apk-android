"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  FileText,
  MoreHorizontal,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface PageTreeItemProps {
  pageId: string;
  depth?: number;
}

export default function PageTreeItem({ pageId, depth = 0 }: PageTreeItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const page = useStore((s) => s.pages[pageId]);
  const currentPageId = useStore((s) => s.currentPageId);
  const setCurrentPage = useStore((s) => s.setCurrentPage);
  const addPage = useStore((s) => s.addPage);
  const deletePage = useStore((s) => s.deletePage);
  const toggleFavorite = useStore((s) => s.toggleFavorite);

  if (!page) return null;

  const hasChildren = page.children.length > 0;
  const isActive = currentPageId === pageId;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-lg px-2 py-1 text-sm cursor-pointer transition-colors",
          isActive
            ? "bg-gray-200/80 text-gray-900 dark:bg-[#363636] dark:text-gray-100"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#2f2f2f]"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => setCurrentPage(pageId)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className={cn(
            "shrink-0 rounded p-0.5 hover:bg-gray-200 dark:hover:bg-[#3a3a3a]",
            !hasChildren && "invisible"
          )}
        >
          <ChevronRight
            size={14}
            className={cn(
              "transition-transform",
              expanded && "rotate-90"
            )}
          />
        </button>

        {page.icon ? (
          <span className="shrink-0 text-base">{page.icon}</span>
        ) : (
          <FileText size={14} className="shrink-0 text-gray-400" />
        )}

        <span className="flex-1 truncate">{page.title || "Untitled"}</span>

        <div className="hidden items-center gap-0.5 group-hover:flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="rounded p-0.5 hover:bg-gray-200 dark:hover:bg-[#3a3a3a]"
          >
            <MoreHorizontal size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const id = addPage("", pageId);
              setCurrentPage(id);
              setExpanded(true);
            }}
            className="rounded p-0.5 hover:bg-gray-200 dark:hover:bg-[#3a3a3a]"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="ml-8 mt-1 w-40 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-[#3a3a3a] dark:bg-[#252525]">
          <button
            onClick={() => {
              toggleFavorite(pageId);
              setShowMenu(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#2f2f2f]"
          >
            <Star size={14} />
            {page.isFavorite ? "Unfavorite" : "Favorite"}
          </button>
          <button
            onClick={() => {
              deletePage(pageId);
              setShowMenu(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}

      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {page.children.map((childId) => (
              <PageTreeItem
                key={childId}
                pageId={childId}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
