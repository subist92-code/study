export const learningMethods = {
  metacognition: {
    name: "메타인지",
    subtitle: "학습의 관제탑",
    emoji: "🧠",
    color: "#6C3483",
    targetOhang: ["목", "화", "토", "금", "수"],
    targetMbti: ["NT", "SJ", "NF", "SP"],
    description: "자신의 학습 과정을 스스로 모니터링하고 조절하는 능력. 성적 상위 1%와 나머지를 가르는 핵심 변수.",
    steps: [
      { step: 1, title: "자기 인식", content: "아는 것 vs 모르는 것 명확히 구분하기. 단원별 자신감 1-5점 체크." },
      { step: 2, title: "전략 선택", content: "취약 부분에 맞는 최적 학습법 결정 (강의/문제풀이/요약 중 선택)." },
      { step: 3, title: "자기 조절", content: "학습 성과 평가 후 다음 전략 수정. 매주 회고 필수." }
    ],
    practicalTip: "매일 공부 후 3분 백지 테스트: 오늘 배운 것을 아무것도 보지 않고 써보기."
  },
  flow: {
    name: "황농문 몰입법",
    subtitle: "뇌의 에너지를 한 곳으로",
    emoji: "🌊",
    color: "#C0392B",
    targetOhang: ["화", "수"],
    targetMbti: ["NT", "SP"],
    description: "뇌가 특정 주제에 완전히 사로잡혀 잡념이 사라지는 최적 경험 상태를 의도적으로 만드는 기술.",
    steps: [
      { step: 1, title: "목표 설정", content: "뇌가 매력을 느끼는 목표 설정. '수학 1등급'보다 '이 문제 반드시 내 힘으로 풀기'." },
      { step: 2, title: "방해 제거", content: "스마트폰 다른 방, SNS 알림 OFF. 불안을 역이용해 집중력으로 전환." },
      { step: 3, title: "완전 몰입", content: "결과보다 과정에 집중. 데드라인 이펙트 활용 (D-2일 느낌으로 공부)." }
    ],
    practicalTip: "포모도로 변형: 25분 완전 몰입 → 5분 스트레칭 → 3회 반복 후 30분 완전 휴식."
  },
  pattern: {
    name: "이윤규 패턴법",
    subtitle: "시험의 논리적 구조 정복",
    emoji: "🎯",
    color: "#C9973A",
    targetOhang: ["금", "토"],
    targetMbti: ["SJ", "NT"],
    description: "지식을 단순 습득하는 것이 아니라 '시험에 나오는 형태'로 구조화하는 기술.",
    steps: [
      { step: 1, title: "패턴 발굴", content: "최근 3년 기출 분석. 같은 유형이 몇 번 나왔는지 빈도 체크." },
      { step: 2, title: "공식화", content: "각 패턴에 맞는 대응 공식 정립. 나만의 '시험 공략집' 제작." },
      { step: 3, title: "뇌 친화적 배치", content: "할 일 단순화: '오늘은 패턴 3번 완전 정복'처럼 구체화." }
    ],
    practicalTip: "오답 노트 업그레이드: 틀린 문제 분류 → 어떤 패턴인지 이름 붙이기 → 같은 패턴 3개 더 찾기."
  },
  activeRecall: {
    name: "능동적 인출 + 간격 반복",
    subtitle: "기억을 영구적으로 저장하는 법",
    emoji: "🔄",
    color: "#1E8449",
    targetOhang: ["토", "수"],
    targetMbti: ["SJ", "NF"],
    description: "정보를 반복해 읽는 것보다 뇌에서 꺼내는 인출 과정이 기억 형성에 훨씬 효과적.",
    steps: [
      { step: 1, title: "인출 연습", content: "백지 복습: 책 덮고 배운 내용 전부 쓰기. 퀴즈 만들어 풀기." },
      { step: 2, title: "간격 설정", content: "복습 타이밍: 학습 후 1일 → 3일 → 7일 → 21일 → 42일." },
      { step: 3, title: "장기 기억화", content: "플래시카드 앱(Anki) 활용 또는 손으로 카드 직접 제작." }
    ],
    practicalTip: "자기 전 10분: 오늘 배운 내용 눈 감고 머릿속으로 재생하기 (수면 중 기억 강화)."
  },
  mindmap: {
    name: "마인드맵 구조화",
    subtitle: "지식을 하나의 지도로",
    emoji: "🗺️",
    color: "#2D7A4F",
    targetOhang: ["목", "화"],
    targetMbti: ["NF", "NT"],
    description: "파편화된 지식을 하나의 유기적인 지도로 만들어 지식의 전이 효과를 높이는 방법.",
    steps: [
      { step: 1, title: "전체 조망", content: "대단원 제목을 중심에 놓고 소단원들을 가지로 연결." },
      { step: 2, title: "연결 탐색", content: "개념들 사이의 인과관계, 포함관계, 대조관계 표시." },
      { step: 3, title: "의미 부여", content: "각 개념에 나만의 키워드, 색깔, 이미지로 표현." }
    ],
    practicalTip: "단원 시작 전 빈 마인드맵 그리기 → 공부 후 채우기 → 차이로 학습 성과 확인."
  }
}

export type MethodKey = keyof typeof learningMethods

// 오행 × MBTI 기질 → 최적 학습법 매칭 엔진
export const matchingMatrix: Record<string, Record<string, MethodKey[]>> = {
  목: { SJ: ["pattern", "activeRecall"], NT: ["mindmap", "flow"], NF: ["mindmap", "activeRecall"], SP: ["mindmap", "metacognition"] },
  화: { SJ: ["pattern", "activeRecall"], NT: ["flow", "metacognition"], NF: ["mindmap", "flow"], SP: ["flow", "metacognition"] },
  토: { SJ: ["pattern", "activeRecall"], NT: ["pattern", "metacognition"], NF: ["activeRecall", "mindmap"], SP: ["activeRecall", "metacognition"] },
  금: { SJ: ["pattern", "metacognition"], NT: ["flow", "pattern"], NF: ["pattern", "mindmap"], SP: ["pattern", "metacognition"] },
  수: { SJ: ["activeRecall", "pattern"], NT: ["metacognition", "flow"], NF: ["activeRecall", "mindmap"], SP: ["metacognition", "activeRecall"] },
}

export type Temperament = 'SJ' | 'NT' | 'NF' | 'SP'

export function getTemperament(mbti: string): Temperament {
  const sn = mbti[1]
  const tf = mbti[2]
  const jp = mbti[3]
  if (sn === 'S' && jp === 'J') return 'SJ'
  if (sn === 'N' && tf === 'T') return 'NT'
  if (sn === 'N' && tf === 'F') return 'NF'
  return 'SP'
}
