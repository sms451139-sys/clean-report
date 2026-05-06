import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { PropertiesPage } from './pages/PropertiesPage'
import { ReportPage } from './pages/ReportPage'
import { useAuthStore } from './store/authStore'
import { Header } from './components/Layout/Header'
const HistoryPage = () => (
  <>
    <Header />
    <div className="p-8"><h1>報告履歴（Coming Soon）</h1></div>
  </>
)

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/properties"
          element={
            <PrivateRoute>
              <PropertiesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/report/:propertyId"
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
