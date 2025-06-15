import { Linking } from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
import { AuthResponse, AuthError } from '../types/auth.types';

export class LinkedInAuthService {
  private static instance: LinkedInAuthService;
  private readonly API_URL: string;
  private readonly REDIRECT_URI: string;

  private constructor() {
    this.API_URL = Config.API_URL;
    this.REDIRECT_URI = Config.LINKEDIN_REDIRECT_URI;
  }

  public static getInstance(): LinkedInAuthService {
    if (!LinkedInAuthService.instance) {
      LinkedInAuthService.instance = new LinkedInAuthService();
    }
    return LinkedInAuthService.instance;
  }

  public async signIn(): Promise<void> {
    try {
      const linkedinAuthUrl = `${this.API_URL}/auth/linkedin?redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}`;
      await Linking.openURL(linkedinAuthUrl);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async handleCallback(code: string): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${this.API_URL}/auth/linkedin/callback`, {
        code,
        redirect_uri: this.REDIRECT_URI,
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): AuthError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || 'LinkedIn authentication failed',
        code: error.response?.data?.code,
      };
    }
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }
} 