import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StudySession {
  id: string;
  date: string; // ISO yyyy-mm-dd
  startedAt: number; // epoch ms
  durationMin: number;
  subject: string; // paper name
  chapter: string; // chapter name (or "Free Study")
  completed: boolean;
}

export type ChapterStatus = "not-started" | "in-progress" | "completed";

interface ChapterProgress {
  status: ChapterStatus;
  notes: string;
  updatedAt: number;
}

interface StudyState {
  sessions: StudySession[];
  chapterProgress: Record<string, ChapterProgress>;
  goals: {
    dailyMinutes: number;
    weeklyMinutes: number;
  };
  // Actions
  addSession: (s: Omit<StudySession, "id">) => void;
  removeSession: (id: string) => void;
  setChapterStatus: (chapterId: string, status: ChapterStatus) => void;
  setChapterNotes: (chapterId: string, notes: string) => void;
  setDailyGoal: (minutes: number) => void;
  setWeeklyGoal: (minutes: number) => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      sessions: [],
      chapterProgress: {},
      goals: { dailyMinutes: 180, weeklyMinutes: 1080 },

      addSession: (s) =>
        set((state) => ({
          sessions: [
            ...state.sessions,
            { ...s, id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
          ],
        })),

      removeSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),

      setChapterStatus: (chapterId, status) =>
        set((state) => ({
          chapterProgress: {
            ...state.chapterProgress,
            [chapterId]: {
              status,
              notes: state.chapterProgress[chapterId]?.notes ?? "",
              updatedAt: Date.now(),
            },
          },
        })),

      setChapterNotes: (chapterId, notes) =>
        set((state) => ({
          chapterProgress: {
            ...state.chapterProgress,
            [chapterId]: {
              status: state.chapterProgress[chapterId]?.status ?? "not-started",
              notes,
              updatedAt: Date.now(),
            },
          },
        })),

      setDailyGoal: (minutes) =>
        set((state) => ({ goals: { ...state.goals, dailyMinutes: minutes } })),

      setWeeklyGoal: (minutes) =>
        set((state) => ({ goals: { ...state.goals, weeklyMinutes: minutes } })),
    }),
    {
      name: "ca-study-store-v1",
    }
  )
);
