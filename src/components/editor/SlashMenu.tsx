"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Minus,
  Code,
  Quote,
  AlertCircle,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import type { BlockType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SlashMenuItem {
  type: BlockType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const MENU_ITEMS: SlashMenuItem[] = [
  { type: "text", label: "Text", description: "Plain text block", icon: <Type size={18} /> },
  { type: "heading1", label: "Heading 1", description: "Large section heading", icon: <Heading1 size={18} /> },
  { type: "heading2", label: "Heading 2", description: "Medium section heading", icon: <Heading2 size={18} /> },
  { type: "heading3", label: "Heading 3", description: "Small section heading", icon: <Heading3 size={18} /> },
  { type: "bulletList", label: "Bullet List", description: "Unordered list item", icon: <List size={18} /> },
  { type: "numberedList", label: "Numbered List", description: "Ordered list item", icon: <ListOrdered size={18} /> },
  { type: "todo", label: "To-do", description: "Checkbox task item", icon: <CheckSquare size={18} /> },
  { type: "divider", label: "Divider", description: "Horizontal separator", icon: <Minus size={18} /> },
  { type: "code", label: "Code", description: "Code snippet block", icon: <Code size={18} /> },
  { type: "quote", label: "Quote", description: "Blockquote text", icon: <Quote size={18} /> },
  { type: "callout", label: "Callout", description: "Highlighted info block", icon: <AlertCircle size={18} /> },
  { type: "toggle", label: "Toggle", description: "Collapsible content", icon: <ChevronRight size={18} /> },
  { type: "image", label: "Image", description: "Image from URL", icon: <ImageIcon size={18} /> },
];

interface SlashMenuProps {
  query: string;
  position: { top: number; left: number };
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

export default function SlashMenu({
  query,
  position,
  onSelect,
  onClose,
}: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const filtered = MENU_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- reset selection on query change */
    setSelectedIndex(0);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelect(filtered[selectedIndex].type);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [filtered, selectedIndex, onSelect, onClose]);

  useEffect(() => {
    const el = menuRef.current?.children[selectedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (filtered.length === 0) return null;

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="fixed z-50 max-h-[300px] w-[280px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-[#3a3a3a] dark:bg-[#252525]"
      style={{ top: position.top, left: position.left }}
    >
      <div className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
        Blocks
      </div>
      {filtered.map((item, i) => (
        <button
          key={item.type}
          onClick={() => onSelect(item.type)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
            i === selectedIndex
              ? "bg-gray-100 dark:bg-[#363636]"
              : "hover:bg-gray-50 dark:hover:bg-[#2f2f2f]"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 dark:border-[#3a3a3a] dark:bg-[#1e1e1e] dark:text-gray-400">
            {item.icon}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {item.description}
            </div>
          </div>
        </button>
      ))}
    </motion.div>
  );
}
