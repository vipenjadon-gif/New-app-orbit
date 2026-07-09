"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { BottomNav, View } from "@/components/bottom-nav";
import { ParticlesBackground } from "@/components/particles-background";
import { Dashboard } from "@/components/views/dashboard";
import { BubbleTimer } from "@/components/views/bubble-timer";
import { SyllabusManager } from "@/components/views/syllabus-manager";
import { CalendarView } from "@/components/views/calendar-view";
import { GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

function App() {
  const [view, setView] = useState<View>("dashboard");

  return (
    <main className="min-h-screen flex flex-col relative">
      {/* Ambient floating particles background */}
      <ParticlesBackground />

      {/* Top bar */}
      <header className="sticky top-0 z-30 px-4 sm:px-6 py-3 backdrop-blur-xl bg-background/40 border-b border-foreground/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
              className="w-9 h-9 rounded-2xl gradient-accent glow-soft flex items-center justify-center"
            >
              <GraduationCap size={18} className="text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="font-bold text-base leading-tight tracking-tight">
                CA Tracker
              </h1>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Focus · Track · Conquer
              </p>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <ThemeSwitcher />
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 px-4 sm:px-6 py-5 pb-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {view === "dashboard" && <Dashboard onNavigate={(v) => setView(v as View)} />}
              {view === "timer" && <BubbleTimer />}
              {view === "syllabus" && <SyllabusManager />}
              {view === "calendar" && <CalendarView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav active={view} onChange={setView} />
    </main>
  );
}
