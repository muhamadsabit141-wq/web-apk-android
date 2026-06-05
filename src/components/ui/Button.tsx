"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" &&
          "bg-[#0F7DFF] text-white hover:bg-[#0b6ad4]",
        variant === "secondary" &&
          "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#2f2f2f] dark:text-gray-200 dark:hover:bg-[#3a3a3a]",
        variant === "ghost" &&
          "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#2f2f2f]",
        variant === "danger" &&
          "bg-red-500 text-white hover:bg-red-600",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
