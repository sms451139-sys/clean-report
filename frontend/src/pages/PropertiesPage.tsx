import React, { useEffect, useState } from 'react'
import { Header } from '../components/Layout/Header'
import { PropertyList } from '../components/Properties/PropertyList'
import { PropertyForm } from '../components/Properties/PropertyForm'
import { usePropertyStore } from '../store/propertyStore'
import { propertyService } from '../services/property.service'

export const PropertiesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false)
  const properties = usePropertyStore((state) => state.properties)
  const setProperties = usePropertyStore((state) => state.setProperties)
  const isLoading = usePropertyStore((state) => state.isLoading)
  const setLoading = usePropertyStore((state) => state.setLoading)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const data = await propertyService.getProperties()
      setProperties(data)
    } catch (err) {
      console.error('Failed to load properties:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">物件管理</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
            >
              {showForm ? 'キャンセル' : '新規物件'}
            </button>
          </div>

          {showForm && (
            <div className="mb-8">
              <PropertyForm onSuccess={() => {
                setShowForm(false)
                loadProperties()
              }} />
            </div>
          )}

          {isLoading ? (
            <div className="text-center text-gray-500">読み込み中...</div>
          ) : properties.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              物件がありません。新規物件を作成してください。
            </div>
          ) : (
            <PropertyList properties={properties} onRefresh={loadProperties} />
          )}
        </div>
      </div>
    </>
  )
}
