import apiClient from './api'

export interface Property {
  id: string
  propertyName: string
  propertyCode?: string
  address?: string
  latitude?: number
  longitude?: number
  createdAt: string
  updatedAt: string
}

export interface CreatePropertyPayload {
  propertyName: string
  propertyCode?: string
  address?: string
  latitude?: number
  longitude?: number
}

export interface UpdatePropertyPayload {
  propertyName?: string
  propertyCode?: string
  address?: string
  latitude?: number
  longitude?: number
}

export const propertyService = {
  getProperties: async (): Promise<Property[]> => {
    const { data } = await apiClient.get<Property[]>('/properties')
    return data
  },

  getProperty: async (id: string): Promise<Property> => {
    const { data } = await apiClient.get<Property>(`/properties/${id}`)
    return data
  },

  createProperty: async (payload: CreatePropertyPayload): Promise<Property> => {
    const { data } = await apiClient.post<Property>('/properties', payload)
    return data
  },

  updateProperty: async (id: string, payload: UpdatePropertyPayload): Promise<Property> => {
    const { data } = await apiClient.put<Property>(`/properties/${id}`, payload)
    return data
  },

  deleteProperty: async (id: string): Promise<void> => {
    await apiClient.delete(`/properties/${id}`)
  },
}
