"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStudyStore } from "@/lib/study-store";
import { Target, X, Clock, Calendar, Zap } from "lucide-react";

const DAILY_OPTIONS = [60, 120, 180, 240, 360, 480];
const WEEKLY_OPTIONS = [360, 720, 1080, 1440, 1800, 2400];

export function GoalsEditor({ onClose }: { onClose: () => void }) {
  const goals = useStudyStore((s) => s.goals);
  const setDailyGoal = useStudyStore((s) => s.setDailyGoal);
  const setWeeklyGoal = useStudyStore((s) => s.setWeeklyGoal);

  const [daily, setDaily] = useState(goals.dailyMinutes);
  const [weekly, setWeekly] = useState(goals.weeklyMinutes);

  const fmt = (m: number) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    if (h === 0) return `${mm}m`;
    if (mm === 0) return `${h}h`;
    return `${h}h ${mm}m`;
  };

  const save = () => {
    setDailyGoal(daily);
    setWeeklyGoal(weekly);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="glass-card rounded-3xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl gradient-accent glow-soft flex items-center justify-center">
              <Target size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Study Goals</h3>
              <p className="text-[11px] text-muted-foreground">
                Set your daily & weekly targets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-foreground/10 flex items-center justify-center"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Daily goal */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-primary" />
            <span className="text-sm font-medium">Daily Goal</span>
            <span className="ml-auto text-lg font-bold gradient-accent-text">
              {fmt(daily)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DAILY_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setDaily(opt)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                  daily === opt
                    ? "gradient-accent text-white glow-soft"
                    : "glass glass-hover"
                }`}
              >
                {fmt(opt)}
              </button>
            ))}
          </div>
        </div>

        {/* Weekly goal */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-primary" />
            <span className="text-sm font-medium">Weekly Goal</span>
            <span className="ml-auto text-lg font-bold gradient-accent-text">
              {fmt(weekly)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {WEEKLY_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setWeekly(opt)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                  weekly === opt
                    ? "gradient-accent text-white glow-soft"
                    : "glass glass-hover"
                }`}
              >
                {fmt(opt)}
              </button>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="glass rounded-2xl p-3 flex items-start gap-2.5 mb-5">
          <Zap size={14} className="text-primary mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">Tip:</span> Start with
            a 3-hour daily goal and scale up. Consistency beats intensity for CA
            prep — a steady 6-day study week at 3h/day lands you at 18 hours,
            enough for one full syllabus pass every quarter.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full text-sm glass glass-hover"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="flex-1 py-2.5 rounded-full text-sm gradient-accent text-white glow-soft font-medium"
          >
            Save Goals
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
