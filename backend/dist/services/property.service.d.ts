export declare class PropertyService {
    createProperty(userId: string, data: {
        propertyName: string;
        propertyCode?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        propertyName: string;
        propertyCode: string | null;
        address: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        checklistTemplateId: string | null;
        userId: string;
    }>;
    getProperties(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        propertyName: string;
        propertyCode: string | null;
        address: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        checklistTemplateId: string | null;
        userId: string;
    }[]>;
    getProperty(propertyId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        propertyName: string;
        propertyCode: string | null;
        address: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        checklistTemplateId: string | null;
        userId: string;
    }>;
    updateProperty(propertyId: string, userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        propertyName: string;
        propertyCode: string | null;
        address: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        checklistTemplateId: string | null;
        userId: string;
    }>;
    deleteProperty(propertyId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        propertyName: string;
        propertyCode: string | null;
        address: string | null;
        latitude: import("@prisma/client/runtime/library").Decimal | null;
        longitude: import("@prisma/client/runtime/library").Decimal | null;
        checklistTemplateId: string | null;
        userId: string;
    }>;
}
//# sourceMappingURL=property.service.d.ts.map