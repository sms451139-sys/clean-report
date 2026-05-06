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
    return <div className="text-center text-gray-500 py-8">読み込み中...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
        {error}
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">レポートがまだ作成されていません</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <button
          key={report.id}
          onClick={() => onSelectReport(report)}
          className="w-full text-left bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {formatDate(new Date(report.cleaningDate))}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {report.staffName && `スタッフ: ${report.staffName}`}
                {report.isSubmitted && (
                  <span className="ml-2 inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    提出済み
                  </span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {report.overallStatus === 'NORMAL' ? '問題なし' : '問題あり'}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
