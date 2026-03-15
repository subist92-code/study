import { create } from 'zustand'
import type { SajuResult, MbtiType } from '@/types'

interface DiagnosisStore {
  saju: SajuResult | null
  mbti: MbtiType | null
  setSaju: (saju: SajuResult) => void
  setMbti: (mbti: MbtiType) => void
  reset: () => void
}

export const useDiagnosisStore = create<DiagnosisStore>((set) => ({
  saju: null,
  mbti: null,
  setSaju: (saju) => set({ saju }),
  setMbti: (mbti) => set({ mbti }),
  reset: () => set({ saju: null, mbti: null }),
}))
