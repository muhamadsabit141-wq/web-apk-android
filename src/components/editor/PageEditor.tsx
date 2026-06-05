"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import {
  SmilePlus,
  ImageIcon,
  Star,
  MoreHorizontal,
  Copy,
  Trash2,
  Archive,
  ChevronRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import type { BlockType } from "@/lib/types";
import BlockRenderer from "./BlockRenderer";
import SlashMenu from "./SlashMenu";
import { cn } from "@/lib/utils";

const EMOJI_LIST = [
  "📝", "📋", "📌", "🎯", "💡", "🔥", "⭐", "🚀",
  "📚", "🎨", "🎵", "💻", "🌟", "✨", "🏆", "💪",
  "🏠", "🌍", "📊", "🔔", "❤️", "🧠", "📎", "🗂️",
];

const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=300&fit=crop",
  "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=1200&h=300&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=300&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=300&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=300&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&h=300&fit=crop",
];

interface PageEditorProps {
  pageId: string;
}

export default function PageEditor({ pageId }: PageEditorProps) {
  const page = useStore((s) => s.pages[pageId]);
  const updatePage = useStore((s) => s.updatePage);
  const addBlock = useStore((s) => s.addBlock);
  const updateBlock = useStore((s) => s.updateBlock);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const duplicatePage = useStore((s) => s.duplicatePage);
  const archivePage = useStore((s) => s.archivePage);
  const deletePage = useStore((s) => s.deletePage);
  const setCurrentPage = useStore((s) => s.setCurrentPage);
  const getPageBreadcrumbs = useStore((s) => s.getPageBreadcrumbs);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [slashMenu, setSlashMenu] = useState<{
    blockId: string;
    position: { top: number; left: number };
    query: string;
  } | null>(null);
  const [focusBlockId, setFocusBlockId] = useState<string | null>(null);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updatePage(pageId, { title: e.target.value });
    },
    [pageId, updatePage]
  );

  const handleSlashMenu = useCallback(
    (blockId: string, rect: DOMRect) => {
      setSlashMenu({
        blockId,
        position: { top: rect.bottom + 4, left: Math.min(rect.left, window.innerWidth - 300) },
        query: "",
      });
    },
    []
  );

  const handleSlashSelect = useCallback(
    (type: BlockType) => {
      if (!slashMenu) return;
      updateBlock(pageId, slashMenu.blockId, { type, content: "" });
      setSlashMenu(null);
      setFocusBlockId(slashMenu.blockId);
    },
    [slashMenu, pageId, updateBlock]
  );

  if (!page) return null;

  const blocks = page.blocks && page.blocks.length > 0 ? page.blocks : [];
  const breadcrumbs = getPageBreadcrumbs(pageId);

  return (
    <div className="min-h-full">
      {/* Cover Image */}
      {page.coverUrl && (
        <div className="group/cover relative h-[180px] md:h-[240px] w-full overflow-hidden">
          <img
            src={page.coverUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <button
            onClick={() => setShowCoverPicker(true)}
            className="absolute bottom-3 right-3 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 opacity-0 transition-opacity group-hover/cover:opacity-100 hover:bg-white"
          >
            Change cover
          </button>
          <button
            onClick={() => updatePage(pageId, { coverUrl: undefined })}
            className="absolute bottom-3 right-28 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 opacity-0 transition-opacity group-hover/cover:opacity-100 hover:bg-white"
          >
            Remove
          </button>
        </div>
      )}

      {/* Cover picker */}
      {showCoverPicker && (
        <div className="mx-auto max-w-[900px] px-4 md:px-16">
          <div className="mt-2 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-[#3a3a3a] dark:bg-[#252525]">
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Choose a cover
            </p>
            <div className="grid grid-cols-3 gap-2">
              {COVER_IMAGES.map((url) => (
                <button
                  key={url}
                  onClick={() => {
                    updatePage(pageId, { coverUrl: url });
                    setShowCoverPicker(false);
                  }}
                  className="h-16 overflow-hidden rounded-lg border-2 border-transparent hover:border-[#0F7DFF]"
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCoverPicker(false)}
              className="mt-2 text-xs text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[900px] px-4 py-4 pb-32 md:px-16 md:py-8">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <div className="mb-4 flex items-center gap-1 text-sm text-gray-400">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.id} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} />}
                <button
                  onClick={() => setCurrentPage(crumb.id)}
                  className={cn(
                    "rounded px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]",
                    i === breadcrumbs.length - 1
                      ? "text-gray-600 dark:text-gray-300"
                      : "text-gray-400"
                  )}
                >
                  {crumb.title}
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Toolbar: add cover, add icon, more menu */}
        <div className="mb-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100 focus-within:opacity-100"
          style={{ opacity: 1 }}
        >
          {!page.coverUrl && (
            <button
              onClick={() => setShowCoverPicker(true)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
            >
              <ImageIcon size={13} />
              <span>Add cover</span>
            </button>
          )}
          {!page.icon && (
            <button
              onClick={() => setShowEmojiPicker(true)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
            >
              <SmilePlus size={13} />
              <span>Add icon</span>
            </button>
          )}

          {/* Page menu */}
          <div className="relative ml-auto">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
            >
              <MoreHorizontal size={14} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-20 w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-[#3a3a3a] dark:bg-[#252525]">
                  <button
                    onClick={() => { toggleFavorite(pageId); setShowMenu(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-[#2f2f2f]"
                  >
                    <Star size={14} className={page.isFavorite ? "fill-yellow-400 text-yellow-400" : ""} />
                    {page.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  </button>
                  <button
                    onClick={() => {
                      const id = duplicatePage(pageId);
                      if (id) setCurrentPage(id);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-[#2f2f2f]"
                  >
                    <Copy size={14} />
                    Duplicate
                  </button>
                  <button
                    onClick={() => { archivePage(pageId); setShowMenu(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-[#2f2f2f]"
                  >
                    <Archive size={14} />
                    Move to trash
                  </button>
                  <div className="mx-2 my-1 border-t border-gray-100 dark:border-[#3a3a3a]" />
                  <button
                    onClick={() => {
                      deletePage(pageId);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={14} />
                    Delete permanently
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Icon + Title */}
        <div className="mb-6 md:mb-8">
          {page.icon && (
            <div className="relative mb-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl text-4xl md:text-5xl hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition-colors"
              >
                {page.icon}
              </button>
            </div>
          )}

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className="relative z-10 mb-3">
              <div className="absolute left-0 top-0 grid grid-cols-8 gap-1 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-[#3a3a3a] dark:bg-[#252525]">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      updatePage(pageId, { icon: emoji });
                      setShowEmojiPicker(false);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
                {page.icon && (
                  <button
                    onClick={() => {
                      updatePage(pageId, { icon: undefined });
                      setShowEmojiPicker(false);
                    }}
                    className="col-span-8 mt-1 rounded-lg px-2 py-1.5 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
                  >
                    Remove icon
                  </button>
                )}
              </div>
              <div className="fixed inset-0 -z-10" onClick={() => setShowEmojiPicker(false)} />
            </div>
          )}

          <input
            value={page.title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full bg-transparent text-3xl md:text-[40px] font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-600 leading-tight"
          />
          <p className="mt-1 text-sm text-gray-400">
            {new Date(page.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Block editor */}
        <div className="space-y-0.5 pl-7 md:pl-14">
          {blocks.map((block, i) => (
            <BlockRenderer
              key={block.id}
              block={block}
              pageId={pageId}
              index={i}
              onSlashMenu={handleSlashMenu}
              focusBlockId={focusBlockId}
            />
          ))}

          {/* Add block area */}
          <button
            onClick={() => {
              const lastBlock = blocks[blocks.length - 1];
              addBlock(pageId, lastBlock?.id || null);
            }}
            className="w-full py-4 text-left text-sm text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-500 transition-colors"
          >
            Click to add a block, or type &apos;/&apos; for commands
          </button>
        </div>

        {/* Slash command menu */}
        <AnimatePresence>
          {slashMenu && (
            <SlashMenu
              query={slashMenu.query}
              position={slashMenu.position}
              onSelect={handleSlashSelect}
              onClose={() => setSlashMenu(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
