import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-lg">✓</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">CleanReport</h1>
        </div>
        <div className="flex items-center gap-6">
          {user && <span className="text-indigo-100 text-sm">{user.email}</span>}
          <button
            onClick={handleLogout}
            className="bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors duration-200"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  )
}
