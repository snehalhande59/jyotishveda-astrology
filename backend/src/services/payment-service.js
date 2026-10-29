const crypto = require('crypto');
const Razorpay = require('razorpay');

class PaymentService {
  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_AstrologyDemo123';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_AstrologyDemoSecret456';
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_789';

    if (this.keyId && this.keySecret) {
      try {
        this.razorpayInstance = new Razorpay({
          key_id: this.keyId,
          key_secret: this.keySecret,
        });
      } catch (e) {
        console.warn('Razorpay SDK init warning:', e.message);
      }
    }
  }

  async createOrder({ amountInRupees, currency = 'INR', receipt, notes = {} }) {
    const amountInPaise = Math.round(amountInRupees * 100);

    // If real Razorpay credentials are valid, use Razorpay API; otherwise generate valid deterministic test order
    if (this.razorpayInstance && !this.keyId.includes('YourTestKeyId')) {
      try {
        const order = await this.razorpayInstance.orders.create({
          amount: amountInPaise,
          currency,
          receipt,
          notes,
        });
        return {
          orderId: order.id,
          amount: amountInRupees,
          currency: order.currency,
          keyId: this.keyId,
        };
      } catch (err) {
        console.warn('Razorpay API error, falling back to local test order mode:', err.message);
      }
    }

    // Secure local test order fallback
    const simulatedOrderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    return {
      orderId: simulatedOrderId,
      amount: amountInRupees,
      currency,
      keyId: this.keyId,
      isTestMode: true,
    };
  }

  generateSignature({ orderId, paymentId }) {
    if (!orderId || !paymentId || !this.keySecret) {
      throw new Error('orderId, paymentId and keySecret required to compute signature');
    }
    return crypto
      .createHmac('sha256', this.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
  }

  verifySignature({ orderId, paymentId, signature }) {
    if (!orderId || !paymentId || !signature) {
      return false;
    }

    try {
      const generatedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const a = Buffer.from(generatedSignature, 'utf8');
      const b = Buffer.from(signature, 'utf8');
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    } catch (e) {
      console.error('Signature verification error:', e);
      return false;
    }
  }

  verifyWebhookSignature({ rawBody, signature }) {
    if (!this.webhookSecret || !signature) return false;
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(rawBody)
        .digest('hex');
      const a = Buffer.from(expectedSignature, 'utf8');
      const b = Buffer.from(signature, 'utf8');
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    } catch (e) {
      return false;
    }
  }
}

module.exports = new PaymentService();
