import React from 'react'
import { LoginForm } from '../components/Forms/LoginForm'

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CleanReport</h1>
          <p className="text-gray-600 text-sm mt-2">清掃レポート管理システム</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
