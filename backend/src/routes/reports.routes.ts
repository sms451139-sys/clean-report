import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// TODO: Implement reports routes
// - POST / - Create report
// - GET / - List reports
// - GET /:id - Get report details
// - PUT /:id - Update report
// - DELETE /:id - Delete report
// - POST /:id/generate - Generate AI report text
// - POST /:id/photos/upload-url - Get S3 upload URL
// - POST /:id/checklist - Save checklist
// - POST /:id/issues - Report issues

export default router;
