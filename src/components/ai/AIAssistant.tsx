"use client";

import { useState } from "react";
import { Sparkles, Send, X, Loader } from "lucide-react";
import { motion } from "framer-motion";

interface AISuggestion {
  id: string;
  type: "title" | "description" | "tags" | "content";
  suggestion: string;
  confidence: number;
}

interface AIAssistantProps {
  onApply?: (suggestion: AISuggestion) => void;
  context?: {
    title?: string;
    currentContent?: string;
    type?: "task" | "note" | "page";
  };
}

export function AIAssistant({ onApply, context }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulated AI suggestions
  const generateSuggestions = async (query: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call

    const mockSuggestions: AISuggestion[] = [];

    if (query.toLowerCase().includes("meeting")) {
      mockSuggestions.push(
        {
          id: "1",
          type: "title",
          suggestion: "Team Standup Meeting",
          confidence: 0.95,
        },
        {
          id: "2",
          type: "description",
          suggestion:
            "Discuss project progress, blockers, and next steps. Duration: 30 minutes",
          confidence: 0.88,
        },
        {
          id: "3",
          type: "tags",
          suggestion: "meeting, team, planning",
          confidence: 0.82,
        }
      );
    } else if (query.toLowerCase().includes("task")) {
      mockSuggestions.push(
        {
          id: "1",
          type: "title",
          suggestion: "Complete task management feature",
          confidence: 0.90,
        },
        {
          id: "2",
          type: "description",
          suggestion: "Implement CRUD operations for task management system",
          confidence: 0.85,
        }
      );
    } else if (query) {
      mockSuggestions.push(
        {
          id: "1",
          type: "content",
          suggestion: `Here's a summary of: ${query}`,
          confidence: 0.78,
        }
      );
    }

    setSuggestions(mockSuggestions);
    setLoading(false);
  };

  const handleGenerateSuggestions = async () => {
    if (!input.trim()) return;
    await generateSuggestions(input);
  };

  return (
    <>
      {/* AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        title="AI Assistant"
      >
        <Sparkles size={18} />
        <span className="hidden sm:inline text-sm font-medium">AI</span>
      </button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 md:bottom-20 right-4 md:right-6 w-96 max-w-[calc(100vw-2rem)] z-50"
        >
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-[#2f2f2f] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSuggestions([]);
                  setInput("");
                }}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleGenerateSuggestions();
                  }}
                  placeholder="Ask AI for help..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-[#2f2f2f] bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm"
                />
                <button
                  onClick={handleGenerateSuggestions}
                  disabled={loading || !input.trim()}
                  className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    SUGGESTIONS
                  </p>
                  {suggestions.map((suggestion) => (
                    <motion.button
                      key={suggestion.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => {
                        onApply?.(suggestion);
                        setInput("");
                        setSuggestions([]);
                      }}
                      className="w-full text-left p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900/30 hover:border-purple-400 dark:hover:border-purple-700 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                            {suggestion.type}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 truncate group-hover:text-clip">
                            {suggestion.suggestion}
                          </p>
                        </div>
                        <div className="flex-shrink-0 px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-xs font-semibold text-purple-600 dark:text-purple-400">
                          {Math.round(suggestion.confidence * 100)}%
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && suggestions.length === 0 && input && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Sparkles size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No suggestions yet
                  </p>
                </div>
              )}

              {!loading && suggestions.length === 0 && !input && (
                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <p className="font-semibold">✨ AI Assistant Tips:</p>
                  <ul className="space-y-1">
                    <li>• Ask me to help with task titles</li>
                    <li>• Request content suggestions</li>
                    <li>• Ask for tag recommendations</li>
                    <li>• Request note organization help</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
