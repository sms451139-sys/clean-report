import { verifyAccessToken } from '../utils/jwt';
import { AppError } from './errorHandler';
export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError(401, 'Missing or invalid authorization header');
        }
        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);
        if (!payload) {
            throw new AppError(401, 'Invalid or expired token');
        }
        req.user = payload;
        next();
    }
    catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        res.status(401).json({ error: 'Unauthorized' });
    }
};
//# sourceMappingURL=auth.js.map