import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Linking } from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse, AuthError } from '../types/auth';

const API_URL = Config.API_URL;

export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
      iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
      androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async googleSignIn(): Promise<LoginResponse> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      const response = await axios.post(`${API_URL}/auth/google`, {
        idToken: userInfo.idToken,
      });

      const { user, token } = response.data;
      await this.setToken(token);
      return { user, token };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async linkedinSignIn(): Promise<void> {
    const linkedinAuthUrl = `${API_URL}/auth/linkedin`;
    const redirectUri = Config.LINKEDIN_REDIRECT_URI;
    
    try {
      await Linking.openURL(`${linkedinAuthUrl}?redirect_uri=${encodeURIComponent(redirectUri)}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async handleLinkedinCallback(code: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/linkedin/callback`, { code });
      const { user, token } = response.data;
      await this.setToken(token);
      return { user, token };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async logout(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('token');
      this.token = null;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async setToken(token: string): Promise<void> {
    this.token = token;
    await AsyncStorage.setItem('token', token);
  }

  private handleError(error: any): AuthError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || 'An error occurred',
        code: error.response?.data?.code,
      };
    }
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }
} 