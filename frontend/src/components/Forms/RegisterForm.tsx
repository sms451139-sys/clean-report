import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { authService, RegisterPayload } from '../../services/auth.service'
import { useAuthStore } from '../../store/authStore'

export const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterPayload>()
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">CleanReport に登録</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">お名前</label>
        <input
          type="text"
          {...register('name', { required: 'お名前は必須です' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="山田太郎"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
        <input
          type="email"
          {...register('email', { required: 'メールアドレスは必須です' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="user@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">パスワード</label>
        <input
          type="password"
          {...register('password', {
            required: 'パスワードは必須です',
            minLength: { value: 8, message: '8文字以上で設定してください' }
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">パスワード（確認）</label>
        <input
          type="password"
          {...register('passwordConfirm', {
            required: 'パスワード確認は必須です',
            validate: (value) => value === password || 'パスワードが一致しません'
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
        {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {loading ? '登録中...' : '登録'}
      </button>

      <p className="text-center text-sm text-gray-600">
        アカウントをお持ちの場合は{' '}
        <a href="/login" className="text-blue-500 hover:underline">
          ログイン
        </a>
      </p>
    </form>
  )
}
