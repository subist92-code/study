import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import SajuDiagnosis from '@/pages/SajuDiagnosis'
import MbtiTest from '@/pages/MbtiTest'
import DiagnosisReport from '@/pages/DiagnosisReport'
import StudyMethod from '@/pages/StudyMethod'
import Planner from '@/pages/Planner'
import AiTutor from '@/pages/AiTutor'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saju" element={<SajuDiagnosis />} />
          <Route path="/mbti" element={<MbtiTest />} />
          <Route path="/report" element={<DiagnosisReport />} />
          <Route path="/study" element={<StudyMethod />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/tutor" element={<AiTutor />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
