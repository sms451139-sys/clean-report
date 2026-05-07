import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { authService, RegisterPayload } from '../../services/auth.service'
import { useAuthStore } from '../../store/authStore'

interface RegisterFormData extends RegisterPayload {
  passwordConfirm: string
}

export const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const password = watch('password')

  const onSubmit = async (data: any) => {
    setLoading(true)
    setError(null)

    try {
      const { passwordConfirm, ...payload } = data
      const response = await authService.register(payload)
      setAuth(response.user!, response.accessToken)
      navigate('/properties')
    } catch (err: any) {
      setError(err.response?.data?.error || '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg font-medium flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">👤 お名前</label>
        <input
          type="text"
          {...register('name', { required: 'お名前は必須です' })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          placeholder="山田太郎"
        />
        {errors.name && <p className="text-red-600 text-sm mt-2 font-medium">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">📧 メールアドレス</label>
        <input
          type="email"
          {...register('email', { required: 'メールアドレスは必須です' })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          placeholder="user@example.com"
        />
        {errors.email && <p className="text-red-600 text-sm mt-2 font-medium">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">🔐 パスワード</label>
        <input
          type="password"
          {...register('password', {
            required: 'パスワードは必須です',
            minLength: { value: 8, message: '8文字以上で設定してください' }
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-600 text-sm mt-2 font-medium">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">🔐 パスワード（確認）</label>
        <input
          type="password"
          {...register('passwordConfirm', {
            required: 'パスワード確認は必須です',
            validate: (value) => value === password || 'パスワードが一致しません'
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          placeholder="••••••••"
        />
        {errors.passwordConfirm && <p className="text-red-600 text-sm mt-2 font-medium">{errors.passwordConfirm.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
      >
        {loading ? '登録中...' : '✓ 新規登録'}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-600">または</span>
        </div>
      </div>

      <p className="text-center text-gray-600">
        アカウントをお持ちの場合は{' '}
        <a href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
          ログイン
        </a>
      </p>
    </form>
  )
}
