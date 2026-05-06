import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
