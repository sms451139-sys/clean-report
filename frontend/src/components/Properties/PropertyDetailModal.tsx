import React, { useState, useEffect } from 'react'
import { Property } from '../../services/property.service'
import { ChecklistCreateForm } from '../Checklist/ChecklistCreateForm'
import { checklistService, Checklist } from '../../services/checklist.service'

interface PropertyDetailModalProps {
  property: Property
  onClose: () => void
  onRefresh: () => void
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'checklists'>('info')
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'checklists') {
      loadChecklists()
    }
  }, [activeTab])

  const loadChecklists = async () => {
    try {
      setLoading(true)
      const data = await checklistService.getChecklistsByProperty(property.id)
      setChecklists(data)
    } catch (err) {
      console.error('Failed to load checklists:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">🏠</span> {property.propertyName}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
          >
            <span className="text-2xl font-light">✕</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 font-semibold border-b-2 transition-all ${
                activeTab === 'info'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              ℹ️ 基本情報
            </button>
            <button
              onClick={() => setActiveTab('checklists')}
              className={`py-4 font-semibold border-b-2 transition-all ${
                activeTab === 'checklists'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              ✓ チェックリスト
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {activeTab === 'info' && (
            <div className="space-y-5">
              {property.propertyCode && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">物件ID</label>
                  <p className="text-lg font-semibold text-gray-900 mt-2 font-mono">{property.propertyCode}</p>
                </div>
              )}
              {property.address && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">住所</label>
                  <p className="text-lg font-semibold text-gray-900 mt-2">{property.address}</p>
                </div>
              )}
              {property.latitude && property.longitude && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">座標</label>
                  <p className="text-lg font-semibold text-gray-900 mt-2 font-mono">
                    {property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}
                  </p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">作成日</label>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  {new Date(property.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'checklists' && (
            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                    <p className="text-gray-600">読み込み中...</p>
                  </div>
                </div>
              ) : checklists.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-3">📋</div>
                  <p className="text-gray-600 font-medium">チェックリストテンプレートがありません</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-lg">テンプレート一覧</h3>
                  {checklists.map((checklist) => (
                    <div
                      key={checklist.id}
                      className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{checklist.title}</h4>
                          {checklist.description && (
                            <p className="text-sm text-gray-600 mt-2">{checklist.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-3 font-medium">
                            ✓ {checklist.items.length} 項目
                          </p>
                        </div>
                        {checklist.isDefault && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                            デフォルト
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-bold text-gray-900 mb-5 text-lg">+ 新規テンプレート作成</h3>
                <ChecklistCreateForm
                  propertyId={property.id}
                  onSuccess={() => {
                    loadChecklists()
                    onRefresh()
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
