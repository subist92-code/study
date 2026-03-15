import { createContext, useContext, useState, type ReactNode } from 'react'
import type { DiagnosisState, SajuResult, MbtiType } from '@/types'

interface DiagnosisContextValue {
  diagnosis: DiagnosisState
  setSaju: (saju: SajuResult) => void
  setMbti: (mbti: MbtiType) => void
  resetDiagnosis: () => void
}

const initialState: DiagnosisState = {
  saju: null,
  mbti: null,
}

const DiagnosisContext = createContext<DiagnosisContextValue | null>(null)

export function DiagnosisProvider({ children }: { children: ReactNode }) {
  const [diagnosis, setDiagnosis] = useState<DiagnosisState>(initialState)

  const setSaju = (saju: SajuResult) =>
    setDiagnosis((prev) => ({ ...prev, saju }))

  const setMbti = (mbti: MbtiType) =>
    setDiagnosis((prev) => ({ ...prev, mbti }))

  const resetDiagnosis = () => setDiagnosis(initialState)

  return (
    <DiagnosisContext.Provider value={{ diagnosis, setSaju, setMbti, resetDiagnosis }}>
      {children}
    </DiagnosisContext.Provider>
  )
}

export function useDiagnosis() {
  const ctx = useContext(DiagnosisContext)
  if (!ctx) throw new Error('useDiagnosis must be used within DiagnosisProvider')
  return ctx
}
