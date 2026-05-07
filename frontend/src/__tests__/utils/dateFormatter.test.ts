import { describe, it, expect } from 'vitest'
import { formatDate, formatTime, formatDateTime } from '../../utils/dateFormatter'

describe('dateFormatter', () => {
  const testDate = new Date('2026-05-07T14:30:00Z')

  describe('formatDate', () => {
    it('should format date in Japanese locale', () => {
      const result = formatDate(testDate)
      expect(result).toMatch(/\d{4}.*\d{1,2}.*\d{1,2}/)
      expect(result).not.toContain('T')
    })

    it('should handle different dates correctly', () => {
      const date1 = new Date('2026-01-01T00:00:00Z')
      const date2 = new Date('2026-12-31T23:59:59Z')
      const result1 = formatDate(date1)
      const result2 = formatDate(date2)
      expect(result1).not.toEqual(result2)
    })
  })

  describe('formatTime', () => {
    it('should format time in Japanese locale', () => {
      const result = formatTime(testDate)
      expect(result).toMatch(/\d{1,2}:\d{2}/)
    })

    it('should handle different times correctly', () => {
      const time1 = new Date('2026-05-07T09:00:00Z')
      const time2 = new Date('2026-05-07T17:30:00Z')
      const result1 = formatTime(time1)
      const result2 = formatTime(time2)
      expect(result1).not.toEqual(result2)
    })
  })

  describe('formatDateTime', () => {
    it('should combine date and time format', () => {
      const result = formatDateTime(testDate)
      expect(result).toMatch(/\d{4}.*\d{1,2}.*\d{1,2}.*\d{1,2}:\d{2}/)
    })

    it('should contain both date and time parts separated by space', () => {
      const result = formatDateTime(testDate)
      const parts = result.split(' ')
      expect(parts.length).toBeGreaterThanOrEqual(2)
    })
  })
})
