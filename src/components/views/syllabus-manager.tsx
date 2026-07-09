"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudyStore } from "@/lib/study-store";
import type { ChapterStatus } from "@/lib/study-store";
import { SYLLABUS } from "@/lib/ca-syllabus";
import type { SyllabusLevel } from "@/lib/ca-syllabus";
import { Icon } from "@/components/icon";
import {
  ChevronRight,
  CheckCircle2,
  Circle,
  CircleDot,
  BookOpen,
  X,
  StickyNote,
} from "lucide-react";

const STATUS_META: Record<ChapterStatus, { label: string; icon: any; color: string }> = {
  "not-started": { label: "Not Started", icon: Circle, color: "text-muted-foreground" },
  "in-progress": { label: "In Progress", icon: CircleDot, color: "text-primary" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-emerald-400" },
};

export function SyllabusManager() {
  const [activeLevel, setActiveLevel] = useState(SYLLABUS[0].id);
  const [expandedPapers, setExpandedPapers] = useState<Set<string>>(new Set([SYLLABUS[0].papers[0].id]));
  const [noteChapterId, setNoteChapterId] = useState<string | null>(null);

  const chapterProgress = useStudyStore((s) => s.chapterProgress);
  const setChapterStatus = useStudyStore((s) => s.setChapterStatus);
  const setChapterNotes = useStudyStore((s) => s.setChapterNotes);

  const level: SyllabusLevel = SYLLABUS.find((l) => l.id === activeLevel)!;

  const togglePaper = (paperId: string) => {
    setExpandedPapers((prev) => {
      const next = new Set(prev);
      if (next.has(paperId)) next.delete(paperId);
      else next.add(paperId);
      return next;
    });
  };

  const cycleStatus = (chapterId: string, current: ChapterStatus) => {
    const order: ChapterStatus[] = ["not-started", "in-progress", "completed"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    setChapterStatus(chapterId, next);
  };

  // Overall completion per level
  const levelStats = useMemo(() => {
    return SYLLABUS.map((lvl) => {
      const chapters = lvl.papers.flatMap((p) => p.chapters);
      const completed = chapters.filter((c) => chapterProgress[c.id]?.status === "completed").length;
      const inProgress = chapters.filter((c) => chapterProgress[c.id]?.status === "in-progress").length;
      return {
        level: lvl,
        total: chapters.length,
        completed,
        inProgress,
        pct: Math.round((completed / chapters.length) * 100),
      };
    });
  }, [chapterProgress]);

  const currentLevelStat = levelStats.find((s) => s.level.id === activeLevel)!;

  return (
    <div className="space-y-5">
      {/* Overall summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full gradient-accent opacity-15 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Full CA Syllabus
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
              Complete <span className="gradient-accent-text">Roadmap</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {SYLLABUS.length} levels · {SYLLABUS.reduce((s, l) => s + l.papers.length, 0)} papers ·{" "}
              {SYLLABUS.reduce((s, l) => s + l.papers.flatMap((p) => p.chapters).length, 0)} chapters
            </p>
          </div>
          <div className="flex items-center gap-4">
            {levelStats.map((s) => (
              <div key={s.level.id} className="text-center">
                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <defs>
                      <linearGradient id={`g-syllabus-${s.level.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent-1)" />
                        <stop offset="100%" stopColor="var(--accent-2)" />
                      </linearGradient>
                    </defs>
                    <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke={`url(#g-syllabus-${s.level.id})`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 22}
                      strokeDashoffset={2 * Math.PI * 22 * (1 - s.pct / 100)}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                    {s.pct}%
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{s.level.name}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Level tabs */}
      <div className="flex flex-wrap gap-2">
        {SYLLABUS.map((lvl) => {
          const stat = levelStats.find((s) => s.level.id === lvl.id)!;
          const active = lvl.id === activeLevel;
          return (
            <button
              key={lvl.id}
              onClick={() => setActiveLevel(lvl.id)}
              className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 ${
                active ? "gradient-accent text-white glow-soft" : "glass glass-hover"
              }`}
            >
              <span>{lvl.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-foreground/10"}`}>
                {stat.completed}/{stat.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Level header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{level.name} Level</h2>
          <p className="text-xs text-muted-foreground">{level.description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold gradient-accent-text">{currentLevelStat.pct}%</p>
          <p className="text-[10px] text-muted-foreground">
            {currentLevelStat.completed} done · {currentLevelStat.inProgress} active
          </p>
        </div>
      </div>

      {/* Papers list */}
      <div className="space-y-3">
        {level.papers.map((paper, idx) => {
          const expanded = expandedPapers.has(paper.id);
          const paperChapters = paper.chapters;
          const completed = paperChapters.filter(
            (c) => chapterProgress[c.id]?.status === "completed"
          ).length;
          const pct = Math.round((completed / paperChapters.length) * 100);
          return (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="glass-card rounded-3xl overflow-hidden"
            >
              <button
                onClick={() => togglePaper(paper.id)}
                className="w-full p-4 sm:p-5 flex items-center gap-4 hover:bg-foreground/5 transition-colors text-left"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${paper.color}, ${paper.color}cc)` }}
                >
                  <Icon name={paper.icon} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {paper.code}
                    </span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground">{paper.marks} marks</span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base truncate">{paper.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden flex-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full gradient-accent"
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {completed}/{paperChapters.length}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className={`text-muted-foreground transition-transform flex-shrink-0 ${
                    expanded ? "rotate-90" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-2">
                      {paperChapters.map((chapter) => {
                        const status: ChapterStatus =
                          chapterProgress[chapter.id]?.status ?? "not-started";
                        const meta = STATUS_META[status];
                        const StatusIcon = meta.icon;
                        const notes = chapterProgress[chapter.id]?.notes ?? "";
                        return (
                          <div
                            key={chapter.id}
                            className="p-3 rounded-2xl glass glass-hover"
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => cycleStatus(chapter.id, status)}
                                className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform"
                                aria-label={`Cycle status: ${meta.label}`}
                              >
                                <StatusIcon size={18} className={meta.color} />
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-sm font-medium">{chapter.name}</h4>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={() => setNoteChapterId(chapter.id)}
                                      className="w-7 h-7 rounded-lg hover:bg-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground"
                                      aria-label="Add notes"
                                    >
                                      <StickyNote size={13} />
                                    </button>
                                    <span className={`text-[10px] ${meta.color}`}>
                                      {meta.label}
                                    </span>
                                  </div>
                                </div>
                                {chapter.topics.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {chapter.topics.map((t) => (
                                      <span
                                        key={t}
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {notes && (
                                  <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">
                                    “{notes}”
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Notes modal */}
      <AnimatePresence>
        {noteChapterId && (
          <NotesModal
            chapterId={noteChapterId}
            initialNote={chapterProgress[noteChapterId]?.notes ?? ""}
            onClose={() => setNoteChapterId(null)}
            onSave={(text) => {
              setChapterNotes(noteChapterId, text);
              setNoteChapterId(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="glass rounded-2xl p-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tap status icon to cycle:</p>
        {Object.entries(STATUS_META).map(([key, meta]) => {
          const Icon = meta.icon;
          return (
            <div key={key} className="flex items-center gap-1.5">
              <Icon size={14} className={meta.color} />
              <span className="text-xs">{meta.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotesModal({
  chapterId,
  initialNote,
  onClose,
  onSave,
}: {
  chapterId: string;
  initialNote: string;
  onClose: () => void;
  onSave: (text: string) => void;
}) {
  const [text, setText] = useState(initialNote);

  // Find chapter name for the title
  let chapterName = "Chapter notes";
  for (const lvl of SYLLABUS) {
    for (const p of lvl.papers) {
      const ch = p.chapters.find((c) => c.id === chapterId);
      if (ch) {
        chapterName = `${p.code} · ${ch.name}`;
        break;
      }
    }
  }

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
        className="glass-card rounded-3xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-accent flex items-center justify-center">
              <BookOpen size={15} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Chapter Notes</h3>
              <p className="text-[10px] text-muted-foreground">{chapterName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-foreground/10 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Key takeaways, doubts, examples to revise later..."
          rows={6}
          className="w-full p-3 rounded-2xl glass bg-transparent text-sm resize-none outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/60"
          autoFocus
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm glass glass-hover"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(text)}
            className="px-5 py-2 rounded-full text-sm gradient-accent text-white glow-soft"
          >
            Save Notes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Suppress unused import warnings
