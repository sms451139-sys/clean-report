import React from 'react'
import { RegisterForm } from '../components/Forms/RegisterForm'

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}
