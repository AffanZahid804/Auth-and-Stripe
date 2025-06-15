export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'linkedin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthError {
  message: string;
  code?: string;
} 