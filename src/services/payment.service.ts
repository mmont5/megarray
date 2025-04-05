import { PrismaClient, PlanType, PaymentStatus, PaymentMethod } from '@prisma/client';
import Stripe from 'stripe';
import { ethers } from 'ethers';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export class PaymentService {
  // Create a Stripe checkout session for subscription
  async createStripeCheckoutSession(params: {
    userId: string;
    planType: PlanType;
    successUrl: string;
    cancelUrl: string;
  }) {
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get plan price ID from environment variables based on plan type
    let priceId;
    switch (params.planType) {
      case 'PRO':
        priceId = process.env.STRIPE_PRICE_PRO;
        break;
      case 'BUSINESS':
        priceId = process.env.STRIPE_PRICE_BUSINESS;
        break;
      case 'ENTERPRISE':
        priceId = process.env.STRIPE_PRICE_ENTERPRISE;
        break;
      default:
        throw new Error('Invalid plan type');
    }

    if (!priceId) {
      throw new Error('Price ID not configured for this plan');
    }

    // Create or retrieve customer
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user.id,
        },
      });

      customerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        userId: user.id,
        planType: params.planType,
      },
    });

    return { sessionId: session.id, url: session.url };
  }

  // Handle Stripe webhook events
  async handleStripeWebhook(event: any) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await this.handleSuccessfulSubscription(
          session.metadata.userId,
          session.metadata.planType,
          session.subscription,
          'STRIPE'
        );
        break;
      }
      
      case 'invoice.paid': {
        const invoice = event.data.object;
        // Record successful payment
        await this.recordPayment({
          userId: invoice.metadata.userId,
          amount: invoice.amount_paid / 100, // Convert from cents
          currency: invoice.currency,
          status: 'COMPLETED',
          method: 'STRIPE',
          stripePaymentId: invoice.payment_intent,
        });
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        // Update subscription status to PAST_DUE
        await prisma.subscription.update({
          where: { userId: invoice.metadata.userId },
          data: { status: 'PAST_DUE' },
        });
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        // Update subscription details
        await this.updateSubscriptionDetails(subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        // Cancel subscription
        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'CANCELLED' },
        });
        break;
      }
    }

    return { received: true };
  }

  // Create crypto payment intent
  async createCryptoPaymentIntent(params: {
    userId: string;
    planType: PlanType;
    cryptoType: 'ETH' | 'USDC' | 'BTC' | 'MATIC';
  }) {
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get the plan price in USD
    let priceUsd;
    switch (params.planType) {
      case 'PRO':
        priceUsd = 79;
        break;
      case 'BUSINESS':
        priceUsd = 199;
        break;
      case 'ENTERPRISE':
        priceUsd = 499;
        break;
      default:
        throw new Error('Invalid plan type');
    }

    // In a real implementation, this would:
    // 1. Get current exchange rate for the selected crypto
    // 2. Calculate the crypto amount
    // 3. Generate a unique payment address or payment ID
    // 4. Store the payment intent in the database

    // For demo purposes:
    const walletAddress = '0x' + Array(40).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    // Mock crypto amount (would use real exchange rates in production)
    let cryptoAmount;
    switch (params.cryptoType) {
      case 'ETH':
        cryptoAmount = priceUsd / 3000; // Mocked ETH price
        break;
      case 'USDC':
        cryptoAmount = priceUsd; // 1:1 to USD
        break;
      case 'BTC':
        cryptoAmount = priceUsd / 40000; // Mocked BTC price
        break;
      case 'MATIC':
        cryptoAmount = priceUsd / 0.8; // Mocked MATIC price
        break;
    }

    // Create a payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amount: priceUsd,
        currency: 'USD',
        status: 'PENDING',
        method: 'CRYPTO',
        cryptoTxHash: null, // Will be filled when payment is received
      },
    });

    return {
      paymentId: payment.id,
      walletAddress,
      amountInCrypto: cryptoAmount,
      cryptoType: params.cryptoType,
      amountInUsd: priceUsd,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };
  }

  // Verify crypto payment
  async verifyCryptoPayment(paymentId: string, txHash: string) {
    // In a real implementation, this would:
    // 1. Verify the transaction on the blockchain
    // 2. Check if the amount is correct
    // 3. Update the payment status
    // 4. Activate the subscription if payment is confirmed

    // For demo purposes:
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
        cryptoTxHash: txHash,
      },
    });

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: payment.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Determine plan type based on payment amount
    let planType: PlanType;
    if (payment.amount <= 80) {
      planType = 'PRO';
    } else if (payment.amount <= 200) {
      planType = 'BUSINESS';
    } else {
      planType = 'ENTERPRISE';
    }

    // Activate subscription
    await this.handleSuccessfulSubscription(
      payment.userId,
      planType,
      null, // No Stripe subscription ID for crypto
      'CRYPTO'
    );

    return { success: true };
  }

  // Cancel subscription
  async cancelSubscription(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.stripeSubscriptionId) {
      // Cancel Stripe subscription
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Update local subscription
      await prisma.subscription.update({
        where: { userId },
        data: {
          cancelAtPeriodEnd: true,
        },
      });
    } else {
      // For crypto or other payment methods, just mark as cancelled
      await prisma.subscription.update({
        where: { userId },
        data: {
          status: 'CANCELLED',
          cancelAtPeriodEnd: true,
        },
      });
    }

    return { success: true };
  }

  // Helper to handle successful subscription
  private async handleSuccessfulSubscription(
    userId: string,
    planType: PlanType,
    stripeSubscriptionId: string | null,
    paymentMethod: PaymentMethod
  ) {
    // Get subscription details if on Stripe
    let periodStart = new Date();
    let periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1); // Default to 1 month

    if (stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      periodStart = new Date(subscription.current_period_start * 1000);
      periodEnd = new Date(subscription.current_period_end * 1000);
    }

    // Check if user already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (existingSubscription) {
      // Update existing subscription
      await prisma.subscription.update({
        where: { userId },
        data: {
          plan: planType,
          status: 'ACTIVE',
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          stripeSubscriptionId,
          cancelAtPeriodEnd: false,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new subscription
      await prisma.subscription.create({
        data: {
          userId,
          plan: planType,
          status: 'ACTIVE',
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          stripeSubscriptionId,
          cancelAtPeriodEnd: false,
        },
      });
    }

    // Update user's plan
    await prisma.user.update({
      where: { id: userId },
      data: { plan: planType },
    });
  }

  // Helper to update subscription details
  private async updateSubscriptionDetails(stripeSubscription: any) {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) {
      // Subscription not found, possibly it's new
      return;
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: this.mapStripeStatusToLocal(stripeSubscription.status),
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        updatedAt: new Date(),
      },
    });
  }

  // Map Stripe status to local subscription status
  private mapStripeStatusToLocal(stripeStatus: string): string {
    switch (stripeStatus) {
      case 'active':
        return 'ACTIVE';
      case 'past_due':
        return 'PAST_DUE';
      case 'canceled':
        return 'CANCELLED';
      case 'trialing':
        return 'TRIALING';
      default:
        return 'ACTIVE';
    }
  }

  // Record a payment
  private async recordPayment(params: {
    userId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    stripePaymentId?: string;
    cryptoTxHash?: string;
  }) {
    return prisma.payment.create({
      data: params,
    });
  }
} 