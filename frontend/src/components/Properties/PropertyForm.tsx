import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { propertyService, CreatePropertyPayload } from '../../services/property.service'

interface PropertyFormProps {
  onSuccess: () => void
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreatePropertyPayload>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: CreatePropertyPayload) => {
    setLoading(true)
    setError(null)

    try {
      await propertyService.createProperty(data)
      reset()
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.error || '物件作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span className="text-2xl">🏢</span> 新規物件
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            物件名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('propertyName', { required: '物件名は必須です' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            placeholder="東京都渋谷区のマンション"
          />
          {errors.propertyName && <p className="text-red-600 text-sm mt-2 font-medium">{errors.propertyName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            物件コード
          </label>
          <input
            type="text"
            {...register('propertyCode')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            placeholder="PROP-001"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            住所
          </label>
          <input
            type="text"
            {...register('address')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            placeholder="東京都渋谷区道玄坂"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              緯度
            </label>
            <input
              type="number"
              {...register('latitude', { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors font-mono"
              placeholder="35.6595"
              step="0.0001"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              経度
            </label>
            <input
              type="number"
              {...register('longitude', { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors font-mono"
              placeholder="139.7004"
              step="0.0001"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
      >
        {loading ? '作成中...' : '✓ 物件を作成'}
      </button>
    </form>
  )
}
