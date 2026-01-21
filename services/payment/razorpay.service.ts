import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '@/lib/env';

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  error?: string;
}

export class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number, currency: string = 'INR', notes?: any): Promise<CreateOrderResponse> {
    try {
      const order = await this.razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency,
        notes,
      });

      return {
        success: true,
        orderId: order.id,
        amount: (order.amount as number) / 100,
        currency: order.currency,
      };
    } catch (error: any) {
      console.error('Razorpay Create Order Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create order',
      };
    }
  }

  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): VerifyPaymentResponse {
    try {
      const text = `${orderId}|${paymentId}`;
      const generated_signature = crypto
        .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generated_signature === signature) {
        return {
          success: true,
          message: 'Payment verified successfully',
        };
      }

      return {
        success: false,
        message: 'Invalid payment signature',
      };
    } catch (error: any) {
      console.error('Razorpay Verify Payment Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify payment',
      };
    }
  }

  verifyWebhookSignature(body: string, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Webhook Signature Verification Error:', error);
      return false;
    }
  }

  async createRefund(paymentId: string, amount?: number): Promise<RefundResponse> {
    try {
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return {
        success: true,
        refundId: refund.id,
      };
    } catch (error: any) {
      console.error('Razorpay Create Refund Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process refund',
      };
    }
  }

  async fetchPayment(paymentId: string) {
    try {
      return await this.razorpay.payments.fetch(paymentId);
    } catch (error) {
      console.error('Razorpay Fetch Payment Error:', error);
      throw error;
    }
  }

  async fetchOrder(orderId: string) {
    try {
      return await this.razorpay.orders.fetch(orderId);
    } catch (error) {
      console.error('Razorpay Fetch Order Error:', error);
      throw error;
    }
  }
}

export const razorpayService = new RazorpayService();
