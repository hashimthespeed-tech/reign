import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import Leaderboard from './pages/Leaderboard'
import MonthlyReport from './pages/MonthlyReport'
import Learning from './pages/Learning'
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherOnboarding from './pages/TeacherOnboarding'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/teacher" element={<TeacherOnboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/monthly-report" element={<MonthlyReport />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App