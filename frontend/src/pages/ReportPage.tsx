import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '../components/Layout/Header'
import { ChecklistView } from '../components/Checklist/ChecklistView'
import { ReportForm } from '../components/Forms/ReportForm'
import { ReportList } from '../components/Report/ReportList'
import { ReportDetail } from '../components/Report/ReportDetail'
import { checklistService, Checklist } from '../services/checklist.service'
import { Report } from '../services/report.service'

type ViewMode = 'create' | 'list'

export const ReportPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>()
  const navigate = useNavigate()
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('create')
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (propertyId) {
      loadChecklists()
    }
  }, [propertyId])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const loadChecklists = async () => {
    try {
      setLoading(true)
      if (propertyId) {
        const data = await checklistService.getChecklistsByProperty(propertyId)
        setChecklists(data)
        if (data.length > 0) {
          setSelectedChecklist(data[0])
        }
      }
    } catch (err) {
      console.error('Failed to load checklists:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReportCreated = (report: Report) => {
    setSuccessMessage('レポートを作成しました')
    setRefreshTrigger((prev) => prev + 1)
    setViewMode('list')
  }

  const handleReportError = (error: string) => {
    console.error('Report creation error:', error)
  }

  const handleReportSubmitted = (report: Report) => {
    setSuccessMessage('レポートを提出しました')
    setSelectedReport(report)
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/properties')}
              className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-2"
            >
              ← 戻る
            </button>
            <h1 className="text-3xl font-bold text-gray-900">報告作成</h1>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              {successMessage}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setViewMode('create')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'create'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              新規レポート作成
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              レポート一覧
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">読み込み中...</div>
          ) : (
            <>
              {viewMode === 'create' && propertyId && (
                <div className="mb-8">
                  <ReportForm
                    propertyId={propertyId}
                    onSuccess={handleReportCreated}
                    onError={handleReportError}
                  />
                </div>
              )}

              {viewMode === 'list' && propertyId && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Report list */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <h2 className="font-bold text-gray-900 mb-4">レポート一覧</h2>
                      <ReportList
                        propertyId={propertyId}
                        onSelectReport={setSelectedReport}
                        refreshTrigger={refreshTrigger}
                      />
                    </div>
                  </div>

                  {/* Report detail */}
                  <div className="lg:col-span-2">
                    {selectedReport ? (
                      <ReportDetail report={selectedReport} onSubmitSuccess={handleReportSubmitted} />
                    ) : (
                      <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-500">
                          左からレポートを選択して詳細を表示
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Checklist View */}
              {checklists.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">チェックリスト管理</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Checklist selector */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="font-bold text-gray-900 mb-4">チェックリスト</h3>
                        <div className="space-y-2">
                          {checklists.map((checklist) => (
                            <button
                              key={checklist.id}
                              onClick={() => setSelectedChecklist(checklist)}
                              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                selectedChecklist?.id === checklist.id
                                  ? 'bg-blue-500 text-white font-medium'
                                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              }`}
                            >
                              {checklist.title}
                              {checklist.isDefault && (
                                <span className="text-xs ml-2 opacity-75">
                                  (デフォルト)
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Checklist view */}
                    <div className="lg:col-span-3">
                      {selectedChecklist && (
                        <ChecklistView
                          checklist={selectedChecklist}
                          onUpdate={(updated) => {
                            setSelectedChecklist(updated)
                            setChecklists(
                              checklists.map((c) =>
                                c.id === updated.id ? updated : c
                              )
                            )
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
