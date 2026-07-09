"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Timer, BookMarked, Calendar } from "lucide-react";

export type View = "dashboard" | "timer" | "syllabus" | "calendar";

const NAV_ITEMS: { id: View; label: string; icon: any }[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "timer", label: "Timer", icon: Timer },
  { id: "syllabus", label: "Syllabus", icon: BookMarked },
  { id: "calendar", label: "Calendar", icon: Calendar },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: View;
  onChange: (v: View) => void;
}) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md">
      <div className="glass-strong rounded-full p-1.5 shadow-2xl">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className="relative flex flex-col items-center justify-center px-3 sm:px-5 py-2 rounded-full transition-colors"
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full gradient-accent glow-soft"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-0.5">
                  <Icon
                    size={18}
                    className={isActive ? "text-white" : "text-muted-foreground"}
                  />
                  <span
                    className={`text-[10px] font-medium ${
                      isActive ? "text-white" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
