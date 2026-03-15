import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: '홈' },
  { path: '/mbti', label: 'MBTI' },
  { path: '/report', label: '리포트' },
  { path: '/study', label: '학습법' },
  { path: '/planner', label: '플래너' },
  { path: '/tutor', label: 'AI 학습' },
]

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-700">강남chat</span>
          <span className="text-xs text-gray-400 font-medium">AI 학습 설계</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === path
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
