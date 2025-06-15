import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import axios from 'axios';
import { AuthResponse, AuthError } from '../types/auth.types';

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private readonly API_URL: string;

  private constructor() {
    this.API_URL = Config.API_URL;
    this.initializeGoogleSignIn();
  }

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  private initializeGoogleSignIn(): void {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
      iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
      androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    });
  }

  public async signIn(): Promise<AuthResponse> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.idToken) {
        throw new Error('No ID token present');
      }

      const response = await axios.post<AuthResponse>(`${this.API_URL}/auth/google`, {
        idToken: userInfo.idToken,
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): AuthError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || 'Google authentication failed',
        code: error.response?.data?.code,
      };
    }
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }
} 