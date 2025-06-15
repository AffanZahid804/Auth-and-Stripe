import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../types/auth';

export const errorHandler = (
  error: Error | AuthError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof AuthError) {
    return res.status(401).json({
      message: error.message,
      code: error.code,
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}; 