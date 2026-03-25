import { create } from "zustand";
import type { Product, CartItem } from "./products";

// Simple cart state without zustand for template simplicity
// In production, you'd use zustand, redux, or context

let cartItems: CartItem[] = [];
let listeners: (() => void)[] = [];

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function addToCart(product: Product) {
  const existingItem = cartItems.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
  cartItems = [...cartItems];
  notifyListeners();
}

export function removeFromCart(productId: string) {
  cartItems = cartItems.filter((item) => item.id !== productId);
  notifyListeners();
}

export function updateQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const item = cartItems.find((item) => item.id === productId);
  if (item) {
    item.quantity = quantity;
    cartItems = [...cartItems];
    notifyListeners();
  }
}

export function getCartItems(): CartItem[] {
  return cartItems;
}

export function getCartTotal(): number {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartCount(): number {
  return cartItems.reduce((count, item) => count + item.quantity, 0);
}

export function clearCart() {
  cartItems = [];
  notifyListeners();
}

export function subscribeToCart(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
