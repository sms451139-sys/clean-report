import { logger } from '../utils/logger';
export class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}
export const errorHandler = (err, req, res, next) => {
    const errorLog = {
        message: err.message,
        stack: err instanceof Error ? err.stack : undefined,
        path: req.path,
        method: req.method,
    };
    logger.error(JSON.stringify(errorLog));
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            statusCode: err.statusCode,
        });
    }
    res.status(500).json({
        error: 'Internal Server Error',
        statusCode: 500,
    });
};
//# sourceMappingURL=errorHandler.js.map