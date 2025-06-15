import { initStripe, useStripe } from '@stripe/stripe-react-native';
import Config from 'react-native-config';
import axios from 'axios';
import { AuthService } from './auth.service';

const API_URL = Config.API_URL;
const STRIPE_PUBLISHABLE_KEY = Config.STRIPE_PUBLISHABLE_KEY;

export class StripeService {
  private static instance: StripeService;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
    this.initializeStripe();
  }

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  private async initializeStripe(): Promise<void> {
    try {
      await initStripe({
        publishableKey: STRIPE_PUBLISHABLE_KEY,
        merchantIdentifier: 'merchant.com.yourapp',
      });
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  }

  public async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<string> {
    try {
      const response = await axios.post(
        `${API_URL}/payments/create-intent`,
        { amount, currency },
        {
          headers: {
            Authorization: `Bearer ${await this.authService.getToken()}`,
          },
        }
      );
      return response.data.clientSecret;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async confirmPayment(clientSecret: string): Promise<void> {
    const stripe = useStripe();
    try {
      const { error } = await stripe.confirmPayment(clientSecret);
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      return new Error(error.response?.data?.message || 'Payment failed');
    }
    return error instanceof Error ? error : new Error('An unexpected error occurred');
  }
} 