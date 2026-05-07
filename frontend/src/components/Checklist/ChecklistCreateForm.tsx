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
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">✓</span> チェックリストテンプレート作成
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-medium">
          ⚠️ {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          テンプレート名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('title', { required: 'テンプレート名は必須です' })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          placeholder="標準清掃チェックリスト"
        />
        {errors.title && <p className="text-red-600 text-sm mt-2 font-medium">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">説明</label>
        <textarea
          {...register('description')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          placeholder="このテンプレートの説明"
          rows={2}
        />
      </div>

      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 cursor-pointer transition-colors">
        <input
          type="checkbox"
          {...register('isDefault')}
          className="h-5 w-5 text-indigo-600 rounded accent-indigo-600"
        />
        <span className="ml-3 text-sm font-medium text-gray-700">⭐ デフォルトテンプレートとして使用</span>
      </label>

      <div className="border-t-2 border-cyan-200 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>✓</span> チェック項目
          </h3>
          <button
            type="button"
            onClick={() => append({ title: '', description: '' })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            + 項目追加
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-800 font-bold text-lg ml-auto"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    項目名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`items.${index}.title`, { required: '項目名は必須です' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="ベッドメイキング"
                  />
                  {errors.items?.[index]?.title && (
                    <p className="text-red-600 text-sm mt-2 font-medium">
                      {errors.items[index]?.title?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    詳細説明
                  </label>
                  <textarea
                    {...register(`items.${index}.description`)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="この項目についての詳細"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
      >
        {loading ? '作成中...' : '✓ チェックリストを作成'}
      </button>
    </form>
  )
}
