import { describe, it, expect, beforeEach, vi } from 'vitest'
import { reportService } from '../../services/report.service'

describe('reportService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getReportsByProperty', () => {
    it('should fetch reports for a property', async () => {
      const reports = await reportService.getReportsByProperty('prop1')
      expect(reports).toBeDefined()
      expect(Array.isArray(reports)).toBe(true)
    })

    it('should return reports with required fields', async () => {
      const reports = await reportService.getReportsByProperty('prop1')
      const report = reports[0]
      expect(report.id).toBeDefined()
      expect(report.propertyId).toBeDefined()
      expect(report.cleaningDate).toBeDefined()
    })
  })

  describe('getReportById', () => {
    it('should fetch a single report by ID', async () => {
      const report = await reportService.getReportById('1')
      expect(report).toBeDefined()
      expect(report.id).toBe('1')
    })

    it('should return report with all expected fields', async () => {
      const report = await reportService.getReportById('1')
      expect(report.userId).toBeDefined()
      expect(report.propertyId).toBeDefined()
      expect(report.isSubmitted).toBeDefined()
    })
  })

  describe('createReport', () => {
    it('should create a new report', async () => {
      const newReport = await reportService.createReport({
        propertyId: 'prop1',
        cleaningDate: '2026-05-07',
        reportFormat: 'STANDARD'
      })
      expect(newReport).toBeDefined()
      expect(newReport.id).toBeDefined()
      expect(newReport.isSubmitted).toBe(false)
    })
  })

  describe('submitReport', () => {
    it('should submit a report', async () => {
      const submitted = await reportService.submitReport('1')
      expect(submitted.isSubmitted).toBe(true)
      expect(submitted.submittedAt).toBeDefined()
    })
  })

  describe('deleteReport', () => {
    it('should delete a report', async () => {
      await expect(reportService.deleteReport('1')).resolves.toBeUndefined()
    })
  })

  describe('uploadPhoto', () => {
    it('should upload a photo to a report', async () => {
      const photo = await reportService.uploadPhoto('report-1', 'data:image/png;base64,abc123', 'Living Room')
      expect(photo).toBeDefined()
      expect(photo.id).toBeDefined()
      expect(photo.location).toBe('Living Room')
    })
  })

  describe('createIssue', () => {
    it('should create an issue for a report', async () => {
      const issue = await reportService.createIssue('report-1', {
        issueType: 'STAIN',
        description: 'Test issue',
        severity: 'HIGH'
      })
      expect(issue).toBeDefined()
      expect(issue.issueType).toBe('STAIN')
      expect(issue.isResolved).toBe(false)
    })
  })

  describe('resolveIssue', () => {
    it('should resolve an issue', async () => {
      const resolved = await reportService.resolveIssue('report-1', 'issue-1')
      expect(resolved.isResolved).toBe(true)
      expect(resolved.resolvedAt).toBeDefined()
    })
  })
})
