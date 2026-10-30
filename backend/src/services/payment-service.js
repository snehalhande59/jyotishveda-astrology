const crypto = require("crypto");
const Razorpay = require("razorpay");

class PaymentService {
  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID;
    this.keySecret = process.env.RAZORPAY_KEY_SECRET;
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!this.keyId || !this.keySecret || !this.webhookSecret) {
      console.warn("Razorpay credentials are not fully configured.");
    }

    if (this.keyId && this.keySecret) {
      try {
        this.razorpayInstance = new Razorpay({
          key_id: this.keyId,
          key_secret: this.keySecret,
        });
      } catch (e) {
        console.warn("Razorpay SDK init warning:", e.message);
      }
    }
  }

  async createOrder({ amountInRupees, currency = "INR", receipt, notes = {} }) {
    const amountInPaise = Math.round(amountInRupees * 100);

    // Create a real Razorpay order when credentials are configured
    if (this.razorpayInstance) {
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
          isTestMode: false,
        };
      } catch (err) {
        console.warn("Razorpay order creation failed:", err.message);
      }
    }

    // Never allow simulated orders in production
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Razorpay is not configured correctly. Please configure valid payment credentials.",
      );
    }

    // Simulated orders are allowed only during local development
    const simulatedOrderId = `order_${Date.now()}_${crypto
      .randomBytes(4)
      .toString("hex")}`;

    return {
      orderId: simulatedOrderId,
      amount: amountInRupees,
      currency,
      keyId: this.keyId || null,
      isTestMode: true,
    };
  }

  generateSignature({ orderId, paymentId }) {
    if (!orderId || !paymentId || !this.keySecret) {
      throw new Error(
        "orderId, paymentId and keySecret required to compute signature",
      );
    }

    return crypto
      .createHmac("sha256", this.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
  }

  verifySignature({ orderId, paymentId, signature }) {
    if (!orderId || !paymentId || !signature || !this.keySecret) {
      return false;
    }

    try {
      const generatedSignature = crypto
        .createHmac("sha256", this.keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      const a = Buffer.from(generatedSignature, "utf8");
      const b = Buffer.from(signature, "utf8");

      if (a.length !== b.length) return false;

      return crypto.timingSafeEqual(a, b);
    } catch (e) {
      console.error("Signature verification error:", e.message);
      return false;
    }
  }

  verifyWebhookSignature({ rawBody, signature }) {
    if (!this.webhookSecret || !signature || !rawBody) {
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac("sha256", this.webhookSecret)
        .update(rawBody)
        .digest("hex");

      const a = Buffer.from(expectedSignature, "utf8");
      const b = Buffer.from(signature, "utf8");

      if (a.length !== b.length) return false;

      return crypto.timingSafeEqual(a, b);
    } catch (e) {
      console.error("Webhook signature verification error:", e.message);
      return false;
    }
  }
}

module.exports = new PaymentService();
