import { Router } from 'express';
import { PropertiesController } from '../controllers/properties.controller';
import { authenticate } from '../middleware/auth';
const router = Router();
const controller = new PropertiesController();
router.use(authenticate);
router.post('/', (req, res, next) => controller.create(req, res, next));
router.get('/', (req, res, next) => controller.list(req, res, next));
router.get('/:id', (req, res, next) => controller.get(req, res, next));
router.put('/:id', (req, res, next) => controller.update(req, res, next));
router.delete('/:id', (req, res, next) => controller.delete(req, res, next));
export default router;
//# sourceMappingURL=properties.routes.js.map