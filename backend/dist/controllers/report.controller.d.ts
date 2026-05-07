import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class ReportController {
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getByProperty(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getByUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    submit(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    uploadPhoto(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    uploadPhotoBlob(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deletePhoto(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    createIssue(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteIssue(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    resolveIssue(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=report.controller.d.ts.map