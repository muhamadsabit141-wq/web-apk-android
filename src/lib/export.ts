"use client";

import { Download, FileJson, BookOpen } from "lucide-react";
import type { Task, Page } from "@/lib/types";

export function exportTasksAsMarkdown(tasks: Task[]): string {
  let markdown = "# Tasks Export\n\n";
  markdown += `Exported on: ${new Date().toLocaleString()}\n\n`;

  // Group by status
  const byStatus: Record<string, Task[]> = {
    todo: [],
    "in-progress": [],
    done: [],
    cancelled: [],
  };

  tasks.forEach((task) => {
    byStatus[task.status].push(task);
  });

  Object.entries(byStatus).forEach(([status, statusTasks]) => {
    if (statusTasks.length === 0) return;

    markdown += `## ${status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}\n\n`;

    statusTasks.forEach((task) => {
      const checkbox = task.status === "done" ? "[x]" : "[ ]";
      markdown += `${checkbox} **${task.title}** (${task.priority})\n`;

      if (task.description) {
        markdown += `   - Description: ${task.description}\n`;
      }
      if (task.dueDate) {
        markdown += `   - Due: ${new Date(task.dueDate).toLocaleDateString()}\n`;
      }
      if (task.tags.length > 0) {
        markdown += `   - Tags: ${task.tags.join(", ")}\n`;
      }

      markdown += "\n";
    });
  });

  return markdown;
}

export function exportPageAsMarkdown(page: Page): string {
  let markdown = `# ${page.title}\n\n`;
  markdown += `Created: ${new Date(page.createdAt).toLocaleDateString()}\n`;
  markdown += `Last modified: ${new Date(page.updatedAt).toLocaleDateString()}\n\n`;

  // Export blocks
  page.blocks.forEach((block) => {
    switch (block.type) {
      case "heading1":
        markdown += `# ${block.content}\n\n`;
        break;
      case "heading2":
        markdown += `## ${block.content}\n\n`;
        break;
      case "heading3":
        markdown += `### ${block.content}\n\n`;
        break;
      case "bulletList":
        markdown += `- ${block.content}\n`;
        break;
      case "numberedList":
        markdown += `1. ${block.content}\n`;
        break;
      case "todo":
        markdown += `${block.checked ? "[x]" : "[ ]"} ${block.content}\n`;
        break;
      case "code":
        markdown += "```\n" + block.content + "\n```\n\n";
        break;
      case "quote":
        markdown += `> ${block.content}\n\n`;
        break;
      case "callout":
        markdown += `⚠️ ${block.content}\n\n`;
        break;
      case "divider":
        markdown += "---\n\n";
        break;
      default:
        markdown += block.content + "\n\n";
    }
  });

  return markdown;
}

export function downloadAsFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateCSV(tasks: Task[]): string {
  const headers = ["Title", "Priority", "Status", "Due Date", "Tags"];
  const rows = tasks.map((task) => [
    `"${task.title.replace(/"/g, '""')}"`,
    task.priority,
    task.status,
    task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
    `"${task.tags.join(",")}"`,
  ]);

  return [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");
}

interface ExportMenuProps {
  tasks?: Task[];
  page?: Page;
}

export function ExportMenu({ tasks, page }: ExportMenuProps) {
  const handleExportMarkdown = () => {
    if (tasks) {
      const markdown = exportTasksAsMarkdown(tasks);
      downloadAsFile(markdown, `tasks-${Date.now()}.md`);
    } else if (page) {
      const markdown = exportPageAsMarkdown(page);
      downloadAsFile(markdown, `${page.title}-${Date.now()}.md`);
    }
  };

  const handleExportCSV = () => {
    if (tasks) {
      const csv = generateCSV(tasks);
      downloadAsFile(csv, `tasks-${Date.now()}.csv`);
    }
  };

  const handleExportJSON = () => {
    if (tasks) {
      const json = JSON.stringify(tasks, null, 2);
      downloadAsFile(json, `tasks-${Date.now()}.json`);
    } else if (page) {
      const json = JSON.stringify(page, null, 2);
      downloadAsFile(json, `${page.title}-${Date.now()}.json`);
    }
  };

  return (
    <div className="flex flex-col gap-1 p-1">
      <button
        onClick={handleExportMarkdown}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2f2f2f] text-sm text-gray-700 dark:text-gray-300 w-full text-left"
      >
        <BookOpen size={14} />
        <span>Export as Markdown</span>
      </button>

      {tasks && (
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2f2f2f] text-sm text-gray-700 dark:text-gray-300 w-full text-left"
        >
          <Download size={14} />
          <span>Export as CSV</span>
        </button>
      )}

      <button
        onClick={handleExportJSON}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2f2f2f] text-sm text-gray-700 dark:text-gray-300 w-full text-left"
      >
        <FileJson size={14} />
        <span>Export as JSON</span>
      </button>
    </div>
  );
}
