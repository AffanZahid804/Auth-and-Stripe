import { appleAuth } from '@invertase/react-native-apple-authentication';
import Config from 'react-native-config';
import axios from 'axios';
import { AuthResponse, AuthError } from '../types/auth.types';

export class AppleAuthService {
  private static instance: AppleAuthService;
  private readonly API_URL: string;

  private constructor() {
    this.API_URL = Config.API_URL;
  }

  public static getInstance(): AppleAuthService {
    if (!AppleAuthService.instance) {
      AppleAuthService.instance = new AppleAuthService();
    }
    return AppleAuthService.instance;
  }

  public async signIn(): Promise<AuthResponse> {
    try {
      const appleAuthResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthResponse.identityToken) {
        throw new Error('No identity token present');
      }

      const response = await axios.post<AuthResponse>(`${this.API_URL}/auth/apple`, {
        identityToken: appleAuthResponse.identityToken,
        user: appleAuthResponse.user,
        email: appleAuthResponse.email,
        fullName: appleAuthResponse.fullName,
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async signOut(): Promise<void> {
    try {
      await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGOUT,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): AuthError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || 'Apple authentication failed',
        code: error.response?.data?.code,
      };
    }
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }
} 