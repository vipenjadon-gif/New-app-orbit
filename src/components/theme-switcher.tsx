"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isOrange = theme === "orange";

  return (
    <div className="relative flex items-center gap-1 p-1 rounded-full glass-strong">
      {/* Sliding pill background */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-full gradient-accent glow-soft"
        initial={false}
        animate={{
          left: isOrange ? 4 : "50%",
          right: isOrange ? "50%" : 4,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ width: "calc(50% - 4px)" }}
      />
      <button
        onClick={() => setTheme("orange")}
        className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
        aria-label="Switch to orange theme"
      >
        <Sun size={13} className={isOrange ? "text-white" : "text-muted-foreground"} />
        <span className={isOrange ? "text-white" : "text-muted-foreground"}>Orange</span>
      </button>
      <button
        onClick={() => setTheme("blue")}
        className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
        aria-label="Switch to blue theme"
      >
        <Moon size={13} className={!isOrange ? "text-white" : "text-muted-foreground"} />
        <span className={!isOrange ? "text-white" : "text-muted-foreground"}>Blue</span>
      </button>
    </div>
  );
}
