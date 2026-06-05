"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { useServiceWorker } from "@/hooks/useServiceWorker";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const darkMode = useStore((s) => s.darkMode);
  useServiceWorker();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return <>{children}</>;
}
