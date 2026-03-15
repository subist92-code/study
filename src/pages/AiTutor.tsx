import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Anthropic from '@anthropic-ai/sdk'
import { useUserStore } from '@/store/userStore'
import { getMbtiCategory } from '@/data/mbtiData'
import MunhaeryokReader from '@/components/munhaeryok/MunhaeryokReader'

// ── 사주/MBTI/VAK 프롬프트 규칙 DB ──────────────────────────
const SAJU_RULES: Record<string, { title: string; rule: string }> = {
  비겁: {
    title: '고독한 승부사',
    rule: '타인과 비교하는 표현을 절대 쓰지 마세요. 학생 스스로 자신과의 싸움에서 이길 수 있도록 도전 정신을 자극하고, 혼자 조용히 파고들 수 있는 심화 질문을 마지막에 던지세요.',
  },
  식상: {
    title: '호기심 스토리텔러',
    rule: "답변을 닫힌 결론으로 끝내지 마세요. 학생이 더 넓게 사고를 확장할 수 있도록 '이걸 실생활이나 다른 과목에 적용하면 어떨까?' 같은 꼬리 질문을 던져 호기심을 자극하세요.",
  },
  재성: {
    title: '실용 탐구자',
    rule: '추상적인 이론보다 실질적인 결과와 활용법을 먼저 보여주세요. 이 지식이 실제 시험, 생활, 미래에 어떻게 쓰이는지 구체적인 예시와 함께 설명하세요.',
  },
  관성: {
    title: '체계적 전략가',
    rule: '체계적이고 단계적인 가이드(Step-1, Step-2)를 제공하세요. 전체 구조를 먼저 보여준 후 세부 사항으로 들어가고, 이 개념이 큰 그림에서 어디에 위치하는지 설명하세요.',
  },
  인성: {
    title: '심층 사색가',
    rule: "표면적인 암기법을 제시하지 마세요. '왜 이런 공식/현상이 발생했는지' 그 근본적인 원리와 배경지식을 아주 깊이 있고 차분하게 설명하세요.",
  },
}

const MBTI_RULES: Record<string, { title: string; rule: string }> = {
  SJ: {
    title: '모범생 가디언',
    rule: '매우 체계적이고 단계적인(Step-1, Step-2) 가이드를 제공하세요. 모호한 표현을 피하고, 이 개념이 실제 시험이나 기출문제에 어떻게 적용되는지 실용적으로 설명하세요.',
  },
  SP: {
    title: '자유로운 아티스트',
    rule: '지루하고 긴 이론 설명은 최소화하세요. 마치 게임의 퀘스트를 깨는 것처럼 짧고 도전적인 과제로 나누어 설명하고, 파격적이거나 재미있는 비유를 사용하세요.',
  },
  NT: {
    title: '논리적 전략가',
    rule: '감정적인 위로보다는 논리적이고 객관적인 사실에 입각하여 설명하세요. 전체적인 시스템의 원리를 먼저 설명한 후 세부 사항으로 들어가세요.',
  },
  NF: {
    title: '가치지향 이상주의자',
    rule: "따뜻하고 공감하는 톤으로 답변을 시작하세요. 이 과목이나 지식이 사람들의 삶과 세상에 어떤 긍정적인 영향을 미치는지 '스토리텔링'을 곁들여 설명하세요.",
  },
}

const VAK_RULES: Record<string, { title: string; rule: string }> = {
  V: {
    title: '시각 스캐너형',
    rule: '반드시 마크다운 표, 이모지, 굵은 글씨, 불렛포인트를 적극 활용하여 시각적으로 구조화하세요. 줄글을 길게 쓰지 말고 핵심을 한눈에 스캔할 수 있게 만드세요.',
  },
  A: {
    title: '청각 아나운서형',
    rule: '마치 대화하듯 리듬감 있고 구어체적인 표현을 사용하세요. 학생이 소리 내어 읽기 좋은 문장으로 구성하고, 암기할 내용은 앞 글자를 딴 재미있는 운율이나 약어를 만들어 제안하세요.',
  },
  K: {
    title: '체감각 액션배우형',
    rule: "'직접 손으로 써보자', '일어나서 걸으면서 생각해보자' 같은 행동 유도 지시문을 포함하세요. 물리적으로 직접 만지고 겪을 수 있는 예시를 드세요.",
  },
}

function buildSystemPrompt(
  userName: string,
  sajuGroup: string,
  mbtiCode: string,
  vakType: string,
): string {
  const saju = SAJU_RULES[sajuGroup] ?? SAJU_RULES['식상']
  const mbtiCat = getMbtiCategory(mbtiCode)
  const mbti = MBTI_RULES[mbtiCat] ?? MBTI_RULES['NT']
  const vak = VAK_RULES[vakType] ?? VAK_RULES['V']

  return `[Role Definition]
당신은 학생의 타고난 기질(사주), 심리 상태 및 동기(MBTI), 감각적 인지 방식(VAK)을 완벽하게 파악하고 있는 대한민국 최고의 1:1 맞춤형 AI 과외 선생님입니다.
당신의 목표는 단순한 정답 제공이 아니라, 학생의 고유한 기질에 맞춰 지식을 완벽히 소화하도록 돕는 것입니다.

[Student Profile]
- 이름: ${userName}
- 내면 기질 (사주 십성): ${saju.title}
- 성향 및 동기 (MBTI): ${mbti.title} (${mbtiCode})
- 정보 습득 양식 (VAK): ${vak.title}

[Instruction Guidelines : 절대 준수 규칙]
1. 설명 및 포맷팅 방식 (VAK 규칙): ${vak.rule}
2. 톤앤매너 및 동기부여 (MBTI 규칙): ${mbti.rule}
3. 멘탈 케어 및 몰입 유도 (사주 규칙): ${saju.rule}

[Output Requirement]
위 프로필과 규칙을 완벽하게 반영하여, 학생이 즉시 실천할 수 있고 흥미를 느낄 수 있는 맞춤형 해설과 가이드를 작성하세요.`
}

// ── 타입 ──────────────────────────────────────────────────
type SupportedMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | 'application/pdf'

interface AttachedFile {
  name: string
  mediaType: SupportedMediaType
  data: string       // base64 (no data URL prefix)
  preview?: string   // data URL for image preview
  size: number
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  files?: AttachedFile[]
}

// Anthropic API 전송용 메시지 변환
function toApiMessage(msg: ChatMessage): { role: 'user' | 'assistant'; content: string | Anthropic.ContentBlockParam[] } {
  if (msg.role === 'assistant' || !msg.files?.length) {
    return { role: msg.role, content: msg.content }
  }

  const blocks: Anthropic.ContentBlockParam[] = []

  for (const f of msg.files) {
    if (f.mediaType === 'application/pdf') {
      blocks.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: f.data },
      } as unknown as Anthropic.ContentBlockParam)
    } else {
      blocks.push({
        type: 'image',
        source: { type: 'base64', media_type: f.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp', data: f.data },
      })
    }
  }

  if (msg.content) {
    blocks.push({ type: 'text', text: msg.content })
  }

  return { role: 'user', content: blocks }
}

const IMAGE_MAX_W = 800
const IMAGE_MAX_H = 600

/** 이미지를 800×600 이내로 리사이즈 후 base64 + dataURL 반환 */
function resizeImage(file: File): Promise<{ base64: string; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(IMAGE_MAX_W / img.width, IMAGE_MAX_H / img.height, 1)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        resolve({ base64: dataUrl.split(',')[1], dataUrl })
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

// PDF → base64 변환 (리사이즈 불필요)
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

// ── 마크다운 간단 렌더러 ────────────────────────────────────
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3 class="font-bold text-base mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-bold text-lg mt-4 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-bold text-xl mt-4 mb-2">$1</h1>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>')
}

// ── 허용 파일 타입 ──────────────────────────────────────────
const ACCEPTED_TYPES: Record<string, SupportedMediaType> = {
  'image/jpeg': 'image/jpeg',
  'image/jpg': 'image/jpeg',
  'image/png': 'image/png',
  'image/gif': 'image/gif',
  'image/webp': 'image/webp',
  'application/pdf': 'application/pdf',
}
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function AiTutor() {
  const navigate = useNavigate()
  const { userInfo, saju, mbti, vak } = useUserStore()

  const [apiKey, setApiKey] = useState(() => localStorage.getItem('anthropic-api-key') ?? '')
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [showKeyForm, setShowKeyForm] = useState(!localStorage.getItem('anthropic-api-key'))

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<AttachedFile[]>([])
  const [fileError, setFileError] = useState('')
  const [readingMode, setReadingMode] = useState(false)
  const [readingKey, setReadingKey] = useState(0)

  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // 진단 미완료
  if (!saju || !mbti) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-6xl">🤖</div>
        <h1 className="text-2xl font-bold text-gray-800">진단을 먼저 완료해주세요</h1>
        <p className="text-gray-500 text-center">
          사주·MBTI 진단이 완료되어야<br />AI 맞춤 학습을 사용할 수 있어요.
        </p>
        <button
          onClick={() => navigate('/saju')}
          className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-colors"
        >
          진단 시작하기
        </button>
      </div>
    )
  }

  const userName = userInfo.name || '학생'
  const sajuGroup = saju.sipseongGroup
  const mbtiCode = mbti
  const vakType = vak ?? 'V'

  const sajuInfo = SAJU_RULES[sajuGroup] ?? SAJU_RULES['식상']
  const mbtiCat = getMbtiCategory(mbtiCode)
  const mbtiInfo = MBTI_RULES[mbtiCat] ?? MBTI_RULES['NT']
  const vakInfo = VAK_RULES[vakType] ?? VAK_RULES['V']

  // ── API 키 관리 ────────────────────────────────────────────
  const handleSaveKey = () => {
    if (!apiKeyInput.trim()) return
    localStorage.setItem('anthropic-api-key', apiKeyInput.trim())
    setApiKey(apiKeyInput.trim())
    setShowKeyForm(false)
  }

  const handleRemoveKey = () => {
    localStorage.removeItem('anthropic-api-key')
    setApiKey('')
    setApiKeyInput('')
    setShowKeyForm(true)
  }

  // ── 대화 초기화 ────────────────────────────────────────────
  const clearChat = () => {
    setMessages([])
    setPendingFiles([])
    setInput('')
  }

  // ── 파일 첨부 ──────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    setFileError('')

    for (const file of files) {
      const mediaType = ACCEPTED_TYPES[file.type]
      if (!mediaType) {
        setFileError(`지원하지 않는 파일 형식: ${file.name}`)
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`파일이 너무 큽니다 (최대 10MB): ${file.name}`)
        continue
      }

      let data: string
      let preview: string | undefined
      if (mediaType === 'application/pdf') {
        data = await fileToBase64(file)
      } else {
        const resized = await resizeImage(file)
        data = resized.base64
        preview = resized.dataUrl
      }

      setPendingFiles((prev) => [
        ...prev,
        { name: file.name, mediaType: mediaType === 'application/pdf' ? mediaType : 'image/jpeg', data, preview, size: file.size },
      ])
    }
  }

  const removePendingFile = (idx: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  // ── 메시지 전송 ────────────────────────────────────────────
  const handleSend = async () => {
    const trimmed = input.trim()

    // /clear 명령어
    if (trimmed === '/clear') {
      clearChat()
      return
    }

    if ((!trimmed && pendingFiles.length === 0) || loading || !apiKey) return

    const newMsg: ChatMessage = {
      role: 'user',
      content: trimmed,
      files: pendingFiles.length > 0 ? [...pendingFiles] : undefined,
    }

    const newMessages: ChatMessage[] = [...messages, newMsg]
    setMessages(newMessages)
    setInput('')
    setPendingFiles([])
    setLoading(true)

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
      const systemPrompt = buildSystemPrompt(userName, sajuGroup, mbtiCode, vakType)
      const hasPdf = newMessages.some((m) => m.files?.some((f) => f.mediaType === 'application/pdf'))

      const response = await client.messages.create(
        {
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: systemPrompt,
          messages: newMessages.map(toApiMessage),
          ...(hasPdf ? { betas: ['pdfs-2024-09-25'] } : {}),
        } as Parameters<typeof client.messages.create>[0],
      )

      const answer = (response.content[0] as { type: string; text: string }).text
      setMessages([...newMessages, { role: 'assistant', content: answer }])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setMessages([...newMessages, { role: 'assistant', content: `❌ 오류: ${message}` }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 유사문제 / 확장문제 빠른 전송
  const handleQuickSend = async (promptText: string) => {
    if (loading || !apiKey) return

    const newMsg: ChatMessage = { role: 'user', content: promptText }
    const newMessages: ChatMessage[] = [...messages, newMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
      const systemPrompt = buildSystemPrompt(userName, sajuGroup, mbtiCode, vakType)

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: newMessages.map(toApiMessage),
      })

      const answer = (response.content[0] as { type: string; text: string }).text
      setMessages([...newMessages, { role: 'assistant', content: answer }])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setMessages([...newMessages, { role: 'assistant', content: `❌ 오류: ${message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4 min-h-screen">

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400">사주 × MBTI × VAK 맞춤형</p>
          <h1 className="text-xl font-bold text-gray-900">AI 1:1 학습 선생님</h1>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            title="/clear"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
            대화 초기화
          </button>
        )}
      </div>

      {/* 페르소나 배지 */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700">🔮 {sajuInfo.title}</span>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700">🧠 {mbtiInfo.title} ({mbtiCode})</span>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-100 text-violet-700">👁 {vakInfo.title}</span>
      </div>

      {/* API 키 설정 */}
      {showKeyForm ? (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-sm font-bold text-orange-700 mb-1">🔑 Anthropic API 키 입력</p>
          <p className="text-xs text-gray-500 mb-3">키는 브라우저 localStorage에만 저장됩니다.</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
              placeholder="sk-ant-..."
              className="flex-1 px-3 py-2 text-sm border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            />
            <button
              onClick={handleSaveKey}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-green-50 border border-green-200">
          <span className="text-xs text-green-700 font-semibold">✅ API 키 설정됨</span>
          <button onClick={handleRemoveKey} className="text-xs text-gray-400 hover:text-red-500 transition-colors">변경</button>
        </div>
      )}

      {/* 문해력 훈련 모드 */}
      {readingMode && (
        <div className="bg-gray-50 rounded-2xl p-4 border border-indigo-100">
          <MunhaeryokReader
            key={readingKey}
            apiKey={apiKey}
            systemPrompt={buildSystemPrompt(userName, sajuGroup, mbtiCode, vakType)}
            userName={userName}
            grade={userInfo.grade}
            onClose={() => setReadingMode(false)}
            onRestart={() => setReadingKey((k) => k + 1)}
          />
        </div>
      )}

      {/* 채팅 영역 — translate="no" 로 브라우저 자동번역 차단 */}
      {!readingMode && <div translate="no" className="flex-1 flex flex-col gap-3 min-h-[400px] bg-gray-50 rounded-2xl p-4 border border-gray-100">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center py-10">
            <span className="text-4xl">✏️</span>
            <p className="text-sm font-semibold text-gray-600">{userName}님의 기질에 맞게 설명해드릴게요</p>
            <p className="text-xs text-gray-400">질문하거나 교재/문제 사진을 첨부해보세요</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              <button
                key="munhaeryok"
                onClick={() => setReadingMode(true)}
                className="text-xs px-3 py-1.5 rounded-full bg-indigo-600 border border-indigo-600 text-white hover:bg-indigo-700 transition-colors font-semibold"
              >
                📖 문해력 키워줘
              </button>
              {['이차방정식 풀이법 알려줘', '한국사 3.1 운동 설명해줘'].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-300 mt-2"><code>/clear</code> 를 입력하면 대화가 초기화됩니다</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && <span className="text-lg mr-2 flex-shrink-0 mt-0.5">🤖</span>}
            <div
              className={`max-w-[85%] flex flex-col gap-2 ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* 첨부 파일 표시 */}
              {msg.files && msg.files.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.files.map((f, fi) => (
                    <div key={fi} className="rounded-xl overflow-hidden border border-indigo-200 bg-indigo-50">
                      {f.preview ? (
                        <img src={f.preview} alt={f.name} className="w-32 h-24 object-cover" />
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-2">
                          <span className="text-lg">📄</span>
                          <div>
                            <p className="text-xs font-semibold text-indigo-700 max-w-[120px] truncate">{f.name}</p>
                            <p className="text-xs text-gray-400">{formatBytes(f.size)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 텍스트 버블 */}
              {(msg.content || msg.role === 'assistant') && (
                <div
                  translate="no"
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-500 text-white rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} className="prose-sm" />
                  ) : (
                    msg.content
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <span className="text-lg mr-2 flex-shrink-0">🤖</span>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <span className="inline-flex gap-1">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>}

      {/* 파일 첨부 미리보기 */}
      {pendingFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {pendingFiles.map((f, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden border border-gray-200 bg-white">
              {f.preview ? (
                <img src={f.preview} alt={f.name} className="w-16 h-16 object-cover" />
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-2 w-36">
                  <span className="text-xl">📄</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{f.name}</p>
                    <p className="text-xs text-gray-400">{formatBytes(f.size)}</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => removePendingFile(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-gray-700/70 text-white text-xs flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {fileError && (
        <p className="text-xs text-red-500 px-1">{fileError}</p>
      )}

      {/* 유사문제 / 확장문제 — 대화 시작 후에만 표시 */}
      {messages.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => handleQuickSend('지금 다룬 내용과 유사한 수준의 문제를 새로 만들어줘. 난이도와 유형은 동일하게 유지해줘.')}
            disabled={loading || !apiKey}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>📋</span> 유사문제
          </button>
          <button
            onClick={() => handleQuickSend('지금 다룬 내용과 같은 유형이지만 더 심화된 난이도의 문제를 만들어줘. 개념 응용과 사고력이 필요한 수준으로 만들어줘.')}
            disabled={loading || !apiKey}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 text-sm font-semibold hover:bg-violet-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>🔥</span> 확장문제
          </button>
        </div>
      )}

      {/* 입력창 */}
      <div className="flex items-end gap-2">
        {/* 파일 첨부 버튼 */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!apiKey || loading}
          title="파일 첨부 (이미지·PDF)"
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={apiKey ? '질문 입력 또는 /clear (Enter 전송, Shift+Enter 줄바꿈)' : 'API 키를 먼저 입력해주세요'}
          disabled={!apiKey || loading}
          rows={2}
          className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-50 disabled:text-gray-400"
        />

        <button
          onClick={handleSend}
          disabled={(!input.trim() && pendingFiles.length === 0) || loading || !apiKey}
          className="flex-shrink-0 px-4 h-10 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          전송
        </button>
      </div>
    </div>
  )
}
