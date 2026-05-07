import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
const prisma = new PrismaClient();
export class AuthService {
    async register(email, password, name) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new AppError(400, 'User already exists');
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'STAFF',
            },
        });
        // Generate tokens
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            accessToken,
            refreshToken,
        };
    }
    async login(email, password) {
        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new AppError(401, 'Invalid email or password');
        }
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError(401, 'Invalid email or password');
        }
        // Generate tokens
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
    async verifyRefreshToken(refreshToken) {
        // This is a simplified version. In production, you might store refresh tokens in Redis
        const { verifyRefreshToken } = await import('../utils/jwt');
        const payload = verifyRefreshToken(refreshToken);
        if (!payload) {
            throw new AppError(401, 'Invalid or expired refresh token');
        }
        const newAccessToken = generateAccessToken(payload);
        return { accessToken: newAccessToken };
    }
}
//# sourceMappingURL=auth.service.js.map