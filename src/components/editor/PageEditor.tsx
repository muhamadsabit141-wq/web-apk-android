"use client";

import { useState, useCallback } from "react";
import { useStore } from "@/lib/store";
import { SmilePlus } from "lucide-react";

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updatePage(pageId, { title: e.target.value });
    },
    [pageId, updatePage]
  );

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updatePage(pageId, { content: e.target.value });
    },
    [pageId, updatePage]
  );

  if (!page) return null;

  return (
    <div className="mx-auto w-full max-w-[900px] px-6 py-12 md:px-16">
      {/* Icon + Title */}
      <div className="mb-8">
        <div className="relative mb-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl text-3xl hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
          >
            {page.icon || <SmilePlus size={24} className="text-gray-300" />}
          </button>
          {showEmojiPicker && (
            <div className="absolute top-14 left-0 z-10 grid grid-cols-8 gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-[#3a3a3a] dark:bg-[#252525]">
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
          className="w-full bg-transparent text-4xl font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-600"
        />
      </div>

      {/* Content area */}
      <textarea
        value={page.content}
        onChange={handleContentChange}
        placeholder="Start writing, or press '/' for commands..."
        className="min-h-[60vh] w-full resize-none bg-transparent text-base leading-[1.7] text-[#37352F] placeholder:text-gray-400 focus:outline-none dark:text-[#E8E8E5] dark:placeholder:text-gray-600"
      />
    </div>
  );
}
