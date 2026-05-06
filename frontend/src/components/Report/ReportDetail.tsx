import React, { useState } from 'react'
import { Report, reportService } from '../../services/report.service'
import { formatDate, formatTime } from '../../utils/dateFormatter'

interface ReportDetailProps {
  report: Report
  onSubmitSuccess?: (updatedReport: Report) => void
}

export const ReportDetail: React.FC<ReportDetailProps> = ({ report, onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!window.confirm('このレポートを提出してもよろしいですか？')) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const updatedReport = await reportService.submitReport(report.id)
      onSubmitSuccess?.(updatedReport)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'レポート提出に失敗しました'
      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusLabel = (status: string) => {
    return status === 'NORMAL' ? '問題なし' : '問題あり'
  }

  const getStatusColor = (status: string) => {
    return status === 'NORMAL' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getFormatLabel = (format: string) => {
    const labels: Record<string, string> = {
      OWNER: 'オーナー向け',
      MANAGER: 'マネージャー向け',
      BOTH: 'オーナー・マネージャー向け',
    }
    return labels[format] || format
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {formatDate(new Date(report.cleaningDate))}
          </h2>
          {!report.isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {isSubmitting ? '提出中...' : 'レポート提出'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.overallStatus)}`}>
            {getStatusLabel(report.overallStatus)}
          </span>
          {report.isSubmitted && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              提出済み
            </span>
          )}
        </div>

        {submitError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
            {submitError}
          </div>
        )}
      </div>

      {/* Report Details Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">チェックイン</p>
          <p className="font-medium text-gray-900">
            {report.checkInTime ? formatTime(new Date(report.checkInTime)) : '未記録'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">チェックアウト</p>
          <p className="font-medium text-gray-900">
            {report.checkOutTime ? formatTime(new Date(report.checkOutTime)) : '未記録'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">スタッフ名</p>
          <p className="font-medium text-gray-900">
            {report.staffName || '未記録'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">レポート形式</p>
          <p className="font-medium text-gray-900">
            {getFormatLabel(report.reportFormat)}
          </p>
        </div>
      </div>

      {/* Report Text */}
      {report.reportText && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">メモ</p>
          <p className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
            {report.reportText}
          </p>
        </div>
      )}

      {/* Photos */}
      {report.photos && report.photos.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-600 mb-3">写真 ({report.photos.length})</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {report.photos.map((photo) => (
              <div key={photo.id} className="rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={photo.photoUrl}
                  alt="Report photo"
                  className="w-full h-40 object-cover"
                />
                {photo.location && (
                  <div className="bg-gray-50 px-3 py-2">
                    <p className="text-xs text-gray-600">{photo.location}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist Items */}
      {report.checklistItems && report.checklistItems.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-600 mb-3">チェックリスト項目</p>
          <div className="space-y-2">
            {report.checklistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  disabled
                  className="w-5 h-5 rounded"
                />
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  {item.description && (
                    <p className="text-sm text-gray-600">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues */}
      {report.issues && report.issues.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-600 mb-3">報告された問題</p>
          <div className="space-y-3">
            {report.issues.map((issue) => (
              <div
                key={issue.id}
                className="border-l-4 border-red-500 bg-red-50 p-4 rounded"
              >
                <p className="font-medium text-gray-900">{issue.issueType}</p>
                <p className="text-sm text-gray-700 mt-1">{issue.description}</p>
                <p className="text-xs text-gray-600 mt-2">
                  重大度: {issue.severity}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
        <p>作成: {formatDate(new Date(report.createdAt))}</p>
        {report.submittedAt && (
          <p>提出: {formatDate(new Date(report.submittedAt))}</p>
        )}
      </div>
    </div>
  )
}
