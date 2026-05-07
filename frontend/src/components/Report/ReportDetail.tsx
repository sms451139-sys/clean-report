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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {formatDate(new Date(report.cleaningDate))}
          </h2>
          {!report.isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
            >
              {isSubmitting ? '提出中...' : '✓ レポート提出'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(report.overallStatus)}`}>
            {getStatusLabel(report.overallStatus)}
          </span>
          {report.isSubmitted && (
            <span className="px-4 py-2 bg-indigo-100 text-indigo-800 text-sm rounded-full font-medium">
              ✓ 提出済み
            </span>
          )}
        </div>

        {submitError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm font-medium">
            ⚠️ {submitError}
          </div>
        )}
      </div>

      {/* Report Details Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-100">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">チェックイン</p>
          <p className="text-lg font-semibold text-gray-900">
            {report.checkInTime ? formatTime(new Date(report.checkInTime)) : '-'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">チェックアウト</p>
          <p className="text-lg font-semibold text-gray-900">
            {report.checkOutTime ? formatTime(new Date(report.checkOutTime)) : '-'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">スタッフ</p>
          <p className="text-lg font-semibold text-gray-900">
            {report.staffName || '-'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">形式</p>
          <p className="text-lg font-semibold text-gray-900">
            {getFormatLabel(report.reportFormat)}
          </p>
        </div>
      </div>

      {/* Report Text */}
      {report.reportText && (
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-3">📝 メモ</p>
          <p className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap border border-gray-100">
            {report.reportText}
          </p>
        </div>
      )}

      {/* Photos */}
      {report.photos && report.photos.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-4">📸 写真 ({report.photos.length})</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {report.photos.map((photo) => (
              <div key={photo.id} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={photo.photoUrl}
                  alt="Report photo"
                  className="w-full h-40 object-cover"
                />
                {photo.location && (
                  <div className="bg-gray-50 px-3 py-2 border-t border-gray-100">
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
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-4">✓ チェックリスト項目</p>
          <div className="space-y-2">
            {report.checklistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  disabled
                  className="w-5 h-5 rounded text-emerald-600 mt-0.5"
                />
                <div className="flex-1">
                  <p className={`font-medium ${item.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues */}
      {report.issues && report.issues.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-4">⚠️ 報告された問題</p>
          <div className="space-y-3">
            {report.issues.map((issue) => (
              <div
                key={issue.id}
                className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg border border-red-100"
              >
                <p className="font-semibold text-red-900">{issue.issueType}</p>
                <p className="text-sm text-red-800 mt-2">{issue.description}</p>
                <p className="text-xs text-red-700 mt-3 font-medium">
                  重大度: {issue.severity}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="text-xs text-gray-500 pt-6 border-t border-gray-200">
        <p>作成日時: {formatDate(new Date(report.createdAt))}</p>
        {report.submittedAt && (
          <p>提出日時: {formatDate(new Date(report.submittedAt))}</p>
        )}
      </div>
    </div>
  )
}
