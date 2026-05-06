import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

export class ChecklistController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { propertyId, title, description, items, isDefault } = req.body
      const userId = req.user?.userId

      if (!propertyId || !title || !items) {
        throw new AppError(400, 'propertyId, title, and items are required')
      }

      // Verify property ownership
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
      })

      if (!property || property.userId !== userId) {
        throw new AppError(403, 'Property not found or unauthorized')
      }

      const checklist = await prisma.checklistTemplate.create({
        data: {
          propertyId,
          title,
          description,
          isDefault,
          items: {
            create: items.map((item: any, index: number) => ({
              title: item.title,
              description: item.description,
              order: index,
            })),
          },
        },
        include: {
          items: true,
        },
      })

      logger.info(`Checklist created: ${checklist.id}`)
      res.status(201).json(checklist)
    } catch (error) {
      next(error)
    }
  }

  async getByProperty(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params
      const userId = req.user?.userId

      // Verify property ownership
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
      })

      if (!property || property.userId !== userId) {
        throw new AppError(403, 'Property not found or unauthorized')
      }

      const checklists = await prisma.checklistTemplate.findMany({
        where: { propertyId },
        include: {
          items: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      })

      res.json(checklists)
    } catch (error) {
      next(error)
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.user?.userId

      const checklist = await prisma.checklistTemplate.findUnique({
        where: { id },
        include: {
          items: {
            orderBy: { order: 'asc' },
          },
          property: true,
        },
      })

      if (!checklist) {
        throw new AppError(404, 'Checklist not found')
      }

      if (checklist.property.userId !== userId) {
        throw new AppError(403, 'Unauthorized')
      }

      res.json(checklist)
    } catch (error) {
      next(error)
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { title, description, items } = req.body
      const userId = req.user?.userId

      const checklist = await prisma.checklistTemplate.findUnique({
        where: { id },
        include: { property: true },
      })

      if (!checklist) {
        throw new AppError(404, 'Checklist not found')
      }

      if (checklist.property.userId !== userId) {
        throw new AppError(403, 'Unauthorized')
      }

      const updated = await prisma.checklistTemplate.update({
        where: { id },
        data: {
          title,
          description,
        },
        include: {
          items: {
            orderBy: { order: 'asc' },
          },
        },
      })

      res.json(updated)
    } catch (error) {
      next(error)
    }
  }

  async updateItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, itemId } = req.params
      const { isCompleted } = req.body
      const userId = req.user?.userId

      const checklist = await prisma.checklistTemplate.findUnique({
        where: { id },
        include: { property: true },
      })

      if (!checklist) {
        throw new AppError(404, 'Checklist not found')
      }

      if (checklist.property.userId !== userId) {
        throw new AppError(403, 'Unauthorized')
      }

      await prisma.checklistItem.update({
        where: { id: itemId },
        data: { isCompleted },
      })

      const updated = await prisma.checklistTemplate.findUnique({
        where: { id },
        include: {
          items: {
            orderBy: { order: 'asc' },
          },
        },
      })

      res.json(updated)
    } catch (error) {
      next(error)
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.user?.userId

      const checklist = await prisma.checklistTemplate.findUnique({
        where: { id },
        include: { property: true },
      })

      if (!checklist) {
        throw new AppError(404, 'Checklist not found')
      }

      if (checklist.property.userId !== userId) {
        throw new AppError(403, 'Unauthorized')
      }

      await prisma.checklistTemplate.delete({
        where: { id },
      })

      logger.info(`Checklist deleted: ${id}`)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
