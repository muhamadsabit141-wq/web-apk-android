"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Copy, Trash2 } from "lucide-react";
import { createBlock } from "@/lib/utils";
import type { Block } from "@/lib/types";

export interface Template {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
  icon: string;
  category: "note" | "checklist" | "meeting" | "blog" | "project";
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "template-daily-note",
    name: "Daily Note",
    description: "Template for daily journal and reflections",
    icon: "📔",
    category: "note",
    blocks: [
      createBlock("heading1", "Today"),
      createBlock("heading2", "What I accomplished"),
      createBlock("bulletList", "Item 1"),
      createBlock("bulletList", "Item 2"),
      createBlock("heading2", "Reflections"),
      createBlock("text", ""),
      createBlock("heading2", "Tomorrow's goals"),
      createBlock("numberedList", "Goal 1"),
      createBlock("numberedList", "Goal 2"),
    ],
  },
  {
    id: "template-meeting",
    name: "Meeting Notes",
    description: "Template for capturing meeting information",
    icon: "👥",
    category: "meeting",
    blocks: [
      createBlock("heading1", "Meeting: "),
      createBlock("heading2", "Date & Attendees"),
      createBlock("text", "Date: \nAttendees: "),
      createBlock("heading2", "Agenda"),
      createBlock("bulletList", ""),
      createBlock("heading2", "Discussion"),
      createBlock("text", ""),
      createBlock("heading2", "Action Items"),
      createBlock("todo", "Item 1"),
      createBlock("todo", "Item 2"),
    ],
  },
  {
    id: "template-project",
    name: "Project Brief",
    description: "Template for project planning",
    icon: "🎯",
    category: "project",
    blocks: [
      createBlock("heading1", "Project Name"),
      createBlock("heading2", "Overview"),
      createBlock("text", ""),
      createBlock("heading2", "Goals"),
      createBlock("numberedList", "Goal 1"),
      createBlock("numberedList", "Goal 2"),
      createBlock("heading2", "Timeline"),
      createBlock("text", "Start: \nEnd: "),
      createBlock("heading2", "Resources"),
      createBlock("bulletList", ""),
      createBlock("heading2", "Risks & Mitigation"),
      createBlock("text", ""),
    ],
  },
  {
    id: "template-blog-post",
    name: "Blog Post",
    description: "Template for writing blog posts",
    icon: "✍️",
    category: "blog",
    blocks: [
      createBlock("heading1", "Title"),
      createBlock("text", "Excerpt or summary"),
      createBlock("heading2", "Introduction"),
      createBlock("text", ""),
      createBlock("heading2", "Main Content"),
      createBlock("heading3", "Section 1"),
      createBlock("text", ""),
      createBlock("heading3", "Section 2"),
      createBlock("text", ""),
      createBlock("heading2", "Conclusion"),
      createBlock("text", ""),
      createBlock("heading2", "References"),
      createBlock("bulletList", "Reference 1"),
    ],
  },
  {
    id: "template-checklist",
    name: "Checklist",
    description: "Template for task lists",
    icon: "✅",
    category: "checklist",
    blocks: [
      createBlock("heading1", "Checklist"),
      createBlock("text", ""),
      createBlock("todo", "Task 1"),
      createBlock("todo", "Task 2"),
      createBlock("todo", "Task 3"),
    ],
  },
];

interface TemplatesGalleryProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

export function TemplatesGallery({
  onSelectTemplate,
  onClose,
}: TemplatesGalleryProps) {
  const [category, setCategory] = useState<Template["category"] | "all">("all");

  const filteredTemplates =
    category === "all"
      ? DEFAULT_TEMPLATES
      : DEFAULT_TEMPLATES.filter((t) => t.category === category);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-[#1e1e1e] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-[#2f2f2f] p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Page Templates
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-[#2f2f2f] overflow-x-auto">
          {["all", "note", "meeting", "project", "blog", "checklist"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() =>
                  setCategory(cat as Template["category"] | "all")
                }
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-[#2f2f2f] text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
          {filteredTemplates.map((template) => (
            <motion.button
              key={template.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectTemplate(template)}
              className="text-left p-4 rounded-xl border border-gray-200 dark:border-[#2f2f2f] hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-2">{template.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {template.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{template.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default DEFAULT_TEMPLATES;
