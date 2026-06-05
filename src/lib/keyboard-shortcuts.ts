"use client";

import { useEffect, useState } from "react";
import { Command, HelpCircle, X } from "lucide-react";

export interface Shortcut {
  keys: string[];
  description: string;
  action: () => void;
}

const KEYBOARD_SHORTCUTS: { label: string; shortcuts: Shortcut[] }[] = [
  {
    label: "Navigation",
    shortcuts: [
      {
        keys: ["Ctrl", "K"],
        description: "Open command palette",
        action: () => {},
      },
      {
        keys: ["Ctrl", "B"],
        description: "Toggle sidebar",
        action: () => {},
      },
    ],
  },
  {
    label: "Editing",
    shortcuts: [
      {
        keys: ["/"],
        description: "Open slash commands",
        action: () => {},
      },
      {
        keys: ["Ctrl", "Enter"],
        description: "Save changes",
        action: () => {},
      },
      {
        keys: ["Ctrl", "Z"],
        description: "Undo",
        action: () => {},
      },
      {
        keys: ["Ctrl", "Shift", "Z"],
        description: "Redo",
        action: () => {},
      },
    ],
  },
  {
    label: "Tasks",
    shortcuts: [
      {
        keys: ["Ctrl", "Shift", "T"],
        description: "Create new task",
        action: () => {},
      },
      {
        keys: ["Tab"],
        description: "Mark task as complete",
        action: () => {},
      },
    ],
  },
  {
    label: "Theme",
    shortcuts: [
      {
        keys: ["Ctrl", "Shift", "L"],
        description: "Toggle dark mode",
        action: () => {},
      },
    ],
  },
];

export function useKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K: Command palette
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        // Trigger command palette
      }

      // Ctrl+B: Toggle sidebar
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        // Trigger sidebar toggle
      }

      // Ctrl+Shift+L: Toggle dark mode
      if (e.ctrlKey && e.shiftKey && e.key === "l") {
        e.preventDefault();
        // Trigger dark mode toggle
      }

      // ?: Show help
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { showHelp, setShowHelp };
}

export function KeyboardShortcutsHelp({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-[#2f2f2f] p-4">
          <div className="flex items-center gap-2">
            <Command size={20} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {KEYBOARD_SHORTCUTS.map((group) => (
            <div key={group.label}>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.shortcuts.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#252525]"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {shortcut.description}
                    </span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <div key={i}>
                          <kbd className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-gray-400 mx-1">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-[#2f2f2f] p-4 bg-gray-50 dark:bg-[#252525]">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press <kbd className="px-1 py-0.5 rounded bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-xs">?</kbd> anytime to show this help
          </p>
        </div>
      </div>
    </div>
  );
}
