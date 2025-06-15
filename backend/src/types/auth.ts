export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'linkedin';
}

export interface JwtPayload {
  userId: string;
  email: string;
  provider: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
} 