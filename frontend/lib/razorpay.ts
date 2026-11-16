declare global {
  interface Window {
    Razorpay: any;
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay checkout script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure?: (response: any) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export async function openRazorpayModal(options: RazorpayOptions): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error('Razorpay SDK could not be loaded. Please check your internet connection.');
  }

  const { onFailure, ...rzpOptions } = options;

  const cleanOptions: any = { ...rzpOptions };
  // Only include order_id if it is a non-empty string and not undefined/null/placeholder
  if (
    !cleanOptions.order_id ||
    typeof cleanOptions.order_id !== 'string' ||
    cleanOptions.order_id === 'undefined' ||
    cleanOptions.order_id.trim() === '' ||
    cleanOptions.order_id.startsWith('order_test_') ||
    cleanOptions.order_id.startsWith('order_1')
  ) {
    delete cleanOptions.order_id;
  }

  const rzp = new window.Razorpay({
    ...cleanOptions,
    theme: {
      color: '#D4AF37', // Gold brand theme
      ...cleanOptions.theme,
    },
  });

  if (onFailure) {
    rzp.on('payment.failed', (resp: any) => {
      onFailure(resp);
    });
  }

  rzp.open();
}
