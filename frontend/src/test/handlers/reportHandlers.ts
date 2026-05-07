import { http, HttpResponse } from 'msw'

const mockReports = [
  {
    id: '1',
    userId: 'user1',
    propertyId: 'prop1',
    cleaningDate: '2026-05-07',
    staffName: 'Test Staff',
    overallStatus: 'COMPLETED',
    reportFormat: 'STANDARD',
    isSubmitted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    checklistItems: [],
    photos: [],
    issues: []
  }
]

export const reportHandlers = [
  http.get('/api/reports/property/:propertyId', () => {
    return HttpResponse.json(mockReports)
  }),

  http.get('/api/reports/user/all', () => {
    return HttpResponse.json(mockReports)
  }),

  http.get('/api/reports/:id', () => {
    return HttpResponse.json(mockReports[0])
  }),

  http.post('/api/reports', async ({ request }) => {
    const body = await request.json() as any
    const newReport = {
      id: 'new-report-id',
      userId: 'user1',
      propertyId: body.propertyId,
      cleaningDate: body.cleaningDate,
      staffName: body.staffName,
      overallStatus: 'DRAFT',
      reportFormat: body.reportFormat,
      isSubmitted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      checklistItems: [],
      photos: [],
      issues: []
    }
    return HttpResponse.json(newReport, { status: 201 })
  }),

  http.put('/api/reports/:id', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({
      ...mockReports[0],
      ...body,
      updatedAt: new Date().toISOString()
    })
  }),

  http.post('/api/reports/:id/submit', () => {
    return HttpResponse.json({
      ...mockReports[0],
      isSubmitted: true,
      submittedAt: new Date().toISOString()
    })
  }),

  http.delete('/api/reports/:id', () => {
    return HttpResponse.json(null, { status: 204 })
  }),

  http.post('/api/reports/:reportId/photos', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({
      id: 'photo-1',
      reportId: 'report-1',
      photoUrl: body.photoUrl,
      location: body.location,
      uploadedAt: new Date().toISOString()
    }, { status: 201 })
  }),

  http.delete('/api/reports/:reportId/photos/:photoId', () => {
    return HttpResponse.json(null, { status: 204 })
  }),

  http.post('/api/reports/:reportId/issues', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({
      id: 'issue-1',
      reportId: 'report-1',
      propertyId: 'prop-1',
      issueType: body.issueType,
      description: body.description,
      severity: body.severity || 'MEDIUM',
      isResolved: false,
      createdAt: new Date().toISOString()
    }, { status: 201 })
  }),

  http.delete('/api/reports/:reportId/issues/:issueId', () => {
    return HttpResponse.json(null, { status: 204 })
  }),

  http.post('/api/reports/:reportId/issues/:issueId/resolve', () => {
    return HttpResponse.json({
      id: 'issue-1',
      reportId: 'report-1',
      propertyId: 'prop-1',
      issueType: 'STAIN',
      description: 'Test issue',
      severity: 'MEDIUM',
      isResolved: true,
      resolvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    })
  })
]
