import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Badge, Input } from "@raydenui/ui";
import { getCartCount, subscribeToCart } from "../data/cart";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
];

export default function Header() {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    return subscribeToCart(() => {
      setCartCount(getCartCount());
    });
  }, []);

  return (
    <header className="bg-white border-b border-grey-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-semibold text-grey-900">Rayden Store</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? "text-primary-600"
                      : "text-grey-600 hover:text-grey-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-8">
            <Input placeholder="Search products..." leadingIcon="search" />
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <Button variant="grey" appearance="outlined" size="sm">
                Cart
                {cartCount > 0 && (
                  <Badge color="orange" className="ml-2">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
