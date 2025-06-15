export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'linkedin' | 'apple';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface SocialAuthConfig {
  clientId: string;
  redirectUri?: string;
  scopes?: string[];
} 