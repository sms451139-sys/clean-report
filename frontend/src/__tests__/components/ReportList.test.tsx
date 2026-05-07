import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReportList } from '../../components/Report/ReportList'
import * as reportServiceModule from '../../services/report.service'

vi.mock('../../services/report.service', () => ({
  reportService: {
    getReportsByProperty: vi.fn()
  }
}))

describe('ReportList', () => {
  const mockReports = [
    {
      id: '1',
      userId: 'user1',
      propertyId: 'prop1',
      cleaningDate: '2026-05-07',
      staffName: 'Test Staff',
      overallStatus: 'NORMAL',
      reportFormat: 'STANDARD',
      isSubmitted: true,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  const mockOnSelectReport = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display loading state initially', () => {
    const mock = vi.spyOn(reportServiceModule.reportService, 'getReportsByProperty')
    mock.mockImplementation(() => new Promise(() => {}))

    render(<ReportList propertyId="prop1" onSelectReport={mockOnSelectReport} />)
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('should display error message when fetch fails', async () => {
    const mock = vi.spyOn(reportServiceModule.reportService, 'getReportsByProperty')
    mock.mockRejectedValue(new Error('API Error'))

    render(<ReportList propertyId="prop1" onSelectReport={mockOnSelectReport} />)
    await waitFor(() => {
      expect(screen.getByText(/レポート一覧の読み込みに失敗しました/)).toBeInTheDocument()
    })
  })

  it('should display empty state when no reports', async () => {
    const mock = vi.spyOn(reportServiceModule.reportService, 'getReportsByProperty')
    mock.mockResolvedValue([])

    render(<ReportList propertyId="prop1" onSelectReport={mockOnSelectReport} />)
    await waitFor(() => {
      expect(screen.getByText('レポートがまだ作成されていません')).toBeInTheDocument()
    })
  })

  it('should display reports when loaded', async () => {
    const mock = vi.spyOn(reportServiceModule.reportService, 'getReportsByProperty')
    mock.mockResolvedValue(mockReports)

    render(<ReportList propertyId="prop1" onSelectReport={mockOnSelectReport} />)
    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
      expect(buttons[0].textContent).toContain('Test Staff')
    })
  })

  it('should call onSelectReport when clicking a report', async () => {
    const mock = vi.spyOn(reportServiceModule.reportService, 'getReportsByProperty')
    mock.mockResolvedValue(mockReports)
    const user = userEvent.setup()

    render(<ReportList propertyId="prop1" onSelectReport={mockOnSelectReport} />)
    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    const reportButton = screen.getAllByRole('button')[0]
    await user.click(reportButton)
    expect(mockOnSelectReport).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }))
  })

  it('should reload reports when refreshTrigger changes', async () => {
    const mock = vi.spyOn(reportServiceModule.reportService, 'getReportsByProperty')
    mock.mockResolvedValue(mockReports)

    const { rerender } = render(
      <ReportList propertyId="prop1" onSelectReport={mockOnSelectReport} refreshTrigger={0} />
    )
    await waitFor(() => {
      expect(mock).toHaveBeenCalledTimes(1)
    })

    rerender(<ReportList propertyId="prop1" onSelectReport={mockOnSelectReport} refreshTrigger={1} />)
    await waitFor(() => {
      expect(mock).toHaveBeenCalledTimes(2)
    })
  })
})
