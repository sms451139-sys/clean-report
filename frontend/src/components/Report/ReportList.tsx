import React, { useEffect, useState } from 'react'
import { Report, reportService } from '../../services/report.service'
import { formatDate } from '../../utils/dateFormatter'

interface ReportListProps {
  propertyId: string
  onSelectReport: (report: Report) => void
  refreshTrigger?: number
}

export const ReportList: React.FC<ReportListProps> = ({
  propertyId,
  onSelectReport,
  refreshTrigger = 0,
}) => {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadReports()
  }, [propertyId, refreshTrigger])

  const loadReports = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await reportService.getReportsByProperty(propertyId)
      setReports(data)
    } catch (err: any) {
      setError('レポート一覧の読み込みに失敗しました')
      console.error('Failed to load reports:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-3 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-2"></div>
          <p className="text-gray-600 text-sm">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm font-medium">
        ⚠️ {error}
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
        <div className="text-gray-400 text-3xl mb-2">📭</div>
        <p className="text-gray-600 font-medium">レポートがまだ作成されていません</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {reports.map((report) => (
        <button
          key={report.id}
          onClick={() => onSelectReport(report)}
          className="w-full text-left bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-lg p-4 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {formatDate(new Date(report.cleaningDate))}
              </p>
              <p className="text-sm text-gray-500 mt-2 flex flex-wrap items-center gap-2">
                {report.staffName && (
                  <span>👤 {report.staffName}</span>
                )}
                {report.isSubmitted && (
                  <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
                    ✓ 提出済み
                  </span>
                )}
              </p>
            </div>
            <div className="text-right ml-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                report.overallStatus === 'NORMAL'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {report.overallStatus === 'NORMAL' ? '✓ 問題なし' : '⚠️ 問題あり'}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
