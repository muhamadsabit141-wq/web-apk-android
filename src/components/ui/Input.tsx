"use client";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0F7DFF] focus:outline-none focus:ring-2 focus:ring-[#0F7DFF]/20 dark:border-[#3a3a3a] dark:bg-[#252525] dark:text-gray-100 dark:placeholder:text-gray-500",
          className
        )}
        {...props}
      />
    </div>
  );
}
