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
    return undefined
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

  const handleReportCreated = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-10">
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center gap-2 px-3 py-2 text-indigo-600 hover:text-indigo-700 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
            >
              ← 戻る
            </button>
            <h1 className="text-4xl font-bold text-gray-900">レポート作成</h1>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-800 font-medium shadow-sm">
              ✓ {successMessage}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setViewMode('create')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                viewMode === 'create'
                  ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              新規レポート作成
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              レポート一覧
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">読み込み中...</p>
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'create' && propertyId && (
                <div className="mb-10">
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h2 className="text-lg font-bold text-gray-900 mb-5">レポート一覧</h2>
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
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="text-gray-400 text-4xl mb-3">📋</div>
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
                <div className="mt-16 pt-10 border-t border-gray-200">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">チェックリスト</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Checklist selector */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-5">リスト選択</h3>
                        <div className="space-y-2">
                          {checklists.map((checklist) => (
                            <button
                              key={checklist.id}
                              onClick={() => setSelectedChecklist(checklist)}
                              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                                selectedChecklist?.id === checklist.id
                                  ? 'bg-indigo-600 text-white font-medium shadow-md'
                                  : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200'
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
