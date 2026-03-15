import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MbtiType, VakType, UserInfo } from '@/types'
import type { SajuCalculationResult } from '@/utils/sajuCalculator'

interface UserStore {
  // 유저 기본 정보
  userInfo: UserInfo | null
  // 진단 결과
  saju: SajuCalculationResult | null
  mbti: MbtiType | null
  vak: VakType | null

  // Actions
  setUserInfo: (info: UserInfo) => void
  setSaju: (result: SajuCalculationResult) => void
  setMbti: (mbti: MbtiType) => void
  setVak: (vak: VakType) => void
  reset: () => void
}

const initialState = {
  userInfo: null,
  saju: null,
  mbti: null,
  vak: null,
}

/**
 * 유저 정보 + 진단 결과를 관리하는 Zustand 스토어.
 * localStorage에 persist해서 브라우저 재시작 후에도 유지됩니다.
 */
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUserInfo: (info) => set({ userInfo: info }),
      setSaju: (result) => set({ saju: result }),
      setMbti: (mbti) => set({ mbti }),
      setVak: (vak) => set({ vak }),
      reset: () => set(initialState),
    }),
    { name: 'gangnamchat-user' },
  ),
)
