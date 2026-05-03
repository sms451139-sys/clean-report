import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { useAuthStore } from './store/authStore'

// Placeholder components for now
const PropertiesPage = () => <div className="p-8"><h1>物件管理（Coming Soon）</h1></div>
const ReportPage = () => <div className="p-8"><h1>報告作成（Coming Soon）</h1></div>
const HistoryPage = () => <div className="p-8"><h1>報告履歴（Coming Soon）</h1></div>

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/properties"
          element={
            <PrivateRoute>
              <PropertiesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/report"
          element={
            <PrivateRoute>
              <ReportPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <HistoryPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/properties" />} />
      </Routes>
    </Router>
  )
}

export default App
