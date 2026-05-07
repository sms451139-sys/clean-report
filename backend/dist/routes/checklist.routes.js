import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { ChecklistController } from '../controllers/checklist.controller';
const router = Router();
const checklistController = new ChecklistController();
// Create checklist
router.post('/checklists', authenticate, (req, res, next) => checklistController.create(req, res, next));
// Get checklists by property
router.get('/properties/:propertyId/checklists', authenticate, (req, res, next) => checklistController.getByProperty(req, res, next));
// Get single checklist
router.get('/checklists/:id', authenticate, (req, res, next) => checklistController.getById(req, res, next));
// Update checklist
router.put('/checklists/:id', authenticate, (req, res, next) => checklistController.update(req, res, next));
// Update checklist item
router.patch('/checklists/:id/items/:itemId', authenticate, (req, res, next) => checklistController.updateItem(req, res, next));
// Delete checklist
router.delete('/checklists/:id', authenticate, (req, res, next) => checklistController.delete(req, res, next));
export default router;
//# sourceMappingURL=checklist.routes.js.map