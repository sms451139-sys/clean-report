import apiClient from './api'

export interface ReportPhoto {
  id: string
  reportId: string
  photoUrl: string
  location?: string | null
  fileSize?: number | null
  uploadedAt: string
}

export interface ReportIssue {
  id: string
  reportId: string
  propertyId: string
  issueType: string
  description: string
  severity: string
  photoUrl?: string | null
  isResolved: boolean
  createdAt: string
  resolvedAt?: string | null
}

export interface Report {
  id: string
  userId: string
  propertyId: string
  cleaningDate: string
  checkInTime?: string | null
  checkOutTime?: string | null
  staffName?: string | null
  overallStatus: string
  reportText?: string | null
  reportFormat: string
  isSubmitted: boolean
  submittedAt?: string | null
  createdAt: string
  updatedAt: string
  checklistItems?: any[]
  photos?: ReportPhoto[]
  issues?: ReportIssue[]
  inventoryItems?: any[]
}

export const reportService = {
  async createReport(data: Partial<Report>): Promise<Report> {
    const response = await apiClient.post('/reports', data)
    return response.data
  },

  async getReportById(id: string): Promise<Report> {
    const response = await apiClient.get(`/reports/${id}`)
    return response.data
  },

  async getReportsByProperty(propertyId: string): Promise<Report[]> {
    const response = await apiClient.get(`/reports/property/${propertyId}`)
    return response.data
  },

  async getUserReports(): Promise<Report[]> {
    const response = await apiClient.get('/reports/user/all')
    return response.data
  },

  async updateReport(id: string, data: Partial<Report>): Promise<Report> {
    const response = await apiClient.put(`/reports/${id}`, data)
    return response.data
  },

  async submitReport(id: string): Promise<Report> {
    const response = await apiClient.post(`/reports/${id}/submit`)
    return response.data
  },

  async deleteReport(id: string): Promise<void> {
    await apiClient.delete(`/reports/${id}`)
  },

  async uploadPhoto(reportId: string, photoUrl: string, location?: string): Promise<ReportPhoto> {
    const response = await apiClient.post(`/reports/${reportId}/photos`, {
      photoUrl,
      location: location || null,
    })
    return response.data
  },

  async uploadPhotoBlob(reportId: string, file: File, location?: string): Promise<ReportPhoto> {
    const formData = new FormData()
    formData.append('photo', file)
    if (location) {
      formData.append('location', location)
    }
    const response = await apiClient.post(`/reports/${reportId}/photos/blob`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async deletePhoto(reportId: string, photoId: string): Promise<void> {
    await apiClient.delete(`/reports/${reportId}/photos/${photoId}`)
  },

  async createIssue(reportId: string, issue: { issueType: string; description: string; severity?: string }): Promise<ReportIssue> {
    const response = await apiClient.post(`/reports/${reportId}/issues`, issue)
    return response.data
  },

  async deleteIssue(reportId: string, issueId: string): Promise<void> {
    await apiClient.delete(`/reports/${reportId}/issues/${issueId}`)
  },

  async resolveIssue(reportId: string, issueId: string): Promise<ReportIssue> {
    const response = await apiClient.post(`/reports/${reportId}/issues/${issueId}/resolve`)
    return response.data
  },
}
