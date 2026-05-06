import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { checklistService, CreateChecklistPayload } from '../../services/checklist.service'

interface ChecklistCreateFormProps {
  propertyId: string
  onSuccess: () => void
}

interface FormData {
  title: string
  description: string
  isDefault: boolean
  items: Array<{
    title: string
    description: string
  }>
}

export const ChecklistCreateForm: React.FC<ChecklistCreateFormProps> = ({
  propertyId,
  onSuccess,
}) => {
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      isDefault: false,
      items: [{ title: '', description: '' }],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)

    try {
      const payload: CreateChecklistPayload = {
        propertyId,
        title: data.title,
        description: data.description,
        isDefault: data.isDefault,
        items: data.items.map((item, index) => ({
          title: item.title,
          description: item.description,
          order: index,
        })),
      }
      await checklistService.createChecklist(payload)
      reset()
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.error || 'チェックリスト作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold mb-6">チェックリストを作成</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">テンプレート名 *</label>
        <input
          type="text"
          {...register('title', { required: 'テンプレート名は必須です' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="標準清掃チェックリスト"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">説明</label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="このテンプレートの説明"
          rows={2}
        />
      </div>

      <label className="flex items-center">
        <input
          type="checkbox"
          {...register('isDefault')}
          className="h-5 w-5 text-blue-600 rounded"
        />
        <span className="ml-2 text-sm text-gray-600">デフォルトテンプレートとして使用</span>
      </label>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">チェック項目</h3>
          <button
            type="button"
            onClick={() => append({ title: '', description: '' })}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1 px-3 rounded"
          >
            + 項目追加
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      項目名 *
                    </label>
                    <input
                      type="text"
                      {...register(`items.${index}.title`, { required: '項目名は必須です' })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ベッドメイキング"
                    />
                    {errors.items?.[index]?.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.items[index]?.title?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      詳細説明
                    </label>
                    <textarea
                      {...register(`items.${index}.description`)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="この項目についての詳細"
                      rows={2}
                    />
                  </div>
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="ml-4 text-red-500 hover:text-red-700 font-medium text-sm"
                  >
                    削除
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {loading ? '作成中...' : 'チェックリストを作成'}
      </button>
    </form>
  )
}
