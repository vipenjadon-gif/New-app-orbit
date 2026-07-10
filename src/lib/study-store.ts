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

export interface CustomChapter {
  id: string;
  name: string;
  topics: string[];
}

export interface CustomPaper {
  id: string;
  name: string;
  chapters: CustomChapter[];
}

interface StudyState {
  sessions: StudySession[];
  chapterProgress: Record<string, ChapterProgress>;
  customPapers: CustomPaper[];
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
  addCustomPaper: (name: string) => void;
  removeCustomPaper: (paperId: string) => void;
  addCustomChapter: (paperId: string, name: string) => void;
  removeCustomChapter: (paperId: string, chapterId: string) => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      sessions: [],
      chapterProgress: {},
      customPapers: [],
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

      addCustomPaper: (name) =>
        set((state) => ({
          customPapers: [
            ...state.customPapers,
            {
              id: `cp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name,
              chapters: [],
            },
          ],
        })),

      removeCustomPaper: (paperId) =>
        set((state) => ({
          customPapers: state.customPapers.filter((p) => p.id !== paperId),
        })),

      addCustomChapter: (paperId, name) =>
        set((state) => ({
          customPapers: state.customPapers.map((p) =>
            p.id === paperId
              ? {
                  ...p,
                  chapters: [
                    ...p.chapters,
                    {
                      id: `cc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                      name,
                      topics: [],
                    },
                  ],
                }
              : p
          ),
        })),

      removeCustomChapter: (paperId, chapterId) =>
        set((state) => ({
          customPapers: state.customPapers.map((p) =>
            p.id === paperId
              ? { ...p, chapters: p.chapters.filter((c) => c.id !== chapterId) }
              : p
          ),
        })),
    }),
    {
      name: "ca-study-store-v1",
    }
  )
);
