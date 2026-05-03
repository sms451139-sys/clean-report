import { NextFunction, Response } from 'express';
import { PropertyService } from '../services/property.service';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const propertyService = new PropertyService();

export class PropertiesController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError(401, 'Unauthorized');

      const result = await propertyService.createProperty(req.user.userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError(401, 'Unauthorized');

      const properties = await propertyService.getProperties(req.user.userId);
      res.json(properties);
    } catch (error) {
      next(error);
    }
  }

  async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError(401, 'Unauthorized');

      const property = await propertyService.getProperty(req.params.id, req.user.userId);
      res.json(property);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError(401, 'Unauthorized');

      const property = await propertyService.updateProperty(req.params.id, req.user.userId, req.body);
      res.json(property);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError(401, 'Unauthorized');

      await propertyService.deleteProperty(req.params.id, req.user.userId);
      res.json({ message: 'Property deleted' });
    } catch (error) {
      next(error);
    }
  }
}
