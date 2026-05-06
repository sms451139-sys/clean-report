import { create } from 'zustand'
import { Property } from '../services/property.service'

interface PropertyState {
  properties: Property[]
  selectedProperty: Property | null
  isLoading: boolean
  error: string | null

  setProperties: (properties: Property[]) => void
  setSelectedProperty: (property: Property | null) => void
  addProperty: (property: Property) => void
  updateProperty: (property: Property) => void
  removeProperty: (id: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: [],
  selectedProperty: null,
  isLoading: false,
  error: null,

  setProperties: (properties) => set({ properties }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  addProperty: (property) => set((state) => ({
    properties: [...state.properties, property],
  })),
  updateProperty: (property) => set((state) => ({
    properties: state.properties.map((p) => (p.id === property.id ? property : p)),
  })),
  removeProperty: (id) => set((state) => ({
    properties: state.properties.filter((p) => p.id !== id),
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
