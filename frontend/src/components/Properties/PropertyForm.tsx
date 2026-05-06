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
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold mb-6">新規物件</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">物件名 *</label>
        <input
          type="text"
          {...register('propertyName', { required: '物件名は必須です' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="東京都渋谷区のマンション"
        />
        {errors.propertyName && <p className="text-red-500 text-sm mt-1">{errors.propertyName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">物件コード</label>
        <input
          type="text"
          {...register('propertyCode')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="PROP-001"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">住所</label>
        <input
          type="text"
          {...register('address')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="東京都渋谷区道玄坂"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">緯度</label>
          <input
            type="number"
            {...register('latitude', { valueAsNumber: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="35.6595"
            step="0.0001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">経度</label>
          <input
            type="number"
            {...register('longitude', { valueAsNumber: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="139.7004"
            step="0.0001"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {loading ? '作成中...' : '物件を作成'}
      </button>
    </form>
  )
}
