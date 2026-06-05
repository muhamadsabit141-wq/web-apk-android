"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ArrowRight, Sparkles, CalendarCheck, FileText } from "lucide-react";

export default function HomePage() {
  const user = useStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/workspace");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#111]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
            HX
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            HabitsXD
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[#0F7DFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b6ad4] transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-600 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            <Sparkles size={14} />
            Your productivity, reimagined
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100 md:text-6xl">
            Write. Plan.
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Build habits.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-md text-lg text-gray-500 dark:text-gray-400">
            A clean, fast, Notion-inspired workspace for notes, tasks, and habit
            tracking. Works on web and Android.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F7DFF] px-6 py-3 text-base font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-[#0b6ad4] hover:shadow-xl hover:shadow-blue-500/30"
            >
              Start free
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {[
            {
              icon: FileText,
              title: "Block editor",
              desc: "Rich text editing with slash commands",
            },
            {
              icon: CalendarCheck,
              title: "Habit tracking",
              desc: "Daily habits with streak counters",
            },
            {
              icon: Sparkles,
              title: "PWA ready",
              desc: "Install as an Android app",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6 text-left dark:border-[#2f2f2f] dark:bg-[#1e1e1e]"
            >
              <f.icon
                size={24}
                className="mb-3 text-[#0F7DFF]"
              />
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {f.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} HabitsXD. Built with Next.js.
      </footer>
    </div>
  );
}
