import { Router } from 'express';
import Stripe from 'stripe';
import { AuthError } from '../types/auth';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Create Payment Intent
router.post('/create-intent', async (req, res, next) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
});

// Handle Stripe Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      throw new AuthError('No signature provided', 'INVALID_SIGNATURE');
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle successful payment
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        // Handle failed payment
        console.log('Payment failed:', failedPayment.id);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

export const paymentRouter = router; 