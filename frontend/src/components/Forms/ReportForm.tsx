import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { reportService, ReportPhoto } from '../../services/report.service'
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
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
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
        setUploadingPhotos(true)
        for (const photo of selectedPhotos) {
          try {
            const photoUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = (e) => {
                resolve(e.target?.result as string)
              }
              reader.readAsDataURL(photo)
            })
            await reportService.uploadPhoto(report.id, photoUrl)
          } catch (err) {
            console.error('Failed to upload photo:', err)
          }
        }
        setUploadingPhotos(false)
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
    return <div className="text-center text-gray-500">読み込み中...</div>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">新規レポート作成</h2>

      <div className="space-y-4">
        {/* Cleaning Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            清掃日 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('cleaningDate', { required: '清掃日は必須です' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.cleaningDate && (
            <p className="text-red-500 text-sm mt-1">{errors.cleaningDate.message}</p>
          )}
        </div>

        {/* Check-in Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            チェックイン時刻
          </label>
          <input
            type="time"
            {...register('checkInTime')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Check-out Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            チェックアウト時刻
          </label>
          <input
            type="time"
            {...register('checkOutTime')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Staff Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            スタッフ名
          </label>
          <input
            type="text"
            placeholder="例: 佐藤太郎"
            {...register('staffName')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Report Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            レポート形式 <span className="text-red-500">*</span>
          </label>
          <select
            {...register('reportFormat', { required: 'レポート形式は必須です' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="BOTH">オーナー向け・マネージャー向け</option>
            <option value="OWNER">オーナー向けのみ</option>
            <option value="MANAGER">マネージャー向けのみ</option>
          </select>
          {errors.reportFormat && (
            <p className="text-red-500 text-sm mt-1">{errors.reportFormat.message}</p>
          )}
        </div>

        {/* Checklist Selection */}
        {checklists.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              チェックリスト
            </label>
            <select
              {...register('checklistId')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            写真をアップロード
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoSelection}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">複数の写真を選択できます</p>
        </div>

        {/* Photo Previews */}
        {photoPreviews.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選択した写真 ({photoPreviews.length})
            </label>
            <div className="grid grid-cols-3 gap-3">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issue Reporting */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              報告された問題
            </label>
            <button
              type="button"
              onClick={() => setShowIssueForm(!showIssueForm)}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
            >
              {showIssueForm ? 'キャンセル' : '問題を追加'}
            </button>
          </div>

          {showIssueForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  問題タイプ
                </label>
                <input
                  type="text"
                  placeholder="例: 破損、汚れ、欠落"
                  value={newIssue.issueType}
                  onChange={(e) => setNewIssue((prev) => ({ ...prev, issueType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  説明
                </label>
                <textarea
                  placeholder="問題の詳細説明"
                  value={newIssue.description}
                  onChange={(e) => setNewIssue((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  重大度
                </label>
                <select
                  value={newIssue.severity}
                  onChange={(e) => setNewIssue((prev) => ({ ...prev, severity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LIGHT">軽微</option>
                  <option value="MEDIUM">中程度</option>
                  <option value="SEVERE">重大</option>
                </select>
              </div>

              <button
                type="button"
                onClick={addIssue}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg text-sm"
              >
                問題を追加
              </button>
            </div>
          )}

          {issues.length > 0 && (
            <div className="space-y-2">
              {issues.map((issue, index) => (
                <div key={index} className="border-l-4 border-yellow-500 bg-yellow-50 p-3 rounded flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{issue.issueType}</p>
                    <p className="text-sm text-gray-700 mt-1">{issue.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      重大度: {issue.severity === 'LIGHT' ? '軽微' : issue.severity === 'MEDIUM' ? '中程度' : '重大'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIssue(index)}
                    className="text-red-600 hover:text-red-700 font-bold text-lg ml-2"
                  >
                    ×
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
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {isSubmitting ? '作成中...' : 'レポートを作成'}
        </button>
      </div>
    </form>
  )
}
