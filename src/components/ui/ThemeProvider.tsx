"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useServiceWorker } from "@/hooks/useServiceWorker";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const darkMode = useStore((s) => s.darkMode);
  const [mounted, setMounted] = useState(false);
  useServiceWorker();

  useEffect(() => {
    setMounted(true);
    // Apply dark mode on mount
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Update dark mode when it changes
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    // Store preference
    localStorage.setItem("theme-preference", darkMode ? "dark" : "light");
  }, [darkMode, mounted]);

  return <>{children}</>;
}
