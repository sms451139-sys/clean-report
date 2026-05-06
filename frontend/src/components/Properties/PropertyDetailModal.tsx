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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{property.propertyName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              基本情報
            </button>
            <button
              onClick={() => setActiveTab('checklists')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'checklists'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              チェックリスト
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'info' && (
            <div className="space-y-4">
              {property.propertyCode && (
                <div>
                  <label className="text-sm font-medium text-gray-600">物件コード</label>
                  <p className="text-lg text-gray-900">{property.propertyCode}</p>
                </div>
              )}
              {property.address && (
                <div>
                  <label className="text-sm font-medium text-gray-600">住所</label>
                  <p className="text-lg text-gray-900">{property.address}</p>
                </div>
              )}
              {property.latitude && property.longitude && (
                <div>
                  <label className="text-sm font-medium text-gray-600">座標</label>
                  <p className="text-lg text-gray-900">
                    {property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">作成日</label>
                <p className="text-lg text-gray-900">
                  {new Date(property.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'checklists' && (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center text-gray-500">読み込み中...</div>
              ) : checklists.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  チェックリストテンプレートがありません
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">テンプレート一覧</h3>
                  {checklists.map((checklist) => (
                    <div
                      key={checklist.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{checklist.title}</h4>
                          {checklist.description && (
                            <p className="text-sm text-gray-600 mt-1">{checklist.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {checklist.items.length}項目
                          </p>
                        </div>
                        {checklist.isDefault && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            デフォルト
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
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
