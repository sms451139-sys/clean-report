import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
const prisma = new PrismaClient();
export class PropertyService {
    async createProperty(userId, data) {
        return await prisma.property.create({
            data: {
                userId,
                ...data,
            },
        });
    }
    async getProperties(userId) {
        return await prisma.property.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getProperty(propertyId, userId) {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (!property || property.userId !== userId) {
            throw new AppError(404, 'Property not found');
        }
        return property;
    }
    async updateProperty(propertyId, userId, data) {
        const property = await this.getProperty(propertyId, userId);
        return await prisma.property.update({
            where: { id: propertyId },
            data,
        });
    }
    async deleteProperty(propertyId, userId) {
        const property = await this.getProperty(propertyId, userId);
        return await prisma.property.delete({
            where: { id: propertyId },
        });
    }
}
//# sourceMappingURL=property.service.js.map