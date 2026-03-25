"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Select, Divider, Breadcrumb } from "@raydenui/ui";
import { getCartItems, getCartTotal, clearCart, subscribeToCart } from "@/data/cart";
import { formatPrice } from "@/data/products";

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(getCartItems());
  const [cartTotal, setCartTotal] = useState(getCartTotal());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return subscribeToCart(() => {
      setCartItems(getCartItems());
      setCartTotal(getCartTotal());
    });
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold text-grey-900 mb-4">
          Your cart is empty
        </h1>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    clearCart();
    alert("Order placed successfully! Thank you for your purchase.");
    router.push("/");
  };

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const total = cartTotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
        className="mb-8"
      />

      <h1 className="text-3xl font-bold text-grey-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-grey-900 mb-4">
                Contact Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Email"
                  type="email"
                  required
                  className="sm:col-span-2"
                />
                <Input placeholder="Phone" type="tel" />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-grey-900 mb-4">
                Shipping Address
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input placeholder="First Name" required />
                <Input placeholder="Last Name" required />
                <Input
                  placeholder="Address"
                  required
                  className="sm:col-span-2"
                />
                <Input placeholder="City" required />
                <div className="grid grid-cols-2 gap-4">
                  <Select required>
                    <option value="">State</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                  </Select>
                  <Input placeholder="ZIP Code" required />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-grey-900 mb-4">
                Payment
              </h2>
              <div className="grid gap-4">
                <Input placeholder="Card Number" required />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="MM/YY" required />
                  <Input placeholder="CVC" required />
                </div>
                <Input placeholder="Cardholder Name" required />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-grey-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-grey-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-grey-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-grey-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-grey-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Divider className="my-4" />

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-grey-600">Subtotal</span>
                  <span className="text-grey-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-grey-600">Shipping</span>
                  <span className="text-grey-900">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <Divider className="my-4" />

              <div className="flex justify-between mb-6">
                <span className="font-semibold text-grey-900">Total</span>
                <span className="font-bold text-xl text-grey-900">
                  {formatPrice(total)}
                </span>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
