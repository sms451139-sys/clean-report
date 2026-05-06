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
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">{property.propertyName}</h3>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {property.propertyCode && (
                <p><span className="font-medium">コード:</span> {property.propertyCode}</p>
              )}
              {property.address && (
                <p><span className="font-medium">住所:</span> {property.address}</p>
              )}
              {property.latitude && property.longitude && (
                <p><span className="font-medium">座標:</span> {property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}</p>
              )}
              <p className="text-xs text-gray-500">
                作成: {new Date(property.createdAt).toLocaleDateString('ja-JP')}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/report/${property.id}`)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm"
                disabled={deleting === property.id}
              >
                報告
              </button>
              <button
                onClick={() => setSelectedProperty(property)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded text-sm"
                disabled={deleting === property.id}
              >
                設定
              </button>
              <button
                onClick={() => handleDelete(property.id)}
                disabled={deleting === property.id}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded text-sm"
              >
                {deleting === property.id ? '削除中...' : '削除'}
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
