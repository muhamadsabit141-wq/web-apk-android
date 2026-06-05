"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { SmilePlus } from "lucide-react";
import { useStore } from "@/lib/store";
import type { BlockType } from "@/lib/types";
import BlockRenderer from "./BlockRenderer";
import SlashMenu from "./SlashMenu";

const EMOJI_LIST = [
  "📝", "📋", "📌", "🎯", "💡", "🔥", "⭐", "🚀",
  "📚", "🎨", "🎵", "💻", "🌟", "✨", "🏆", "💪",
];

interface PageEditorProps {
  pageId: string;
}

export default function PageEditor({ pageId }: PageEditorProps) {
  const page = useStore((s) => s.pages[pageId]);
  const updatePage = useStore((s) => s.updatePage);
  const addBlock = useStore((s) => s.addBlock);
  const updateBlock = useStore((s) => s.updateBlock);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
        position: { top: rect.bottom + 4, left: rect.left },
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

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-8 pb-32 md:px-16 md:py-12">
      {/* Icon + Title */}
      <div className="mb-6 md:mb-8">
        <div className="relative mb-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="mb-2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl text-2xl md:text-3xl hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
          >
            {page.icon || <SmilePlus size={22} className="text-gray-300" />}
          </button>
          {showEmojiPicker && (
            <div className="absolute top-12 md:top-14 left-0 z-10 grid grid-cols-8 gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-[#3a3a3a] dark:bg-[#252525]">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    updatePage(pageId, { icon: emoji });
                    setShowEmojiPicker(false);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-lg hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
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
                  className="col-span-8 mt-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
                >
                  Remove icon
                </button>
              )}
            </div>
          )}
        </div>

        <input
          value={page.title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="w-full bg-transparent text-3xl md:text-4xl font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-600"
        />
      </div>

      {/* Block editor */}
      <div className="space-y-1">
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            pageId={pageId}
            onSlashMenu={handleSlashMenu}
            focusBlockId={focusBlockId}
          />
        ))}
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
  );
}
