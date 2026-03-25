import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Divider } from "@raydenui/ui";
import { getCartItems, getCartTotal, subscribeToCart } from "../data/cart";
import { formatPrice } from "../data/products";
import CartItemComponent from "../components/CartItem";

export default function Cart() {
  const [cartItems, setCartItems] = useState(getCartItems());
  const [cartTotal, setCartTotal] = useState(getCartTotal());

  useEffect(() => {
    return subscribeToCart(() => {
      setCartItems(getCartItems());
      setCartTotal(getCartTotal());
    });
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-grey-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-grey-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-grey-900 mb-8">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {cartItems.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-grey-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-grey-600">Subtotal</span>
                <span className="text-grey-900">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-grey-600">Shipping</span>
                <span className="text-grey-900">
                  {cartTotal >= 50 ? "Free" : formatPrice(9.99)}
                </span>
              </div>
              {cartTotal < 50 && (
                <p className="text-xs text-grey-500">
                  Add {formatPrice(50 - cartTotal)} more for free shipping
                </p>
              )}
            </div>

            <Divider className="my-4" />

            <div className="flex justify-between mb-6">
              <span className="font-semibold text-grey-900">Total</span>
              <span className="font-bold text-xl text-grey-900">
                {formatPrice(cartTotal + (cartTotal >= 50 ? 0 : 9.99))}
              </span>
            </div>

            <Link to="/checkout">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>

            <Link to="/products">
              <Button variant="grey" appearance="outlined" className="w-full mt-3">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
