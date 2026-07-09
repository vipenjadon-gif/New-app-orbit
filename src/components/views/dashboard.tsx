"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useStudyStore } from "@/lib/study-store";
import { SYLLABUS, countTotalChapters, countTotalTopics } from "@/lib/ca-syllabus";
import {
  todayISO,
  toISODate,
  startOfWeek,
  addDays,
  formatMinutes,
  fromISODate,
  diffDays,
} from "@/lib/time";
import {
  Flame,
  Clock,
  CheckCircle2,
  Target,
  TrendingUp,
  Calendar as CalendarIcon,
  BookMarked,
  Sparkles,
  RefreshCw,
  Settings2,
  ArrowRight,
  CircleDot,
  AlertCircle,
} from "lucide-react";
import { GoalsEditor } from "@/components/goals-editor";

export function Dashboard({ onNavigate }: { onNavigate: (v: string) => void }) {
  const sessions = useStudyStore((s) => s.sessions);
  const chapterProgress = useStudyStore((s) => s.chapterProgress);
  const goals = useStudyStore((s) => s.goals);

  const today = todayISO();
  // Create a stable "now" reference so React Compiler can preserve memoization.
  const [now] = useState(() => new Date());

  // Today's stats
  const todaySessions = sessions.filter((s) => s.date === today);
  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.durationMin, 0);

  // This week's stats
  const weekStart = startOfWeek(now);
  const weekStartISO = toISODate(weekStart);
  const weekEndISO = toISODate(addDays(weekStart, 6));
  const weekSessions = useMemo(
    () => sessions.filter((s) => s.date >= weekStartISO && s.date <= weekEndISO),
    [sessions, weekStartISO, weekEndISO]
  );
  const weekMinutes = weekSessions.reduce((sum, s) => sum + s.durationMin, 0);

  // Streak calculation: consecutive days (including today or yesterday) with sessions
  const streak = useMemo(() => {
    if (sessions.length === 0) return 0;
    const datesWithStudy = new Set(sessions.map((s) => s.date));
    let count = 0;
    let cursor = new Date(now);
    // if no session today, start from yesterday
    if (!datesWithStudy.has(toISODate(cursor))) {
      cursor = addDays(cursor, -1);
    }
    while (datesWithStudy.has(toISODate(cursor))) {
      count += 1;
      cursor = addDays(cursor, -1);
    }
    return count;
  }, [sessions, now]);

  // Syllabus completion
  const totalChapters = countTotalChapters();
  const completedChapters = Object.values(chapterProgress).filter(
    (c) => c.status === "completed"
  ).length;
  const syllabusPct = Math.round((completedChapters / totalChapters) * 100);

  // Last 7 days for mini chart
  const last7 = useMemo(() => {
    const arr: { date: Date; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(now, -i);
      const iso = toISODate(d);
      const minutes = sessions
        .filter((s) => s.date === iso)
        .reduce((sum, s) => sum + s.durationMin, 0);
      arr.push({ date: d, minutes });
    }
    return arr;
  }, [sessions, now]);

  const maxMin = Math.max(60, ...last7.map((d) => d.minutes));

  // Top subjects this week
  const subjectStats = useMemo(() => {
    const map: Record<string, number> = {};
    weekSessions.forEach((s) => {
      map[s.subject] = (map[s.subject] || 0) + s.durationMin;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [weekSessions]);

  // Revision suggestions: chapters marked completed more than 7 days ago,
  // or chapters "in-progress" not touched in 3+ days. Suggest top 4.
  const revisionSuggestions = useMemo(() => {
    const out: {
      chapterId: string;
      chapterName: string;
      paperCode: string;
      paperName: string;
      reason: string;
      daysAgo: number;
      urgency: "high" | "medium" | "low";
    }[] = [];
    const todayDate = fromISODate(today);
    for (const level of SYLLABUS) {
      for (const paper of level.papers) {
        for (const chapter of paper.chapters) {
          const prog = chapterProgress[chapter.id];
          if (!prog) continue;
          const days = prog.updatedAt ? diffDays(new Date(prog.updatedAt), todayDate) : 999;
          if (prog.status === "completed" && days >= 7) {
            out.push({
              chapterId: chapter.id,
              chapterName: chapter.name,
              paperCode: paper.code,
              paperName: paper.name,
              reason: days >= 21 ? "Long-term revision due" : "Weekly revision due",
              daysAgo: days,
              urgency: days >= 21 ? "high" : days >= 14 ? "medium" : "low",
            });
          } else if (prog.status === "in-progress" && days >= 3) {
            out.push({
              chapterId: chapter.id,
              chapterName: chapter.name,
              paperCode: paper.code,
              paperName: paper.name,
              reason: "Resume incomplete chapter",
              daysAgo: days,
              urgency: "high",
            });
          }
        }
      }
    }
    return out.sort((a, b) => b.daysAgo - a.daysAgo).slice(0, 4);
  }, [chapterProgress, today]);

  const [showGoals, setShowGoals] = useState(false);

  return (
    <div className="space-y-5">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full gradient-accent opacity-20 blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              {now.toLocaleDateString("en-IN", { weekday: "long" })} ·{" "}
              {now.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
              Hello, future <span className="gradient-accent-text">CA</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              {todayMinutes > 0
                ? `You've studied ${formatMinutes(todayMinutes)} today — keep the momentum going.`
                : "Ready to start a focused session today?"}
            </p>
          </div>
          <button
            onClick={() => setShowGoals(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass glass-hover text-xs"
            aria-label="Edit study goals"
          >
            <Settings2 size={12} />
            Goals
          </button>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={<Flame size={18} />}
          label="Streak"
          value={`${streak} day${streak !== 1 ? "s" : ""}`}
          tint="glow-soft"
          delay={0.05}
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Today"
          value={formatMinutes(todayMinutes)}
          sub={`Goal: ${formatMinutes(goals.dailyMinutes)}`}
          progress={Math.min(1, todayMinutes / goals.dailyMinutes)}
          delay={0.1}
        />
        <StatCard
          icon={<CalendarIcon size={18} />}
          label="This Week"
          value={formatMinutes(weekMinutes)}
          sub={`Goal: ${formatMinutes(goals.weeklyMinutes)}`}
          progress={Math.min(1, weekMinutes / goals.weeklyMinutes)}
          delay={0.15}
        />
        <StatCard
          icon={<BookMarked size={18} />}
          label="Syllabus"
          value={`${syllabusPct}%`}
          sub={`${completedChapters}/${totalChapters} chapters`}
          progress={syllabusPct / 100}
          delay={0.2}
        />
      </div>

      {/* Weekly chart + Today overview */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Weekly chart - takes 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="glass-card rounded-3xl p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-base flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Last 7 Days
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Total {formatMinutes(last7.reduce((s, d) => s + d.minutes, 0))} this week
              </p>
            </div>
            <button
              onClick={() => onNavigate("calendar")}
              className="text-xs px-3 py-1.5 rounded-full glass glass-hover text-foreground/80"
            >
              View Calendar →
            </button>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {last7.map((d, i) => {
              const heightPct = (d.minutes / maxMin) * 100;
              const isToday = toISODate(d.date) === today;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="flex-1 w-full flex items-end justify-center relative">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(heightPct, 4)}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.05, ease: "easeOut" }}
                      className={`w-full max-w-[34px] rounded-full ${
                        isToday
                          ? "gradient-accent glow-soft"
                          : "bg-foreground/15 group-hover:bg-foreground/25"
                      }`}
                      style={{ minHeight: 8 }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-center pt-1 font-medium">
                        {d.minutes > 0 ? `${d.minutes}m` : ""}
                      </div>
                    </motion.div>
                  </div>
                  <span className={`text-[10px] ${isToday ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                    {d.date.toLocaleDateString("en-IN", { weekday: "short" }).charAt(0)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Today's sessions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-3xl p-6"
        >
          <h3 className="font-semibold text-base mb-1 flex items-center gap-2">
            <Target size={16} className="text-primary" />
            Today
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {todaySessions.length} session{todaySessions.length !== 1 ? "s" : ""}
          </p>

          {todaySessions.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto rounded-full glass flex items-center justify-center mb-3">
                <Clock size={20} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                No sessions yet today
              </p>
              <button
                onClick={() => onNavigate("timer")}
                className="text-xs px-4 py-2 rounded-full gradient-accent text-white font-medium glow-soft hover:scale-105 transition-transform"
              >
                Start Focus Session
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar pr-1">
              {todaySessions
                .slice()
                .reverse()
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-2.5 rounded-2xl glass glass-hover"
                  >
                    <div className="w-8 h-8 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{s.subject}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {s.chapter}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      {formatMinutes(s.durationMin)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Subject distribution + quick syllabus */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="glass-card rounded-3xl p-6"
        >
          <h3 className="font-semibold text-base mb-1">Top Subjects This Week</h3>
          <p className="text-xs text-muted-foreground mb-4">Time per subject</p>
          {subjectStats.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Study this week to see breakdown
            </p>
          ) : (
            <div className="space-y-3">
              {subjectStats.map(([subject, minutes], idx) => {
                const pct = (minutes / subjectStats[0][1]) * 100;
                return (
                  <div key={subject}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">{subject}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatMinutes(minutes)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: 0.4 + idx * 0.08, ease: "easeOut" }}
                        className="h-full rounded-full gradient-accent"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base">Syllabus Levels</h3>
              <p className="text-xs text-muted-foreground">
                {countTotalTopics()} topics · {totalChapters} chapters
              </p>
            </div>
            <button
              onClick={() => onNavigate("syllabus")}
              className="text-xs px-3 py-1.5 rounded-full glass glass-hover"
            >
              Manage →
            </button>
          </div>
          <div className="space-y-3">
            {SYLLABUS.map((level) => {
              const levelChapters = level.papers.flatMap((p) => p.chapters);
              const completed = levelChapters.filter(
                (c) => chapterProgress[c.id]?.status === "completed"
              ).length;
              const pct = Math.round((completed / levelChapters.length) * 100);
              return (
                <div key={level.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{level.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {level.papers.length} papers
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-primary">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
                      className="h-full rounded-full gradient-accent"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Revision Planner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="glass-card rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-base flex items-center gap-2">
              <RefreshCw size={16} className="text-primary" />
              Revision Planner
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Smart suggestions based on your activity
            </p>
          </div>
          <button
            onClick={() => onNavigate("syllabus")}
            className="text-xs px-3 py-1.5 rounded-full glass glass-hover"
          >
            All chapters →
          </button>
        </div>

        {revisionSuggestions.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto rounded-full glass flex items-center justify-center mb-3">
              <CheckCircle2 size={20} className="text-emerald-400" />
            </div>
            <p className="text-sm font-medium mb-0.5">All caught up!</p>
            <p className="text-xs text-muted-foreground">
              Mark chapters as completed in the Syllabus tab to get revision reminders.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {revisionSuggestions.map((r, idx) => {
              const urgencyColor =
                r.urgency === "high"
                  ? "text-rose-400 bg-rose-400/10"
                  : r.urgency === "medium"
                  ? "text-amber-400 bg-amber-400/10"
                  : "text-primary bg-primary/10";
              return (
                <motion.button
                  key={r.chapterId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.06 }}
                  onClick={() => onNavigate("syllabus")}
                  className="w-full p-3 rounded-2xl glass glass-hover flex items-center gap-3 text-left group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${urgencyColor}`}>
                    {r.urgency === "high" ? (
                      <AlertCircle size={15} />
                    ) : (
                      <CircleDot size={15} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {r.paperCode}
                      </span>
                      <span className="text-[10px] text-muted-foreground">·</span>
                      <span className="text-[10px] text-muted-foreground">
                        {r.daysAgo}d ago
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate">{r.chapterName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {r.reason} · {r.paperName}
                    </p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                  />
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Goals editor modal */}
      {showGoals && <GoalsEditor onClose={() => setShowGoals(false)} />}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  progress,
  tint,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  progress?: number;
  tint?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card rounded-3xl p-4 sm:p-5 glass-hover ${tint ?? ""}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-xl gradient-accent flex items-center justify-center text-white">
          {icon}
        </div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      {progress !== undefined && (
        <div className="mt-2.5 h-1.5 rounded-full bg-foreground/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress * 100, 100)}%` }}
            transition={{ duration: 0.7, delay: delay + 0.2, ease: "easeOut" }}
            className="h-full rounded-full gradient-accent"
          />
        </div>
      )}
    </motion.div>
  );
}
