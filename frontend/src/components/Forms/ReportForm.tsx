import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { reportService } from '../../services/report.service'
import { checklistService, Checklist } from '../../services/checklist.service'

interface ReportFormProps {
  propertyId: string
  onSuccess?: (report: any) => void
  onError?: (error: string) => void
}

interface ReportFormData {
  cleaningDate: string
  checkInTime: string
  checkOutTime: string
  staffName: string
  reportFormat: 'OWNER' | 'MANAGER' | 'BOTH'
  checklistId?: string
  reportText?: string
}

export const ReportForm: React.FC<ReportFormProps> = ({
  propertyId,
  onSuccess,
  onError,
}) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ReportFormData>({
    defaultValues: {
      cleaningDate: new Date().toISOString().split('T')[0],
      reportFormat: 'BOTH',
    },
  })
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [issues, setIssues] = useState<Array<{ issueType: string; description: string; severity: string }>>([])
  const [showIssueForm, setShowIssueForm] = useState(false)
  const [newIssue, setNewIssue] = useState({ issueType: '', description: '', severity: 'LIGHT' })

  useEffect(() => {
    loadChecklists()
  }, [propertyId])

  const loadChecklists = async () => {
    try {
      const data = await checklistService.getChecklistsByProperty(propertyId)
      setChecklists(data)
    } catch (err) {
      console.error('Failed to load checklists:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ReportFormData) => {
    try {
      const cleaningDate = new Date(data.cleaningDate)

      let checkInTime: string | null = null
      let checkOutTime: string | null = null

      if (data.checkInTime) {
        const [hours, minutes] = data.checkInTime.split(':')
        cleaningDate.setHours(parseInt(hours), parseInt(minutes), 0)
        checkInTime = cleaningDate.toISOString()
      }

      if (data.checkOutTime) {
        const dateObj = new Date(data.cleaningDate)
        const [hours, minutes] = data.checkOutTime.split(':')
        dateObj.setHours(parseInt(hours), parseInt(minutes), 0)
        checkOutTime = dateObj.toISOString()
      }

      const reportData = {
        propertyId,
        cleaningDate: new Date(data.cleaningDate).toISOString(),
        checkInTime,
        checkOutTime,
        staffName: data.staffName || null,
        reportFormat: data.reportFormat,
      }

      const report = await reportService.createReport(reportData)

      // Upload photos if selected
      if (selectedPhotos.length > 0) {
        for (const photo of selectedPhotos) {
          try {
            await reportService.uploadPhotoBlob(report.id, photo)
          } catch (err) {
            console.error('Failed to upload photo:', err)
          }
        }
      }

      // Create issues if any
      for (const issue of issues) {
        try {
          await reportService.createIssue(report.id, issue)
        } catch (err) {
          console.error('Failed to create issue:', err)
        }
      }

      reset()
      setSelectedPhotos([])
      setPhotoPreviews([])
      setIssues([])
      onSuccess?.(report)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'レポート作成に失敗しました'
      onError?.(errorMessage)
    }
  }

  const handlePhotoSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedPhotos(files)

    const previewList = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          resolve(event.target?.result as string)
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(previewList).then(setPhotoPreviews)
  }

  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const addIssue = () => {
    if (newIssue.issueType && newIssue.description) {
      setIssues((prev) => [...prev, newIssue])
      setNewIssue({ issueType: '', description: '', severity: 'LIGHT' })
      setShowIssueForm(false)
    }
  }

  const removeIssue = (index: number) => {
    setIssues((prev) => prev.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">📋 新規レポート作成</h2>

      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-xl">📝</span> 基本情報
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cleaning Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                清掃日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('cleaningDate', { required: '清掃日は必須です' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
              {errors.cleaningDate && (
                <p className="text-red-600 text-sm mt-2 font-medium">{errors.cleaningDate.message}</p>
              )}
            </div>

            {/* Staff Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                スタッフ名
              </label>
              <input
                type="text"
                placeholder="例: 佐藤太郎"
                {...register('staffName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Check-in Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                チェックイン時刻
              </label>
              <input
                type="time"
                {...register('checkInTime')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Check-out Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                チェックアウト時刻
              </label>
              <input
                type="time"
                {...register('checkOutTime')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Report Format */}
          <div className="mt-6 border-t border-indigo-200 pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              レポート形式 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                <input
                  type="radio"
                  value="BOTH"
                  {...register('reportFormat', { required: 'レポート形式は必須です' })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">両向け</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                <input
                  type="radio"
                  value="OWNER"
                  {...register('reportFormat', { required: 'レポート形式は必須です' })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">オーナー向け</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                <input
                  type="radio"
                  value="MANAGER"
                  {...register('reportFormat', { required: 'レポート形式は必須です' })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">マネージャー向け</span>
              </label>
            </div>
            {errors.reportFormat && (
              <p className="text-red-600 text-sm mt-2 font-medium">{errors.reportFormat.message}</p>
            )}
          </div>
        </div>

        {/* Checklist Selection */}
        {checklists.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ✓ チェックリスト参照
            </label>
            <select
              {...register('checklistId')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            >
              <option value="">チェックリストを選択...</option>
              {checklists.map((checklist) => (
                <option key={checklist.id} value={checklist.id}>
                  {checklist.title}
                  {checklist.isDefault ? ' (デフォルト)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Photo Upload Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-xl">📸</span> 写真ドキュメント
          </h3>

          <label className="block">
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-100 transition-all">
              <div className="text-3xl mb-3">📷</div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                写真をドラッグ＆ドロップ
              </p>
              <p className="text-xs text-gray-600">または、クリックして選択</p>
              <p className="text-xs text-gray-500 mt-3">最大50MBまで。複数選択可</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoSelection}
              className="hidden"
            />
          </label>

          {/* Photo Previews */}
          {photoPreviews.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">
                選択済み: {photoPreviews.length} 枚
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center"
                    >
                      <span className="text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Issue Reporting Section */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-xl">⚠️</span> 問題報告
            </h3>
            {!showIssueForm && (
              <button
                type="button"
                onClick={() => setShowIssueForm(true)}
                className="text-sm bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 font-medium transition-colors"
              >
                + 問題を追加
              </button>
            )}
          </div>

          {showIssueForm && (
            <div className="bg-white p-6 rounded-lg mb-6 space-y-4 border border-red-200">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  問題タイプ
                </label>
                <input
                  type="text"
                  placeholder="例: 破損、汚れ、欠落"
                  value={newIssue.issueType}
                  onChange={(e) => setNewIssue((prev) => ({ ...prev, issueType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  説明
                </label>
                <textarea
                  placeholder="問題の詳細説明"
                  value={newIssue.description}
                  onChange={(e) => setNewIssue((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  重大度
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'LIGHT', label: '軽微', color: 'yellow' },
                    { value: 'MEDIUM', label: '中程度', color: 'orange' },
                    { value: 'SEVERE', label: '重大', color: 'red' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                        newIssue.severity === option.value
                          ? `border-${option.color}-500 bg-${option.color}-50`
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        checked={newIssue.severity === option.value}
                        onChange={(e) =>
                          setNewIssue((prev) => ({ ...prev, severity: e.target.value }))
                        }
                        className="hidden"
                      />
                      <span className="text-sm font-medium text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={addIssue}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  追加
                </button>
                <button
                  type="button"
                  onClick={() => setShowIssueForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}

          {issues.length > 0 && (
            <div className="space-y-3">
              {issues.map((issue, index) => (
                <div key={index} className="border-l-4 border-red-500 bg-white p-4 rounded-lg flex justify-between items-start border border-red-100">
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">{issue.issueType}</p>
                    <p className="text-sm text-red-800 mt-2">{issue.description}</p>
                    <div className="mt-3 inline-block">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        issue.severity === 'LIGHT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : issue.severity === 'MEDIUM'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {issue.severity === 'LIGHT' ? '軽微' : issue.severity === 'MEDIUM' ? '中程度' : '重大'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIssue(index)}
                    className="text-red-600 hover:text-red-800 font-bold text-xl ml-3"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none text-lg"
        >
          {isSubmitting ? '作成中...' : '✓ レポートを作成'}
        </button>
      </div>
    </form>
  )
}
