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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-4xl">🏢</span> 物件管理
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
                showForm
                  ? 'bg-gray-400 hover:bg-gray-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {showForm ? '✕ キャンセル' : '+ 新規物件'}
            </button>
          </div>

          {showForm && (
            <div className="mb-10">
              <PropertyForm onSuccess={() => {
                setShowForm(false)
                loadProperties()
              }} />
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">読み込み中...</p>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg font-medium">物件がありません</p>
              <p className="text-gray-500 text-sm mt-2">新規物件を作成してください</p>
            </div>
          ) : (
            <PropertyList properties={properties} onRefresh={loadProperties} />
          )}
        </div>
      </div>
    </>
  )
}
