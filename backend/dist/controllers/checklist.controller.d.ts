import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class ChecklistController {
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getByProperty(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=checklist.controller.d.ts.map