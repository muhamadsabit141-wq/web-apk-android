"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Check,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Block, BlockType } from "@/lib/types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface BlockRendererProps {
  block: Block;
  pageId: string;
  onSlashMenu: (blockId: string, rect: DOMRect) => void;
  focusBlockId: string | null;
}

export default function BlockRenderer({
  block,
  pageId,
  onSlashMenu,
  focusBlockId,
}: BlockRendererProps) {
  const updateBlock = useStore((s) => s.updateBlock);
  const deleteBlock = useStore((s) => s.deleteBlock);
  const addBlock = useStore((s) => s.addBlock);
  const moveBlock = useStore((s) => s.moveBlock);
  const [showActions, setShowActions] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (focusBlockId === block.id && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLTextAreaElement) {
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }
  }, [focusBlockId, block.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey && block.type !== "code") {
        e.preventDefault();
        addBlock(pageId, block.id, block.type === "todo" ? "todo" : "text");
      }
      if (e.key === "Backspace" && block.content === "" && block.type !== "text") {
        e.preventDefault();
        updateBlock(pageId, block.id, { type: "text" as BlockType });
      }
      if (e.key === "Backspace" && block.content === "" && block.type === "text") {
        e.preventDefault();
        deleteBlock(pageId, block.id);
      }
      if (e.key === "/" && block.content === "") {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        onSlashMenu(block.id, rect);
      }
    },
    [block, pageId, addBlock, updateBlock, deleteBlock, onSlashMenu]
  );

  const handleChange = (value: string) => {
    updateBlock(pageId, block.id, { content: value });
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const baseInputClass =
    "w-full bg-transparent focus:outline-none resize-none text-[#37352F] dark:text-[#E8E8E5] placeholder:text-gray-400 dark:placeholder:text-gray-600";

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
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#37352F] dark:bg-[#E8E8E5]" />
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
            <span className="mt-[2px] shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[20px]">
              1.
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
          <div className="flex items-start gap-2.5">
            <button
              onClick={() => updateBlock(pageId, block.id, { checked: !block.checked })}
              className={cn(
                "mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                block.checked
                  ? "border-[#0F7DFF] bg-[#0F7DFF] text-white"
                  : "border-gray-300 hover:border-gray-400 dark:border-gray-600"
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
          <div className="rounded-lg bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#3a3a3a]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-[#3a3a3a]">
              <span className="text-xs font-medium text-gray-500">Code</span>
            </div>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={block.content}
              onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const target = e.target as HTMLTextAreaElement;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  handleChange(block.content.substring(0, start) + "  " + block.content.substring(end));
                  setTimeout(() => target.setSelectionRange(start + 2, start + 2), 0);
                } else {
                  handleKeyDown(e);
                }
              }}
              placeholder="// Write code here..."
              rows={3}
              className={cn(baseInputClass, "px-4 py-3 font-mono text-sm leading-6 whitespace-pre")}
            />
          </div>
        );
      case "quote":
        return (
          <div className="flex gap-3">
            <div className="w-1 shrink-0 rounded-full bg-[#37352F] dark:bg-[#E8E8E5]" />
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={block.content}
              onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
              onKeyDown={handleKeyDown}
              placeholder="Quote"
              rows={1}
              className={cn(baseInputClass, "text-base italic leading-[1.7]")}
            />
          </div>
        );
      case "callout":
        return (
          <div className="flex gap-3 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/10">
            <span className="text-xl">💡</span>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={block.content}
              onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
              onKeyDown={handleKeyDown}
              placeholder="Type a callout..."
              rows={1}
              className={cn(baseInputClass, "bg-transparent text-base leading-[1.7]")}
            />
          </div>
        );
      case "toggle":
        return (
          <div>
            <div className="flex items-start gap-1.5">
              <button
                onClick={() => updateBlock(pageId, block.id, { collapsed: !block.collapsed })}
                className="mt-[3px] shrink-0 rounded p-0.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
              >
                {block.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
              </button>
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={block.content}
                onChange={(e) => { handleChange(e.target.value); autoResize(e.target); }}
                onKeyDown={handleKeyDown}
                placeholder="Toggle"
                rows={1}
                className={cn(baseInputClass, "text-base font-medium leading-[1.7]")}
              />
            </div>
            {!block.collapsed && (
              <div className="ml-7 mt-1 border-l-2 border-gray-200 pl-4 dark:border-[#3a3a3a]">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Toggle content area
                </p>
              </div>
            )}
          </div>
        );
      case "image":
        return (
          <div>
            {block.url ? (
              <img
                src={block.url}
                alt=""
                className="max-w-full rounded-xl"
              />
            ) : (
              <div>
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  value={block.content}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      updateBlock(pageId, block.id, { url: block.content });
                    }
                  }}
                  placeholder="Paste image URL and press Enter..."
                  className={cn(
                    "w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm dark:border-[#3a3a3a] dark:bg-[#1e1e1e]",
                    baseInputClass
                  )}
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
      className="group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={cn(
        "absolute -left-14 top-0 hidden items-center gap-0.5 md:flex transition-opacity",
        showActions ? "opacity-100" : "opacity-0"
      )}>
        <button
          onClick={() => addBlock(pageId, block.id)}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
          title="Add block below"
        >
          <Plus size={14} />
        </button>
        <div className="flex flex-col">
          <button
            onClick={() => moveBlock(pageId, block.id, "up")}
            className="rounded p-0.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
            title="Move up"
          >
            <ArrowUp size={10} />
          </button>
          <button
            onClick={() => moveBlock(pageId, block.id, "down")}
            className="rounded p-0.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]"
            title="Move down"
          >
            <ArrowDown size={10} />
          </button>
        </div>
        <button className="cursor-grab rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2f2f2f]">
          <GripVertical size={14} />
        </button>
      </div>

      {/* Mobile action: long-press hint */}
      <div className="flex items-start gap-1 md:hidden">
        {block.type !== "divider" && (
          <button
            onClick={() => {
              const menu = document.createElement("div");
              const rect = inputRef.current?.getBoundingClientRect();
              if (rect) onSlashMenu(block.id, rect);
            }}
            className="mt-1 shrink-0 rounded p-1 text-gray-300 active:bg-gray-100 dark:text-gray-600 dark:active:bg-[#2f2f2f]"
          >
            <Plus size={14} />
          </button>
        )}
        <div className="flex-1 min-w-0">{renderBlock()}</div>
        {block.type !== "divider" && showActions && (
          <button
            onClick={() => deleteBlock(pageId, block.id)}
            className="mt-1 shrink-0 rounded p-1 text-gray-300 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="hidden md:block">{renderBlock()}</div>
    </div>
  );
}
