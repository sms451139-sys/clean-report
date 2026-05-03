import React from 'react'
import { LoginForm } from '../components/Forms/LoginForm'

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
