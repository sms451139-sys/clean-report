import { Router } from 'express';
import { PropertiesController } from '../controllers/properties.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new PropertiesController();

router.use(authenticate);

router.post('/', (req, res, next) => controller.create(req as any, res, next));
router.get('/', (req, res, next) => controller.list(req as any, res, next));
router.get('/:id', (req, res, next) => controller.get(req as any, res, next));
router.put('/:id', (req, res, next) => controller.update(req as any, res, next));
router.delete('/:id', (req, res, next) => controller.delete(req as any, res, next));

export default router;
