import winston from 'winston';
const logLevel = process.env.LOG_LEVEL || 'debug';
export const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
    defaultMeta: { service: 'clean-report-api' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});
// Also log to console in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }));
}
//# sourceMappingURL=logger.js.map