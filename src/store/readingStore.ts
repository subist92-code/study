import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ReadingSession {
  id: string
  date: string          // YYYY-MM-DD
  durationSec: number   // 읽기 시작 ~ 문제 완료까지 초
  category: string      // 과학, 역사, 문학, 시사, 상식
  sentenceCount: number
  correctCount: number
  totalQuestions: number
}

interface ReadingStore {
  sessions: ReadingSession[]
  addSession: (s: Omit<ReadingSession, 'id'>) => void
}

export const useReadingStore = create<ReadingStore>()(
  persist(
    (set) => ({
      sessions: [],
      addSession: (s) =>
        set((state) => ({
          sessions: [...state.sessions, { ...s, id: Date.now().toString() }],
        })),
    }),
    { name: 'gangnamchat-reading' },
  ),
)

// ── 헬퍼 ──────────────────────────────────────────────────
export function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export function getISOWeekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export function fmtSec(sec: number): string {
  if (sec < 60) return `${sec}초`
  return `${Math.floor(sec / 60)}분 ${sec % 60}초`
}
