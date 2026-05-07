import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class PropertiesController {
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    list(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    get(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=properties.controller.d.ts.map