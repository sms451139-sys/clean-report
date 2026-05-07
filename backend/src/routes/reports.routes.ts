import { Router } from 'express'
import multer from 'multer'
import { authenticate } from '../middleware/auth'
import { ReportController } from '../controllers/report.controller'

const router = Router()
const reportController = new ReportController()
const upload = multer({ storage: multer.memoryStorage() })

// Create report
router.post('/', authenticate, (req, res, next) =>
  reportController.create(req, res, next)
)

// Get reports by property
router.get('/property/:propertyId', authenticate, (req, res, next) =>
  reportController.getByProperty(req, res, next)
)

// Get user's reports
router.get('/user/all', authenticate, (req, res, next) =>
  reportController.getByUser(req, res, next)
)

// Get single report
router.get('/:id', authenticate, (req, res, next) =>
  reportController.getById(req, res, next)
)

// Update report
router.put('/:id', authenticate, (req, res, next) =>
  reportController.update(req, res, next)
)

// Submit report
router.post('/:id/submit', authenticate, (req, res, next) =>
  reportController.submit(req, res, next)
)

// Delete report
router.delete('/:id', authenticate, (req, res, next) =>
  reportController.delete(req, res, next)
)

// Upload photo to report (Vercel Blob - for file uploads)
router.post('/:reportId/photos/blob', authenticate, upload.single('photo'), (req, res, next) =>
  reportController.uploadPhotoBlob(req, res, next)
)

// Upload photo to report (legacy - for Base64)
router.post('/:reportId/photos', authenticate, (req, res, next) =>
  reportController.uploadPhoto(req, res, next)
)

// Delete photo from report
router.delete('/:reportId/photos/:photoId', authenticate, (req, res, next) =>
  reportController.deletePhoto(req, res, next)
)

// Create issue for report
router.post('/:reportId/issues', authenticate, (req, res, next) =>
  reportController.createIssue(req, res, next)
)

// Delete issue from report
router.delete('/:reportId/issues/:issueId', authenticate, (req, res, next) =>
  reportController.deleteIssue(req, res, next)
)

// Resolve issue
router.post('/:reportId/issues/:issueId/resolve', authenticate, (req, res, next) =>
  reportController.resolveIssue(req, res, next)
)

export default router
