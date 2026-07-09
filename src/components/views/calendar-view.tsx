"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudyStore } from "@/lib/study-store";
import type { StudySession } from "@/lib/study-store";
import { toISODate, fromISODate, formatMinutes, prettyDate, monthLabel } from "@/lib/time";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  BookOpen,
  X,
  CalendarDays,
  Plus,
} from "lucide-react";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function CalendarView() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(toISODate(today));

  const sessions = useStudyStore((s) => s.sessions);
  const removeSession = useStudyStore((s) => s.removeSession);

  // Sessions grouped by date
  const byDate = useMemo(() => {
    const map: Record<string, StudySession[]> = {};
    sessions.forEach((s) => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  }, [sessions]);

  // Build calendar grid
  const days = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const last = new Date(viewYear, viewMonth + 1, 0);
    const startOffset = first.getDay(); // 0=Sun
    const total = last.getDate();
    const cells: { date: Date | null; iso: string | null }[] = [];
    // leading blanks
    for (let i = 0; i < startOffset; i++) cells.push({ date: null, iso: null });
    for (let d = 1; d <= total; d++) {
      const dt = new Date(viewYear, viewMonth, d);
      cells.push({ date: dt, iso: toISODate(dt) });
    }
    // trailing to fill 6 rows (42 cells)
    while (cells.length % 7 !== 0) cells.push({ date: null, iso: null });
    return cells;
  }, [viewYear, viewMonth]);

  const todayISOStr = toISODate(today);
  const selectedSessions = (byDate[selectedDate] ?? []).sort((a, b) => a.startedAt - b.startedAt);
  const selectedMinutes = selectedSessions.reduce((s, x) => s + x.durationMin, 0);

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  // Month total
  const monthTotal = useMemo(() => {
    const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-`;
    return sessions
      .filter((s) => s.date.startsWith(monthPrefix))
      .reduce((sum, s) => sum + s.durationMin, 0);
  }, [sessions, viewYear, viewMonth]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-5 sm:p-6 relative overflow-hidden"
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full gradient-accent opacity-15 blur-3xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">
              Study Calendar
            </p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {monthLabel(viewYear, viewMonth)}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatMinutes(monthTotal)} studied this month
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-xl glass glass-hover flex items-center justify-center"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => {
                setViewYear(today.getFullYear());
                setViewMonth(today.getMonth());
                setSelectedDate(toISODate(today));
              }}
              className="px-3 h-10 rounded-xl glass glass-hover text-xs font-medium"
            >
              Today
            </button>
            <button
              onClick={goNext}
              className="w-10 h-10 rounded-xl glass glass-hover flex items-center justify-center"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Calendar grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card rounded-3xl p-4 sm:p-5 lg:col-span-3"
        >
          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((d, i) => (
              <div
                key={i}
                className="text-center text-[10px] uppercase tracking-wider text-muted-foreground py-1"
              >
                {d}
              </div>
            ))}
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((cell, i) => {
              if (!cell.date || !cell.iso) {
                return <div key={i} className="aspect-square" />;
              }
              const daySessions = byDate[cell.iso] ?? [];
              const minutes = daySessions.reduce((s, x) => s + x.durationMin, 0);
              const isToday = cell.iso === todayISOStr;
              const isSelected = cell.iso === selectedDate;
              // intensity: 0..4 based on minutes
              const intensity =
                minutes === 0 ? 0 : Math.min(4, Math.ceil(minutes / 45));

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(cell.iso!)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all relative group ${
                    isSelected
                      ? "gradient-accent text-white glow-soft"
                      : isToday
                      ? "ring-1 ring-primary/60 bg-primary/5"
                      : "hover:bg-foreground/5"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isSelected
                        ? "text-white"
                        : isToday
                        ? "text-primary"
                        : "text-foreground/80"
                    }`}
                  >
                    {cell.date.getDate()}
                  </span>
                  {/* Heat indicator */}
                  {minutes > 0 && !isSelected && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: intensity }).map((_, idx) => (
                        <span
                          key={idx}
                          className="w-1 h-1 rounded-full bg-primary/70"
                        />
                      ))}
                    </div>
                  )}
                  {isSelected && minutes > 0 && (
                    <span className="text-[9px] text-white/80">{minutes}m</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Heatmap legend */}
          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-foreground/8">
            <span className="text-[10px] text-muted-foreground">Less</span>
            <div className="flex gap-0.5">
              {[0.15, 0.3, 0.5, 0.7, 1].map((op, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-sm bg-primary"
                  style={{ opacity: op }}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">More</span>
          </div>
        </motion.div>

        {/* Selected day details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-card rounded-3xl p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-primary" />
              <h3 className="font-semibold text-sm">
                {prettyDate(selectedDate)}
              </h3>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {selectedSessions.length} session{selectedSessions.length !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-2xl font-bold gradient-accent-text mb-4">
            {formatMinutes(selectedMinutes)}
          </p>

          {selectedSessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto rounded-full glass flex items-center justify-center mb-3">
                <Clock size={18} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No sessions recorded</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Start a focus session in the Timer tab
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar pr-1">
              <AnimatePresence>
                {selectedSessions.map((s) => (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-3 p-3 rounded-2xl glass glass-hover group"
                  >
                    <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                      <BookOpen size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{s.subject}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {s.chapter}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(s.startedAt).toLocaleTimeString("en-IN", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">
                        {formatMinutes(s.durationMin)}
                      </span>
                      <button
                        onClick={() => removeSession(s.id)}
                        className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground/10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                        aria-label="Delete session"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Monthly stats summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card rounded-3xl p-5"
      >
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Plus size={14} className="text-primary" />
          Month at a Glance
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MiniStat label="Total Time" value={formatMinutes(monthTotal)} />
          <MiniStat
            label="Active Days"
            value={Object.keys(byDate).filter((d) =>
              d.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-`)
            ).length.toString()}
          />
          <MiniStat
            label="Sessions"
            value={sessions
              .filter((s) =>
                s.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-`)
              )
              .length.toString()}
          />
          <MiniStat
            label="Avg / Day"
            value={formatMinutes(
              Math.round(
                monthTotal /
                  Math.max(
                    1,
                    Object.keys(byDate).filter((d) =>
                      d.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-`)
                    ).length
                  )
              )
            )}
          />
        </div>
      </motion.div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-2xl glass">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

// Suppress unused import warning
void X;
void fromISODate;
