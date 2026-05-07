import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
const prisma = new PrismaClient();
export class ReportController {
    async create(req, res, next) {
        try {
            const { propertyId, cleaningDate, checkInTime, checkOutTime, staffName, overallStatus, reportText, reportFormat, } = req.body;
            const userId = req.user?.userId;
            if (!propertyId || !cleaningDate) {
                throw new AppError(400, 'propertyId and cleaningDate are required');
            }
            // Verify property ownership
            const property = await prisma.property.findUnique({
                where: { id: propertyId },
            });
            if (!property || property.userId !== userId) {
                throw new AppError(403, 'Property not found or unauthorized');
            }
            const report = await prisma.cleaningReport.create({
                data: {
                    userId,
                    propertyId,
                    cleaningDate: new Date(cleaningDate),
                    checkInTime: checkInTime ? new Date(checkInTime) : null,
                    checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
                    staffName,
                    overallStatus: overallStatus || 'NORMAL',
                    reportText,
                    reportFormat: reportFormat || 'BOTH',
                },
                include: {
                    checklistItems: {
                        orderBy: { order: 'asc' },
                    },
                    photos: true,
                    issues: true,
                    inventoryItems: true,
                },
            });
            logger.info(`Report created: ${report.id}`);
            res.status(201).json(report);
        }
        catch (error) {
            next(error);
        }
    }
    async getByProperty(req, res, next) {
        try {
            const { propertyId } = req.params;
            const userId = req.user?.userId;
            // Verify property ownership
            const property = await prisma.property.findUnique({
                where: { id: propertyId },
            });
            if (!property || property.userId !== userId) {
                throw new AppError(403, 'Property not found or unauthorized');
            }
            const reports = await prisma.cleaningReport.findMany({
                where: { propertyId },
                include: {
                    checklistItems: {
                        orderBy: { order: 'asc' },
                    },
                    photos: true,
                    issues: true,
                    inventoryItems: true,
                },
                orderBy: { cleaningDate: 'desc' },
            });
            res.json(reports);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const report = await prisma.cleaningReport.findUnique({
                where: { id },
                include: {
                    property: true,
                    checklistItems: {
                        orderBy: { order: 'asc' },
                    },
                    photos: true,
                    issues: true,
                    inventoryItems: true,
                },
            });
            if (!report) {
                throw new AppError(404, 'Report not found');
            }
            if (report.property.userId !== userId) {
                throw new AppError(403, 'Unauthorized');
            }
            res.json(report);
        }
        catch (error) {
            next(error);
        }
    }
    async getByUser(req, res, next) {
        try {
            const userId = req.user?.userId;
            const reports = await prisma.cleaningReport.findMany({
                where: { userId },
                include: {
                    property: true,
                    checklistItems: {
                        orderBy: { order: 'asc' },
                    },
                    photos: true,
                    issues: true,
                    inventoryItems: true,
                },
                orderBy: { cleaningDate: 'desc' },
            });
            res.json(reports);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { cleaningDate, checkInTime, checkOutTime, staffName, overallStatus, reportText, reportFormat, } = req.body;
            const userId = req.user?.userId;
            const report = await prisma.cleaningReport.findUnique({
                where: { id },
                include: { property: true },
            });
            if (!report) {
                throw new AppError(404, 'Report not found');
            }
            if (report.property.userId !== userId) {
                throw new AppError(403, 'Unauthorized');
            }
            const updated = await prisma.cleaningReport.update({
                where: { id },
                data: {
                    cleaningDate: cleaningDate ? new Date(cleaningDate) : undefined,
                    checkInTime: checkInTime ? new Date(checkInTime) : null,
                    checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
                    staffName,
                    overallStatus,
                    reportText,
                    reportFormat,
                },
                include: {
                    checklistItems: {
                        orderBy: { order: 'asc' },
                    },
                    photos: true,
                    issues: true,
                    inventoryItems: true,
                },
            });
            res.json(updated);
        }
        catch (error) {
            next(error);
        }
    }
    async submit(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const report = await prisma.cleaningReport.findUnique({
                where: { id },
                include: { property: true },
            });
            if (!report) {
                throw new AppError(404, 'Report not found');
            }
            if (report.property.userId !== userId) {
                throw new AppError(403, 'Unauthorized');
            }
            const submitted = await prisma.cleaningReport.update({
                where: { id },
                data: {
                    isSubmitted: true,
                    submittedAt: new Date(),
                },
                include: {
                    checklistItems: {
                        orderBy: { order: 'asc' },
                    },
                    photos: true,
                    issues: true,
                    inventoryItems: true,
                },
            });
            logger.info(`Report submitted: ${id}`);
            res.json(submitted);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const report = await prisma.cleaningReport.findUnique({
                where: { id },
                include: { property: true },
            });
            if (!report) {
                throw new AppError(404, 'Report not found');
            }
            if (report.property.userId !== userId) {
                throw new AppError(403, 'Unauthorized');
            }
            await prisma.cleaningReport.delete({
                where: { id },
            });
            logger.info(`Report deleted: ${id}`);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async uploadPhoto(req, res, next) {
        try {
            const { reportId } = req.params;
            const { photoUrl, location, fileSize } = req.body;
            const userId = req.user?.userId;
            if (!photoUrl) {
                throw new AppError(400, 'photoUrl is required');
            }
            const report = await prisma.cleaningReport.findUnique({
                where: { id: reportId },
                include: { property: true },
            });
            if (!report) {
                throw new AppError(404, 'Report not found');
            }
            if (!report.property || report.property.userId !== userId) {
                throw new AppError(403, 'Unauthorized');
            }
            const photo = await prisma.reportPhoto.create({
                data: {
                    reportId,
                    photoUrl,
                    location: location || null,
                    fileSize: fileSize || null,
                },
            });
            logger.info(`Photo uploaded to report ${reportId}: ${photo.id}`);
            res.status(201).json(photo);
        }
        catch (error) {
            logger.error(`Photo upload error:`, error);
            next(error);
        }
    }
    async uploadPhotoBlob(req, res, next) {
        try {
            const { reportId } = req.params;
            const { location } = req.body;
            const userId = req.user?.userId;
            if (!req.file) {
                throw new AppError(400, 'File is required');
            }
            const report = await prisma.cleaningReport.findUnique({
                where: { id: reportId },
                include: { property: true },
            });
            if (!report) {
                throw new AppError(404, 'Report not found');
            }
            if (!report.property || report.property.userId !== userId) {
                throw new AppError(403, 'Unauthorized');
            }
            const filename = `reports/${reportId}/${Date.now()}-${req.file.originalname}`;
            const blob = await put(filename, req.file.buffer, {
                access: 'public',
                contentType: req.file.mimetype,
            });
            const photo = await prisma.reportPhoto.create({
                data: {
                    reportId,
                    photoUrl: blob.url,
                    location: location || null,
                    fileSize: req.file.size,
                },
            });
            logger.info(`Photo uploaded to Vercel Blob: ${reportId}/${photo.id}`);
            res.status(201).json(photo);
        }
        catch (error) {
            logger.error(`Photo Blob upload error:`, error);
            next(error);
        }
    }
    async deletePhoto(req, res, next) {
        try {
            const { reportId, photoId } = req.params;
            const userId = req.user?.userId;
            const photo = await prisma.reportPhoto.findUnique({
                where: { id: photoId },
                include: { report: { include: { property: true } } },
            });
            if (!photo) {
                throw new AppError(404, 'Photo not found');
            }
            if (photo.report.property.userId !== userId) {
                throw new AppError(403, 'Unauthorized');
            }
            await prisma.reportPhoto.delete({
                where: { id: photoId },
            });
            logger.info(`Photo deleted: ${photoId}`);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async createIssue(req, res, next) {
        try {
            const { reportId } = req.params;
            const { issueType, description, severity, photoUrl } = req.body;
            const userId = req.user?.userId;
            if (!issueType || !description) {
                throw new AppError(400, 'issueType and description are required');
            }
            const report = await prisma.cleaningReport.findUnique({
                where: { id: reportId },
                include: { property: true },
            });
            if (!report) {
                throw new AppError(404, 'Report not found');
            }
            if (report.property.userId !== userId) {
                throw new AppError(403, 'Unauthorized');
            }
            const issue = await prisma.issue.create({
                data: {
                    reportId,
                    propertyId: report.propertyId,
                    issueType,
                    description,
                    severity: severity || 'LIGHT',
                    photoUrl: photoUrl || null,
                },
            });
            logger.info(`Issue created: ${issue.id}`);
            res.status(201).json(issue);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteIssue(req, res, next) {
        try {
            const { reportId, issueId } = req.params;
            const userId = req.user?.userId;
            const issue = await prisma.issue.findUnique({
                where: { id: issueId },
                include: { report: { include: { property: true } } },
            });
            if (!issue) {
                throw new AppError(404, 'Issue not found');
            }
            if (issue.report.property.userId !== userId) {
                throw new AppError(403, 'Unauthorized');
            }
            await prisma.issue.delete({
                where: { id: issueId },
            });
            logger.info(`Issue deleted: ${issueId}`);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async resolveIssue(req, res, next) {
        try {
            const { reportId, issueId } = req.params;
            const userId = req.user?.userId;
            const issue = await prisma.issue.findUnique({
                where: { id: issueId },
                include: { report: { include: { property: true } } },
            });
            if (!issue) {
                throw new AppError(404, 'Issue not found');
            }
            if (issue.report.property.userId !== userId) {
                throw new AppError(403, 'Unauthorized');
            }
            const updated = await prisma.issue.update({
                where: { id: issueId },
                data: {
                    isResolved: true,
                    resolvedAt: new Date(),
                },
            });
            logger.info(`Issue resolved: ${issueId}`);
            res.json(updated);
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=report.controller.js.map