import apiClient from './api'

export interface ChecklistItem {
  id: string
  title: string
  description?: string
  isCompleted: boolean
  order: number
}

export interface Checklist {
  id: string
  propertyId: string
  title: string
  description?: string
  items: ChecklistItem[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateChecklistPayload {
  propertyId: string
  title: string
  description?: string
  items: Array<{
    title: string
    description?: string
    order: number
  }>
  isDefault?: boolean
}

export interface UpdateChecklistPayload {
  title?: string
  description?: string
  items?: ChecklistItem[]
}

export const checklistService = {
  getChecklistsByProperty: async (propertyId: string): Promise<Checklist[]> => {
    const { data } = await apiClient.get<Checklist[]>(`/properties/${propertyId}/checklists`)
    return data
  },

  getChecklist: async (id: string): Promise<Checklist> => {
    const { data } = await apiClient.get<Checklist>(`/checklists/${id}`)
    return data
  },

  createChecklist: async (payload: CreateChecklistPayload): Promise<Checklist> => {
    const { data } = await apiClient.post<Checklist>('/checklists', payload)
    return data
  },

  updateChecklist: async (id: string, payload: UpdateChecklistPayload): Promise<Checklist> => {
    const { data } = await apiClient.put<Checklist>(`/checklists/${id}`, payload)
    return data
  },

  deleteChecklist: async (id: string): Promise<void> => {
    await apiClient.delete(`/checklists/${id}`)
  },

  updateChecklistItem: async (checklistId: string, itemId: string, isCompleted: boolean): Promise<Checklist> => {
    const { data } = await apiClient.patch<Checklist>(`/checklists/${checklistId}/items/${itemId}`, {
      isCompleted,
    })
    return data
  },
}
