// JyotishVeda Shopping Cart State Management

import { Product, PRODUCTS_CATALOGUE } from './shop-data';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_KEY = 'jyotishveda_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse cart:', e);
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
}

export function addToCart(product: Product, quantity = 1): CartItem[] {
  const current = getCart();
  const existingIndex = current.findIndex((item) => item.product.id === product.id);

  if (existingIndex > -1) {
    current[existingIndex].quantity += quantity;
  } else {
    current.push({ product, quantity });
  }

  saveCart(current);
  return current;
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  let current = getCart();
  if (quantity <= 0) {
    current = current.filter((item) => item.product.id !== productId);
  } else {
    const existing = current.find((item) => item.product.id === productId);
    if (existing) {
      existing.quantity = quantity;
    }
  }
  saveCart(current);
  return current;
}

export function removeFromCart(productId: string): CartItem[] {
  return updateCartQuantity(productId, 0);
}

export function clearCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cart-updated'));
}

export function getCartTotals(items?: CartItem[]) {
  const cartItems = items || getCart();
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Free delivery for orders above ₹999, else ₹99
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  
  // 3% Vedic Seva & Insurance
  const tax = Math.round(subtotal * 0.03);
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
    totalItems,
  };
}
