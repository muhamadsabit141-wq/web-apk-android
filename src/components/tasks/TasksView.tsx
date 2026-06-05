"use client";

import { useState } from "react";
import {
  Plus,
  ChevronDown,
  Trash2,
  Flag,
  Calendar,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDateDisplay, getPriorityColor, getStatusColor } from "@/lib/utils";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";

const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"];
const STATUSES: TaskStatus[] = ["todo", "in-progress", "done", "cancelled"];

export default function TasksView() {
  const tasks = useStore((s) => s.getTasks());
  const addTask = useStore((s) => s.addTask);
  const updateTask = useStore((s) => s.updateTask);
  const deleteTask = useStore((s) => s.deleteTask);
  const toggleTaskStatus = useStore((s) => s.toggleTaskStatus);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "created">(
    "dueDate"
  );

  const handleAddTask = (priority: TaskPriority = "medium") => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle, priority);
      setNewTaskTitle("");
    }
  };

  const filteredTasks = tasks.filter(
    (t) => filterStatus === "all" || t.status === filterStatus
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return (a.dueDate ?? Infinity) - (b.dueDate ?? Infinity);
      case "priority":
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "created":
        return b.createdAt - a.createdAt;
      default:
        return 0;
    }
  });

  const tasksByStatus = {
    todo: sortedTasks.filter((t) => t.status === "todo"),
    "in-progress": sortedTasks.filter((t) => t.status === "in-progress"),
    done: sortedTasks.filter((t) => t.status === "done"),
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#191919]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-[#2f2f2f] bg-white dark:bg-[#191919] px-4 py-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
          Tasks
        </h2>

        {/* Quick Add */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTask("medium");
            }}
            placeholder="Add a task..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-[#2f2f2f] bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm"
          />
          <button
            onClick={() => handleAddTask("medium")}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(["all", ...STATUSES] as const).map((status) => (
            <button
              key={status}
              onClick={() =>
                setFilterStatus(status === "all" ? "all" : status)
              }
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-[#2f2f2f] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3a3a3a]"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto">
        {sortedTasks.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>No tasks yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isExpanded={expandedTask === task.id}
                onToggleExpanded={() =>
                  setExpandedTask(
                    expandedTask === task.id ? null : task.id
                  )
                }
                onStatusChange={() => toggleTaskStatus(task.id)}
                onDelete={() => deleteTask(task.id)}
                onUpdate={(updates) => updateTask(task.id, updates)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onStatusChange: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Task>) => void;
}

function TaskItem({
  task,
  isExpanded,
  onToggleExpanded,
  onStatusChange,
  onDelete,
  onUpdate,
}: TaskItemProps) {
  const priorityColor = getPriorityColor(task.priority);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-[#2f2f2f] bg-gray-50 dark:bg-[#1e1e1e] hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors">
      {/* Main row */}
      <div className="flex items-center gap-2 p-3">
        {/* Status toggle */}
        <button
          onClick={onStatusChange}
          className="flex-shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-[#2f2f2f]"
        >
          {task.status === "done" ? (
            <CheckCircle2 size={20} className="text-green-500" />
          ) : (
            <Circle size={20} className="text-gray-400" />
          )}
        </button>

        {/* Title & Priority */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              task.status === "done"
                ? "line-through text-gray-400"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-500 truncate">
              {task.description}
            </p>
          )}
        </div>

        {/* Priority badge */}
        <div
          className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium border ${priorityColor}`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-500">
            <Calendar size={14} />
            {formatDateDisplay(task.dueDate)}
          </div>
        )}

        {/* Expand button */}
        <button
          onClick={onToggleExpanded}
          className="flex-shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-[#2f2f2f]"
        >
          <ChevronDown
            size={18}
            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-[#2f2f2f] px-3 py-2 bg-white dark:bg-[#252525] space-y-2">
          {task.tags && task.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs text-blue-700 dark:text-blue-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {task.checklist && task.checklist.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Checklist
              </p>
              {task.checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => {
                      const updated = task.checklist?.map((c) =>
                        c.id === item.id
                          ? { ...c, completed: e.target.checked }
                          : c
                      );
                      onUpdate({ checklist: updated });
                    }}
                    className="w-4 h-4 rounded"
                  />
                  <span
                    className={
                      item.completed
                        ? "line-through text-gray-400"
                        : "text-gray-900 dark:text-gray-100"
                    }
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Delete button */}
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-medium"
          >
            <Trash2 size={14} />
            Delete Task
          </button>
        </div>
      )}
    </div>
  );
}
