let cartItems = [];
let listeners = [];

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function addToCart(product) {
  const existingItem = cartItems.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
  cartItems = [...cartItems];
  notifyListeners();
}

export function removeFromCart(productId) {
  cartItems = cartItems.filter((item) => item.id !== productId);
  notifyListeners();
}

export function updateQuantity(productId, quantity) {
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

export function getCartItems() {
  return cartItems;
}

export function getCartTotal() {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartCount() {
  return cartItems.reduce((count, item) => count + item.quantity, 0);
}

export function clearCart() {
  cartItems = [];
  notifyListeners();
}

export function subscribeToCart(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
