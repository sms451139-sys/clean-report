import { AuthService } from '../services/auth.service';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
const authService = new AuthService();
export class AuthController {
    async register(req, res, next) {
        try {
            const { email, password, name } = req.body;
            if (!email || !password || !name) {
                throw new AppError(400, 'Email, password, and name are required');
            }
            const result = await authService.register(email, password, name);
            logger.info(`User registered: ${email}`);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new AppError(400, 'Email and password are required');
            }
            const result = await authService.login(email, password);
            logger.info(`User logged in: ${email}`);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new AppError(400, 'Refresh token is required');
            }
            const result = await authService.verifyRefreshToken(refreshToken);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=auth.controller.js.map