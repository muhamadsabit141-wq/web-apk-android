"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronRight,
  Check,
  ImageIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Block } from "@/lib/types";

interface BlockRendererProps {
  block: Block;
  pageId: string;
  onSlashMenu: (blockId: string, rect: DOMRect) => void;
  focusBlockId: string | null;
  index?: number;
}

export default function BlockRenderer({
  block,
  pageId,
  onSlashMenu,
  focusBlockId,
  index = 0,
}: BlockRendererProps) {
  const addBlock = useStore((s) => s.addBlock);
  const updateBlock = useStore((s) => s.updateBlock);
  const deleteBlock = useStore((s) => s.deleteBlock);

  const [showActions, setShowActions] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (focusBlockId === block.id && inputRef.current) {
      inputRef.current.focus();
      if ("selectionStart" in inputRef.current) {
        inputRef.current.selectionStart = inputRef.current.value.length;
        inputRef.current.selectionEnd = inputRef.current.value.length;
      }
    }
  }, [focusBlockId, block.id]);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  useEffect(() => {
    if (inputRef.current && inputRef.current instanceof HTMLTextAreaElement) {
      autoResize(inputRef.current);
    }
  }, [block.content]);

  const handleChange = (value: string) => {
    updateBlock(pageId, block.id, { content: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && block.type !== "code") {
      e.preventDefault();
      addBlock(pageId, block.id);
    }
    if (
      e.key === "Backspace" &&
      block.content === "" &&
      block.type !== "text"
    ) {
      e.preventDefault();
      updateBlock(pageId, block.id, { type: "text" });
    }
    if (e.key === "Backspace" && block.content === "" && block.type === "text") {
      e.preventDefault();
      deleteBlock(pageId, block.id);
    }
    if (e.key === "/" && block.content === "") {
      e.preventDefault();
      const rect = inputRef.current?.getBoundingClientRect();
      if (rect) onSlashMenu(block.id, rect);
    }
    if (e.key === "Tab" && block.type === "code") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      handleChange(value.substring(0, start) + "  " + value.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const baseInputClass =
    "w-full resize-none overflow-hidden bg-transparent focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-gray-100";

  const renderBlock = () => {
    switch (block.type) {
      case "heading1":
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={block.content}
            onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
            onKeyDown={handleKeyDown}
            placeholder="Heading 1"
            rows={1}
            className={cn(baseInputClass, "text-3xl font-bold leading-tight")}
          />
        );
      case "heading2":
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={block.content}
            onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
            onKeyDown={handleKeyDown}
            placeholder="Heading 2"
            rows={1}
            className={cn(baseInputClass, "text-2xl font-semibold leading-tight")}
          />
        );
      case "heading3":
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={block.content}
            onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
            onKeyDown={handleKeyDown}
            placeholder="Heading 3"
            rows={1}
            className={cn(baseInputClass, "text-xl font-semibold leading-tight")}
          />
        );
      case "bulletList":
        return (
          <div className="flex items-start gap-2">
            <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900 dark:bg-gray-100" />
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={block.content}
              onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
              onKeyDown={handleKeyDown}
              placeholder="List item"
              rows={1}
              className={cn(baseInputClass, "text-base leading-[1.7]")}
            />
          </div>
        );
      case "numberedList":
        return (
          <div className="flex items-start gap-2">
            <span className="mt-[2px] shrink-0 min-w-[1.25rem] text-right text-base text-gray-500 dark:text-gray-400">
              {(index + 1)}.
            </span>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={block.content}
              onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
              onKeyDown={handleKeyDown}
              placeholder="List item"
              rows={1}
              className={cn(baseInputClass, "text-base leading-[1.7]")}
            />
          </div>
        );
      case "todo":
        return (
          <div className="flex items-start gap-2">
            <button
              onClick={() => updateBlock(pageId, block.id, { checked: !block.checked })}
              className={cn(
                "mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                block.checked
                  ? "border-[#0F7DFF] bg-[#0F7DFF] text-white"
                  : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
              )}
            >
              {block.checked && <Check size={12} strokeWidth={3} />}
            </button>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={block.content}
              onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
              onKeyDown={handleKeyDown}
              placeholder="To-do"
              rows={1}
              className={cn(
                baseInputClass,
                "text-base leading-[1.7]",
                block.checked && "text-gray-400 line-through dark:text-gray-500"
              )}
            />
          </div>
        );
      case "divider":
        return (
          <div className="py-2">
            <hr className="border-gray-200 dark:border-[#3a3a3a]" />
          </div>
        );
      case "code":
        return (
          <div className="rounded-lg border border-gray-200 bg-[#F7F7F5] dark:border-[#3a3a3a] dark:bg-[#1e1e1e]">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-1.5 dark:border-[#3a3a3a]">
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                {block.language || "code"}
              </span>
            </div>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={block.content}
              onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
              onKeyDown={handleKeyDown}
              placeholder="Write code..."
              rows={3}
              className={cn(
                baseInputClass,
                "whitespace-pre-wrap p-4 font-mono text-sm leading-6"
              )}
            />
          </div>
        );
      case "quote":
        return (
          <div className="flex">
            <div className="mr-3 w-1 shrink-0 rounded-full bg-gray-900 dark:bg-gray-100" />
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={block.content}
              onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
              onKeyDown={handleKeyDown}
              placeholder="Quote"
              rows={1}
              className={cn(baseInputClass, "text-base italic leading-[1.7] text-gray-700 dark:text-gray-300")}
            />
          </div>
        );
      case "callout":
        return (
          <div className="flex gap-3 rounded-lg bg-[#FBF3DB] p-4 dark:bg-[#2D2B24]">
            <span className="shrink-0 text-xl">💡</span>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={block.content}
              onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
              onKeyDown={handleKeyDown}
              placeholder="Callout"
              rows={1}
              className={cn(baseInputClass, "text-base leading-[1.7]")}
            />
          </div>
        );
      case "toggle":
        return (
          <div>
            <div className="flex items-start gap-1">
              <button
                onClick={() =>
                  updateBlock(pageId, block.id, {
                    collapsed: !block.collapsed,
                  })
                }
                className="mt-[3px] shrink-0 rounded p-0.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
              >
                <ChevronRight
                  size={16}
                  className={cn(
                    "transition-transform",
                    !block.collapsed && "rotate-90"
                  )}
                />
              </button>
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={block.content}
                onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
                onKeyDown={handleKeyDown}
                placeholder="Toggle"
                rows={1}
                className={cn(baseInputClass, "text-base leading-[1.7]")}
              />
            </div>
            {!block.collapsed && (
              <div className="ml-6 mt-1 border-l-2 border-gray-200 pl-4 dark:border-[#3a3a3a]">
                <p className="text-sm text-gray-400">Toggle content (click arrow to collapse)</p>
              </div>
            )}
          </div>
        );
      case "image":
        return (
          <div>
            {block.url ? (
              <div className="group/img relative overflow-hidden rounded-lg">
                <img
                  src={block.url}
                  alt=""
                  className="w-full rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <button
                  onClick={() => updateBlock(pageId, block.id, { url: undefined })}
                  className="absolute right-2 top-2 rounded-lg bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover/img:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 py-8 dark:border-[#3a3a3a] dark:bg-[#1e1e1e]/50">
                <ImageIcon size={32} className="text-gray-300 dark:text-gray-600" />
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  value={block.content}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      updateBlock(pageId, block.id, { url: block.content, content: "" });
                    }
                  }}
                  placeholder="Paste image URL and press Enter"
                  className="w-full max-w-sm bg-transparent px-4 text-center text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none dark:text-gray-400"
                />
              </div>
            )}
          </div>
        );
      default:
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={block.content}
            onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
            onKeyDown={handleKeyDown}
            placeholder="Type '/' for commands..."
            rows={1}
            className={cn(baseInputClass, "text-base leading-[1.7]")}
          />
        );
    }
  };

  return (
    <div
      className="group relative flex items-start"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Left action buttons - desktop */}
      <div
        className={cn(
          "absolute -left-[52px] top-0.5 hidden items-center gap-0.5 md:flex transition-opacity duration-150",
          showActions ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <button
          onClick={() => addBlock(pageId, block.id)}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#2f2f2f] dark:hover:text-gray-300"
          title="Add block below"
        >
          <Plus size={14} />
        </button>
        <button
          className="cursor-grab rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#2f2f2f] dark:hover:text-gray-300"
          title="Drag to reorder"
          onMouseDown={() => {}}
        >
          <GripVertical size={14} />
        </button>
      </div>

      {/* Block content */}
      <div className="min-w-0 flex-1">{renderBlock()}</div>

      {/* Right action buttons - visible on hover/focus */}
      <div
        className={cn(
          "absolute -right-8 top-0.5 hidden md:flex items-center transition-opacity duration-150",
          showActions ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {block.type !== "divider" && (
          <button
            onClick={() => deleteBlock(pageId, block.id)}
            className="rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
            title="Delete block"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Mobile: long-press plus button */}
      <div className="absolute -left-7 top-0.5 md:hidden">
        {block.type !== "divider" && (
          <button
            onClick={() => {
              const rect = inputRef.current?.getBoundingClientRect();
              if (rect) onSlashMenu(block.id, rect);
            }}
            className="rounded p-1 text-gray-300 active:text-gray-500 dark:text-gray-600"
          >
            <Plus size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
