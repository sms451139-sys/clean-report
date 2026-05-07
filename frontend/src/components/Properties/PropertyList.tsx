import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Property, propertyService } from '../../services/property.service'
import { usePropertyStore } from '../../store/propertyStore'
import { PropertyDetailModal } from './PropertyDetailModal'

interface PropertyListProps {
  properties: Property[]
  onRefresh: () => void
}

export const PropertyList: React.FC<PropertyListProps> = ({ properties, onRefresh }) => {
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const removeProperty = usePropertyStore((state) => state.removeProperty)

  const handleDelete = async (id: string) => {
    if (!confirm('この物件を削除しますか？')) return

    try {
      setDeleting(id)
      await propertyService.deleteProperty(id)
      removeProperty(id)
    } catch (err) {
      alert('削除に失敗しました')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 p-6"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-start gap-2">
                <span className="text-2xl">🏠</span>
                <span>{property.propertyName}</span>
              </h3>
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
              {property.propertyCode && (
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 font-medium min-w-fit">ID:</span>
                  <span className="font-mono text-gray-800">{property.propertyCode}</span>
                </div>
              )}
              {property.address && (
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 font-medium min-w-fit">📍</span>
                  <span className="text-gray-800">{property.address}</span>
                </div>
              )}
              {property.latitude && property.longitude && (
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 font-medium min-w-fit">座標:</span>
                  <span className="font-mono text-gray-700 text-xs">{property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 mb-6">
              作成: {new Date(property.createdAt).toLocaleDateString('ja-JP')}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/report/${property.id}`)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
                disabled={deleting === property.id}
              >
                📋 報告
              </button>
              <button
                onClick={() => setSelectedProperty(property)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
                disabled={deleting === property.id}
              >
                ⚙️ 設定
              </button>
              <button
                onClick={() => handleDelete(property.id)}
                disabled={deleting === property.id}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {deleting === property.id ? '削除中...' : '🗑️'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onRefresh={onRefresh}
        />
      )}
    </>
  )
}
